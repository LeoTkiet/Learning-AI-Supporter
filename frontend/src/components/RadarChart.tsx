"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SkillScore } from "@/types";

interface RadarChartProps {
  skills: SkillScore[];
  subjectColor?: string;
}

export function RadarChart({ skills, subjectColor = "#3B82F6" }: RadarChartProps) {
  const chartData = skills.map((s) => ({
    topic: s.topic_name,
    score: s.mastery_score,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#374151" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="topic"
            tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#4B5563"
            tick={{ fill: "#6B7280", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              borderColor: "#374151",
              borderRadius: "0.5rem",
              color: "#F3F4F6",
              fontSize: "12px",
            }}
            formatter={(value: any) => [`${value}/100 điểm`, "Năng lực"]}
          />
          <Radar
            name="Điểm Năng Lực"
            dataKey="score"
            stroke={subjectColor}
            fill={subjectColor}
            fillOpacity={0.45}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
