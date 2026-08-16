from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

SUBJECTS_DATA = [
    {
        "id": "math",
        "name": "Toán Học",
        "description": "Đại số, Giải tích, Hình học không gian, Mũ - Logarit và Tọa độ Oxyz",
        "icon": "Calculator",
        "color": "#3B82F6",
        "total_topics": 5,
        "active_students": 1240
    },
    {
        "id": "physics",
        "name": "Vật Lý",
        "description": "Dao động cơ, Sóng cơ, Điện xoay chiều, Sóng ánh sáng và Hạt nhân nguyên tử",
        "icon": "Zap",
        "color": "#8B5CF6",
        "total_topics": 5,
        "active_students": 980
    },
    {
        "id": "chemistry",
        "name": "Hóa Học",
        "description": "Hóa vô cơ kim loại, Este - Lipit, Amino axit, Polime và Phản ứng oxi hóa khử",
        "icon": "FlaskConical",
        "color": "#10B981",
        "total_topics": 5,
        "active_students": 850
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
async def get_subjects():
    """Lấy danh sách các môn học hỗ trợ trong hệ thống (Toán, Lý, Hóa)"""
    return SUBJECTS_DATA

@router.get("/{subject_id}", response_model=Dict[str, Any])
async def get_subject_by_id(subject_id: str):
    """Lấy thông tin chi tiết của một môn học"""
    for sub in SUBJECTS_DATA:
        if sub["id"] == subject_id.lower():
            return sub
    return SUBJECTS_DATA[0]
