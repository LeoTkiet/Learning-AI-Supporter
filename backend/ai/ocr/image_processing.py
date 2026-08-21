"""
Image Processing Module for Mathematical OCR Service.
Enforces STRICT ZERO DISK I/O: All decoding, transformation, and enhancement 
occur strictly in-memory using NumPy buffers, OpenCV arrays, and PIL Images.
"""

from typing import Optional, Set
import cv2
import numpy as np
from PIL import Image

# Allowed MIME types for uploaded image validation
ALLOWED_IMAGE_MIME_TYPES: Set[str] = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/bmp",
    "image/tiff",
}

# Allowed file extensions for additional filename safety
ALLOWED_IMAGE_EXTENSIONS: Set[str] = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".bmp",
    ".tiff",
    ".tif",
}


def validate_image_content_type(content_type: Optional[str], filename: Optional[str] = None) -> bool:
    """
    Validate that the uploaded file conforms to accepted image formats.
    
    Args:
        content_type: MIME type reported by the client (e.g. 'image/png').
        filename: Optional filename to verify file extension.
        
    Returns:
        bool: True if the file type is acceptable, False otherwise.
    """
    if not content_type:
        return False
    
    clean_content_type = content_type.lower().split(";")[0].strip()
    if clean_content_type in ALLOWED_IMAGE_MIME_TYPES:
        return True

    # Fallback to file extension verification if MIME type is generic
    if filename:
        import os
        ext = os.path.splitext(filename.lower())[1]
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            return True

    return False


def decode_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw in-memory bytes into an OpenCV BGR image matrix without any disk I/O.
    
    Args:
        image_bytes: Raw binary content of the image file.
        
    Returns:
        np.ndarray: OpenCV BGR image matrix (dtype uint8).
        
    Raises:
        ValueError: If bytes are empty or cv2.imdecode fails to parse a valid image.
    """
    if not image_bytes:
        raise ValueError("Image byte stream is empty.")

    # Convert binary buffer directly into a 1D NumPy uint8 array in RAM
    np_buffer = np.frombuffer(image_bytes, dtype=np.uint8)

    # Decode image from RAM buffer into OpenCV BGR matrix (IMREAD_COLOR: 3-channel color)
    image = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Failed to decode image from memory buffer. The file may be corrupt or not a supported image format.")

    return image


def enhance_image_for_ocr(image: np.ndarray) -> np.ndarray:
    """
    Enhance mathematical formula image for OCR accuracy using OpenCV.
    
    Pipeline Steps:
    1. Grayscale Conversion: Reduces 3-channel BGR to single-channel intensity,
       eliminating chromatic noise and reducing computational overhead.
    2. Noise Reduction: Applies Gaussian Blur with a 5x5 kernel to smooth high-frequency
       sensor noise, paper texture, and scanner artifacts without degrading formula stroke edges.
    3. Adaptive Thresholding: Applies cv2.ADAPTIVE_THRESH_GAUSSIAN_C to calculate local
       pixel thresholds dynamically. This handles uneven illumination, shadow gradients,
       and low-contrast ink effectively, isolating mathematical symbols, sub/superscripts,
       fraction bars, and radical signs clearly.
       
    Args:
        image: Input OpenCV image matrix (BGR or Grayscale, uint8).
        
    Returns:
        np.ndarray: Enhanced binarized image matrix (single-channel uint8, 0 or 255).
        
    Raises:
        ValueError: If input image is empty or invalid.
    """
    if image is None or image.size == 0:
        raise ValueError("Input image array is empty or None.")

    # 1. Grayscale Conversion
    # If the input has 3 channels (BGR), convert to 1-channel grayscale.
    # Otherwise, copy existing single-channel array.
    if len(image.shape) == 3 and image.shape[2] == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    elif len(image.shape) == 2:
        gray = image.copy()
    elif len(image.shape) == 3 and image.shape[2] == 4:
        # Handle BGRA transparency channel by converting to BGR then Grayscale
        gray = cv2.cvtColor(cv2.cvtColor(image, cv2.COLOR_BGRA2BGR), cv2.COLOR_BGR2GRAY)
    else:
        raise ValueError(f"Unsupported image shape for OCR enhancement: {image.shape}")

    # 2. Noise Reduction (Gaussian Blur)
    # Parameter Choice:
    # - ksize=(5, 5): A 5x5 Gaussian kernel is optimal for standard resolution documents.
    #   It effectively suppresses high-frequency noise while keeping thin mathematical
    #   strokes (e.g. integral bounds, dots on 'i', plus/minus signs) crisp.
    # - sigmaX=0: Setting sigma to 0 instructs OpenCV to compute sigma automatically from kernel size.
    blurred = cv2.GaussianBlur(gray, ksize=(5, 5), sigmaX=0)

    # 3. Adaptive Thresholding
    # Parameter Choice:
    # - maxValue=255: Binary white foreground/background value.
    # - adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C: The threshold value is the weighted sum
    #   of neighborhood values where weights are Gaussian window. This is superior to mean
    #   adaptive thresholding for handwritten/printed formulas under non-uniform illumination.
    # - thresholdType=cv2.THRESH_BINARY: Pixels greater than local threshold become 255 (white),
    #   others become 0 (black). Standard for mathematical OCR engines.
    # - blockSize=11: Size of a pixel neighborhood used to calculate threshold value (must be odd).
    #   11 provides a balanced receptive field to detect local background lighting changes.
    # - C=2: Constant subtracted from the calculated Gaussian mean. Fine-tunes threshold
    #   sensitivity to suppress faint background paper fibers without cutting off thin strokes.
    binary = cv2.adaptiveThreshold(
        src=blurred,
        maxValue=255,
        adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        thresholdType=cv2.THRESH_BINARY,
        blockSize=11,
        C=2
    )

    return binary


def cv2_to_pil(image: np.ndarray) -> Image.Image:
    """
    Convert an OpenCV NumPy array to a PIL Image entirely in RAM (Zero Disk I/O).
    Useful for feeding images into PyTorch/Transformers vision models (e.g., pix2tex).
    
    Args:
        image: OpenCV image array (2D binary/grayscale or 3D BGR).
        
    Returns:
        Image.Image: PIL Image instance residing solely in memory.
    """
    if len(image.shape) == 2:
        # Grayscale or binary image
        return Image.fromarray(image)
    elif len(image.shape) == 3 and image.shape[2] == 3:
        # BGR to RGB conversion for PIL
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb_image)
    elif len(image.shape) == 3 and image.shape[2] == 4:
        # BGRA to RGBA conversion for PIL
        rgba_image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGBA)
        return Image.fromarray(rgba_image)
    else:
        return Image.fromarray(image)
