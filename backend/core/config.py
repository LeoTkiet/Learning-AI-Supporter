from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Learning Platform"
    API_V1_STR: str = "/api/v1"
    
    # Google Gemini AI
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Supabase (PostgreSQL)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    
    # OCR
    TESSERACT_CMD_PATH: Optional[str] = "tesseract"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
