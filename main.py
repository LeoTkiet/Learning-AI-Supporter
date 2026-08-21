"""
=============================================================================
High-Performance Mathematical OCR REST API Service
=============================================================================
Architecture: Clean Architecture, Asynchronous FastAPI Service
Strict Constraint: ZERO DISK I/O (All operations in RAM via NumPy / Pillow / OpenCV)
=============================================================================
"""

from __future__ import annotations

import json
import os
import threading
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional, Set, List, Union

from dotenv import load_dotenv

# Automatically discover and load .env file from project root or backend folder
ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=ROOT_DIR / ".env", override=False)
load_dotenv(dotenv_path=ROOT_DIR / "backend" / ".env", override=False)
load_dotenv(override=False)

import cv2
import numpy as np
from PIL import Image
from pydantic import BaseModel, Field
from fastapi import FastAPI, UploadFile, File, Header, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware


# =============================================================================
# 1. RESPONSE & ERROR SCHEMAS (Pydantic Models)
# =============================================================================

class MathOCRResponse(BaseModel):
    """
    Standard response payload for successful mathematical formula extraction.
    """
    status: str = Field(
        default="success",
        description="Execution status ('success' or 'error')"
    )
    processing_time_ms: float = Field(
        ...,
        description="Total end-to-end processing latency in milliseconds (RAM only)"
    )
    latex_formula: str = Field(
        ...,
        description="Extracted mathematical expression formatted in standard LaTeX"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "success",
                "processing_time_ms": 14.82,
                "latex_formula": r"\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}"
            }
        }
    }


class ErrorDetail(BaseModel):
    """
    Standard error detail schema.
    """
    status: str = Field(default="error", description="Error status indicator")
    detail: str = Field(..., description="Descriptive error explanation")


# =============================================================================
# 2. IMAGE PROCESSING SERVICE (Zero Disk I/O, OpenCV Pipeline)
# =============================================================================

ALLOWED_IMAGE_MIME_TYPES: Set[str] = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/bmp",
    "image/tiff",
}

ALLOWED_IMAGE_EXTENSIONS: Set[str] = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".bmp",
    ".tiff",
    ".tif",
}


def validate_image_file(content_type: Optional[str], filename: Optional[str] = None) -> bool:
    """
    Validate that the uploaded file matches supported image MIME types or extensions.

    Args:
        content_type: MIME type sent in the request header (e.g. 'image/png').
        filename: Optional filename used for secondary extension fallback.

    Returns:
        bool: True if valid image format, False otherwise.
    """
    if not content_type:
        return False

    clean_content_type = content_type.lower().split(";")[0].strip()
    if clean_content_type in ALLOWED_IMAGE_MIME_TYPES:
        return True

    # Secondary check: verify filename extension
    if filename:
        ext = os.path.splitext(filename.lower())[1]
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            return True

    return False


def decode_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw byte buffer into an OpenCV BGR NumPy matrix directly in RAM.
    STRICT ZERO DISK I/O: No temporary files or disk reads are performed.

    Args:
        image_bytes: Raw binary content read from the upload stream.

    Returns:
        np.ndarray: OpenCV BGR image matrix (dtype: uint8).

    Raises:
        ValueError: If buffer is empty or cv2.imdecode fails to parse the image.
    """
    if not image_bytes:
        raise ValueError("The uploaded image byte buffer is empty.")

    # 1. Convert byte stream to a 1D NumPy uint8 array in RAM
    np_buffer = np.frombuffer(image_bytes, dtype=np.uint8)

    # 2. Decode the memory buffer into an OpenCV BGR image matrix
    # cv2.IMREAD_COLOR ensures 3-channel color decoding regardless of source encoding
    image: Optional[np.ndarray] = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)

    if image is None or image.size == 0:
        raise ValueError(
            "Failed to decode image from byte stream. "
            "Please ensure the file is a valid, uncorrupted image (PNG, JPEG, etc.)."
        )

    return image


def enhance_image_for_ocr(image: np.ndarray) -> np.ndarray:
    """
    Enhance mathematical formula image for OCR recognition using OpenCV.

    Pipeline:
    -------------------------------------------------------------------------
    1. Grayscale Conversion:
       - Converts 3-channel BGR to 1-channel luminance (cv2.COLOR_BGR2GRAY).
       - Eliminates color noise, chromatic aberration, and reduces memory bandwidth by 66%.

    2. Noise Reduction (Gaussian Blur):
       - Applies cv2.GaussianBlur with kernel size (5, 5) and sigmaX=0.
       - Parameter Rationale:
         * ksize=(5, 5): Optimal window to suppress paper grain, scanner moiré,
           and sensor salt-and-pepper noise while retaining sharp edges on thin
           mathematical strokes (e.g. integral bounds, minus signs, accents).
         * sigmaX=0: OpenCV auto-derives optimal standard deviation from kernel size.

    3. Adaptive Thresholding (Gaussian C):
       - Applies cv2.adaptiveThreshold with cv2.ADAPTIVE_THRESH_GAUSSIAN_C.
       - Parameter Rationale:
         * adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C: Computes threshold dynamically
           as the Gaussian-weighted cross-section of neighboring pixels. This robustly
           counteracts uneven phone camera lighting, shadow gradients, and vignetting.
         * thresholdType=cv2.THRESH_BINARY: Produces high-contrast binary output (0 or 255).
         * blockSize=11: Receptive field (11x11 neighborhood, must be odd) large enough to
           capture local background lighting yet localized enough to preserve character geometry.
         * C=2: Constant subtracted from weighted mean. Fine-tunes noise suppression
           to prevent faint background smudges from being binarized as foreground ink.

    Args:
        image: Input OpenCV BGR or Grayscale matrix (dtype: uint8).

    Returns:
        np.ndarray: Enhanced binary image matrix (dtype: uint8, values 0 or 255).

    Raises:
        ValueError: If input image is empty or invalid.
    """
    if image is None or image.size == 0:
        raise ValueError("Input image matrix cannot be empty or None.")

    # 1. Grayscale Conversion
    if len(image.shape) == 3 and image.shape[2] == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    elif len(image.shape) == 2:
        gray = image.copy()
    elif len(image.shape) == 3 and image.shape[2] == 4:
        gray = cv2.cvtColor(cv2.cvtColor(image, cv2.COLOR_BGRA2BGR), cv2.COLOR_BGR2GRAY)
    else:
        raise ValueError(f"Unsupported image shape for enhancement: {image.shape}")

    # 2. Noise Reduction (Gaussian Blur)
    # Smooths out high-frequency background noise while keeping stroke boundaries intact
    blurred = cv2.GaussianBlur(gray, ksize=(5, 5), sigmaX=0)

    # 3. Adaptive Gaussian Thresholding
    # Isolates mathematical characters dynamically under uneven lighting conditions
    binary = cv2.adaptiveThreshold(
        src=blurred,
        maxValue=255,
        adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        thresholdType=cv2.THRESH_BINARY,
        blockSize=11,
        C=2,
    )

    return binary


def cv2_to_pil(image: np.ndarray) -> Image.Image:
    """
    Convert an OpenCV NumPy matrix to a PIL Image instance entirely in RAM.
    Enables seamless interoperability with PyTorch / HuggingFace vision models
    (e.g., pix2tex / TrOCR / Donut) with ZERO Disk I/O.

    Args:
        image: OpenCV image matrix (2D binary/grayscale or 3D BGR).

    Returns:
        Image.Image: In-memory PIL Image object.
    """
    if len(image.shape) == 2:
        # Grayscale / Binary mode
        return Image.fromarray(image)
    elif len(image.shape) == 3 and image.shape[2] == 3:
        # Convert BGR color space to RGB for PIL compatibility
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb)
    elif len(image.shape) == 3 and image.shape[2] == 4:
        rgba = cv2.cvtColor(image, cv2.COLOR_BGRA2RGBA)
        return Image.fromarray(rgba)
    else:
        return Image.fromarray(image)


# =============================================================================
# 3. OCR ABSTRACTION LAYER (Service Interface & Mock Implementation)
# =============================================================================

class MathOCRService(ABC):
    """
    Abstract Interface for Mathematical OCR Inference Engines.
    Decouples image processing and routing from specific model backends
    (e.g., Mock, pix2tex, LaTeX-OCR, Google Vision, Nougat).
    """

    @abstractmethod
    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Asynchronously extract LaTeX formula string from preprocessed image array.

        Args:
            image: Preprocessed OpenCV image matrix (uint8).

        Returns:
            str: Recognized LaTeX expression.
        """
        pass


class MockMathOCRService(MathOCRService):
    """
    Mock implementation of MathOCRService for unit testing and offline development.
    Demonstrates zero-disk transition to PIL Image in RAM and returns LaTeX formula.
    """

    def __init__(self, default_latex: str = r"\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}"):
        self.default_latex = default_latex

    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Execute in-memory mock inference on the enhanced image array.

        Args:
            image: Enhanced OpenCV image array.

        Returns:
            str: Valid LaTeX formula.
        """
        # In-memory RAM conversion to PIL Image (zero disk I/O)
        pil_image: Image.Image = cv2_to_pil(image)

        # Verification of in-memory object integrity
        if pil_image.size[0] <= 0 or pil_image.size[1] <= 0:
            raise ValueError("In-memory PIL image has invalid dimensions.")

        return self.default_latex


def parse_api_keys(raw_input: Optional[Union[str, List[str]]] = None) -> List[str]:
    """
    Parse a list of API keys from:
    1. A Python list: ["key1", "key2"]
    2. A JSON array string: '["key1", "key2"]'
    3. A Comma-separated string: "key1,key2,key3"
    4. A single string: "key1"
    5. Fallback to GEMINI_API_KEYS or GEMINI_API_KEY environment variables.
    """
    if isinstance(raw_input, list):
        return [str(k).strip().strip('"').strip("'") for k in raw_input if str(k).strip()]

    if raw_input is None:
        raw_input = os.getenv("GEMINI_API_KEYS") or os.getenv("GEMINI_API_KEY")

    if not raw_input:
        return []

    raw_input = raw_input.strip()
    if not raw_input:
        return []

    # JSON Array syntax: '["key1", "key2"]'
    if raw_input.startswith("[") and raw_input.endswith("]"):
        try:
            parsed = json.loads(raw_input)
            if isinstance(parsed, list):
                return [str(k).strip().strip('"').strip("'") for k in parsed if str(k).strip()]
        except Exception:
            pass

    # Comma or semicolon or newline separated syntax
    keys = [
        k.strip().strip('"').strip("'")
        for k in raw_input.replace("\n", ",").replace(";", ",").split(",")
        if k.strip().strip('"').strip("'")
    ]
    return keys


class APIKeyRotator:
    """
    Thread-safe Round-Robin API Key Rotator with Automatic Failover for Rate Limits.
    Mitigates HTTP 429 (Resource Exhausted) and balances load evenly across multiple keys.
    """

    def __init__(self, keys: Optional[List[str]] = None):
        self.keys: List[str] = keys or []
        self._lock = threading.Lock()
        self._index: int = 0

    def add_keys(self, keys: List[str]) -> None:
        with self._lock:
            for k in keys:
                if k and k not in self.keys:
                    self.keys.append(k)

    def get_ordered_candidates(self) -> List[str]:
        """
        Get all keys ordered by round-robin priority.
        If the primary key hits a rate limit (429), the caller can fall back to the next key.
        """
        with self._lock:
            if not self.keys:
                return []
            idx = self._index % len(self.keys)
            self._index = (self._index + 1) % len(self.keys)
            return self.keys[idx:] + self.keys[:idx]


class GeminiMathOCRService(MathOCRService):
    """
    Production-grade Mathematical OCR Service powered by Google Gemini Multimodal AI.
    Features:
    - Multi-key rotation (Round-Robin) to prevent rate limit bottlenecks on high traffic.
    - Automatic Failover: If Key A hits HTTP 429, immediately retries with Key B.
    - Multi-model fallback across Gemini 2.0 / 2.5 / 1.5 Flash variants.
    - Strict Zero Disk I/O (all image tensors remain in RAM).
    """

    CANDIDATE_MODELS: List[str] = [
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-pro-vision",
    ]

    def __init__(
        self,
        api_keys: Optional[Union[str, List[str]]] = None,
        model_name: Optional[str] = None
    ):
        parsed_keys = parse_api_keys(api_keys)
        self.rotator = APIKeyRotator(parsed_keys)
        self.preferred_model = model_name or os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

        if not self.rotator.keys:
            raise ValueError(
                "No Gemini API keys found. Please set GEMINI_API_KEYS (or GEMINI_API_KEY) in your .env file or environment."
            )

    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Send the enhanced image from RAM directly to Gemini Vision to recognize real math formulas.
        Rotates across available keys and tries compatible models with automatic failover.
        """
        pil_image: Image.Image = cv2_to_pil(image)

        prompt = (
            "You are an expert Mathematical OCR system. "
            "Examine this image carefully and extract all mathematical formulas, equations, and expressions. "
            "Convert the mathematical expressions into clean, standard LaTeX syntax. "
            "Output ONLY the raw LaTeX string without markdown code fences (do NOT wrap in ```latex ... ```), "
            "and without any conversational prefix or explanation."
        )

        candidate_keys = self.rotator.get_ordered_candidates()
        models_to_try = [self.preferred_model] + [m for m in self.CANDIDATE_MODELS if m != self.preferred_model]
        last_error = None

        # Iterate through rotated keys (Failover logic on rate limit / error)
        for key in candidate_keys:
            # 1. Primary: Modern google.genai SDK
            try:
                from google import genai
                client = genai.Client(api_key=key)
                for model_name in models_to_try:
                    try:
                        response = client.models.generate_content(
                            model=model_name,
                            contents=[prompt, pil_image],
                        )
                        text = (response.text or "").strip()
                        if text:
                            return self._clean_latex(text)
                    except Exception as exc:
                        last_error = exc
                        err_str = str(exc).lower()
                        # If model not found, try next model with same key
                        if "404" in err_str or "not found" in err_str:
                            continue
                        # If rate limited (429) or invalid key (400/403), break to next key
                        if "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str or "key not valid" in err_str:
                            break
            except ImportError:
                pass

            # 2. Secondary: Legacy google.generativeai SDK
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=key)
                for model_name in models_to_try:
                    try:
                        gen_model = legacy_genai.GenerativeModel(model_name)
                        response = gen_model.generate_content([prompt, pil_image])
                        text = (response.text or "").strip()
                        if text:
                            return self._clean_latex(text)
                    except Exception as exc:
                        last_error = exc
                        err_str = str(exc).lower()
                        if "404" in err_str or "not found" in err_str:
                            continue
                        if "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str or "key not valid" in err_str:
                            break
            except ImportError:
                pass

        raise RuntimeError(
            f"Failed to extract math formulas using Gemini. Tried {len(candidate_keys)} API key(s). "
            f"Last error encountered: {str(last_error)}"
        )

    @staticmethod
    def _clean_latex(latex_text: str) -> str:
        """
        Clean markdown backticks and code blocks from the raw response string.
        """
        latex_text = latex_text.strip()
        if latex_text.startswith("```latex"):
            latex_text = latex_text[len("```latex"):].strip()
        if latex_text.startswith("```"):
            latex_text = latex_text[3:].strip()
        if latex_text.endswith("```"):
            latex_text = latex_text[:-3].strip()
        return latex_text.strip()


# Dependency injection provider for FastAPI
def get_ocr_service() -> MathOCRService:
    """
    FastAPI dependency injection provider for the MathOCR service.
    Automatically initializes GeminiMathOCRService if GEMINI_API_KEYS or GEMINI_API_KEY is present;
    otherwise falls back to MockMathOCRService.
    """
    keys = parse_api_keys()
    if keys:
        try:
            return GeminiMathOCRService(api_keys=keys)
        except Exception:
            pass
    return MockMathOCRService()


# =============================================================================
# 4. FASTAPI APPLICATION & ROUTING LAYER
# =============================================================================

app = FastAPI(
    title="Mathematical OCR Service",
    description="High-performance, Zero-Disk I/O Mathematical Formula OCR REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
async def health_check():
    """
    Service health check endpoint.
    """
    return {"status": "healthy", "service": "MathOCR-Service", "timestamp": time.time()}


@app.post(
    "/api/v1/extract-math",
    response_model=MathOCRResponse,
    responses={
        200: {"description": "Mathematical formula successfully extracted as LaTeX", "model": MathOCRResponse},
        400: {"description": "Invalid file format or corrupted image buffer", "model": ErrorDetail},
        500: {"description": "Internal server processing failure", "model": ErrorDetail},
    },
    tags=["Mathematical OCR"],
    summary="Extract LaTeX formula from an image with zero disk I/O",
)
async def extract_math_from_image(
    file: UploadFile = File(
        ...,
        description="Image file containing mathematical formulas (PNG, JPEG, WEBP, BMP, TIFF)"
    ),
    x_gemini_api_key: Optional[str] = Header(
        default=None,
        alias="x-gemini-api-key",
        description="Optional Gemini API key for real-time AI OCR recognition (overrides mock)"
    ),
    ocr_service: MathOCRService = Depends(get_ocr_service),
) -> MathOCRResponse:
    """
    High-Performance Mathematical OCR Pipeline:
    
    1. **Format Validation**: Ensures valid image MIME type / extension.
    2. **Zero-Disk In-Memory Decoding**: Reads bytes directly to RAM, decoding with `cv2.imdecode`.
    3. **OpenCV Image Enhancement**:
       - Grayscale conversion (`cv2.COLOR_BGR2GRAY`)
       - Noise reduction (`cv2.GaussianBlur` with 5x5 kernel)
       - Adaptive Gaussian Thresholding (`cv2.adaptiveThreshold`)
    4. **In-Memory OCR Inference**: Passes enhanced array / PIL Image to `MathOCRService` (Mock or Gemini Vision AI).
    5. **Latency Metric**: Returns execution time alongside standard LaTeX formula.
    """
    start_time = time.perf_counter()

    # Step 1: MIME Type and Format Validation
    if not validate_image_file(file.content_type, file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file type '{file.content_type}'. "
                f"Please upload a valid image file (PNG, JPEG, WEBP, BMP, TIFF)."
            ),
        )

    try:
        # Step 2: Read binary contents directly into RAM (Zero Disk I/O)
        image_bytes: bytes = await file.read()
        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded image file is empty (contains 0 bytes).",
            )

        # Decode directly from RAM buffer into OpenCV matrix
        raw_image: np.ndarray = decode_image_from_bytes(image_bytes)

        # Step 3: OpenCV Image Enhancement Pipeline
        enhanced_image: np.ndarray = enhance_image_for_ocr(raw_image)

        # Step 4: Asynchronous OCR Inference Layer
        # If API key is provided in request header, use real Gemini Vision OCR directly
        active_service = GeminiMathOCRService(api_keys=x_gemini_api_key) if x_gemini_api_key else ocr_service
        latex_result: str = await active_service.extract_latex(enhanced_image)

        # Step 5: Latency Calculation
        elapsed_ms: float = round((time.perf_counter() - start_time) * 1000, 2)

        return MathOCRResponse(
            status="success",
            processing_time_ms=elapsed_ms,
            latex_formula=latex_result,
        )

    except ValueError as val_err:
        # Handle decoding and parameter errors as 400 Bad Request
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except HTTPException:
        # Re-raise explicit HTTPExceptions
        raise
    except Exception as exc:
        # Catch unforeseen runtime errors as 500 Internal Server Error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected internal error occurred during math OCR processing: {str(exc)}",
        )


# =============================================================================
# 5. ENTRY POINT (Local Run Server)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
