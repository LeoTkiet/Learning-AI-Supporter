import logging
from typing import List
from app.schemas.gamification import (
    RadarChartData, SubjectSkillScore, BadgeItem, LeaderboardUser, UserDashboardSummary
)

logger = logging.getLogger(__name__)

# Dữ liệu mô phỏng mặc định
MOCK_TOPICS = {
    "math": [
        ("math_calculus", "Giải tích & Đạo hàm", 45, 12, 5),
        ("math_algebra", "Đại số & Lũy thừa", 70, 10, 7),
        ("math_geometry", "Hình học Không gian", 85, 14, 12),
        ("math_probability", "Xác suất & Thống kê", 60, 8, 5),
        ("math_vectors", "Tọa độ Oxyz", 90, 15, 14)
    ],
    "physics": [
        ("phy_mechanics", "Dao động cơ học", 80, 15, 12),
        ("phy_waves", "Sóng cơ & Sóng âm", 65, 10, 6),
        ("phy_ac_current", "Điện xoay chiều", 40, 16, 6),
        ("phy_optics", "Quang hình & Ánh sáng", 75, 8, 6),
        ("phy_nuclear", "Vật lý Hạt nhân", 85, 12, 10)
    ],
    "chemistry": [
        ("chem_organic", "Hóa học Hữu cơ", 50, 14, 7),
        ("chem_inorganic", "Hóa học Vô cơ", 85, 18, 15),
        ("chem_redox", "Điện phân & Oxi hóa khử", 60, 10, 6),
        ("chem_polymers", "Polime & Vật liệu", 90, 8, 7),
        ("chem_thermochemistry", "Nhiệt hóa học", 70, 10, 7)
    ]
}

SUBJECT_NAMES = {
    "math": "Toán Học",
    "physics": "Vật Lý",
    "chemistry": "Hóa Học"
}

class GamificationService:
    def get_radar_data(self, subject_id: str) -> RadarChartData:
        subject = subject_id.lower()
        items = MOCK_TOPICS.get(subject, MOCK_TOPICS["math"])
        skills = [
            SubjectSkillScore(
                topic_id=t[0],
                topic_name=t[1],
                mastery_score=t[2],
                total_attempts=t[3],
                correct_attempts=t[4]
            ) for t in items
        ]
        overall = sum(s.mastery_score for s in skills) // len(skills)
        return RadarChartData(
            subject_id=subject,
            subject_name=SUBJECT_NAMES.get(subject, "Môn học"),
            overall_mastery=overall,
            skills=skills
        )

    def get_all_radar_data(self) -> List[RadarChartData]:
        return [self.get_radar_data("math"), self.get_radar_data("physics"), self.get_radar_data("chemistry")]

    def get_badges(self) -> List[BadgeItem]:
        return [
            BadgeItem(id="first_quiz", name="Khởi Đầu Nan", description="Hoàn thành bài kiểm tra chẩn đoán đầu tiên", icon_name="Trophy", xp_reward=100, category="general", is_unlocked=True, unlocked_at="2026-08-10T10:00:00Z"),
            BadgeItem(id="ocr_master", name="Chữ Đẹp Điểm Cao", description="Tải lên bài giải tự luận OCR đầu tiên thành công", icon_name="FileText", xp_reward=150, category="general", is_unlocked=True, unlocked_at="2026-08-12T14:30:00Z"),
            BadgeItem(id="math_scholar", name="Thần Đồng Đại Số", description="Đạt 85+ điểm năng lực chuyên đề Giải tích", icon_name="Award", xp_reward=250, category="math", is_unlocked=False),
            BadgeItem(id="physics_pro", name="Bậc Thầy Dao Động", description="Khắc phục hoàn toàn 5 lỗi sai môn Vật Lý", icon_name="Target", xp_reward=250, category="physics", is_unlocked=False),
            BadgeItem(id="chem_alchemist", name="Nhà Giả Kim Thuật", description="Đạt chuỗi 10 phản ứng hóa học đúng liên tiếp", icon_name="Sparkles", xp_reward=250, category="chemistry", is_unlocked=False),
            BadgeItem(id="streak_7", name="Bền Bỉ Chiến Binh", description="Duy trì chuỗi học tập 7 ngày liên tiếp", icon_name="Flame", xp_reward=300, category="streak", is_unlocked=True, unlocked_at="2026-08-16T20:00:00Z")
        ]

    def get_leaderboard(self) -> List[LeaderboardUser]:
        return [
            LeaderboardUser(user_id="a0000000-0000-0000-0000-000000000002", rank_position=1, full_name="Trần Thị Bình", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=BinhTran", grade=12, total_xp=1820, current_streak=12, badges_count=5),
            LeaderboardUser(user_id="a0000000-0000-0000-0000-000000000001", rank_position=2, full_name="Nguyễn Văn An (Bạn)", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=AnNguyen", grade=12, total_xp=1450, current_streak=5, badges_count=3),
            LeaderboardUser(user_id="a0000000-0000-0000-0000-000000000003", rank_position=3, full_name="Lê Hùng Cường", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=CuongLe", grade=12, total_xp=980, current_streak=2, badges_count=2),
            LeaderboardUser(user_id="a0000000-0000-0000-0000-000000000004", rank_position=4, full_name="Phạm Hoàng Nam", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=NamPham", grade=12, total_xp=850, current_streak=4, badges_count=2),
            LeaderboardUser(user_id="a0000000-0000-0000-0000-000000000005", rank_position=5, full_name="Đỗ Mai Linh", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=LinhDo", grade=11, total_xp=720, current_streak=1, badges_count=1)
        ]

    def get_user_dashboard(self) -> UserDashboardSummary:
        return UserDashboardSummary(
            user_id="a0000000-0000-0000-0000-000000000001",
            full_name="Nguyễn Văn An",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=AnNguyen",
            grade=12,
            total_xp=1450,
            current_streak=5,
            radar_data=self.get_all_radar_data(),
            badges=self.get_badges(),
            recent_activity=[
                {"type": "quiz", "subject": "Toán Học", "score": "80%", "time": "Hôm qua lúc 19:30"},
                {"type": "ocr_ai", "subject": "Vật Lý", "feedback": "Đã phát hiện lỗi đổi đơn vị gam", "time": "2 ngày trước"},
                {"type": "badge", "badge_name": "Bền Bỉ Chiến Binh", "xp": "+300 XP", "time": "3 ngày trước"}
            ]
        )

gamification_service = GamificationService()
