/**
 * Centralized Application Routes & Navigation Helpers
 * Helps avoid hardcoded URLs across components and pages.
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  QUIZ: '/quiz',
  SUBMISSION: '/submission',
  EVALUATION: '/evaluation',
  CHAT: '/chat',
  LEADERBOARD: '/leaderboard',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

export interface NavigationItem {
  label: string;
  href: AppRoute;
  iconName?: string;
  description?: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavigationItem[] = [
  { label: 'Trang Chủ', href: ROUTES.HOME },
  { label: 'Trắc Nghiệm', href: ROUTES.QUIZ },
  { label: 'Tự Luận & OCR', href: ROUTES.SUBMISSION },
  { label: 'Đánh Giá Năng Lực', href: ROUTES.EVALUATION },
  { label: 'Chatbox AI', href: ROUTES.CHAT },
  { label: 'Bảng Xếp Hạng', href: ROUTES.LEADERBOARD },
];

export const FEATURE_ACTIONS: NavigationItem[] = [
  {
    label: 'Làm Trắc Nghiệm Chẩn Đoán',
    href: ROUTES.QUIZ,
    iconName: 'ClipboardCheck',
    description: 'Khoanh vùng nhanh lỗ hổng kiến thức qua các câu hỏi trắc nghiệm khách quan 3 môn Toán, Lý, Hóa.',
    badge: 'Lớp 1 • Chẩn đoán nhanh',
  },
  {
    label: 'Làm Bài Tự Luận & OCR',
    href: ROUTES.SUBMISSION,
    iconName: 'FileText',
    description: 'Viết lời giải ra giấy, tải ảnh lên để nhận diện công thức toán LaTeX không qua ghi đĩa (Zero Disk I/O).',
    badge: 'Lớp 2 • Nhận diện viết tay',
  },
  {
    label: 'Xem Bảng Đánh Giá Năng Lực',
    href: ROUTES.EVALUATION,
    iconName: 'BarChart3',
    description: 'Theo dõi chỉ số thành thạo từng chuyên đề (Radar Chart) và phân tích điểm mạnh - điểm yếu cá nhân.',
    badge: 'Phân tích • Radar Chart',
  },
  {
    label: 'Chatbox Hỏi Bài Với AI Gia Sư',
    href: ROUTES.CHAT,
    iconName: 'MessageSquareText',
    description: 'Trao đổi 1-1 với trợ lý sư phạm AI để được giải đáp thắc mắc, gợi ý phương pháp giải và sửa bài tức thì.',
    badge: 'AI Gia Sư 24/7',
  },
];
