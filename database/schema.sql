-- ==============================================================================
-- HỆ THỐNG HỖ TRỢ HỌC TẬP ĐA MÔN ÁP DỤNG AI (TOÁN, LÝ, HÓA)
-- CSDL POSTGRESQL / SUPABASE SCHEMA
-- ==============================================================================

-- Bật UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG MÔN HỌC (SUBJECTS)
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY, -- 'math', 'physics', 'chemistry'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG CHUYÊN ĐỀ / CHỦ ĐỀ KIẾN THỨC (TOPICS & KNOWLEDGE GRAPH)
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    parent_id VARCHAR(50) REFERENCES topics(id) ON DELETE SET NULL,
    weight INTEGER DEFAULT 1, -- Trọng số kỹ năng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG HỒ SƠ NGƯỜI DÙNG (USER_PROFILES)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    grade INTEGER DEFAULT 12, -- Lớp 10, 11, 12
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG CÂU HỎI (QUESTIONS - TRẮC NGHIỆM & TỰ LUẬN)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    question_type VARCHAR(20) DEFAULT 'multiple_choice', -- 'multiple_choice', 'essay'
    difficulty VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard', 'advanced'
    content TEXT NOT NULL, -- Hỗ trợ LaTeX: $\int_0^1 x dx$
    image_url TEXT,
    options JSONB, -- Ví dụ: [{"id": "A", "text": "2"}, {"id": "B", "text": "4"}]
    correct_option VARCHAR(10), -- 'A', 'B', 'C', 'D'
    explanation TEXT, -- Lời giải chuẩn bằng LaTeX / Markdown
    hint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG BÀI KIỂM TRA CHẨN ĐOÁN (QUIZ_SESSIONS)
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'in_progress', -- 'in_progress', 'completed'
    total_questions INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    score_percentage NUMERIC(5,2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. BẢNG BÀI NỘP TRẮC NGHIỆM & TỰ LUẬN OCR (SUBMISSIONS)
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    selected_option VARCHAR(10),
    is_correct BOOLEAN,
    
    -- Dành cho Lớp 2 (OCR Tự luận)
    handwritten_image_url TEXT,
    ocr_raw_text TEXT,
    ocr_confidence NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BẢNG PHÂN TÍCH CHUYÊN SÂU TỪ GEMINI AI (AI_ANALYSES - Lớp 3)
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    detected_error_step INTEGER, -- Bước đầu tiên bị sai trong bài giải
    error_type VARCHAR(100), -- 'Sai công thức', 'Nhầm lẫn dấu', 'Lỗi tính toán', 'Thiếu điều kiện xác định'
    detailed_feedback TEXT NOT NULL, -- Phân tích từng bước
    suggested_revision TEXT, -- Lộ trình khắc phục lỗ hổng
    remedial_latex_solution TEXT, -- Lời giải đúng dạng KaTeX
    ai_confidence_score NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG NĂNG LỰC NGƯỜI DÙNG CHO BIỂU ĐỒ RADAR (USER_STATS / RADAR METRICS)
CREATE TABLE IF NOT EXISTS user_topic_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score INTEGER DEFAULT 50, -- Điểm kỹ năng từ 0 - 100 (vẽ Radar)
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, topic_id)
);

-- 9. BẢNG HUY HIỆU & GAMIFICATION (BADGES & USER_BADGES)
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    category VARCHAR(50) DEFAULT 'general', -- 'math', 'physics', 'chemistry', 'streak', 'general'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- 10. VIEW BẢNG XẾP HẠNG (LEADERBOARD VIEW)
CREATE OR REPLACE VIEW view_leaderboard AS
SELECT 
    p.id AS user_id,
    p.full_name,
    p.avatar_url,
    p.grade,
    p.total_xp,
    p.current_streak,
    COUNT(DISTINCT ub.badge_id) AS badges_count,
    DENSE_RANK() OVER (ORDER BY p.total_xp DESC) AS rank_position
FROM user_profiles p
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.full_name, p.avatar_url, p.grade, p.total_xp, p.current_streak
ORDER BY p.total_xp DESC;
