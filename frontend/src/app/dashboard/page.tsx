"use client";

import { useEffect, useState } from "react";
import { DashboardSummary, SubjectId } from "@/types";
import { fetchDashboardData } from "@/lib/api";
import { RadarChart } from "@/components/RadarChart";
import { BadgeCard } from "@/components/BadgeCard";
import {
  Trophy, Flame, Award, Zap, Calculator, FlaskConical, BarChart3, TrendingUp, RefreshCw
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("math");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const res = await fetchDashboardData();
      setData(res);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="text-center py-24 text-blue-400 flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="text-sm text-slate-400">Đang tải biểu đồ năng lực và bảng xếp hạng...</p>
      </div>
    );
  }

  const currentRadar = data.radar_data.find((r) => r.subject_id === selectedSubject) || data.radar_data[0];

  const subjectColorMap: Record<string, string> = {
    math: "#3B82F6",
    physics: "#8B5CF6",
    chemistry: "#10B981",
  };

  return (
    <div className="space-y-10 py-2">
      {/* User Stats Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90">
        <div className="flex items-center gap-4">
          <img
            src={data.avatar_url}
            alt={data.full_name}
            className="w-16 h-16 rounded-2xl border-2 border-blue-500/40 shadow-lg bg-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{data.full_name}</h1>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-semibold border border-blue-500/30">
                Lớp {data.grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Đang chinh phục lộ trình khắc phục điểm yếu đa môn</p>
          </div>
        </div>

        {/* Quick Gamification Metrics */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{data.current_streak} Ngày</span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Chuỗi Học Tập</span>
          </div>

          <div className="text-center bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-bold">
              <Award className="w-4 h-4" />
              <span>{data.total_xp} XP</span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Điểm Kinh Nghiệm</span>
          </div>
        </div>
      </div>

      {/* Radar Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart Visual */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Biểu Đồ Radar Năng Lực</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">Trực quan hóa sức mạnh các kỹ năng theo từng môn học</p>
            </div>

            {/* Subject Switcher for Radar */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { id: "math", label: "Toán", icon: Calculator },
                { id: "physics", label: "Lý", icon: Zap },
                { id: "chemistry", label: "Hóa", icon: FlaskConical },
              ].map((s) => {
                const Icon = s.icon;
                const active = selectedSubject === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id as SubjectId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {currentRadar && (
            <div className="space-y-4">
              <RadarChart
                skills={currentRadar.skills}
                subjectColor={subjectColorMap[selectedSubject]}
              />

              {/* Skills Progress Bar List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                {currentRadar.skills.map((sk) => (
                  <div key={sk.topic_id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">{sk.topic_name}</span>
                      <span className={`font-bold ${
                        sk.mastery_score >= 80
                          ? "text-emerald-400"
                          : sk.mastery_score >= 60
                          ? "text-blue-400"
                          : "text-amber-400"
                      }`}>
                        {sk.mastery_score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${sk.mastery_score}%`,
                          backgroundColor: subjectColorMap[selectedSubject],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mini Leaderboard on Dashboard */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Bảng Xếp Hạng</h2>
            </div>
            <p className="text-xs text-slate-400">Top học sinh có điểm kinh nghiệm rèn luyện cao nhất tuần</p>

            <div className="space-y-3 pt-2">
              {[
                { rank: 1, name: "Trần Thị Bình", xp: "1,820 XP", streak: "12 ngày", avatar: "BinhTran", color: "text-amber-400" },
                { rank: 2, name: "Nguyễn Văn An (Bạn)", xp: "1,450 XP", streak: "5 ngày", avatar: "AnNguyen", color: "text-slate-300", isCurrent: true },
                { rank: 3, name: "Lê Hùng Cường", xp: "980 XP", streak: "2 ngày", avatar: "CuongLe", color: "text-amber-600" },
                { rank: 4, name: "Phạm Hoàng Nam", xp: "850 XP", streak: "4 ngày", avatar: "NamPham", color: "text-slate-400" },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    user.isCurrent
                      ? "bg-blue-600/10 border-blue-500/30 text-white"
                      : "bg-slate-900/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-bold text-sm ${user.color}`}>#{user.rank}</span>
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatar}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full bg-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-semibold leading-none">{user.name}</h4>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">Chuỗi: {user.streak}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{user.xp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Bạn chỉ cần thêm <strong>370 XP</strong> để vươn lên vị trí Top 1!</span>
          </div>
        </div>
      </section>

      {/* Badges Collection Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Bộ Sưu Tập Huy Hiệu</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Phần thưởng ghi nhận nỗ lực vượt qua các chuyên đề và lỗi sai khó
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </section>
    </div>
  );
}
