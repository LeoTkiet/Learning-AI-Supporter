import React from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  FileText, 
  BarChart3, 
  MessageSquareText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AppRoute } from '@/services/navigation';

interface FeatureCardProps {
  title: string;
  description: string;
  href: AppRoute;
  badge: string;
  iconName: string;
  isPrimary?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  href,
  badge,
  iconName,
  isPrimary = false,
}) => {
  const renderIcon = () => {
    const iconClass = "w-7 h-7";
    switch (iconName) {
      case 'ClipboardCheck':
        return <ClipboardCheck className={iconClass} />;
      case 'FileText':
        return <FileText className={iconClass} />;
      case 'BarChart3':
        return <BarChart3 className={iconClass} />;
      case 'MessageSquareText':
        return <MessageSquareText className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="group relative bg-white/90 hover:bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Top Badges & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            {renderIcon()}
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#1e3c72] border border-blue-100">
            {badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#1e3c72] transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <Link
        href={href}
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
          isPrimary
            ? 'bg-[#1e3c72] hover:bg-[#2a5298] text-white shadow-blue-900/20'
            : 'bg-slate-100 hover:bg-[#1e3c72] text-gray-800 hover:text-white'
        }`}
      >
        <span>Bắt đầu ngay</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default FeatureCard;
