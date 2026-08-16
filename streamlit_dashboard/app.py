import os
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="AI Learning Supporter - Prototype Dashboard",
    page_icon="🎓",
    layout="wide"
)

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")

st.title("🎓 AI Learning Supporter - Prototype & Analytics Hub")
st.markdown("Công cụ kiểm thử logic nhanh nội bộ kết nối trực tiếp với Backend API & Supabase")

# Sidebar navigation
st.sidebar.header("🔍 Điều Hướng Nhanh")
menu = st.sidebar.radio(
    "Chọn Module",
    ["1. Biểu Đồ Radar Năng Lực", "2. Kiểm Thử OCR & Gemini AI", "3. Bảng Xếp Hạng & Gamification", "4. Quản Lý Kho Câu Hỏi"]
)

# -----------------
# 1. RADAR CHART PROTOTYPE
# -----------------
if menu == "1. Biểu Đồ Radar Năng Lực":
    st.subheader("📊 Trực Quan Hóa Điểm Năng Lực (Radar Chart)")
    
    subject = st.selectbox("Chọn Môn Học", ["Toán Học (math)", "Vật Lý (physics)", "Hóa Học (chemistry)"])
    sub_key = "math" if "Toán" in subject else ("physics" if "Vật Lý" in subject else "chemistry")

    # Fetch from API or fallback
    try:
        res = requests.get(f"{API_BASE_URL}/gamification/radar/{sub_key}", timeout=2)
        if res.status_code == 200:
            radar_data = res.json()
            skills = radar_data["skills"]
        else:
            raise Exception("API error")
    except Exception:
        if sub_key == "math":
            skills = [
                {"topic_name": "Giải tích & Đạo hàm", "mastery_score": 45},
                {"topic_name": "Đại số & Lũy thừa", "mastery_score": 70},
                {"topic_name": "Hình học Không gian", "mastery_score": 85},
                {"topic_name": "Xác suất & Thống kê", "mastery_score": 60},
                {"topic_name": "Tọa độ Oxyz", "mastery_score": 90},
            ]
        elif sub_key == "physics":
            skills = [
                {"topic_name": "Dao động cơ học", "mastery_score": 80},
                {"topic_name": "Sóng cơ & Sóng âm", "mastery_score": 65},
                {"topic_name": "Điện xoay chiều", "mastery_score": 40},
                {"topic_name": "Quang hình & Ánh sáng", "mastery_score": 75},
                {"topic_name": "Vật lý Hạt nhân", "mastery_score": 85},
            ]
        else:
            skills = [
                {"topic_name": "Hóa học Hữu cơ", "mastery_score": 50},
                {"topic_name": "Hóa học Vô cơ", "mastery_score": 85},
                {"topic_name": "Điện phân & Redox", "mastery_score": 60},
                {"topic_name": "Polime & Vật liệu", "mastery_score": 90},
                {"topic_name": "Nhiệt hóa học", "mastery_score": 70},
            ]

    df_radar = pd.DataFrame(skills)

    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=df_radar["mastery_score"].tolist() + [df_radar["mastery_score"].iloc[0]],
        theta=df_radar["topic_name"].tolist() + [df_radar["topic_name"].iloc[0]],
        fill='toself',
        name=subject,
        line_color="#3B82F6" if sub_key == "math" else ("#8B5CF6" if sub_key == "physics" else "#10B981")
    ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100])
        ),
        showlegend=True,
        height=500
    )

    col1, col2 = st.columns([2, 1])
    with col1:
        st.plotly_chart(fig, use_container_width=True)
    with col2:
        st.markdown("### Chi Tiết Năng Lực")
        st.dataframe(df_radar, use_container_width=True)

# -----------------
# 2. KIỂM THỬ OCR & GEMINI AI
# -----------------
elif menu == "2. Kiểm Thử OCR & Gemini AI":
    st.subheader("🧪 Kiểm Thử Pipeline OCR & Gemini AI Prompt")
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("#### 1. Input Đề Bài & Môn Học")
        sub_test = st.selectbox("Môn", ["math", "physics", "chemistry"])
        q_content = st.text_area("Nội dung câu hỏi", value="Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$.")
        
        uploaded_file = st.file_uploader("Upload ảnh chữ viết tay bài làm (Tùy chọn)", type=["png", "jpg", "jpeg"])
        manual_ocr_text = st.text_area(
            "Hoặc nhập trực tiếp kết quả OCR mô phỏng",
            value="Bước 1: f(x) = 2x + e^x\nBước 2: F(x) = 2*(x^2/2) + x*e^(x-1) + C\nBước 3: F(x) = x^2 + x*e^(x-1) + C"
        )
        
        btn_analyze = st.button("🚀 Chạy Phân Tích Gemini AI", type="primary")

    with col2:
        st.markdown("#### 2. Kết Quả Phân Tích AI (Lớp 3)")
        if btn_analyze:
            with st.spinner("Gemini AI đang phân tích logic từng bước..."):
                try:
                    payload = {
                        "subject_id": sub_test,
                        "question_content": q_content,
                        "student_solution_text": manual_ocr_text
                    }
                    res = requests.post(f"{API_BASE_URL}/ai/analyze", json=payload, timeout=10)
                    if res.status_code == 200:
                        data = res.json()
                        st.error(f"❌ Phát hiện lỗi tại Bước {data.get('detected_error_step')}: {data.get('error_type')}")
                        st.info(f"💡 Nhận xét: {data.get('detailed_feedback')}")
                        st.markdown("#### Lời giải chuẩn:")
                        st.latex(r"\int (2x + e^x)dx = x^2 + e^x + C")
                        st.json(data)
                    else:
                        st.warning("Không thể gọi Backend API. Hiển thị fallback.")
                except Exception as e:
                    st.error(f"Lỗi kết nối API: {e}")

# -----------------
# 3. LEADERBOARD & GAMIFICATION
# -----------------
elif menu == "3. Bảng Xếp Hạng & Gamification":
    st.subheader("🏆 Leaderboard & Huy Hiệu")
    
    users = [
        {"Hạng": 1, "Họ và Tên": "Trần Thị Bình", "Lớp": 12, "Tổng XP": 1820, "Chuỗi Học": "12 ngày"},
        {"Hạng": 2, "Họ và Tên": "Nguyễn Văn An", "Lớp": 12, "Tổng XP": 1450, "Chuỗi Học": "5 ngày"},
        {"Hạng": 3, "Họ và Tên": "Lê Hùng Cường", "Lớp": 12, "Tổng XP": 980, "Chuỗi Học": "2 ngày"},
        {"Hạng": 4, "Họ và Tên": "Phạm Hoàng Nam", "Lớp": 12, "Tổng XP": 850, "Chuỗi Học": "4 ngày"},
    ]
    st.table(pd.DataFrame(users))

# -----------------
# 4. QUẢN LÝ KHO CÂU HỎI
# -----------------
elif menu == "4. Quản Lý Kho Câu Hỏi":
    st.subheader("📚 Quản Lý Ngân Hàng Câu Hỏi 3 Môn")
    st.success("CSDL đã sẵn sàng kết nối Supabase PostgreSQL.")
    st.write("Dữ liệu khởi tạo gồm các câu hỏi mẫu có công thức KaTeX cho Toán, Vật Lý, Hóa Học.")
