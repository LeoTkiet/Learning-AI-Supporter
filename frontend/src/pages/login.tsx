import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock, EyeOff, Eye, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import apiService from '@/services/api';
import { supabase } from '@/services/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc số điện thoại.');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiService.login({ email: email.trim(), password });

      if (res.access_token) {
        localStorage.setItem('auth_token', res.access_token);
        localStorage.setItem('user_profile', JSON.stringify(res.user));
        setSuccessMsg(res.message || 'Đăng nhập thành công! Đang chuyển hướng...');

        setTimeout(() => {
          router.push('/');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const detail = err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setErrorMsg(detail);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập qua Supabase OAuth (Google / Facebook)
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google login error:', err);
      setErrorMsg(err.message || 'Không thể kết nối đến Google OAuth. Vui lòng kiểm tra Supabase.');
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Facebook login error:', err);
      setErrorMsg(err.message || 'Không thể kết nối đến Facebook OAuth. Vui lòng kiểm tra Supabase.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto flex flex-col bg-blue-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/clouds-bg.jpg')" }}
    >
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Main Content - Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-[#f4f7fb]/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl p-8 border border-white/40">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ĐĂNG NHẬP</h1>
            <p className="text-sm text-gray-500">vào tài khoản Learning AI Supporter của bạn</p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Input Email/SĐT */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email hoặc Số điện thoại"
                disabled={isLoading}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3c72] transition disabled:bg-gray-100"
              />
            </div>

            {/* Input Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3c72] transition disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            {/* Quên mật khẩu */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setErrorMsg('Vui lòng nhập Email trước khi yêu cầu khôi phục mật khẩu.');
                    return;
                  }
                  try {
                    await apiService.forgotPassword(email);
                    setSuccessMsg('Email đặt lại mật khẩu đã được gửi!');
                  } catch (e: any) {
                    setErrorMsg(e.response?.data?.detail || 'Không thể gửi email đặt lại mật khẩu.');
                  }
                }}
                className="text-sm text-gray-500 hover:text-[#1e3c72] transition"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold py-3 px-4 rounded-lg transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ĐANG XỬ LÝ...</span>
                </>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-4">-- hoặc đăng nhập bằng --</p>
            <div className="flex space-x-4">

              {/* Nút Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition bg-white shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-bold text-gray-700">Google</span>
              </button>

              {/* Nút Facebook */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition bg-white shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                  <path d="M16.671 15.542l.532-3.469h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V5.006s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.633H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z" fill="#ffffff" />
                </svg>
                <span className="font-bold text-gray-700">Facebook</span>
              </button>

            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{' '}
            <a href="#" className="font-bold text-[#1e3c72] hover:underline">
              Đăng ký ngay
            </a>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-[#1e293b] text-white/70 py-4 text-center text-xs">
        Bản quyền © 2024 <span className="text-white font-semibold cursor-pointer">LEARNING AI SUPPORTER</span>. Tất cả quyền được bảo lưu.
      </footer>
    </div>
  );
}