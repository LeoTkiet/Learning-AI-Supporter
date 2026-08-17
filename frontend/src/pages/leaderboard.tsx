import React from 'react';

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  badge: string;
}

const mockUsers: LeaderboardUser[] = [
  { rank: 1, name: 'Nguyễn Văn A', xp: 2450, streak: 14, badge: '👑 Thủ Khoa' },
  { rank: 2, name: 'Trần Thị B', xp: 2100, streak: 10, badge: '🔥 Chăm Chỉ' },
  { rank: 3, name: 'Lê Hoàng C', xp: 1850, streak: 7, badge: '⚡ Siêu Tốc' },
  { rank: 4, name: 'Phạm Minh D', xp: 1600, streak: 5, badge: '🌱 Tân Binh' },
  { rank: 5, name: 'Hoàng Anh E', xp: 1420, streak: 3, badge: '🌱 Tân Binh' },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🏆 Bảng Xếp Hạng Học Sinh</h1>
        <p className="text-gray-500 text-sm">Vinh danh các bạn học sinh có điểm kinh nghiệm (XP) và chuỗi học tập cao nhất</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Hạng</th>
              <th className="py-3 px-4">Học Sinh</th>
              <th className="py-3 px-4">Danh Hiệu</th>
              <th className="py-3 px-4">Chuỗi Streak</th>
              <th className="py-3 px-4 text-right">Tổng Điểm XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockUsers.map((user) => (
              <tr key={user.rank} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-4 font-bold text-gray-700">
                  {user.rank === 1 ? '🥇 #1' : user.rank === 2 ? '🥈 #2' : user.rank === 3 ? '🥉 #3' : `#${user.rank}`}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                <td className="py-3 px-4 text-xs font-medium text-indigo-600">{user.badge}</td>
                <td className="py-3 px-4 text-gray-600">🔥 {user.streak} ngày</td>
                <td className="py-3 px-4 text-right font-bold text-indigo-600">{user.xp.toLocaleString()} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
