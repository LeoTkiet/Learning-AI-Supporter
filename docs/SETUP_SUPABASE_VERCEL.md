# 🚀 HƯỚNG DẪN CHI TIẾT SETUP SUPABASE & DEPLOY VERCEL

Tài liệu này hướng dẫn bạn từng bước từ A đến Z cách:
1. **Thiết lập Database & Xác thực Supabase Auth** cho Backend FastAPI.
2. **Cấu hình Backend** để tự động kết nối Supabase.
3. **Deploy Frontend Next.js lên Vercel**.
4. **Deploy Backend FastAPI lên Render / Railway / Fly.io** và kết nối toàn bộ hệ thống.

---

## PHẦN 1: THIẾT LẬP SUPABASE (DATABASE & AUTH)

### Bước 1.1: Tạo Project Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập (hoặc đăng ký bằng tài khoản GitHub).
2. Nhấn **"New Project"**.
3. Điền thông tin:
   - **Name**: `learning-ai-supporter` (hoặc tên tùy thích).
   - **Database Password**: Đặt mật khẩu mạnh và lưu lại.
   - **Region**: Chọn **Singapore (Southeast Asia - ap-southeast-1)** để có độ trễ nhanh nhất về Việt Nam.
   - **Pricing Plan**: Chọn **Free Plan**.
4. Nhấn **"Create new project"** và đợi khoảng 1-2 phút để Supabase khởi tạo.

---

### Bước 1.2: Lấy API Keys của Supabase
1. Trên giao diện Supabase Dashboard, vào menu bên trái chọn **Project Settings** (biểu tượng bánh răng ⚙️) $\to$ **API**.
2. Tìm và sao chép 2 giá trị sau:
   - **Project URL**: Ví dụ `https://xyzcompany.supabase.co`
   - **Project API Keys**: Copy key **`anon` / `public`** (dạng `eyJhbGciOi...`).

---

### Bước 1.3: Cấu hình Supabase Authentication
1. Tại thanh menu bên trái, vào **Authentication** $\to$ **Providers**.
2. **Email Provider**:
   - Đảm bảo **Enable Email provider** đang BẬT (`ON`).
   - *(Khuyên dùng trong giai đoạn Dev)*: Tắt **"Confirm email"** nếu muốn học sinh đăng ký xong có thể đăng nhập ngay mà không cần xác thực link qua hòm thư.
3. *(Tùy chọn)* **Google OAuth Provider**:
   - Nếu muốn hỗ trợ nút "Đăng nhập với Google": Bật **Google** provider $\to$ Nhập **Client ID** & **Client Secret** từ [Google Cloud Console](https://console.cloud.google.com).

---

### Bước 1.4: Tạo Bảng Thông Tin Học Sinh (`profiles`) & Trigger Tự Động
Vào **SQL Editor** trong Supabase $\to$ Nhấn **"New query"** $\to$ Dán đoạn mã SQL sau và nhấn **Run**:

```sql
-- 1. Tạo bảng profiles lưu thông tin mở rộng của học sinh (XP, Streak, Avatar)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  xp integer default 0,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bật Row Level Security (RLS) để bảo vệ dữ liệu
alter table public.profiles enable row level security;

-- Cho phép người dùng xem profile của chính mình và của người khác (để làm bảng xếp hạng)
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Cho phép người dùng tự cập nhật profile của mình
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 3. Tạo Trigger tự động copy thông tin sang profiles khi có user đăng ký mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, xp, streak)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.email),
    coalesce((new.raw_user_meta_data->>'xp')::integer, 0),
    coalesce((new.raw_user_meta_data->>'streak')::integer, 0)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## PHẦN 2: CẤU HÌNH BIẾN MÔI TRƯỜNG CHO BACKEND

Tạo hoặc chỉnh sửa file `.env` tại thư mục `backend/.env` (hoặc root `.env`):

```env
# 1. Google Gemini AI API Keys
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
GEMINI_MODEL=gemini-2.0-flash

# 2. Supabase Configuration (Dán thông tin lấy ở Bước 1.2 vào đây)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 3. Tesseract OCR (Tùy chọn nếu dùng local)
TESSERACT_CMD_PATH=tesseract
```

> 💡 **Lưu ý**: Nếu bạn chưa điền Supabase keys, Backend đã được tích hợp sẵn **chế độ Development Fallback** thông minh, cho phép bạn test form login ngay trên frontend mà không bị crash lỗi.

---

## PHẦN 3: DEPLOY FRONTEND NEXT.JS LÊN VERCEL

### Bước 3.1: Đưa Code lên GitHub
```bash
git add .
git commit -m "feat(auth): complete login backend API and frontend connection"
git push origin module/login
```

### Bước 3.2: Import Project vào Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Nhấn **"Add New..."** $\to$ Chọn **"Project"**.
3. Tìm repository `Learning-AI-Supporter` và nhấn **Import**.
4. Cấu hình Project trên Vercel:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Nhấn `Edit` $\to$ Chọn thư mục `frontend` $\to$ Nhấn `Continue`.
   - **Build and Output Settings**: Giữ mặc định (`npm run build`).
5. **Environment Variables**: Thêm biến môi trường:
   - `NEXT_PUBLIC_API_URL`: Điền URL backend của bạn (Ví dụ: `https://your-backend-app.onrender.com/api/v1` hoặc `http://localhost:8000/api/v1` khi chạy dev).
6. Nhấn **"Deploy"** và đợi Vercel build hoàn tất (khoảng 1 phút).

---

## PHẦN 4: DEPLOY BACKEND FASTAPI (RENDER / RAILWAY)

Vì Vercel tối ưu nhất cho Frontend và Serverless Node.js, nên Backend FastAPI (kèm OpenCV và Python dependencies) nên được host trên **Render.com** (miễn phí) hoặc **Railway.app**:

### Cách Deploy lên Render.com (Miễn phí):
1. Vào [https://render.com](https://render.com) $\to$ Đăng nhập bằng GitHub.
2. Nhấn **"New +"** $\to$ Chọn **"Web Service"**.
3. Chọn repo `Learning-AI-Supporter`.
4. Cấu hình thông số:
   - **Name**: `learning-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**: Thêm các biến môi trường:
   - `GEMINI_API_KEY`: Key Google AI Studio của bạn
   - `SUPABASE_URL`: URL Supabase
   - `SUPABASE_ANON_KEY`: Anon Key Supabase
6. Nhấn **"Create Web Service"**.
7. Sau khi deploy xong, Render sẽ cung cấp một URL dạng `https://learning-ai-backend.onrender.com`.
8. Bạn chỉ cần cập nhật URL này vào biến `NEXT_PUBLIC_API_URL` trên Vercel (dạng `https://learning-ai-backend.onrender.com/api/v1`).

---

## PHẦN 5: KIỂM THỬ HỆ THỐNG (TESTING CHECKLIST)

1. **Khởi động Backend cục bộ**:
   ```powershell
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Khởi động Frontend cục bộ**:
   ```powershell
   cd frontend
   npm run dev
   ```
3. Truy cập [http://localhost:3000/login](http://localhost:3000/login):
   - Nhập Email và Mật khẩu.
   - Nhấn **ĐĂNG NHẬP**.
   - Kiểm tra toast thông báo đăng nhập thành công và token được lưu vào `localStorage`.
   - Xem tài liệu Swagger API tại [http://localhost:8000/docs](http://localhost:8000/docs).
