import React from 'react';
import Link from 'next/link';
import RadarChart from '@/components/RadarChart';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-10 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg p-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Hệ Thống Học Tập Đa Môn Áp Dụng AI
        </h1>
        <p className="text-indigo-100 max-w-2xl mx-auto text-lg mb-6">
          Khắc phục triệt để lỗ hổng kiến thức Toán, Lý, Hóa qua cơ chế đánh giá 3 lớp: Trắc nghiệm, Tự luận OCR và Gemini AI phân tích.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/quiz"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-50 transition"
          >
            Bắt Đầu Làm Trắc Nghiệm
          </Link>
          <Link
            href="/submission"
            className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg border border-indigo-400 hover:bg-indigo-400 transition"
          >
            Tải Ảnh Bài Tự Luận (OCR)
          </Link>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RadarChart title="Tổng Quan Năng Lực 3 Môn" />

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quy Trình Khắc Phục Điểm Yếu 3 Lớp</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">Lớp 1</span>
                <span><strong>Trắc nghiệm chẩn đoán:</strong> Khoanh vùng mảng kiến thức yếu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">Lớp 2</span>
                <span><strong>Tự luận với OCR:</strong> Giải bài ra giấy & nhận diện công thức LaTeX.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">Lớp 3</span>
                <span><strong>AI phân tích sâu:</strong> Gemini AI chỉ rõ dòng sai & giải thích chi tiết.</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/leaderboard"
              className="text-indigo-600 font-medium hover:underline text-sm flex items-center gap-1"
            >
              Xem Bảng Xếp Hạng Học Sinh →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
