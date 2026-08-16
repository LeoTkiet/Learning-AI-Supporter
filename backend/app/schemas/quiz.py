from typing import List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class QuestionOption(BaseModel):
    id: str
    text: str

class QuestionSchema(BaseModel):
    id: str
    subject_id: str
    topic_id: str
    question_type: str = "multiple_choice"
    difficulty: str = "medium"
    content: str
    image_url: Optional[str] = None
    options: List[QuestionOption] = []
    hint: Optional[str] = None

class QuestionWithAnswerSchema(QuestionSchema):
    correct_option: str
    explanation: Optional[str] = None

class AnswerSubmission(BaseModel):
    question_id: str
    selected_option: str

class QuizSubmissionRequest(BaseModel):
    user_id: Optional[str] = "a0000000-0000-0000-0000-000000000001"
    subject_id: str
    answers: List[AnswerSubmission]

class QuizResultItem(BaseModel):
    question_id: str
    topic_id: str
    selected_option: str
    correct_option: str
    is_correct: bool
    explanation: Optional[str] = None
    content: str

class QuizSubmissionResponse(BaseModel):
    quiz_session_id: str
    subject_id: str
    total_questions: int
    correct_count: int
    score_percentage: float
    results: List[QuizResultItem]
    weak_topics: List[str]
    xp_earned: int
