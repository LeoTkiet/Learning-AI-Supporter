import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';

export default function SubmissionPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lớp 2 & 3: Tự Luận & OCR AI Phân Tích</h1>
        <p className="text-gray-500 text-sm">Chụp ảnh bài giải tự luận ra giấy của bạn và tải lên để AI nhận diện và phát hiện lỗi sai</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Tải Ảnh Bài Làm Lên</h2>
            <FileUpload />
            <button
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition text-sm shadow"
            >
              {isAnalyzing ? 'Đang Chẩn Đoán Bằng Gemini AI...' : 'Bắt Đầu Nhận Diện & Phân Tích'}
            </button>
          </div>
        </div>

        {/* Diagnostic Result Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Kết Quả Phân Tích</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700">Trạng thái: Sẵn sàng</p>
            <p>Sau khi tải ảnh, Gemini AI sẽ chỉ rõ:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Bước giải bắt đầu sai</li>
              <li>Loại lỗi (công thức, đơn vị, bảo toàn)</li>
              <li>Lời giải mẫu chuẩn LaTeX</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
