# Pipeline Tiền Xử Lý Ảnh & OCR Chữ Viết Tay (Lớp 2)

Pipeline tiếp nhận ảnh chụp bài làm tự luận từ người dùng, thực hiện tiền xử lý đồ họa qua OpenCV trước khi đưa vào mô hình OCR (Tesseract / Google Cloud Vision).

---

## 1. Các Bước Tiền Xử Lý (Image Preprocessing với OpenCV)

```python
# 1. Chuyển sang thang độ xám (Grayscale)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 2. Khử nhiễu bề mặt giấy bằng Bilateral Filter (giữ lại biên chữ nét)
denoised = cv2.bilateralFilter(gray, 9, 75, 75)

# 3. Nhị phân hóa thích nghi (Adaptive Thresholding) để tách mực viết tay khỏi nền giấy
binary = cv2.adaptiveThreshold(
    denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
)
```

---

## 2. Cấu Hình Tesseract OCR

- **Ngôn ngữ**: `lang='vie+eng'`
- **Page Segmentation Mode (PSM)**:
  - `psm 6`: Giả định khối văn bản đơn đồng nhất.
  - `psm 3`: Tự động phân vùng trang khi bài làm có nhiều đoạn phân cách.
- **Ký tự toán học**: Tự động ánh xạ các từ khóa như `int` $\rightarrow$ `\int`, `sqrt` $\rightarrow$ `\sqrt`, `pi` $\rightarrow$ `\pi`.
