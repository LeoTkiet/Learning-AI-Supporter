import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, LucideIcon } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { ROUTES } from '@/services/navigation';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  badge: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon = Sparkles,
  children,
}) => {
  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <div className="bg-[#f4f7fb]/95 backdrop-blur-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/40 animate-fadeIn">
        {/* Navigation Bar / Back button */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200/80">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3c72] hover:text-[#2a5298] bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100/80 text-[#1e3c72] border border-blue-200">
            {badge}
          </span>
        </div>

        {/* Header Title with Icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Content Area or Default Placeholder */}
        {children ? (
          <div>{children}</div>
        ) : (
          <div className="bg-white/80 rounded-xl border border-dashed border-gray-300 p-8 text-center my-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#1e3c72] flex items-center justify-center mb-3">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">
              Khung Giao Diện Sẵn Sàng
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Trang này đã được đồng bộ hóa nền mây trời và hệ thống điều hướng. Bạn có thể chèn các logic chuyên sâu hoặc thành phần giao diện vào đây.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PlaceholderPage;
