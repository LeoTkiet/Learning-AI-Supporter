import React from 'react';
import { FileText } from 'lucide-react';
import PlaceholderPage from '@/components/PlaceholderPage';

export default function SubmissionPage() {
  return (
    <PlaceholderPage
      title="Lớp 2 & 3: Tự Luận & OCR AI Sư Phạm"
      subtitle="Chụp ảnh bài giải tự luận viết tay ra giấy và tải lên để hệ thống nhận diện công thức LaTeX và Gemini AI phân tích từng bước."
      badge="Lớp 2 & 3 • OCR & AI Sư Phạm"
      icon={FileText}
    />
  );
}
