# 📜 SpecKit Constitution — AI Learning Platform (Learning-AI-Supporter)

> **Mục tiêu**: Bản hiến chương này định nghĩa các nguyên tắc cốt lõi, tiêu chuẩn kiến trúc, quy chuẩn mã nguồn và các ràng buộc bất biến cho toàn bộ dự án **Learning-AI-Supporter** (Hệ thống hỗ trợ học tập và chẩn đoán sư phạm áp dụng AI).

---

## 1. 🏛️ Nguyên Tắc Cốt Lõi (Core Principles)

1. **Pedagogy-First AI (Sư phạm là trung tâm)**:
   - AI không đơn thuần chỉ giải bài hoặc đưa ra đáp án cuối cùng. AI đóng vai trò như một **Gia sư sư phạm thông minh**, phân tích chi tiết từng bước giải (*step-by-step*), chỉ ra chính xác bước sai, phân loại loại lỗi sai (sai bản chất, sai công thức, sai đơn vị, nhầm số học) và đưa ra bài học khắc phục tương ứng.
   - Luôn giải thích bằng ngôn ngữ sư phạm tích cực, khuyến khích học sinh tư duy.

2. **Zero Disk I/O for Media & OCR (Tuyệt đối không ghi đĩa với ảnh nhận diện)**:
   - Toàn bộ luồng nhận diện ảnh và trích xuất công thức toán học (`/extract-math`, `/ocr/upload`) phải xử lý **100% trên bộ nhớ RAM** thông qua byte buffers (`io.BytesIO`), OpenCV (`cv2.imdecode`) và NumPy.
   - Không được lưu file tạm (`tempfile`, local file write) lên đĩa cục bộ nhằm tối ưu tốc độ phản hồi (< 1000ms), ngăn ngừa rò rỉ dung lượng ổ cứng và bảo vệ quyền riêng tư hình ảnh bài làm của học sinh.

3. **Multi-layer Diagnostic Workflow (Đánh giá 3 lớp mạch lạc)**:
   - **Lớp 1 (Trắc nghiệm chẩn đoán)**: Phân loại nhanh phạm vi kiến thức, khoanh vùng chủ đề yếu qua câu hỏi trắc nghiệm khách quan.
   - **Lớp 2 (Tự luận & Mathematical OCR)**: Học sinh trình bày tự luận bằng chữ viết tay, hệ thống tiền xử lý ảnh (Grayscale -> Gaussian Blur -> Adaptive Thresholding) và trích xuất LaTeX.
   - **Lớp 3 (Phân tích sư phạm chuyên sâu)**: Gemini AI đối chiếu đề bài, chuẩn hóa công thức toán và xuất phân tích sư phạm có cấu trúc rõ ràng.

4. **Graceful Degradation & Resilient Architecture (Khả năng chịu lỗi và thích ứng)**:
   - Tất cả các dịch vụ ngoại vi (Supabase, Gemini API, OCR Engine) phải có cơ chế **Fallback an toàn**:
     - Khi thiếu `SUPABASE_URL` / `SUPABASE_KEY`: Hệ thống tự động chuyển sang chế độ Mock/Development mode mà không làm crash server.
     - Khi gặp sự cố Gemini API rate-limit / network: Fallback sang Mock service hoặc multi-key round-robin/failover.

---

## 2. 🛠️ Tiêu Chuẩn Công Nghệ & Ràng Buộc Kỹ Thuật (Tech Stack & Constraints)

| Lĩnh Vực | Công Nghệ / Thư Viện | Quy Chuẩn & Ràng Buộc |
| :--- | :--- | :--- |
| **Backend API** | **FastAPI** (Python 3.10+) | Clean Architecture, Async-first endpoints, Pydantic v2 validation models, Type Hinting đầy đủ, Swagger UI tự động. |
| **Frontend Web** | **Next.js 14** (Pages/App Router) + **TypeScript** | Responsive UI, Tailwind CSS, Recharts (Radar topic mastery chart), KaTeX/MathJax render công thức toán học. |
| **Database & Auth** | **Supabase (PostgreSQL)** | UUID Primary Keys, Row Level Security (RLS), Supabase Auth (JWT Bearer Token), Auto-migration SQL scripts. |
| **Vision & OCR** | **OpenCV** + **Gemini Vision / Tesseract** | Xử lý ảnh in-memory (cv2 numpy array), binarization, zero disk storage, trích xuất chuẩn định dạng LaTeX. |
| **AI LLM** | **Google Gemini 1.5 Pro / Flash** | Prompt Engineering có cấu trúc JSON output nghiêm ngặt, zero-hallucination, hỗ trợ multi-key rotation. |
| **Internal Tools** | **Streamlit** (Python) | Bảng điều khiển giám sát trực quan, telemetry, quản trị dữ liệu câu hỏi và thống kê người dùng. |

---

## 3. 📐 Quy Chuẩn Kiến Trúc & Cấu Trúc Mã Nguồn (Code Quality & Architecture)

### 3.1 Backend Architecture
```
backend/
├── ai/                # Core AI Logic: OCR Image Processing & Gemini Pedagogical Client
├── api/               # FastAPI Routers & Endpoints (RESTful API v1)
├── core/              # Config (pydantic-settings), Database connection (Supabase)
├── models/            # Pydantic Schemas (Request/Response DTOs)
└── main.py            # FastAPI Entrypoint, Middleware (CORS, Request Tracing)
```

- **Clean Separation of Concerns**: Router chỉ tiếp nhận request và trả response. Nghiệp vụ AI nằm trong `ai/`, xử lý CSDL nằm trong `core/`, định nghĩa kiểu dữ liệu trong `models/`.
- **Strict Data Contracts**: Mọi endpoint bắt buộc có `response_model` và định nghĩa Schema Pydantic rõ ràng.

### 3.2 Frontend Architecture
```
frontend/src/
├── components/        # Reusable UI components (Navbar, RadarChart, MathEditor, Dropzone)
├── pages/             # Route pages (Home, Quiz, Submission, Leaderboard, Login)
├── services/          # HTTP Client services (Axios / Fetch API wrappers)
└── styles/            # Tailwind configuration & global CSS
```

- **TypeScript First**: Tuyệt đối không dùng `any` bừa bãi. Định nghĩa đầy đủ `interface` và `type` cho mọi dữ liệu phản hồi từ backend.
- **Modern UX/UI**: Trải nghiệm mượt mà, phản hồi loading state rõ ràng, hiển thị lỗi thân thiện, tối ưu hiển thị công thức toán học trên mobile và desktop.

---

## 4. 🔒 Bảo Mật & An Toàn Dữ Liệu (Security & Privacy)

1. **Quản lý Secrets & Biến Môi Trường**:
   - Tuyệt đối không hardcode API Keys, Database Passwords, JWT Secrets trong mã nguồn.
   - Sử dụng `.env` / `.env.local` và quản lý qua `core/config.py`.
2. **Xác thực & Phân quyền**:
   - Sử dụng chuẩn `Bearer <JWT_TOKEN>` cho các private endpoints.
   - Kiểm tra tính hợp lệ của token qua Supabase Auth Middleware.
3. **Bảo mật Dữ liệu Học sinh**:
   - Không lưu trữ hình ảnh bài làm nhạy cảm của người dùng khi chưa có sự đồng thuận.
   - Dữ liệu điểm số và thống kê cá nhân được bảo vệ theo cơ chế phân quyền người dùng.

---

## 5. 🧪 Tiêu Chuẩn Kiểm Thử & CI/CD (Testing & Quality Assurance)

1. **Automated Unit Testing**:
   - Mọi module xử lý ảnh và trích xuất toán học phải có unit test bao phủ (ví dụ: `tests/test_extract_math.py`).
   - Kiểm tra đầy đủ các kịch bản: Ảnh chuẩn, Ảnh mờ/lỗi, Format không hợp lệ, Payload rỗng, API Key sai.
2. **Code Linting & Formatting**:
   - Backend tuân thủ PEP8, Ruff/Black formatting, Type checking với mypy.
   - Frontend tuân thủ ESLint và Prettier standards.