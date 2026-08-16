from fastapi import APIRouter
from app.api.v1.endpoints import subjects, quizzes, ocr, ai_analysis, gamification

api_router = APIRouter()

api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects (Toán - Lý - Hóa)"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["Lớp 1: Trắc nghiệm chẩn đoán"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["Lớp 2: Xử lý ảnh OCR tự luận"])
api_router.include_router(ai_analysis.router, prefix="/ai", tags=["Lớp 3: Phân tích sâu từ Gemini AI"])
api_router.include_router(gamification.router, prefix="/gamification", tags=["Gamification & Radar Dashboard"])
