import React from 'react';
import { MessageSquareText } from 'lucide-react';
import PlaceholderPage from '@/components/PlaceholderPage';

export default function ChatPage() {
  return (
    <PlaceholderPage
      title="Chatbox Hỏi Bài Với AI Gia Sư"
      subtitle="Hỏi đáp 1-1 với trợ lý sư phạm AI để nhận hướng dẫn giải chi tiết, giải thích các khái niệm khó hiểu hoặc kiểm tra bài giải."
      badge="AI Sư Phạm 24/7"
      icon={MessageSquareText}
    />
  );
}
