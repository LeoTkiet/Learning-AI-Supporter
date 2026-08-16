from typing import Optional, List
from pydantic import BaseModel

class OCRProcessResponse(BaseModel):
    raw_text: str
    latex_extracted: Optional[str] = None
    confidence_score: float
    detected_language: str = "vie+eng"
    is_readable: bool = True
    warning_message: Optional[str] = None
    bounding_boxes: Optional[List[dict]] = None
