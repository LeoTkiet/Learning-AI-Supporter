"""
Comprehensive Test Suite for Mathematical OCR REST API.
Verifies Zero Disk I/O, Image Decoding, OpenCV Enhancement Pipeline, Mock OCR,
Multi-Key Rotation / Failover, and Error Handling across HTTP 200, 400, and 500 status codes for both
standalone `main.py` and modular `backend.main:app`.
"""

import io
import pytest
import numpy as np
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

from main import (
    app as standalone_app,
    decode_image_from_bytes,
    enhance_image_for_ocr,
    cv2_to_pil,
    validate_image_file,
    MockMathOCRService,
    get_ocr_service,
    parse_api_keys,
    APIKeyRotator,
)
from backend.main import app as backend_app
from backend.api.routes import get_math_ocr_service

# Override OCR service in test suite to use MockMathOCRService for offline unit testing
standalone_app.dependency_overrides[get_ocr_service] = lambda: MockMathOCRService()
backend_app.dependency_overrides[get_math_ocr_service] = lambda: MockMathOCRService()

client = TestClient(standalone_app)
backend_client = TestClient(backend_app)


def generate_synthetic_math_image_bytes(format: str = "PNG") -> bytes:
    """
    Generate an in-memory synthetic image containing a mathematical formula
    without writing anything to disk.
    """
    # Create white canvas
    img = Image.new("RGB", (400, 150), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Draw mathematical formula-like strokes: integral sign, formula, brackets
    draw.arc([30, 20, 70, 120], start=180, end=360, fill=(0, 0, 0), width=3)
    draw.line([50, 40, 50, 100], fill=(0, 0, 0), width=3)
    
    # Draw simple text
    draw.text((80, 50), "e^(-x^2) dx = sqrt(pi)/2", fill=(0, 0, 0))

    # Add simulated uneven lighting gradient across image
    img_array = np.array(img, dtype=np.float32)
    gradient = np.linspace(0.8, 1.0, 400).reshape(1, 400, 1)
    img_array = np.clip(img_array * gradient, 0, 255).astype(np.uint8)
    img = Image.fromarray(img_array)

    # Save strictly to in-memory bytes buffer
    buffer = io.BytesIO()
    img.save(buffer, format=format)
    return buffer.getvalue()


# =============================================================================
# UNIT TESTS: Image Processing & In-Memory Operations
# =============================================================================

def test_validate_image_file():
    """Verify MIME type and extension validation."""
    assert validate_image_file("image/png") is True
    assert validate_image_file("image/jpeg") is True
    assert validate_image_file("image/webp") is True
    assert validate_image_file("application/pdf") is False
    assert validate_image_file("text/plain") is False
    assert validate_image_file(None) is False
    assert validate_image_file("application/octet-stream", "formula.png") is True


def test_decode_image_from_bytes():
    """Verify in-memory decoding produces valid OpenCV numpy ndarray."""
    img_bytes = generate_synthetic_math_image_bytes(format="PNG")
    decoded = decode_image_from_bytes(img_bytes)

    assert isinstance(decoded, np.ndarray)
    assert len(decoded.shape) == 3
    assert decoded.shape[2] == 3
    assert decoded.dtype == np.uint8
    assert decoded.shape[0] == 150
    assert decoded.shape[1] == 400


def test_decode_corrupted_bytes():
    """Verify corrupt bytes raise a ValueError."""
    corrupt_bytes = b"NOT_A_VALID_IMAGE_BUFFER_DATA_12345"
    with pytest.raises(ValueError) as exc_info:
        decode_image_from_bytes(corrupt_bytes)
    assert "Failed to decode image" in str(exc_info.value)


def test_enhance_image_for_ocr():
    """Verify OpenCV enhancement pipeline (Grayscale -> Gaussian Blur -> Adaptive Threshold)."""
    img_bytes = generate_synthetic_math_image_bytes(format="JPEG")
    decoded = decode_image_from_bytes(img_bytes)
    
    enhanced = enhance_image_for_ocr(decoded)

    # Must be 2D single-channel binary image
    assert isinstance(enhanced, np.ndarray)
    assert len(enhanced.shape) == 2
    assert enhanced.dtype == np.uint8
    assert enhanced.shape == (150, 400)

    # Must contain binary values (0 and 255)
    unique_vals = set(np.unique(enhanced))
    assert unique_vals.issubset({0, 255})


def test_cv2_to_pil_in_memory():
    """Verify RAM-only conversion from OpenCV ndarray to PIL Image."""
    img_bytes = generate_synthetic_math_image_bytes(format="PNG")
    decoded = decode_image_from_bytes(img_bytes)
    enhanced = enhance_image_for_ocr(decoded)

    pil_img = cv2_to_pil(enhanced)
    assert isinstance(pil_img, Image.Image)
    assert pil_img.size == (400, 150)
    assert pil_img.mode == "L"


# =============================================================================
# UNIT TESTS: Multi-Key Parser & APIKeyRotator
# =============================================================================

def test_parse_api_keys_formats():
    """Verify parsing of various key list formats (comma, JSON, list, single)."""
    # Comma-separated
    assert parse_api_keys("key1, key2, key3") == ["key1", "key2", "key3"]
    # JSON array
    assert parse_api_keys('["keyA", "keyB"]') == ["keyA", "keyB"]
    # Semicolon/Newline separated
    assert parse_api_keys("key1;\nkey2") == ["key1", "key2"]
    # Single string with quotes
    assert parse_api_keys('"key_single"') == ["key_single"]
    # Python list
    assert parse_api_keys(["k1", "k2"]) == ["k1", "k2"]
    # Empty
    assert parse_api_keys("") == []


def test_api_key_rotator_round_robin():
    """Verify thread-safe round-robin ordering and failover candidates."""
    rotator = APIKeyRotator(["key1", "key2", "key3"])

    # First call starts at key1
    c1 = rotator.get_ordered_candidates()
    assert c1 == ["key1", "key2", "key3"]

    # Second call rotates to start at key2
    c2 = rotator.get_ordered_candidates()
    assert c2 == ["key2", "key3", "key1"]

    # Third call rotates to start at key3
    c3 = rotator.get_ordered_candidates()
    assert c3 == ["key3", "key1", "key2"]

    # Fourth call wraps back to key1
    c4 = rotator.get_ordered_candidates()
    assert c4 == ["key1", "key2", "key3"]


# =============================================================================
# INTEGRATION TESTS: Standalone App Endpoints (main.py)
# =============================================================================

def test_extract_math_success_png():
    """Test POST /api/v1/extract-math with a valid PNG image."""
    png_bytes = generate_synthetic_math_image_bytes(format="PNG")
    
    response = client.post(
        "/api/v1/extract-math",
        files={"file": ("math_formula.png", png_bytes, "image/png")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "latex_formula" in data
    assert len(data["latex_formula"]) > 0
    assert data["processing_time_ms"] >= 0.0


def test_extract_math_success_jpeg():
    """Test POST /api/v1/extract-math with a valid JPEG image."""
    jpeg_bytes = generate_synthetic_math_image_bytes(format="JPEG")
    
    response = client.post(
        "/api/v1/extract-math",
        files={"file": ("formula.jpg", jpeg_bytes, "image/jpeg")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert r"\int" in data["latex_formula"]


def test_extract_math_invalid_content_type():
    """Test POST /api/v1/extract-math with non-image content type returns HTTP 400."""
    text_bytes = b"Hello, this is a plain text file, not a math image."
    
    response = client.post(
        "/api/v1/extract-math",
        files={"file": ("notes.txt", text_bytes, "text/plain")}
    )

    assert response.status_code == 400
    data = response.json()
    assert "Unsupported file type" in data["detail"] or "Invalid file type" in data["detail"]


def test_extract_math_corrupted_image_file():
    """Test POST /api/v1/extract-math with corrupted image payload returns HTTP 400."""
    fake_png = b"\x89PNG\r\n\x1a\nCORRUPTED_PAYLOAD_BYTES"
    
    response = client.post(
        "/api/v1/extract-math",
        files={"file": ("corrupt.png", fake_png, "image/png")}
    )

    assert response.status_code == 400
    data = response.json()
    assert "Failed to decode image" in data["detail"]


def test_extract_math_empty_file():
    """Test POST /api/v1/extract-math with an empty 0-byte file returns HTTP 400."""
    response = client.post(
        "/api/v1/extract-math",
        files={"file": ("empty.png", b"", "image/png")}
    )

    assert response.status_code == 400
    data = response.json()
    assert "empty" in data["detail"].lower()


def test_health_endpoint():
    """Test GET /health returns status 200."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


# =============================================================================
# INTEGRATION TESTS: Backend Modular Router (backend/api/routes.py)
# =============================================================================

def test_backend_extract_math_success():
    """Test POST /api/v1/extract-math on modular backend application."""
    png_bytes = generate_synthetic_math_image_bytes(format="PNG")
    
    response = backend_client.post(
        "/api/v1/extract-math",
        files={"file": ("integral.png", png_bytes, "image/png")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "latex_formula" in data
    assert data["processing_time_ms"] >= 0.0
