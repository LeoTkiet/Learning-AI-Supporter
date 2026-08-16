export type SubjectId = "math" | "physics" | "chemistry";

export interface Subject {
  id: SubjectId;
  name: string;
  description: string;
  icon: string;
  color: string;
  total_topics: number;
  active_students: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject_id: SubjectId;
  topic_id: string;
  question_type: string;
  difficulty: "easy" | "medium" | "hard";
  content: string;
  image_url?: string;
  options: QuestionOption[];
  hint?: string;
}

export interface QuizResultItem {
  question_id: string;
  topic_id: string;
  selected_option: string;
  correct_option: string;
  is_correct: bool;
  explanation?: string;
  content: string;
}

export interface QuizSubmissionResponse {
  quiz_session_id: string;
  subject_id: string;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  results: QuizResultItem[];
  weak_topics: string[];
  xp_earned: number;
}

export interface OCRProcessResponse {
  raw_text: string;
  latex_extracted?: string;
  confidence_score: number;
  detected_language: string;
  is_readable: boolean;
  warning_message?: string;
}

export interface StepAnalysis {
  step_number: number;
  content: string;
  is_correct: boolean;
  comment?: string;
}

export interface AIAnalysisResponse {
  subject_id: SubjectId;
  detected_error_step?: number;
  error_type?: string;
  detailed_feedback: string;
  steps_breakdown: StepAnalysis[];
  suggested_revision: string;
  remedial_latex_solution: string;
  ai_confidence_score: number;
  knowledge_gap_tags: string[];
}

export interface SkillScore {
  topic_id: string;
  topic_name: string;
  mastery_score: number;
  total_attempts: number;
  correct_attempts: number;
}

export interface RadarChartData {
  subject_id: SubjectId;
  subject_name: string;
  overall_mastery: number;
  skills: SkillScore[];
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  xp_reward: number;
  category: string;
  is_unlocked: boolean;
  unlocked_at?: string;
}

export interface LeaderboardUser {
  user_id: string;
  rank_position: number;
  full_name: string;
  avatar_url: string;
  grade: number;
  total_xp: number;
  current_streak: number;
  badges_count: number;
}

export interface DashboardSummary {
  user_id: string;
  full_name: string;
  avatar_url: string;
  grade: number;
  total_xp: number;
  current_streak: number;
  radar_data: RadarChartData[];
  badges: BadgeItem[];
  recent_activity: Array<{
    type: string;
    subject?: string;
    score?: string;
    feedback?: string;
    badge_name?: string;
    xp?: string;
    time: string;
  }>;
}
