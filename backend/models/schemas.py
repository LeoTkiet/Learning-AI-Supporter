from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- Schemas Môn Học & Trắc Nghiệm ---
class Subject(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

class QuizQuestion(BaseModel):
    id: str
    subject_id: str
    topic: str
    content: str
    options: List[str]
    correct_answer: Optional[str] = None

class QuizSubmission(BaseModel):
    user_id: str
    subject_id: str
    answers: Dict[str, str]  # {question_id: selected_option}

# --- Schemas OCR & Nhận Diện ---
class OCRResponse(BaseModel):
    success: bool
    extracted_text: str
    confidence: float = 0.0
    detected_formulas: List[str] = []

# --- Schemas Gemini AI Phân Tích ---
class StepBreakdown(BaseModel):
    step_number: int
    content: str
    is_correct: bool
    comment: str

class AIAnalysisRequest(BaseModel):
    subject: str
    question_content: str
    student_solution_text: str

class AIAnalysisResponse(BaseModel):
    detected_error_step: Optional[int] = None
    error_type: Optional[str] = None
    detailed_feedback: str
    steps_breakdown: List[StepBreakdown] = []
    suggested_revision: Optional[str] = None
    remedial_latex_solution: Optional[str] = None

# --- Schemas Gamification ---
class LeaderboardUser(BaseModel):
    rank: int
    user_id: str
    name: str
    xp: int
    streak: int
