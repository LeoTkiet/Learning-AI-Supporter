import { Trophy, Award, Target, Sparkles, Flame, FileText, Lock } from "lucide-react";
import { BadgeItem } from "@/types";

interface BadgeCardProps {
  badge: BadgeItem;
}

const ICON_MAP: Record<string, any> = {
  Trophy,
  Award,
  Target,
  Sparkles,
  Flame,
  FileText,
};

export function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = ICON_MAP[badge.icon_name] || Trophy;

  return (
    <div
      className={`glass-card p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
        badge.is_unlocked
          ? "border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5"
          : "border-slate-800 bg-slate-900/40 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            badge.is_unlocked
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "bg-slate-800 text-slate-500 border border-slate-700"
          }`}
        >
          {badge.is_unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            badge.is_unlocked
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          +{badge.xp_reward} XP
        </span>
      </div>

      <div className="mt-3">
        <h4 className={`font-semibold text-sm ${badge.is_unlocked ? "text-slate-100" : "text-slate-400"}`}>
          {badge.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {badge.description}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>{badge.category.toUpperCase()}</span>
        <span>{badge.is_unlocked ? "✓ Đã mở" : "Chưa mở"}</span>
      </div>
    </div>
  );
}
