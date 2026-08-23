import os
from typing import Optional
from core.config import settings

supabase_client = None

def get_supabase():
    """
    Kết nối Supabase (PostgreSQL).
    Khởi tạo client nếu cấu hình SUPABASE_URL (hoặc NEXT_PUBLIC_SUPABASE_URL) và key hợp lệ.
    """
    global supabase_client
    if supabase_client is None:
        url = settings.supabase_url
        key = settings.supabase_anon_key
        if url and key:
            try:
                from supabase import create_client
                supabase_client = create_client(url, key)
            except Exception as e:
                print(f"[Supabase] Không thể khởi tạo client: {e}")
                supabase_client = None
    return supabase_client
