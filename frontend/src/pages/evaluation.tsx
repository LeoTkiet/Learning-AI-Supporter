import React from 'react';
import { BarChart3 } from 'lucide-react';
import PlaceholderPage from '@/components/PlaceholderPage';

export default function EvaluationPage() {
  return (
    <PlaceholderPage
      title="Bảng Đánh Giá Năng Lực Học Tập"
      subtitle="Theo dõi tổng quan mức độ thành thạo theo từng chuyên đề 3 môn Toán, Lý, Hóa qua biểu đồ Radar Chart và thống kê chi tiết."
      badge="Phân tích • Radar Chart"
      icon={BarChart3}
    />
  );
}
