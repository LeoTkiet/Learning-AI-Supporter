import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import PlaceholderPage from '@/components/PlaceholderPage';

export default function QuizPage() {
  return (
    <PlaceholderPage
      title="Lớp 1: Trắc Nghiệm Chẩn Đoán"
      subtitle="Thực hiện bài kiểm tra trắc nghiệm nhanh để khoanh vùng các chuyên đề và dạng bài còn bị hổng kiến thức."
      badge="Lớp 1 • Chẩn đoán kiến thức"
      icon={ClipboardCheck}
    />
  );
}
