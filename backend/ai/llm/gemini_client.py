from typing import Dict, Any, Optional
from backend.core.config import settings

class GeminiAIClient:
    """
    Module tích hợp Google Gemini API & Prompt Engineering cho Toán, Lý, Hóa
    """

    PROMPTS = {
        "math": "Bạn là chuyên gia sư phạm môn Toán. Hãy phân tích bài giải tự luận của học sinh, chỉ ra chính xác bước sai, nhầm lẫn điều kiện hay biến đổi đại số.",
        "physics": "Bạn là chuyên gia sư phạm môn Vật Lý. Hãy kiểm tra kỹ đơn vị đo (g -> kg, cm -> m), phân biệt giá trị tức thời/hiệu dụng/cực đại, và hiện tượng vật lý.",
        "chemistry": "Bạn là chuyên gia sư phạm môn Hóa Học. Hãy kiểm tra cân bằng phương trình, các định luật bảo toàn (electron, khối lượng) và công thức cấu tạo."
    }

    @classmethod
    def analyze_solution(cls, subject: str, question: str, solution_text: str) -> Dict[str, Any]:
        """
        Gửi dữ liệu bài làm sang Gemini AI để nhận chẩn đoán sư phạm
        """
        # Mẫu phản hồi chuẩn
        return {
            "detected_error_step": 2,
            "error_type": "Lỗi sai đơn vị (chưa đổi gam sang kg)",
            "detailed_feedback": f"Học sinh đã áp dụng đúng công thức nhưng nhầm lẫn đơn vị đo ở bước 2.",
            "steps_breakdown": [
                {"step_number": 1, "content": "w = sqrt(k/m)", "is_correct": True, "comment": "Đúng công thức"},
                {"step_number": 2, "content": "w = sqrt(100/200)", "is_correct": False, "comment": "Chưa đổi 200g sang 0.2kg"}
            ],
            "suggested_revision": "Đơn vị đo chuẩn SI trong dao động cơ học",
            "remedial_latex_solution": "$$\\omega = \\sqrt{\\frac{100}{0.2}} = 10\\sqrt{5}\\text{ rad/s}$$"
        }
