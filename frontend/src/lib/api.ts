import {
  Subject, Question, QuizSubmissionResponse,
  OCRProcessResponse, AIAnalysisResponse, DashboardSummary, SubjectId
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/subjects/`);
    if (!res.ok) throw new Error("Failed to fetch subjects");
    return await res.json();
  } catch {
    return [
      {
        id: "math",
        name: "Toán Học",
        description: "Đại số, Giải tích, Hình học không gian, Mũ - Logarit và Tọa độ Oxyz",
        icon: "Calculator",
        color: "#3B82F6",
        total_topics: 5,
        active_students: 1240
      },
      {
        id: "physics",
        name: "Vật Lý",
        description: "Dao động cơ, Sóng cơ, Điện xoay chiều, Sóng ánh sáng và Hạt nhân",
        icon: "Zap",
        color: "#8B5CF6",
        total_topics: 5,
        active_students: 980
      },
      {
        id: "chemistry",
        name: "Hóa Học",
        description: "Hóa vô cơ kim loại, Este - Lipit, Amino axit, Polime và Oxi hóa khử",
        icon: "FlaskConical",
        color: "#10B981",
        total_topics: 5,
        active_students: 850
      }
    ];
  }
}

export async function fetchDiagnosticQuiz(subjectId: SubjectId): Promise<Question[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/quizzes/diagnostics/${subjectId}`);
    if (!res.ok) throw new Error("Failed to fetch diagnostic questions");
    return await res.json();
  } catch {
    if (subjectId === "math") {
      return [
        {
          id: "q_math_1",
          subject_id: "math",
          topic_id: "math_calculus",
          question_type: "multiple_choice",
          difficulty: "medium",
          content: "Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$.",
          options: [
            { id: "A", text: "$F(x) = x^2 + e^x + C$" },
            { id: "B", text: "$F(x) = 2 + e^x + C$" },
            { id: "C", text: "$F(x) = x^2 - e^x + C$" },
            { id: "D", text: "$F(x) = \\frac{x^2}{2} + e^x + C$" }
          ],
          hint: "Áp dụng công thức nguyên hàm cơ bản cho từng số hạng."
        }
      ];
    } else if (subjectId === "physics") {
      return [
        {
          id: "q_phy_1",
          subject_id: "physics",
          topic_id: "phy_mechanics",
          question_type: "multiple_choice",
          difficulty: "medium",
          content: "Một con lắc lò xo gồm vật nặng $m = 100\\text{ g}$ và lò xo $k = 100\\text{ N/m}$. Tần số góc dao động riêng của con lắc là:",
          options: [
            { id: "A", text: "$\\omega = 10\\pi\\text{ rad/s}$" },
            { id: "B", text: "$\\omega = 10\\text{ rad/s}$" },
            { id: "C", text: "$\\omega = 31.62\\text{ rad/s}$" },
            { id: "D", text: "$\\omega = 100\\text{ rad/s}$" }
          ],
          hint: "Đổi đơn vị $m$ sang kilôgam."
        }
      ];
    } else {
      return [
        {
          id: "q_chem_1",
          subject_id: "chemistry",
          topic_id: "chem_organic",
          question_type: "multiple_choice",
          difficulty: "easy",
          content: "Hợp chất hữu cơ nào sau đây thuộc loại este no, đơn chức, mạch hở?",
          options: [
            { id: "A", text: "$\\text{CH}_3\\text{COOH}$" },
            { id: "B", text: "$\\text{HCOOCH}_3$" },
            { id: "C", text: "$\\text{CH}_2=\\text{CH}-\\text{COOCH}_3$" },
            { id: "D", text: "$\\text{CH}_3\\text{COOC}_6\\text{H}_5$" }
          ],
          hint: "Este có nhóm $-\\text{COO}-$."
        }
      ];
    }
  }
}

export async function submitQuizAnswers(
  subjectId: SubjectId,
  answers: { question_id: string; selected_option: string }[]
): Promise<QuizSubmissionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/quizzes/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, answers }),
    });
    if (!res.ok) throw new Error("Failed to submit quiz");
    return await res.json();
  } catch {
    return {
      quiz_session_id: "demo-session-id",
      subject_id: subjectId,
      total_questions: answers.length || 1,
      correct_count: 0,
      score_percentage: 0.0,
      results: answers.map((a) => ({
        question_id: a.question_id,
        topic_id: "math_calculus",
        selected_option: a.selected_option,
        correct_option: "A",
        is_correct: false,
        explanation: "Đáp án đúng là A. Cần luyện tập thêm!",
        content: "Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$."
      })),
      weak_topics: ["math_calculus"],
      xp_earned: 0
    };
  }
}

export async function uploadEssayImage(file: File, subjectId: SubjectId): Promise<OCRProcessResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", subjectId);

    const res = await fetch(`${API_BASE_URL}/ocr/process-image`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("OCR Processing failed");
    return await res.json();
  } catch {
    return {
      raw_text: "Bước 1: f(x) = 2x + e^x\nBước 2: F(x) = 2*(x^2/2) + x*e^(x-1) + C\nBước 3: F(x) = x^2 + x*e^(x-1) + C",
      latex_extracted: "F(x) = x^2 + x\\cdot e^{x-1} + C",
      confidence_score: 91.5,
      detected_language: "vie+eng",
      is_readable: true,
    };
  }
}

export async function analyzeSolutionWithAI(
  subjectId: SubjectId,
  questionContent: string,
  studentSolutionText: string
): Promise<AIAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subjectId,
        question_content: questionContent,
        student_solution_text: studentSolutionText,
      }),
    });
    if (!res.ok) throw new Error("AI analysis failed");
    return await res.json();
  } catch {
    return {
      subject_id: subjectId,
      detected_error_step: 2,
      error_type: "Nhầm lẫn công thức nguyên hàm hàm mũ",
      detailed_feedback: "Tại Bước 2, bạn đã tính đạo hàm thay vì lấy nguyên hàm của e^x.",
      steps_breakdown: [
        { step_number: 1, content: "Phân tích f(x) = 2x + e^x", is_correct: true, comment: "Đúng" },
        { step_number: 2, content: "F(x) = x^2 + x*e^(x-1)", is_correct: false, comment: "Sai nguyên hàm của e^x" }
      ],
      suggested_revision: "Bảng nguyên hàm cơ bản hàm mũ và logarit",
      remedial_latex_solution: "$$\\int (2x + e^x)dx = x^2 + e^x + C$$",
      ai_confidence_score: 0.98,
      knowledge_gap_tags: ["Nguyên hàm", "Hàm mũ"]
    };
  }
}

export async function fetchDashboardData(): Promise<DashboardSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/gamification/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    return await res.json();
  } catch {
    return {
      user_id: "demo-user",
      full_name: "Nguyễn Văn An",
      avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=AnNguyen",
      grade: 12,
      total_xp: 1450,
      current_streak: 5,
      radar_data: [
        {
          subject_id: "math",
          subject_name: "Toán Học",
          overall_mastery: 70,
          skills: [
            { topic_id: "math_calculus", topic_name: "Giải tích & Đạo hàm", mastery_score: 45, total_attempts: 12, correct_attempts: 5 },
            { topic_id: "math_algebra", topic_name: "Đại số & Lũy thừa", mastery_score: 70, total_attempts: 10, correct_attempts: 7 },
            { topic_id: "math_geometry", topic_name: "Hình học Không gian", mastery_score: 85, total_attempts: 14, correct_attempts: 12 },
            { topic_id: "math_probability", topic_name: "Xác suất & Thống kê", mastery_score: 60, total_attempts: 8, correct_attempts: 5 },
            { topic_id: "math_vectors", topic_name: "Tọa độ Oxyz", mastery_score: 90, total_attempts: 15, correct_attempts: 14 },
          ]
        }
      ],
      badges: [
        { id: "first_quiz", name: "Khởi Đầu Nan", description: "Hoàn thành bài kiểm tra chẩn đoán", icon_name: "Trophy", xp_reward: 100, category: "general", is_unlocked: true },
        { id: "ocr_master", name: "Chữ Đẹp Điểm Cao", description: "Tải lên bài giải OCR thành công", icon_name: "FileText", xp_reward: 150, category: "general", is_unlocked: true },
        { id: "math_scholar", name: "Thần Đồng Đại Số", description: "Đạt 85+ điểm năng lực Toán", icon_name: "Award", xp_reward: 250, category: "math", is_unlocked: false }
      ],
      recent_activity: [
        { type: "quiz", subject: "Toán Học", score: "80%", time: "Hôm qua lúc 19:30" }
      ]
    };
  }
}
