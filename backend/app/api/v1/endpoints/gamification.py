from fastapi import APIRouter
from typing import List
from app.services.gamification_service import gamification_service
from app.schemas.gamification import (
    RadarChartData, BadgeItem, LeaderboardUser, UserDashboardSummary
)

router = APIRouter()

@router.get("/dashboard", response_model=UserDashboardSummary)
async def get_dashboard_summary():
    """Lấy tổng quan tiến độ học tập, biểu đồ Radar đa môn và huy hiệu của người dùng"""
    return gamification_service.get_user_dashboard()

@router.get("/radar/{subject_id}", response_model=RadarChartData)
async def get_subject_radar(subject_id: str):
    """Lấy dữ liệu kỹ năng để vẽ biểu đồ Radar cho từng môn (Toán / Lý / Hóa)"""
    return gamification_service.get_radar_data(subject_id)

@router.get("/badges", response_model=List[BadgeItem])
async def get_badges_list():
    """Lấy danh sách các huy hiệu và trạng thái mở khóa"""
    return gamification_service.get_badges()

@router.get("/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard():
    """Lấy bảng xếp hạng học tập (Leaderboard) theo điểm kinh nghiệm XP"""
    return gamification_service.get_leaderboard()
