import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, Flame, Award, Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { ROUTES } from '@/services/navigation';
import apiService from '@/services/api';

interface LeaderboardUser {
  rank: number;
  user_id?: string;
  name: string;
  xp: number;
  streak: number;
}

const defaultMockUsers: LeaderboardUser[] = [
  { rank: 1, name: 'Nguyễn Văn A', xp: 2450, streak: 14 },
  { rank: 2, name: 'Trần Thị B', xp: 2100, streak: 10 },
  { rank: 3, name: 'Lê Hoàng C', xp: 1850, streak: 7 },
  { rank: 4, name: 'Phạm Minh D', xp: 1600, streak: 5 },
  { rank: 5, name: 'Hoàng Anh E', xp: 1420, streak: 3 },
];

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>(defaultMockUsers);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getLeaderboard();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <div className="bg-[#f4f7fb]/95 backdrop-blur-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/40 animate-fadeIn">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200/80">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3c72] hover:text-[#2a5298] bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            🏆 Bảng Vinh Danh
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Bảng Xếp Hạng Học Sinh
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Vinh danh các bạn học sinh có tổng điểm kinh nghiệm (XP) và chuỗi học tập cao nhất.
            </p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-[#1e3c72]" />
              <span>Đang tải bảng xếp hạng...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Hạng</th>
                  <th className="py-3.5 px-4 sm:px-6">Học Sinh</th>
                  <th className="py-3.5 px-4 sm:px-6">Chuỗi Streak</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Tổng Điểm XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.rank} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-700">
                      {user.rank === 1 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-extrabold">🥇 #1</span>
                      ) : user.rank === 2 ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-extrabold">🥈 #2</span>
                      ) : user.rank === 3 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-extrabold">🥉 #3</span>
                      ) : (
                        <span className="text-gray-500">#{user.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                        {user.streak} ngày
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-[#1e3c72]">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <Award className="w-4 h-4 text-[#1e3c72]" />
                        {user.xp.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
