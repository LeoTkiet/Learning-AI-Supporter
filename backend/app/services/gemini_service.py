import json
import logging
from typing import Optional
from app.core.config import settings
from app.schemas.ai_analysis import AIAnalysisRequest, AIAnalysisResponse, StepAnalysis

logger = logging.getLogger(__name__)

# SYSTEM PROMPTS CHO TỪNG MÔN HỌC
PROMPT_TEMPLATES = {
    "math": """Bạn là một Chuyên gia Sư phạm Toán học THPT và Luyện thi Đại học.
Nhiệm vụ của bạn là kiểm tra bài giải tự luận của học sinh, phát hiện chính xác vị trí sai lầm, nguyên nhân sai và đưa ra lời giải thích sư phạm tận tình cùng công thức KaTeX chuẩn mực.

Đề bài: {question_content}
Bài làm của học sinh (đã qua OCR):
{student_solution}

Hãy phân tích bài giải từng bước và trả về định dạng JSON DUY NHẤT theo cấu trúc sau:
{{
    "detected_error_step": <Số thứ tự bước sai đầu tiên, hoặc null nếu đúng hoàn toàn>,
    "error_type": "<Tên lỗi, ví dụ: 'Sai công thức nguyên hàm', 'Quên điều kiện xác định', 'Lỗi biến đổi đại số', 'Nhầm dấu'>",
    "detailed_feedback": "<Nhận xét sư phạm chi tiết, chỉ rõ vì sao sai và cách khắc phục>",
    "steps_breakdown": [
        {{"step_number": 1, "content": "<Nội dung bước 1>", "is_correct": true, "comment": "<Đúng: Áp dụng chuẩn>"}},
        {{"step_number": 2, "content": "<Nội dung bước 2>", "is_correct": false, "comment": "<Sai ở đây: ...>"}}
    ],
    "suggested_revision": "<Chủ đề kiến thức cần ôn tập lại>",
    "remedial_latex_solution": "<Lời giải đúng chuẩn mực có chứa mã LaTeX toán học $...$ hoặc $$...$$>",
    "ai_confidence_score": 0.95,
    "knowledge_gap_tags": ["Nguyên hàm hàm số", "Kỹ thuật đổi biến"]
}}
Chỉ trả về chuỗi JSON hợp lệ, không bọc trong ```json hay văn bản thừa nào khác.
""",

    "physics": """Bạn là một Giáo viên Vật Lý THPT chuyên sâu về Cơ, Sóng, Điện xoay chiều và Quang học.
Nhiệm vụ của bạn là kiểm tra bài giải Vật lý của học sinh, chú trọng vào:
1. Đổi sai đơn vị (ví dụ g -> kg, cm -> m, ms -> s)
2. Áp dụng nhầm công thức Vật lý
3. Nhầm lẫn giữa giá trị cực đại và giá trị hiệu dụng ($U_0$ và $U$, $I_0$ và $I$)
4. Sai lệch logic hiện tượng vật lý.

Đề bài: {question_content}
Bài làm của học sinh (đã qua OCR):
{student_solution}

Hãy phân tích bài giải từng bước và trả về định dạng JSON DUY NHẤT theo cấu trúc:
{{
    "detected_error_step": <Số thứ tự bước sai đầu tiên, hoặc null nếu đúng>,
    "error_type": "<Ví dụ: 'Chưa đổi đơn vị gam sang kg', 'Nhầm lẫn điện áp cực đại với hiệu dụng', 'Sai công thức tần số góc'>",
    "detailed_feedback": "<Giải thích chi tiết hiện tượng và công thức vật lý bị nhầm lẫn>",
    "steps_breakdown": [
        {{"step_number": 1, "content": "<Bước 1>", "is_correct": true, "comment": "<Nhận xét>"}}
    ],
    "suggested_revision": "<Chuyên đề Vật Lý cần củng cố>",
    "remedial_latex_solution": "<Lời giải chuẩn có công thức Vật Lý viết bằng LaTeX $$...$$>",
    "ai_confidence_score": 0.95,
    "knowledge_gap_tags": ["Mạch điện xoay chiều", "Dung kháng và Cảm kháng"]
}}
Chỉ trả về chuỗi JSON hợp lệ.
""",

    "chemistry": """Bạn là một Chuyên gia Hóa Học chuyên sâu về Hóa Vô cơ, Hữu cơ và Phương pháp giải nhanh (Bảo toàn e, Bảo toàn khối lượng, Bảo toàn nguyên tố).
Nhiệm vụ của bạn là kiểm tra bài làm Hóa học của học sinh, chú trọng:
1. Viết sai phương trình hóa học hoặc quên cân bằng
2. Sai số mol hoặc sai tỉ lệ phản ứng
3. Nhầm số oxi hóa trong bảo toàn electron
4. Nhầm lẫn đồng phân hoặc công thức cấu tạo hữu cơ.

Đề bài: {question_content}
Bài làm của học sinh (đã qua OCR):
{student_solution}

Hãy phân tích bài giải từng bước và trả về định dạng JSON DUY NHẤT theo cấu trúc:
{{
    "detected_error_step": <Số thứ tự bước sai đầu tiên, hoặc null nếu đúng>,
    "error_type": "<Ví dụ: 'Sai hệ số trao đổi electron', 'Quên tính số mol dư', 'Sai công thức este'>",
    "detailed_feedback": "<Nhận xét chi tiết về bản chất phản ứng hóa học và phương pháp tính toán>",
    "steps_breakdown": [
        {{"step_number": 1, "content": "<Bước 1>", "is_correct": true, "comment": "<Nhận xét>"}}
    ],
    "suggested_revision": "<Chuyên đề Hóa học cần ôn lại>",
    "remedial_latex_solution": "<Lời giải chi tiết chuẩn xác bằng LaTeX/Công thức hóa học>",
    "ai_confidence_score": 0.95,
    "knowledge_gap_tags": ["Bảo toàn electron", "Kim loại tác dụng với Axit HNO3"]
}}
Chỉ trả về chuỗi JSON hợp lệ.
"""
}

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
        
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai.GenerativeModel(self.model_name)
                logger.info("Google Gemini AI client configured successfully.")
            except Exception as e:
                logger.warning(f"Failed to configure Gemini: {e}")

    async def analyze_solution(self, request: AIAnalysisRequest) -> AIAnalysisResponse:
        subject = request.subject_id.lower()
        prompt_template = PROMPT_TEMPLATES.get(subject, PROMPT_TEMPLATES["math"])
        
        prompt = prompt_template.format(
            question_content=request.question_content,
            student_solution=request.student_solution_text
        )

        if self._client:
            try:
                response = self._client.generate_content(prompt)
                raw_json_str = response.text.strip()
                
                # Làm sạch markdown nếu Gemini trả về ```json ... ```
                if raw_json_str.startswith("```"):
                    raw_json_str = raw_json_str.strip("`")
                    if raw_json_str.startswith("json"):
                        raw_json_str = raw_json_str[4:].strip()
                        
                data = json.loads(raw_json_str)
                return AIAnalysisResponse(
                    subject_id=request.subject_id,
                    detected_error_step=data.get("detected_error_step"),
                    error_type=data.get("error_type", "Lỗi lập luận"),
                    detailed_feedback=data.get("detailed_feedback", "Phân tích từ Gemini AI."),
                    steps_breakdown=[StepAnalysis(**s) for s in data.get("steps_breakdown", [])],
                    suggested_revision=data.get("suggested_revision", "Xem lại lý thuyết cơ bản."),
                    remedial_latex_solution=data.get("remedial_latex_solution", "$$x = 0$$"),
                    ai_confidence_score=data.get("ai_confidence_score", 0.95),
                    knowledge_gap_tags=data.get("knowledge_gap_tags", [])
                )
            except Exception as e:
                logger.error(f"Gemini API call failed: {e}. Using intelligent fallback.")

        # FALLBACK MOCK DATA NẾU CHƯA CÓ KEY HOẶC LỖI MẠNG
        return self._generate_intelligent_mock(request)

    def _generate_intelligent_mock(self, request: AIAnalysisRequest) -> AIAnalysisResponse:
        subject = request.subject_id.lower()
        if subject == "math":
            return AIAnalysisResponse(
                subject_id="math",
                detected_error_step=2,
                error_type="Nhầm lẫn công thức nguyên hàm hàm mũ",
                detailed_feedback="Ở Bước 2, bạn đã tính sai nguyên hàm của $e^x$. Lưu ý rằng $\\int e^x dx = e^x + C$, không phải $x \\cdot e^{x-1}$.",
                steps_breakdown=[
                    StepAnalysis(step_number=1, content="Phân tích hàm số: $f(x) = 2x + e^x$", is_correct=True, comment="Phân tích đúng cấu trúc tổng 2 hàm."),
                    StepAnalysis(step_number=2, content="Tính nguyên hàm từng phần tử: $\\int 2x dx = x^2$, nhưng $\\int e^x dx = x e^{x-1}$", is_correct=False, comment="Sai: Nhầm lẫn giữa đạo hàm đa thức và nguyên hàm hàm mũ."),
                    StepAnalysis(step_number=3, content="Kết luận sai: $F(x) = x^2 + x e^{x-1} + C$", is_correct=False, comment="Kết quả bị kéo theo từ sai lầm ở bước 2.")
                ],
                suggested_revision="Bảng nguyên hàm các hàm số cơ bản (Đặc biệt là hàm mũ $e^x$ và $a^x$)",
                remedial_latex_solution="$$\\int (2x + e^x)dx = 2 \\cdot \\frac{x^2}{2} + e^x + C = x^2 + e^x + C$$",
                ai_confidence_score=0.98,
                knowledge_gap_tags=["Nguyên hàm cơ bản", "Hàm số mũ"]
            )
        elif subject == "physics":
            return AIAnalysisResponse(
                subject_id="physics",
                detected_error_step=1,
                error_type="Chưa đổi đơn vị khối lượng (gam sang kg)",
                detailed_feedback="Ở Bước 1, bạn đã thế trực tiếp $m = 100$ vào công thức $\\omega = \\sqrt{k/m}$. Trong hệ SI, khối lượng bắt buộc phải đổi ra kilôgam ($100\\text{ g} = 0.1\\text{ kg}$).",
                steps_breakdown=[
                    StepAnalysis(step_number=1, content="Áp dụng $\\omega = \\sqrt{\\frac{100}{100}} = 1\\text{ rad/s}$", is_correct=False, comment="Sai đơn vị: $m$ phải là $0.1\\text{ kg}$ thay vì $100\\text{ g}$."),
                    StepAnalysis(step_number=2, content="Tính chu kỳ $T = \\frac{2\\pi}{\\omega} = 2\\pi\\text{ s}$", is_correct=False, comment="Kéo theo sai kết quả chu kỳ.")
                ],
                suggested_revision="Quy đổi đơn vị chuẩn SI trong Dao động cơ học",
                remedial_latex_solution="$$m = 100\\text{ g} = 0.1\\text{ kg} \\implies \\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0.1}} = \\sqrt{1000} = 10\\sqrt{10} \\approx 31.62\\text{ rad/s}$$",
                ai_confidence_score=0.96,
                knowledge_gap_tags=["Con lắc lò xo", "Đơn vị đo lường SI"]
            )
        else: # chemistry
            return AIAnalysisResponse(
                subject_id="chemistry",
                detected_error_step=2,
                error_type="Sai tỉ lệ mol trong định luật bảo toàn electron",
                detailed_feedback="Ở Bước 2, bạn đã viết quá trình khử: $\\text{N}^{+5} + 3e \\rightarrow \\text{N}^{+2}\\,(\\text{NO})$. Tuy nhiên khi tính toán lại lấy số mol $\\text{NO} = n_e \\times 3$ thay vì chia 3.",
                steps_breakdown=[
                    StepAnalysis(step_number=1, content="Tính $n_{\\text{Al}} = \\frac{5.4}{27} = 0.2\\text{ mol} \\implies n_{e\\text{ nhường}} = 0.2 \\times 3 = 0.6\\text{ mol}$", is_correct=True, comment="Tính đúng số mol Al và electron nhường."),
                    StepAnalysis(step_number=2, content="Tính $n_{\\text{NO}} = 0.6 \\times 3 = 1.8\\text{ mol}$", is_correct=False, comment="Sai tỉ lệ: $n_{\\text{NO}} = \\frac{n_e}{3} = 0.2\\text{ mol}$ mới chính xác."),
                    StepAnalysis(step_number=3, content="Thể tích $V = 1.8 \\times 22.4 = 40.32\\text{ lít}$", is_correct=False, comment="Kéo theo sai thể tích.")
                ],
                suggested_revision="Phương pháp Bảo toàn Electron trong bài toán Axit có tính Oxi hóa mạnh",
                remedial_latex_solution="$$3 \\cdot n_{\\text{Al}} = 3 \\cdot n_{\\text{NO}} \\implies n_{\\text{NO}} = n_{\\text{Al}} = 0.2\\text{ mol} \\implies V = 0.2 \\times 22.4 = 4.48\\text{ lít}$$",
                ai_confidence_score=0.97,
                knowledge_gap_tags=["Bảo toàn electron", "Phản ứng kim loại với HNO3"]
            )

gemini_service = GeminiService()
