-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)
-- ==============================================================================

-- 1. Môn học
INSERT INTO subjects (id, name, description) VALUES
('math', 'Toán Học', 'Đại số, Giải tích, Hình học Oxyz'),
('physics', 'Vật Lý', 'Dao động cơ, Sóng cơ, Điện xoay chiều'),
('chemistry', 'Hóa Học', 'Hóa hữu cơ, Hóa vô cơ, Oxi hóa khử')
ON CONFLICT (id) DO NOTHING;

-- 2. Chuyên đề mẫu
INSERT INTO topics (id, subject_id, name, order_index) VALUES
('11111111-1111-1111-1111-111111111111', 'math', 'Hàm số & Đạo hàm', 1),
('22222222-2222-2222-2222-222222222222', 'math', 'Tích phân & Nguyên hàm', 2),
('33333333-3333-3333-3333-333333333333', 'physics', 'Dao động điều hòa', 1),
('44444444-4444-4444-4444-444444444444', 'chemistry', 'Este & Lipit', 1)
ON CONFLICT (id) DO NOTHING;

-- 3. Người dùng mẫu
INSERT INTO user_stats (user_id, full_name, email, total_xp, streak_days) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nguyễn Văn A', 'nguyenvana@example.com', 2450, 14),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Trần Thị B', 'tranthib@example.com', 2100, 10)
ON CONFLICT (user_id) DO NOTHING;
