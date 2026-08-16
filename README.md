# 🎓 AI Learning Supporter — Hệ Thống Hỗ Trợ Học Tập Đa Môn Áp Dụng AI (Toán, Lý, Hóa)

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Prototype-Streamlit-FF4B4B?logo=streamlit)](https://streamlit.io/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/AI%20Core-Google%20Gemini%201.5-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Hệ thống Web toàn diện hỗ trợ học sinh THPT phát hiện và khắc phục triệt để lỗ hổng kiến thức qua **Cơ chế Đánh giá 3 lớp** kết hợp **Nhận diện chữ viết tay (OCR)**, **Phân tích sư phạm chuyên sâu từ Gemini AI**, và **Gamification (Biểu đồ Radar Năng lực & Bảng xếp hạng)** cho 3 môn khoa học tự nhiên: **Toán Học, Vật Lý, Hóa Học**.

---

## 🌟 Tính Năng Cốt Lõi (Core Features)

### 1. Quy Trình Khắc Phục Điểm Yếu 3 Lớp
- **Lớp 1 — Trắc nghiệm Chẩn đoán**: Học sinh làm bài kiểm tra nhanh theo chuyên đề để hệ thống tự động khoanh vùng mảng kiến thức bị hổng.
- **Lớp 2 — Tự luận với OCR Chữ Viết Tay**: Với các câu sai, học sinh giải bài ra giấy, chụp ảnh và tải lên. Pipeline **OpenCV + Tesseract / Vision** tiền xử lý và trích xuất chữ viết tay kèm công thức toán học dạng LaTeX.
- **Lớp 3 — Gemini AI Phân Tích Sâu**: Mô hình ngôn ngữ lớn đọc từng bước giải, chỉ ra chính xác sai ở dòng nào, nhầm lẫn công thức hay đổi sai đơn vị và đưa ra lời giải thích chi tiết cùng công thức KaTeX chuẩn.

### 2. Gamification & Biểu Đồ Radar Đa Môn
- **Biểu đồ Radar Năng lực**: Trực quan hóa điểm mạnh/yếu theo từng chuyên đề (Toán: *Đại số, Giải tích, Hình học Oxyz*; Lý: *Dao động cơ, Sóng, Điện xoay chiều*; Hóa: *Hữu cơ, Vô cơ, Oxi hóa khử*).
- **Điểm kinh nghiệm (XP) & Huy hiệu (Badges)**: Nhận thưởng khi hoàn thành bài sửa lỗi, duy trì chuỗi học tập (Streak) và tranh tài trên Bảng xếp hạng (Leaderboard).

---

## 🏛️ Kiến Trúc Thư Mục Dự Án (Repository Structure)

```
LearningAISuporter/
├── .github/workflows/          # GitHub Actions CI/CD (Lint, Build, Test)
├── docs/                       # Tài liệu thiết kế & kỹ thuật chi tiết
│   ├── architecture.md         # Sơ đồ kiến trúc & luồng dữ liệu 3 lớp
│   ├── database-schema.md      # Mô tả CSDL & biểu đồ ERD
│   ├── ai-prompts-guide.md     # Hướng dẫn Prompt Engineering cho Toán/Lý/Hóa
│   └── ocr-pipeline.md         # Chi tiết pipeline tiền xử lý ảnh OpenCV
├── database/                   # CSDL Supabase PostgreSQL
│   ├── schema.sql              # DDL tạo bảng, quan hệ, indexes, views
│   └── seed.sql                # Dữ liệu khởi tạo mẫu câu hỏi, chủ đề, huy hiệu
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py             # Entrypoint FastAPI (CORS, Routers, Docs)
│   │   ├── core/               # Cấu hình config & database client
│   │   ├── schemas/            # Pydantic Schemas cho API
│   │   ├── services/           # OCR (OpenCV), Gemini AI Prompts, Gamification
│   │   └── api/v1/             # Endpoints (quizzes, ocr, ai, gamification)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Next.js 14 (App Router, Tailwind, TypeScript)
│   ├── src/
│   │   ├── app/                # Các trang: Home, /quiz, /submission, /analysis, /dashboard
│   │   ├── components/         # Navbar, LatexRenderer, RadarChart, FileUploader, BadgeCard
│   │   ├── lib/                # API client & helper utils
│   │   └── types/              # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.example
├── streamlit_dashboard/        # Streamlit Quick Prototype & Internal Hub
│   ├── app.py                  # Giao diện kiểm thử nhanh logic & Plotly charts
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml          # Chạy toàn bộ hệ thống bằng 1 câu lệnh Docker
├── .gitignore
├── .env.example                # Biến môi trường mẫu toàn dự án
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Quick Start)

### 1. Cấu hình Biến môi trường
Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Điền `GEMINI_API_KEY` (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/)) và cấu hình Supabase (nếu có).

---

### 2. Chạy Backend API (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Swagger API Docs: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### 3. Chạy Frontend Web (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Truy cập giao diện ứng dụng tại: [http://localhost:3000](http://localhost:3000)

---

### 4. Chạy Streamlit Prototype Hub
```bash
cd streamlit_dashboard
pip install -r requirements.txt
streamlit run app.py
```
Truy cập Hub kiểm thử tại: [http://localhost:8501](http://localhost:8501)

---

### 5. Hoặc Chạy Toàn Bộ Bằng Docker Compose
```bash
docker compose up --build
```

---

## 👥 Phân Công Nhiệm Vụ Trong Nhóm

| Vai Trò | Trách Nhiệm Chính |
| :--- | :--- |
| **Software Engineer** | Phát triển UI/UX trên Next.js (App Router, Tailwind, Recharts), tích hợp bộ gõ/hiển thị KaTeX cho công thức toán, xây dựng giao diện upload ảnh và trang Gamification Dashboard. |
| **AI Engineer** | Xây dựng pipeline tiền xử lý ảnh với OpenCV (`cv2.bilateralFilter`, `cv2.adaptiveThreshold`), tích hợp OCR và tinh chỉnh Prompt Engineering cho 3 môn học Toán - Lý - Hóa trên Gemini API. |
| **Backend / DevOps** | Thiết kế CSDL Supabase PostgreSQL, tối ưu hóa view Leaderboard, hoàn thiện RESTful API trên FastAPI, quản lý luồng upload file an toàn và vận hành dashboard phân tích Streamlit. |

---

## 📦 Hướng Dẫn Push Lên GitHub Lần Đầu

```bash
# 1. Kiểm tra trạng thái Git
git status

# 2. Thêm remote repository GitHub của bạn
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 3. Đổi tên nhánh chính thành main (nếu chưa có)
git branch -M main

# 4. Đẩy code lên GitHub
git push -u origin main
```

---

## 📄 License
Dự án được phân phối dưới giấy phép mã nguồn mở MIT.
