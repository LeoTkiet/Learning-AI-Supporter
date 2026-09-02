import React from 'react';
import { FileText, Edit3, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div
      className="fixed inset-0 z-50 overflow-auto flex flex-col bg-blue-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/clouds-bg.jpg')" }}
    >
      <Navbar />
      {/* Khung chứa nội dung chính */}
      <main className="flex-1 flex flex-col justify-center px-8 md:px-24 w-full max-w-7xl mx-auto">
        
        {/* Phần Text Giới thiệu */}
        <div className="mb-12 mt-12 max-w-2xl">
          <h2 className="text-[#1e3c72] font-bold text-lg md:text-xl uppercase tracking-wider mb-2 leading-snug">
            Chào mừng<br/>
            bạn đến với<br/>
            Learning AI<br/>
            Supporter
          </h2>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 uppercase tracking-widest" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.1)' }}>
            LEARNING AI<br/>
            SUPPORTER
          </h1>
          <p className="text-gray-800 font-medium text-lg">
            Cùng AI học tập thông minh hơn mỗi ngày.
          </p>
        </div>

        {/* Khung 3 Thẻ chức năng (Cards) */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-auto mb-16">
          {/* Thẻ 1 */}
          <button className="bg-[#f4f7fb]/95 backdrop-blur-md w-56 h-40 rounded-xl shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-white/60 group">
            <FileText className="w-10 h-10 text-[#5c7294] group-hover:text-[#1e3c72] transition-colors mb-4" strokeWidth={1.5} />
            <span className="font-semibold text-gray-700">Trắc nghiệm nhanh</span>
          </button>
          
          {/* Thẻ 2 */}
          <button className="bg-[#f4f7fb]/95 backdrop-blur-md w-56 h-40 rounded-xl shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-white/60 group">
            <Edit3 className="w-10 h-10 text-[#5c7294] group-hover:text-[#1e3c72] transition-colors mb-4" strokeWidth={1.5} />
            <span className="font-semibold text-gray-700">Luyện viết luận</span>
          </button>

          {/* Thẻ 3 */}
          <button className="bg-[#f4f7fb]/95 backdrop-blur-md w-56 h-40 rounded-xl shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-white/60 group">
            <Target className="w-10 h-10 text-[#5c7294] group-hover:text-[#1e3c72] transition-colors mb-4" strokeWidth={1.5} />
            <span className="font-semibold text-gray-700">Ôn tập hiệu quả</span>
          </button>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white/70 py-4 text-center text-xs w-full mt-auto">
        Bản quyền © 2024 <span className="text-white font-semibold cursor-pointer">LEARNING AI SUPPORTER</span>. Tất cả quyền được bảo lưu.
      </footer>
    </div>
  );
}