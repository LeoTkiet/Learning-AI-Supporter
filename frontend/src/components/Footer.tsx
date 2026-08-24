import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/services/navigation';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e293b]/90 backdrop-blur-md text-white/70 py-4 text-center text-xs border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Bản quyền © 2024{' '}
          <Link href={ROUTES.HOME} className="text-white font-semibold hover:underline">
            LEARNING AI SUPPORTER
          </Link>
          . Tất cả quyền được bảo lưu.
        </div>
        <div className="flex items-center gap-4 text-xs text-white/60">
          <Link href={ROUTES.HOME} className="hover:text-white transition">
            Trang Chủ
          </Link>
          <span>•</span>
          <Link href={ROUTES.QUIZ} className="hover:text-white transition">
            Trắc Nghiệm
          </Link>
          <span>•</span>
          <Link href={ROUTES.CHAT} className="hover:text-white transition">
            Hỏi Bài AI
          </Link>
          <span>•</span>
          <Link href={ROUTES.LEADERBOARD} className="hover:text-white transition">
            Vinh Danh
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
