import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI Learning Supporter - Hệ Thống Hỗ Trợ Học Tập Đa Môn (Toán, Lý, Hóa)",
  description: "Khắc phục lỗ hổng kiến thức qua 3 lớp: Trắc nghiệm chẩn đoán, OCR chữ viết tay tự luận và Phân tích chuyên sâu từ Google Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
          <p>© 2026 AI Learning Supporter • Toán Học, Vật Lý, Hóa Học • Powered by FastAPI & Gemini AI</p>
        </footer>
      </body>
    </html>
  );
}
