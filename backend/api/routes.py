from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any
from backend.models.schemas import (
    Subject, QuizQuestion, QuizSubmission, OCRResponse,
    AIAnalysisRequest, AIAnalysisResponse, LeaderboardUser
)
from backend.ai.ocr.ocr_engine import OCREngine
from backend.ai.llm.gemini_client import GeminiAIClient

router = APIRouter()

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
@router.post("/ocr/upload", response_model=OCRResponse)
async def upload_handwriting_solution(file: UploadFile = File(...)):
    """
    Nhận file ảnh chụp bài làm tự luận từ người dùng, tiền xử lý và trích xuất text/LaTeX
    """
    if not file.content_type.startswith("image/"):
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
