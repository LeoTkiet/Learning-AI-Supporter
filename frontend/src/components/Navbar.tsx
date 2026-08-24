import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  GraduationCap, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Flame, 
  Award,
  Sparkles
} from 'lucide-react';
import { ROUTES, MAIN_NAV_ITEMS } from '@/services/navigation';
import apiService from '@/services/api';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; xp?: number; streak?: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        try {
          setUserProfile(JSON.parse(stored));
        } catch {
          setUserProfile(null);
        }
      }
    }
  }, [router.pathname]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch {
      // ignore
    } finally {
      setUserProfile(null);
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-[#f4f7fb]/95 backdrop-blur-md border-b border-white/40 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link 
            href={ROUTES.HOME} 
            className="flex items-center gap-2.5 text-[#1e3c72] hover:opacity-90 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#1e3c72]">
                Learning AI Supporter
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                Hệ Thống Đánh Giá 3 Lớp
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#1e3c72] text-white shadow-sm'
                      : 'text-gray-700 hover:text-[#1e3c72] hover:bg-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Login Action */}
          <div className="hidden md:flex items-center gap-3">
            {userProfile ? (
              <div className="flex items-center gap-3 bg-white/90 px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{userProfile.streak || 1} ngày</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-1 text-xs font-bold text-[#1e3c72]">
                  <Award className="w-4 h-4 text-[#1e3c72]" />
                  <span>{userProfile.xp || 100} XP</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                  {userProfile.full_name || 'Học sinh'}
                </span>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="bg-[#1e3c72] hover:bg-[#2a5298] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#1e3c72] hover:bg-white/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f4f7fb]/98 backdrop-blur-lg border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#1e3c72] text-white'
                    : 'text-gray-700 hover:bg-white/80 hover:text-[#1e3c72]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            {userProfile ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-[#1e3c72]" />
                  <span>{userProfile.full_name || 'Học sinh'} ({userProfile.xp || 100} XP)</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#1e3c72] text-white py-2 rounded-lg font-bold text-sm"
              >
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
