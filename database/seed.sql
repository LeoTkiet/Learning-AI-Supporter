-- ==============================================================================
-- HỆ THỐNG HỖ TRỢ HỌC TẬP ĐA MÔN ÁP DỤNG AI (TOÁN, LÝ, HÓA)
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)
-- ==============================================================================

-- 1. NẠP DỮ LIỆU MÔN HỌC (3 MÔN KHOA HỌC TỰ NHIÊN)
INSERT INTO subjects (id, name, description, icon, color) VALUES
('math', 'Toán Học', 'Đại số, Giải tích, Hình học không gian và Xác suất thống kê', 'Calculator', '#3B82F6'),
('physics', 'Vật Lý', 'Cơ học, Dao động sóng, Điện xoay chiều, Quang học và Hạt nhân', 'Zap', '#8B5CF6'),
('chemistry', 'Hóa Học', 'Hóa vô cơ, Kim loại, Hóa hữu cơ, Polime và Phản ứng oxi hóa khử', 'FlaskConical', '#10B981')
ON CONFLICT (id) DO NOTHING;

-- 2. NẠP DỮ LIỆU CHUYÊN ĐỀ (TOPICS)
-- 2.1. TOÁN HỌC
INSERT INTO topics (id, subject_id, name, description, weight) VALUES
('math_calculus', 'math', 'Giải tích & Đạo hàm', 'Ứng dụng đạo hàm khảo sát hàm số, tích phân và nguyên hàm', 2),
('math_algebra', 'math', 'Đại số & Lũy thừa', 'Mũ - Logarit, Số phức, Bất đẳng thức', 2),
('math_geometry', 'math', 'Hình học Không gian', 'Thể tích khối đa diện, Góc và Khoảng cách', 2),
('math_probability', 'math', 'Xác suất & Thống kê', 'Tổ hợp, xác suất biến cố và phân phối', 1),
('math_vectors', 'math', 'Tọa độ Oxyz', 'Phương trình mặt phẳng, đường thẳng và mặt cầu', 2)
ON CONFLICT (id) DO NOTHING;

-- 2.2. VẬT LÝ
INSERT INTO topics (id, subject_id, name, description, weight) VALUES
('phy_mechanics', 'physics', 'Dao động cơ học', 'Con lắc lò xo, con lắc đơn, dao động tắt dần và cộng hưởng', 2),
('phy_waves', 'physics', 'Sóng cơ & Sóng âm', 'Giao thoa sóng, sóng dừng và đặc trưng sinh lý âm', 2),
('phy_ac_current', 'physics', 'Điện xoay chiều', 'Mạch RLC nối tiếp, công suất tiêu thụ và máy biến áp', 2),
('phy_optics', 'physics', 'Quang hình & Sóng ánh sáng', 'Tán sắc ánh sáng, giao thoa khe Young và quang phổ', 1),
('phy_nuclear', 'physics', 'Vật lý Hạt nhân', 'Phóng xạ, năng lượng liên kết và phản ứng hạt nhân', 1)
ON CONFLICT (id) DO NOTHING;

-- 2.3. HÓA HỌC
INSERT INTO topics (id, subject_id, name, description, weight) VALUES
('chem_organic', 'chemistry', 'Hóa học Hữu cơ', 'Este - Lipit, Cacbohiđrat, Amin, Amino axit và Protein', 2),
('chem_inorganic', 'chemistry', 'Hóa học Vô cơ', 'Kim loại kiềm, kiềm thổ, nhôm, sắt và hợp chất', 2),
('chem_redox', 'chemistry', 'Điện phân & Oxi hóa khử', 'Pin điện hóa, sự điện phân dung dịch và ăn mòn kim loại', 2),
('chem_polymers', 'chemistry', 'Polime & Vật liệu', 'Phản ứng trùng hợp, trùng ngưng và tơ sợi', 1),
('chem_thermochemistry', 'chemistry', 'Nhiệt hóa học & Tốc độ', 'Biến thiên Enthalpy và hằng số cân bằng hóa học', 1)
ON CONFLICT (id) DO NOTHING;

-- 3. NẠP BỘ HUY HIỆU GAMIFICATION (BADGES)
INSERT INTO badges (id, name, description, icon_name, xp_reward, category) VALUES
('first_quiz', 'Khởi Đầu Nan', 'Hoàn thành bài kiểm tra chẩn đoán đầu tiên', 'Trophy', 100, 'general'),
('ocr_master', 'Chữ Đẹp Điểm Cao', 'Tải lên bài giải tự luận OCR đầu tiên thành công', 'FileText', 150, 'general'),
('math_scholar', 'Thần Đồng Đại Số', 'Đạt 85+ điểm năng lực chuyên đề Giải tích', 'Award', 250, 'math'),
('physics_pro', 'Bậc Thầy Dao Động', 'Khắc phục hoàn toàn 5 lỗi sai môn Vật Lý', 'Target', 250, 'physics'),
('chem_alchemist', 'Nhà Giả Kim Thuật', 'Đạt chuỗi 10 phản ứng hóa học đúng liên tiếp', 'Sparkles', 250, 'chemistry'),
('streak_7', 'Bền Bỉ Chiến Binh', 'Duy trì chuỗi học tập 7 ngày liên tiếp', 'Flame', 300, 'streak')
ON CONFLICT (id) DO NOTHING;

-- 4. TẠO NGƯỜI DÙNG DEMO (USER PROFILE)
INSERT INTO user_profiles (id, email, full_name, avatar_url, grade, total_xp, current_streak) VALUES
('a0000000-0000-0000-0000-000000000001', 'demo.student@ai-learning.edu.vn', 'Nguyễn Văn An', 'https://api.dicebear.com/7.x/bottts/svg?seed=AnNguyen', 12, 1450, 5),
('a0000000-0000-0000-0000-000000000002', 'tran.binh@ai-learning.edu.vn', 'Trần Thị Bình', 'https://api.dicebear.com/7.x/bottts/svg?seed=BinhTran', 12, 1820, 12),
('a0000000-0000-0000-0000-000000000003', 'le.cuong@ai-learning.edu.vn', 'Lê Hùng Cường', 'https://api.dicebear.com/7.x/bottts/svg?seed=CuongLe', 12, 980, 2)
ON CONFLICT (email) DO NOTHING;

-- 5. GÁN HUY HIỆU CHO DEMO USER
INSERT INTO user_badges (user_id, badge_id) VALUES
('a0000000-0000-0000-0000-000000000001', 'first_quiz'),
('a0000000-0000-0000-0000-000000000001', 'ocr_master'),
('a0000000-0000-0000-0000-000000000002', 'first_quiz'),
('a0000000-0000-0000-0000-000000000002', 'math_scholar'),
('a0000000-0000-0000-0000-000000000002', 'streak_7')
ON CONFLICT DO NOTHING;

-- 6. GÁN ĐIỂM KỸ NĂNG RADAR CHART MẪU CHO DEMO USER (NGUYỄN VĂN AN)
INSERT INTO user_topic_stats (user_id, subject_id, topic_id, mastery_score, total_attempts, correct_attempts) VALUES
-- Môn Toán (Toán: Mạnh Hình học Oxyz, yếu Tích phân & Giải tích)
('a0000000-0000-0000-0000-000000000001', 'math', 'math_calculus', 45, 12, 5),
('a0000000-0000-0000-0000-000000000001', 'math', 'math_algebra', 70, 10, 7),
('a0000000-0000-0000-0000-000000000001', 'math', 'math_geometry', 85, 14, 12),
('a0000000-0000-0000-0000-000000000001', 'math', 'math_probability', 60, 8, 5),
('a0000000-0000-0000-0000-000000000001', 'math', 'math_vectors', 90, 15, 14),

-- Môn Vật Lý
('a0000000-0000-0000-0000-000000000001', 'physics', 'phy_mechanics', 80, 15, 12),
('a0000000-0000-0000-0000-000000000001', 'physics', 'phy_waves', 65, 10, 6),
('a0000000-0000-0000-0000-000000000001', 'physics', 'phy_ac_current', 40, 16, 6),
('a0000000-0000-0000-0000-000000000001', 'physics', 'phy_optics', 75, 8, 6),
('a0000000-0000-0000-0000-000000000001', 'physics', 'phy_nuclear', 85, 12, 10),

-- Môn Hóa Học
('a0000000-0000-0000-0000-000000000001', 'chemistry', 'chem_organic', 50, 14, 7),
('a0000000-0000-0000-0000-000000000001', 'chemistry', 'chem_inorganic', 85, 18, 15),
('a0000000-0000-0000-0000-000000000001', 'chemistry', 'chem_redox', 60, 10, 6),
('a0000000-0000-0000-0000-000000000001', 'chemistry', 'chem_polymers', 90, 8, 7),
('a0000000-0000-0000-0000-000000000001', 'chemistry', 'chem_thermochemistry', 70, 10, 7)
ON CONFLICT (user_id, topic_id) DO NOTHING;

-- 7. CÂU HỎI MẪU CHO 3 MÔN (HỖ TRỢ LATEX)
-- 7.1. CÂU HỎI TOÁN
INSERT INTO questions (subject_id, topic_id, question_type, difficulty, content, options, correct_option, explanation, hint) VALUES
('math', 'math_calculus', 'multiple_choice', 'medium', 
'Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$.',
'[{"id": "A", "text": "$F(x) = x^2 + e^x + C$"}, {"id": "B", "text": "$F(x) = 2 + e^x + C$"}, {"id": "C", "text": "$F(x) = x^2 - e^x + C$"}, {"id": "D", "text": "$F(x) = \\frac{x^2}{2} + e^x + C$"}]',
'A', 
'Áp dụng công thức nguyên hàm cơ bản:\n$$\\int (2x + e^x)dx = 2 \\cdot \\frac{x^2}{2} + e^x + C = x^2 + e^x + C$$', 
'Nhớ lại nguyên hàm của đa thức $x^n$ và hàm mũ $e^x$.'),

('math', 'math_algebra', 'multiple_choice', 'easy',
'Nghiệm của phương trình $\\log_2(x - 1) = 3$ là:',
'[{"id": "A", "text": "$x = 7$"}, {"id": "B", "text": "$x = 9$"}, {"id": "C", "text": "$x = 8$"}, {"id": "D", "text": "$x = 10$"}]',
'B',
'Điều kiện: $x - 1 > 0 \\Leftrightarrow x > 1$.\n$$\\log_2(x - 1) = 3 \\Leftrightarrow x - 1 = 2^3 = 8 \\Leftrightarrow x = 9$$ (thỏa mãn điều kiện).',
'Dùng định nghĩa logarit: $\\log_a b = c \\Leftrightarrow b = a^c$.');

-- 7.2. CÂU HỎI VẬT LÝ
INSERT INTO questions (subject_id, topic_id, question_type, difficulty, content, options, correct_option, explanation, hint) VALUES
('physics', 'phy_mechanics', 'multiple_choice', 'medium',
'Một con lắc lò xo gồm vật nặng khối lượng $m = 100\\text{ g}$ và lò xo có độ cứng $k = 100\\text{ N/m}$. Tần số góc dao động riêng của con lắc là:',
'[{"id": "A", "text": "$\\omega = 10\\pi\\text{ rad/s}$"}, {"id": "B", "text": "$\\omega = 10\\text{ rad/s}$"}, {"id": "C", "text": "$\\omega = 31.62\\text{ rad/s}$"}, {"id": "D", "text": "$\\omega = 100\\text{ rad/s}$"}]',
'C',
'Đổi $m = 100\\text{ g} = 0.1\\text{ kg}$.\nCông thức tần số góc:\n$$\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0.1}} = \\sqrt{1000} = 10\\sqrt{10} \\approx 31.62\\text{ rad/s}$$',
'Chú ý đổi đơn vị khối lượng sang kg trước khi tính căn $\\sqrt{k/m}$.'),

('physics', 'phy_ac_current', 'multiple_choice', 'medium',
'Đặt điện áp xoay chiều $u = 200\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào hai đầu đoạn mạch chỉ chứa tụ điện $C = \\frac{10^{-4}}{\\pi}\\text{ F}$. Cường độ dòng điện hiệu dụng trong mạch là:',
'[{"id": "A", "text": "$I = 2\\text{ A}$"}, {"id": "B", "text": "$I = 2\\sqrt{2}\\text{ A}$"}, {"id": "C", "text": "$I = 1\\text{ A}$"}, {"id": "D", "text": "$I = 4\\text{ A}$"}]',
'A',
'Dung kháng của tụ điện:\n$$Z_C = \\frac{1}{\\omega C} = \\frac{1}{100\\pi \\cdot \\frac{10^{-4}}{\\pi}} = 100\\,\\Omega$$\nĐiện áp hiệu dụng: $U = 200\\text{ V}$.\nCường độ dòng điện hiệu dụng:\n$$I = \\frac{U}{Z_C} = \\frac{200}{100} = 2\\text{ A}$$',
'Tính dung kháng $Z_C = 1/(\\omega C)$ và chú ý dùng giá trị điện áp hiệu dụng $U$.');

-- 7.3. CÂU HỎI HÓA HỌC
INSERT INTO questions (subject_id, topic_id, question_type, difficulty, content, options, correct_option, explanation, hint) VALUES
('chemistry', 'chem_organic', 'multiple_choice', 'easy',
'Hợp chất hữu cơ nào sau đây thuộc loại este no, đơn chức, mạch hở?',
'[{"id": "A", "text": "$\\text{CH}_3\\text{COOH}$"}, {"id": "B", "text": "$\\text{HCOOCH}_3$"}, {"id": "C", "text": "$\\text{CH}_2=\\text{CH}-\\text{COOCH}_3$"}, {"id": "D", "text": "$\\text{CH}_3\\text{COOC}_6\\text{H}_5$"}]',
'B',
'$\\text{HCOOCH}_3$ (metyl fomat) có công thức phân tử $\\text{C}_2\\text{H}_4\\text{O}_2$, thuộc dạng este no đơn chức mạch hở $\\text{C}_n\\text{H}_{2n}\\text{O}_2\\,(n \\ge 2)$.\n$\\text{CH}_3\\text{COOH}$ là axit cacboxylic, $\\text{CH}_2=\\text{CH}-\\text{COOCH}_3$ là este không no, còn $\\text{CH}_3\\text{COOC}_6\\text{H}_5$ là este thơm.',
'Este có nhóm chức $-\\text{COO}-$, công thức phân tử tổng quát của este no đơn chức mạch hở là $\\text{C}_n\\text{H}_{2n}\\text{O}_2$.'),

('chemistry', 'chem_inorganic', 'multiple_choice', 'medium',
'Cho $5.4\\text{ gam}$ nhôm (Al) tác dụng hoàn toàn với dung dịch $\\text{HNO}_3$ loãng dư, thu được $V$ lít khí $\\text{NO}$ (sản phẩm khử duy nhất ở đktc). Giá trị của $V$ là:',
'[{"id": "A", "text": "$2.24\\text{ lít}$"}, {"id": "B", "text": "$4.48\\text{ lít}$"}, {"id": "C", "text": "$6.72\\text{ lít}$"}, {"id": "D", "text": "$3.36\\text{ lít}$"}]',
'B',
'Số mol Al: $n_{\\text{Al}} = \\frac{5.4}{27} = 0.2\\text{ mol}$.\nBảo toàn electron:\n$$\\text{Al}^0 \\rightarrow \\text{Al}^{+3} + 3e \\quad (0.2 \\times 3 = 0.6\\text{ mol } e)$$\n$$\\text{N}^{+5} + 3e \\rightarrow \\text{N}^{+2}\\,(\\text{NO}) \\implies n_{\\text{NO}} = \\frac{0.6}{3} = 0.2\\text{ mol}$$\nThể tích khí NO thu được (đktc):\n$$V = 0.2 \\times 22.4 = 4.48\\text{ lít}$$',
'Dùng định luật bảo toàn electron: $3 \\times n_{\\text{Al}} = 3 \\times n_{\\text{NO}}$.');
