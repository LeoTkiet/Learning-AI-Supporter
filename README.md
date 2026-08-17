# 🎓 AI Learning Platform — Hệ Thống Học Tập Đa Môn Áp Dụng AI

Nền tảng hỗ trợ học tập và khắc phục lỗ hổng kiến thức 3 môn tự nhiên (Toán, Lý, Hóa) thông qua quy trình đánh giá 3 lớp: Trắc nghiệm chẩn đoán, Tự luận với nhận diện chữ viết tay (OCR) và Gemini AI phân tích sư phạm.

---

## 🏛️ Cấu Trúc Dự Án (Repository Structure)

```
ai-learning-platform/
├── frontend/               # Dành cho Software Engineer
│   ├── public/             # Static assets (images, icons)
│   ├── src/
│   │   ├── components/     # UI chung, Radar chart (Recharts), File Upload
│   │   ├── pages/          # Các trang (Trắc nghiệm, Tự luận, Leaderboard)
│   │   ├── services/       # File gọi API đến Backend
│   │   └── styles/         # Tailwind CSS & Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                # Dành cho Backend & AI Engineer
│   ├── api/                # FastAPI routers (nhận UploadFile)
│   │   └── routes.py
│   ├── core/               # Kết nối CSDL Supabase (PostgreSQL)
│   │   ├── config.py
│   │   └── database.py
│   ├── ai/                 # Module xử lý AI
│   │   ├── ocr/            # Tích hợp Tesseract/Google Vision (OpenCV)
│   │   │   └── ocr_engine.py
│   │   └── llm/            # Gemini API & Prompt Engineering cho Toán/Lý/Hóa
│   │       └── gemini_client.py
│   ├── models/             # Định nghĩa Pydantic models
│   │   └── schemas.py
│   ├── main.py             # Entrypoint FastAPI
│   └── requirements.txt
│
├── internal-tools/         # Dành cho DevOps / Prototype
│   ├── dashboard/          # Dashboard Streamlit
│   │   ├── app.py
│   │   └── requirements.txt
│   └── database/           # Các file .sql khởi tạo bảng (Subjects, User_Stats)
│       ├── schema.sql
│       └── seed.sql
│
├── docs/                   # Tài liệu dự án
│   ├── knowledge-graph/    # Sơ đồ tiêu chí đánh giá các môn (Toán, Lý, Hóa)
│   │   ├── math.md
│   │   ├── physics.md
│   │   └── chemistry.md
│   └── api-docs.md         # Đặc tả các RESTful API endpoints
│
├── .gitignore
└── README.md
```

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh

### 1. Frontend (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Internal Dashboard (Streamlit)
```bash
cd internal-tools/dashboard
pip install -r requirements.txt
streamlit run app.py
```
Truy cập: [http://localhost:8501](http://localhost:8501)
