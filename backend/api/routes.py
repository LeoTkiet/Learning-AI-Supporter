import os
import time
from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, Depends
from typing import List, Dict, Any, Optional
from backend.models.schemas import (
    Subject, QuizQuestion, QuizSubmission, OCRResponse, MathOCRResponse,
    AIAnalysisRequest, AIAnalysisResponse, LeaderboardUser
)
from backend.ai.ocr.ocr_engine import OCREngine
from backend.ai.ocr.image_processing import (
    validate_image_content_type, decode_image_from_bytes, enhance_image_for_ocr
)
from backend.ai.ocr.math_ocr_service import (
    MathOCRService, MockMathOCRService, GeminiMathOCRService, parse_api_keys
)
from backend.ai.llm.gemini_client import GeminiAIClient

router = APIRouter()

# Dependency provider for MathOCRService
def get_math_ocr_service() -> MathOCRService:
    keys = parse_api_keys()
    if keys:
        try:
            return GeminiMathOCRService(api_keys=keys)
        except Exception:
            pass
    return MockMathOCRService()

# --- Endpoint Môn Học & Trắc Nghiệm ---
@router.get("/subjects", response_model=List[Subject])
async def get_subjects():
    return [
        {"id": "math", "name": "Toán Học", "description": "Đại số, Giải tích, Hình học Oxyz"},
        {"id": "physics", "name": "Vật Lý", "description": "Dao động cơ, Sóng cơ, Điện xoay chiều"},
        {"id": "chemistry", "name": "Hóa Học", "description": "Hóa hữu cơ, Hóa vô cơ, Oxi hóa khử"}
    ]

@router.get("/quizzes/{subject_id}", response_model=List[QuizQuestion])
async def get_diagnostic_quiz(subject_id: str):
    return [
        {
            "id": "q1",
            "subject_id": subject_id,
            "topic": "Đạo hàm & Cực trị",
            "content": "Số điểm cực trị của hàm số y = x^3 - 3x là:",
            "options": ["0", "1", "2", "3"]
        }
    ]

@router.post("/quizzes/submit")
async def submit_quiz(submission: QuizSubmission):
    return {
        "status": "success",
        "score": 80,
        "incorrect_questions": ["q2"],
        "weak_topics": ["Đổi đơn vị SI", "Dao động cơ"]
    }

# --- Endpoint Nhận UploadFile & OCR ---
@router.post("/extract-math", response_model=MathOCRResponse)
async def extract_math_formula(
    file: UploadFile = File(...),
    x_gemini_api_key: Optional[str] = Header(
        default=None,
        alias="x-gemini-api-key",
        description="Optional Gemini API key for real-time AI OCR recognition"
    ),
    ocr_service: MathOCRService = Depends(get_math_ocr_service)
) -> MathOCRResponse:
    """
    High-performance Mathematical OCR endpoint (STRICT ZERO DISK I/O).
    
    1. Validates image MIME type and file format.
    2. Decodes image in-memory from bytes to OpenCV array.
    3. Enhances image using Grayscale -> Gaussian Blur -> Adaptive Gaussian Thresholding.
    4. Passes enhanced image to MathOCRService in RAM and returns LaTeX formula.
    """
    start_time = time.perf_counter()

    # 1. Image format validation
    if not validate_image_content_type(file.content_type, file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Please upload a valid image (PNG, JPEG, WEBP, BMP, TIFF)."
        )

    try:
        # 2. In-memory reading (Zero Disk I/O)
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # Decode directly from memory buffer
        cv2_image = decode_image_from_bytes(image_bytes)

        # 3. Image Enhancement Pipeline
        enhanced_image = enhance_image_for_ocr(cv2_image)

        # 4. OCR Inference (In-Memory)
        active_service = GeminiMathOCRService(api_keys=x_gemini_api_key) if x_gemini_api_key else ocr_service
        latex_formula = await active_service.extract_latex(enhanced_image)

        # 5. Measure latency and return response
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return MathOCRResponse(
            status="success",
            processing_time_ms=elapsed_ms,
            latex_formula=latex_formula
        )

    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected internal error occurred during math OCR processing: {str(exc)}"
        )


@router.post("/ocr/upload", response_model=OCRResponse)
async def upload_handwriting_solution(file: UploadFile = File(...)):
    """
    Nhận file ảnh chụp bài làm tự luận từ người dùng, tiền xử lý và trích xuất text/LaTeX
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file hình ảnh.")
    
    contents = await file.read()
    result = OCREngine.extract_text(contents)
    return result

# --- Endpoint Phân Tích Gemini AI ---
@router.post("/ai/analyze", response_model=AIAnalysisResponse)
async def analyze_with_gemini(request: AIAnalysisRequest):
    """
    Gửi dữ liệu nhận diện sang Gemini AI để phân tích từng bước và chẩn đoán sư phạm
    """
    result = GeminiAIClient.analyze_solution(
        subject=request.subject,
        question=request.question_content,
        solution_text=request.student_solution_text
    )
    return result

# --- Endpoint Gamification & Leaderboard ---
@router.get("/gamification/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard():
    return [
        {"rank": 1, "user_id": "u1", "name": "Nguyễn Văn A", "xp": 2450, "streak": 14},
        {"rank": 2, "user_id": "u2", "name": "Trần Thị B", "xp": 2100, "streak": 10},
        {"rank": 3, "user_id": "u3", "name": "Lê Hoàng C", "xp": 1850, "streak": 7}
    ]
