import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

supabase_client = None

try:
    from supabase import create_client, Client
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY and "mock-project" not in settings.SUPABASE_URL:
        supabase_client: Optional[Client] = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        logger.info("Supabase client initialized successfully.")
    else:
        logger.warning("Supabase credentials not configured. Running in Mock/In-Memory mode.")
except Exception as e:
    logger.warning(f"Could not connect to Supabase: {e}. Running with mock data fallback.")

def get_supabase_client():
    return supabase_client
