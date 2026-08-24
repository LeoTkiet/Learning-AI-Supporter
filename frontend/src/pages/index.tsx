import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Trophy,
  ArrowRight,
  Zap
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import FeatureCard from '@/components/FeatureCard';
import { ROUTES, FEATURE_ACTIONS } from '@/services/navigation';

export default function HomePage() {
  return (
    <AppLayout maxWidthClass="max-w-5xl">
      <div className="space-y-6">
        
        {/* 1. Main Hub Container (Glassmorphic Card matching login.tsx style) */}
        <div className="bg-[#f4f7fb]/95 backdrop-blur-md w-full rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/40">
          
          {/* Header & Hero Section */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1e3c72] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nền Tảng Đánh Giá Chẩn Đoán AI Sư Phạm</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
              LEARNING AI SUPPORTER
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Khắc phục triệt để lỗ hổng kiến thức <span className="font-semibold text-[#1e3c72]">Toán - Lý - Hóa</span> thông qua cơ chế đánh giá 3 lớp: Trắc nghiệm chẩn đoán, Tự luận nhận diện OCR và Gemini AI phân tích sư phạm từng bước.
            </p>
          </div>

          {/* 2. 3-Layer Diagnostic Quick Summary */}
          <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-gray-200/80 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Layers className="w-4 h-4 text-[#1e3c72]" />
              <span>Quy Trình Học Tập & Khắc Phục Lỗ Hổng 3 Lớp</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
              <div className="flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80">
                <span className="font-bold text-[#1e3c72] bg-white px-2 py-0.5 rounded shadow-xs">Lớp 1</span>
                <span><strong>Trắc nghiệm:</strong> Khoanh vùng chuyên đề & dạng bài còn yếu.</span>
              </div>
              <div className="flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80">
                <span className="font-bold text-[#1e3c72] bg-white px-2 py-0.5 rounded shadow-xs">Lớp 2</span>
                <span><strong>Tự luận & OCR:</strong> Giải ra giấy, nhận diện công thức LaTeX trong RAM.</span>
              </div>
              <div className="flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80">
                <span className="font-bold text-[#1e3c72] bg-white px-2 py-0.5 rounded shadow-xs">Lớp 3</span>
                <span><strong>AI Sư Phạm:</strong> Chỉ đúng dòng sai, phân loại lỗi & giải mẫu.</span>
              </div>
            </div>
          </div>

          {/* 3. 4 Core Feature Cards (User Selection Grid) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Chọn Tính Năng Bắt Đầu</span>
              </h2>
              <span className="text-xs text-gray-500">Chọn 1 trong 4 phân hệ bên dưới</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {FEATURE_ACTIONS.map((action, idx) => (
                <FeatureCard
                  key={action.href}
                  title={action.label}
                  description={action.description || ''}
                  href={action.href}
                  badge={action.badge || `Tính năng ${idx + 1}`}
                  iconName={action.iconName || 'Sparkles'}
                  isPrimary={idx === 0}
                />
              ))}
            </div>
          </div>

          {/* 4. Bottom Quick Links & Gamification Banner */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Hỗ trợ nhận diện công thức Toán, Lý, Hóa xử lý trực tiếp trên RAM (Zero Disk I/O).</span>
            </div>
            <Link
              href={ROUTES.LEADERBOARD}
              className="inline-flex items-center gap-1.5 font-bold text-[#1e3c72] hover:text-[#2a5298] bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition hover:shadow"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Xem Bảng Xếp Hạng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
