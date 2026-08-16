from typing import List, Optional
from pydantic import BaseModel

class SubjectSkillScore(BaseModel):
    topic_id: str
    topic_name: str
    mastery_score: int  # 0 to 100
    total_attempts: int
    correct_attempts: int

class RadarChartData(BaseModel):
    subject_id: str
    subject_name: str
    overall_mastery: int
    skills: List[SubjectSkillScore]

class BadgeItem(BaseModel):
    id: str
    name: str
    description: str
    icon_name: str
    xp_reward: int
    category: str
    is_unlocked: bool
    unlocked_at: Optional[str] = None

class LeaderboardUser(BaseModel):
    user_id: str
    rank_position: int
    full_name: str
    avatar_url: str
    grade: int
    total_xp: int
    current_streak: int
    badges_count: int

class UserDashboardSummary(BaseModel):
    user_id: str
    full_name: str
    avatar_url: str
    grade: int
    total_xp: int
    current_streak: int
    radar_data: List[RadarChartData]
    badges: List[BadgeItem]
    recent_activity: List[dict] = []
