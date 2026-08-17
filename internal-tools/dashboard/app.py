import streamlit as st
import pandas as pd
import plotly.express as px
import requests

st.set_page_config(
    page_title="AI Learning Platform - Internal Dashboard",
    page_icon="📊",
    layout="wide"
)

st.title("📊 Internal DevOps & AI Testing Dashboard")
st.markdown("Công cụ Prototype kiểm thử logic đánh giá 3 lớp & phân tích dữ liệu học tập nội bộ.")

# Sidebar
st.sidebar.header("Cấu Hình Kiểm Thử")
api_base_url = st.sidebar.text_input("FastAPI Backend URL", "http://localhost:8000/api/v1")
selected_subject = st.sidebar.selectbox("Chọn Môn Học", ["Toán Học", "Vật Lý", "Hóa Học"])

# Tabs
tab1, tab2, tab3 = st.tabs(["Biểu Đồ Radar Năng Lực", "Thử Nghiệm OCR & Prompt", "Dữ Liệu Thống Kê"])

with tab1:
    st.subheader("Radar Chart Năng Lực Học Sinh")
    df_radar = pd.DataFrame(dict(
        r=[85, 65, 70, 90, 60, 75],
        theta=['Đại số', 'Giải tích', 'Hình Oxyz', 'Dao động cơ', 'Điện xoay chiều', 'Hóa hữu cơ']
    ))
    fig = px.line_polar(df_radar, r='r', theta='theta', line_close=True)
    fig.update_traces(fill='toself')
    st.plotly_chart(fig, use_container_width=True)

with tab2:
    st.subheader("Kiểm Thử Pipeline OCR & Gemini AI Prompt")
    uploaded_file = st.file_uploader("Tải ảnh chụp bài làm tự luận", type=["png", "jpg", "jpeg"])
    if uploaded_file is not None:
        st.image(uploaded_file, caption="Ảnh bài làm đã tải lên", width=400)
        if st.button("Chạy Thử Nghiệm OCR"):
            st.success("OCR Trích xuất: w = sqrt(k/m) -> w = sqrt(100/200)")
            st.info("Gemini Chẩn đoán: Lỗi sai bước 2 - Chưa đổi gam sang kg trong công thức.")

with tab3:
    st.subheader("Bảng Xếp Hạng & Chỉ Số XP")
    sample_data = pd.DataFrame({
        "Hạng": [1, 2, 3, 4],
        "Tên": ["Nguyễn Văn A", "Trần Thị B", "Lê Hoàng C", "Phạm Minh D"],
        "XP": [2450, 2100, 1850, 1600],
        "Chuỗi Streak (Ngày)": [14, 10, 7, 5]
    })
    st.dataframe(sample_data, use_container_width=True)
