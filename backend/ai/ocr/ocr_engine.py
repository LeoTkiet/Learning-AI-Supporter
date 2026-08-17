import cv2
import numpy as np
from typing import Tuple, Dict, Any

class OCREngine:
    """
    Module xử lý tiền xử lý ảnh (OpenCV) và tích hợp OCR (Tesseract / Google Vision)
    """

    @staticmethod
    def preprocess_image(image_bytes: bytes) -> np.ndarray:
        """
        Tiền xử lý ảnh bài làm:
        1. Chuyển sang ảnh xám
        2. Khử nhiễu giữ nét chữ (Bilateral Filter)
        3. Nhị phân hóa thích nghi (Adaptive Threshold)
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)
        binary = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        return binary

    @classmethod
    def extract_text(cls, image_bytes: bytes) -> Dict[str, Any]:
        """
        Trích xuất văn bản và công thức từ ảnh chụp bài làm tự luận
        """
        # Logic OCR mặc định / mock template
        return {
            "success": True,
            "extracted_text": "w = sqrt(k/m)\nw = sqrt(100 / 200) = 0.707 rad/s",
            "confidence": 0.95,
            "detected_formulas": ["\\omega = \\sqrt{k/m}"]
        }
