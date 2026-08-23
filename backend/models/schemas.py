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
class MathOCRResponse(BaseModel):
    status: str = Field(default="success", description="Status of the OCR operation ('success' or 'error')")
    processing_time_ms: float = Field(..., description="End-to-end processing latency in milliseconds")
    latex_formula: str = Field(..., description="Extracted LaTeX formula from the image")

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

# --- Schemas Xác Thực & Người Dùng (Auth & User) ---
class UserLoginRequest(BaseModel):
    email: str = Field(..., description="Email hoặc tài khoản đăng nhập")
    password: str = Field(..., min_length=6, description="Mật khẩu tài khoản")

class UserRegisterRequest(BaseModel):
    email: str = Field(..., description="Email người dùng")
    password: str = Field(..., min_length=6, description="Mật khẩu")
    full_name: Optional[str] = Field(None, description="Họ và tên người dùng")

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., description="Email cần gửi liên kết đặt lại mật khẩu")

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    xp: int = 0
    streak: int = 0

class AuthResponse(BaseModel):
    status: str = "success"
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
    message: Optional[str] = None

