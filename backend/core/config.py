import json
import os
from pathlib import Path
from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Automatically discover and load .env from project root or backend directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=ROOT_DIR / ".env", override=False)
load_dotenv(dotenv_path=ROOT_DIR / "backend" / ".env", override=False)
load_dotenv(override=False)


def parse_api_keys(raw_value: Optional[str] = None) -> List[str]:
    """
    Parse a list of API keys from comma-separated string, JSON array, or single string.
    Works seamlessly with .env and Vercel Environment Variables.
    """
    if raw_value is None:
        raw_value = os.getenv("GEMINI_API_KEYS") or os.getenv("GEMINI_API_KEY")

    if not raw_value:
        return []

    raw_value = raw_value.strip()
    if not raw_value:
        return []

    # Try parsing as JSON array: '["key1", "key2"]'
    if raw_value.startswith("[") and raw_value.endswith("]"):
        try:
            parsed = json.loads(raw_value)
            if isinstance(parsed, list):
                return [str(k).strip().strip('"').strip("'") for k in parsed if str(k).strip()]
        except Exception:
            pass

    # Parse comma-separated or newline/semicolon-separated string: "key1, key2, key3"
    keys = [
        k.strip().strip('"').strip("'")
        for k in raw_value.replace("\n", ",").replace(";", ",").split(",")
        if k.strip().strip('"').strip("'")
    ]
    return keys


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Learning Platform"
    API_V1_STR: str = "/api/v1"
    
    # Google Gemini AI (Supports single key or multiple keys for rotation)
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_API_KEYS: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Supabase (PostgreSQL)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    
    # OCR
    TESSERACT_CMD_PATH: Optional[str] = "tesseract"

    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="allow"
    )

    def get_gemini_keys_list(self) -> List[str]:
        """Return parsed list of all available Gemini API keys."""
        return parse_api_keys(self.GEMINI_API_KEYS or self.GEMINI_API_KEY)


settings = Settings()
