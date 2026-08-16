from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.ocr_service import ocr_service
from app.schemas.ocr import OCRProcessResponse

router = APIRouter()

@router.post("/process-image", response_model=OCRProcessResponse)
async def process_handwritten_image(
    file: UploadFile = File(...),
    subject_id: Optional[str] = Form("math")
):
    """
    Lớp 2: Tiếp nhận ảnh chụp bài làm tự luận, tiền xử lý qua OpenCV và trích xuất chữ viết tay/công thức
    """
    # Kiểm tra định dạng file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là định dạng hình ảnh (PNG, JPG, JPEG, WEBP).")

    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Dung lượng ảnh không được vượt quá 10MB.")

        result = ocr_service.extract_text(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi trong quá trình xử lý ảnh: {str(e)}")
