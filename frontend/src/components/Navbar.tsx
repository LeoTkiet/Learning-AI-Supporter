import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <span>🎓</span> AI Learning Platform
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/quiz" className="text-gray-600 hover:text-indigo-600 font-medium">
            Trắc Nghiệm
          </Link>
          <Link href="/submission" className="text-gray-600 hover:text-indigo-600 font-medium">
            Tự Luận & OCR
          </Link>
          <Link href="/leaderboard" className="text-gray-600 hover:text-indigo-600 font-medium">
            Bảng Xếp Hạng
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
