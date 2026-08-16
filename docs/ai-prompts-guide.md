# Hướng Dẫn Prompt Engineering Đa Môn (Gemini AI)

Hệ thống sử dụng các mẫu System Prompt chuyên biệt cho từng môn học để đảm bảo Gemini AI phân tích chính xác các đặc thù logic của Toán, Vật Lý và Hóa Học.

---

## 1. Môn Toán Học (Math)
- **Trọng tâm**: Kiểm tra tính đúng đắn của các phép biến đổi đại số, điều kiện xác định của hàm số ($x > 0, \text{mẫu} \neq 0$), công thức nguyên hàm / vi phân, hình học Oxyz.
- **Yêu cầu đầu ra**: Luôn định dạng công thức đúng bằng LaTeX `$formula$` hoặc `$$block\_formula$$`.

## 2. Môn Vật Lý (Physics)
- **Trọng tâm**:
  1. Kiểm tra đơn vị (gram sang kilogram, cm sang mét, mili-giây sang giây).
  2. Phân biệt giá trị tức thời, giá trị cực đại ($U_0, I_0$) và giá trị hiệu dụng ($U, I$).
  3. Bản chất vật lý của hiện tượng (cộng hưởng, giao thoa sóng, tán sắc).

## 3. Môn Hóa Học (Chemistry)
- **Trọng tâm**:
  1. Kiểm tra cân bằng phương trình hóa học và số oxi hóa.
  2. Áp dụng các định luật bảo toàn (bảo toàn electron, bảo toàn khối lượng, bảo toàn nguyên tố).
  3. Nhận dạng danh pháp IUPAC và công thức cấu tạo este, amin, amino axit.

---

## 4. Cấu Trúc JSON Phản Hồi Bắt Buộc

```json
{
  "detected_error_step": 2,
  "error_type": "Chưa đổi đơn vị gam sang kg",
  "detailed_feedback": "Tại bước 1 bạn đã áp dụng đúng công thức nhưng dùng m=100g thay vì 0.1kg trong hệ SI.",
  "steps_breakdown": [
    {"step_number": 1, "content": "w = sqrt(k/m)", "is_correct": false, "comment": "Sai đơn vị khối lượng"}
  ],
  "suggested_revision": "Đơn vị đo chuẩn trong Dao động cơ học",
  "remedial_latex_solution": "$$\\omega = \\sqrt{\\frac{100}{0.1}} = 31.62\\text{ rad/s}$$",
  "ai_confidence_score": 0.96,
  "knowledge_gap_tags": ["Con lắc lò xo", "Đổi đơn vị SI"]
}
```
