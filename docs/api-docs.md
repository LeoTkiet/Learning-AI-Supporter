# 📡 Tài Liệu Đặc Tả API (FastAPI Backend)

Tài liệu tương tác Swagger UI có sẵn tại: `http://localhost:8000/docs`

---

## 1. Môn Học & Trắc Nghiệm Chẩn Đoán (Lớp 1)

### `GET /api/v1/subjects`
Lấy danh sách các môn học hỗ trợ.
- **Response**:
```json
[
  {"id": "math", "name": "Toán Học", "description": "Đại số, Giải tích, Hình học Oxyz"},
  {"id": "physics", "name": "Vật Lý", "description": "Dao động cơ, Sóng cơ, Điện xoay chiều"},
  {"id": "chemistry", "name": "Hóa Học", "description": "Hóa hữu cơ, Hóa vô cơ, Oxi hóa khử"}
]
```

### `GET /api/v1/quizzes/{subject_id}`
Lấy danh sách câu hỏi trắc nghiệm chẩn đoán theo môn học.

### `POST /api/v1/quizzes/submit`
Nộp bài làm trắc nghiệm để khoanh vùng câu sai và chủ đề yếu.

---

## 2. Nhận Diện Ảnh Bài Làm OCR (Lớp 2)

### `POST /api/v1/ocr/upload`
Upload file ảnh chụp bài làm tự luận (`multipart/form-data`).
- **Request Body**: `file: UploadFile`
- **Response**:
```json
{
  "success": true,
  "extracted_text": "w = sqrt(k/m)\nw = sqrt(100 / 200) = 0.707 rad/s",
  "confidence": 0.95,
  "detected_formulas": ["\\omega = \\sqrt{k/m}"]
}
```

---

## 3. Chẩn Đoán Sư Phạm Gemini AI (Lớp 3)

### `POST /api/v1/ai/analyze`
Gửi đề bài và văn bản bài làm OCR để nhận chẩn đoán chi tiết từ Gemini AI.
- **Request Body**:
```json
{
  "subject": "physics",
  "question_content": "Tính tần số góc của con lắc lò xo có k=100 N/m, m=200g",
  "student_solution_text": "w = sqrt(k/m) = sqrt(100/200) = 0.707"
}
```
- **Response**:
```json
{
  "detected_error_step": 2,
  "error_type": "Lỗi sai đơn vị (chưa đổi gam sang kg)",
  "detailed_feedback": "Học sinh đã áp dụng đúng công thức nhưng nhầm lẫn đơn vị đo ở bước 2.",
  "steps_breakdown": [
    {"step_number": 1, "content": "w = sqrt(k/m)", "is_correct": true, "comment": "Đúng công thức"},
    {"step_number": 2, "content": "w = sqrt(100/200)", "is_correct": false, "comment": "Chưa đổi 200g sang 0.2kg"}
  ],
  "suggested_revision": "Đơn vị đo chuẩn SI trong dao động cơ học",
  "remedial_latex_solution": "$$\\omega = \\sqrt{\\frac{100}{0.2}} = 10\\sqrt{5}\\text{ rad/s}$$"
}
```

---

## 4. Gamification & Leaderboard

### `GET /api/v1/gamification/leaderboard`
Lấy danh sách bảng xếp hạng học sinh theo tổng điểm XP.
