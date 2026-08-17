import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

interface RadarChartProps {
  data?: RadarDataPoint[];
  title?: string;
}

const defaultData: RadarDataPoint[] = [
  { subject: 'Đại số', score: 85, fullMark: 100 },
  { subject: 'Giải tích', score: 65, fullMark: 100 },
  { subject: 'Hình học Oxyz', score: 70, fullMark: 100 },
  { subject: 'Dao động cơ', score: 90, fullMark: 100 },
  { subject: 'Điện xoay chiều', score: 60, fullMark: 100 },
  { subject: 'Hóa hữu cơ', score: 75, fullMark: 100 },
];

export const RadarChart: React.FC<RadarChartProps> = ({ data = defaultData, title = "Biểu Đồ Radar Năng Lực" }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" stroke="#4b5563" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" />
            <Radar
              name="Năng lực"
              dataKey="score"
              stroke="#4f46e5"
              fill="#6366f1"
              fillOpacity={0.5}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChart;
