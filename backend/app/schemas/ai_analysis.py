from typing import List, Optional
from pydantic import BaseModel

class StepAnalysis(BaseModel):
    step_number: int
    content: str
    is_correct: bool
    comment: Optional[str] = None

class AIAnalysisRequest(BaseModel):
    subject_id: str  # 'math', 'physics', 'chemistry'
    question_content: str
    student_solution_text: str  # From OCR or manual input
    correct_solution: Optional[str] = None
    topic_id: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    subject_id: str
    detected_error_step: Optional[int] = None
    error_type: Optional[str] = None  # e.g., 'Sai công thức', 'Nhầm lẫn tính toán'
    detailed_feedback: str
    steps_breakdown: List[StepAnalysis] = []
    suggested_revision: str
    remedial_latex_solution: str
    ai_confidence_score: float = 0.95
    knowledge_gap_tags: List[str] = []
