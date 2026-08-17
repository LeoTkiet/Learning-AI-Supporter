-- ==============================================================================
-- CSDL POSTGRESQL / SUPABASE: AI LEARNING PLATFORM
-- ==============================================================================

-- 1. Bảng Môn Học (Subjects)
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng Chuyên Đề Kiến Thức (Topics)
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    order_index INT DEFAULT 0
);

-- 3. Bảng Hồ Sơ Người Dùng & Thống Kê (User_Stats)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    total_xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bảng Điểm Kỹ Năng Theo Chuyên Đề (User_Topic_Stats - Dành cho Radar Chart)
CREATE TABLE IF NOT EXISTS user_topic_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_stats(user_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score INT DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bảng Ngân Hàng Câu Hỏi (Questions)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT,
    explanation TEXT
);

-- 6. Bảng Bài Nộp & Chẩn Đoán AI (Submissions)
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_stats(user_id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    ocr_extracted_text TEXT,
    image_url TEXT,
    ai_feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
