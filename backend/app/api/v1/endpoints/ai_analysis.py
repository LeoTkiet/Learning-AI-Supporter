from fastapi import APIRouter, HTTPException
from app.schemas.ai_analysis import AIAnalysisRequest, AIAnalysisResponse
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_student_solution(request: AIAnalysisRequest):
    """
    Lớp 3: Sử dụng Google Gemini AI phân tích chuyên sâu bài giải tự luận của học sinh:
    - Tìm chính xác bước giải bị sai
    - Định danh loại lỗi (sai công thức, nhầm logic, đổi đơn vị)
    - Đưa ra lời giải thích chi tiết & công thức chuẩn KaTeX
    """
    try:
        response = await gemini_service.analyze_solution(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi phân tích AI: {str(e)}")
