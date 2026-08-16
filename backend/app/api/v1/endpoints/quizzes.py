import uuid
from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.quiz import (
    QuestionSchema, QuizSubmissionRequest, QuizSubmissionResponse, QuizResultItem
)

router = APIRouter()

MOCK_QUESTIONS_DB = {
    "math": [
        {
            "id": "q_math_1",
            "subject_id": "math",
            "topic_id": "math_calculus",
            "question_type": "multiple_choice",
            "difficulty": "medium",
            "content": "Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$.",
            "options": [
                {"id": "A", "text": "$F(x) = x^2 + e^x + C$"},
                {"id": "B", "text": "$F(x) = 2 + e^x + C$"},
                {"id": "C", "text": "$F(x) = x^2 - e^x + C$"},
                {"id": "D", "text": "$F(x) = \\frac{x^2}{2} + e^x + C$"}
            ],
            "correct_option": "A",
            "explanation": "Áp dụng công thức nguyên hàm cơ bản:\n$$\\int (2x + e^x)dx = 2 \\cdot \\frac{x^2}{2} + e^x + C = x^2 + e^x + C$$",
            "hint": "Nhớ lại nguyên hàm của đa thức $x^n$ và hàm mũ $e^x$."
        },
        {
            "id": "q_math_2",
            "subject_id": "math",
            "topic_id": "math_algebra",
            "question_type": "multiple_choice",
            "difficulty": "easy",
            "content": "Nghiệm của phương trình $\\log_2(x - 1) = 3$ là:",
            "options": [
                {"id": "A", "text": "$x = 7$"},
                {"id": "B", "text": "$x = 9$"},
                {"id": "C", "text": "$x = 8$"},
                {"id": "D", "text": "$x = 10$"}
            ],
            "correct_option": "B",
            "explanation": "Điều kiện $x > 1$. Ta có $\\log_2(x-1) = 3 \\Leftrightarrow x - 1 = 2^3 = 8 \\Leftrightarrow x = 9$.",
            "hint": "Áp dụng định nghĩa hàm logarit."
        }
    ],
    "physics": [
        {
            "id": "q_phy_1",
            "subject_id": "physics",
            "topic_id": "phy_mechanics",
            "question_type": "multiple_choice",
            "difficulty": "medium",
            "content": "Một con lắc lò xo gồm vật nặng khối lượng $m = 100\\text{ g}$ và lò xo có độ cứng $k = 100\\text{ N/m}$. Tần số góc dao động riêng của con lắc là:",
            "options": [
                {"id": "A", "text": "$\\omega = 10\\pi\\text{ rad/s}$"},
                {"id": "B", "text": "$\\omega = 10\\text{ rad/s}$"},
                {"id": "C", "text": "$\\omega = 31.62\\text{ rad/s}$"},
                {"id": "D", "text": "$\\omega = 100\\text{ rad/s}$"}
            ],
            "correct_option": "C",
            "explanation": "Đổi $m = 100\\text{ g} = 0.1\\text{ kg}$. Tần số góc $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0.1}} = 10\\sqrt{10} \\approx 31.62\\text{ rad/s}$.",
            "hint": "Đổi đơn vị gam sang kilôgam trước khi tính căn."
        }
    ],
    "chemistry": [
        {
            "id": "q_chem_1",
            "subject_id": "chemistry",
            "topic_id": "chem_organic",
            "question_type": "multiple_choice",
            "difficulty": "easy",
            "content": "Hợp chất hữu cơ nào sau đây thuộc loại este no, đơn chức, mạch hở?",
            "options": [
                {"id": "A", "text": "$\\text{CH}_3\\text{COOH}$"},
                {"id": "B", "text": "$\\text{HCOOCH}_3$"},
                {"id": "C", "text": "$\\text{CH}_2=\\text{CH}-\\text{COOCH}_3$"},
                {"id": "D", "text": "$\\text{CH}_3\\text{COOC}_6\\text{H}_5$"}
            ],
            "correct_option": "B",
            "explanation": "$\\text{HCOOCH}_3$ là metyl fomat, công thức $\\text{C}_2\\text{H}_4\\text{O}_2$ dạng este no đơn chức mạch hở $\\text{C}_n\\text{H}_{2n}\\text{O}_2$.",
            "hint": "Nhận biết nhóm chức este $-\\text{COO}-$."
        }
    ]
}

@router.get("/diagnostics/{subject_id}", response_model=List[QuestionSchema])
async def get_diagnostic_quiz(subject_id: str):
    """
    Lớp 1: Lấy bộ câu hỏi trắc nghiệm chẩn đoán kiến thức cho môn học
    """
    sub = subject_id.lower()
    questions = MOCK_QUESTIONS_DB.get(sub, MOCK_QUESTIONS_DB["math"])
    # Ẩn đáp án đúng và lời giải khi gửi cho học sinh làm bài
    return [QuestionSchema(**q) for q in questions]

@router.post("/submit", response_model=QuizSubmissionResponse)
async def submit_quiz(request: QuizSubmissionRequest):
    """
    Chấm điểm trắc nghiệm và khoanh vùng mảng kiến thức yếu (chuẩn bị cho Lớp 2)
    """
    sub = request.subject_id.lower()
    db_questions = {q["id"]: q for q in MOCK_QUESTIONS_DB.get(sub, MOCK_QUESTIONS_DB["math"])}
    
    results = []
    correct_count = 0
    weak_topics = []

    for ans in request.answers:
        q = db_questions.get(ans.question_id)
        if q:
            is_correct = (ans.selected_option.upper() == q["correct_option"].upper())
            if is_correct:
                correct_count += 1
            else:
                if q["topic_id"] not in weak_topics:
                    weak_topics.append(q["topic_id"])
                    
            results.append(QuizResultItem(
                question_id=ans.question_id,
                topic_id=q["topic_id"],
                selected_option=ans.selected_option,
                correct_option=q["correct_option"],
                is_correct=is_correct,
                explanation=q.get("explanation"),
                content=q["content"]
            ))

    total = len(request.answers) if request.answers else 1
    score = (correct_count / total) * 100

    return QuizSubmissionResponse(
        quiz_session_id=str(uuid.uuid4()),
        subject_id=request.subject_id,
        total_questions=total,
        correct_count=correct_count,
        score_percentage=round(score, 2),
        results=results,
        weak_topics=weak_topics,
        xp_earned=correct_count * 20
    )
