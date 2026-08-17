import os
from typing import Optional
from backend.core.config import settings

supabase_client = None

def get_supabase():
    """
    Kết nối Supabase (PostgreSQL).
    Khởi tạo client nếu cấu hình SUPABASE_URL và SUPABASE_ANON_KEY hợp lệ.
    """
    global supabase_client
    if supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            try:
                from supabase import create_client
                supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            except Exception as e:
                print(f"[Supabase] Không thể khởi tạo client: {e}")
                supabase_client = None
    return supabase_client
