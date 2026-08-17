import React, { useState } from 'react';

export default function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'physics' | 'chemistry'>('math');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lớp 1: Trắc Nghiệm Chẩn Đoán</h1>
          <p className="text-gray-500 text-sm">Chọn môn học và hoàn thành bài kiểm tra để phát hiện lỗ hổng kiến thức</p>
        </div>
        <div className="flex gap-2">
          {(['math', 'physics', 'chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {sub === 'math' ? '📐 Toán Học' : sub === 'physics' ? '⚡ Vật Lý' : '🧪 Hóa Học'}
            </button>
          ))}
        </div>
      </div>

      {/* Placeholder Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <span>Câu hỏi 1 / 5</span>
          <span>Chuyên đề: Đạo hàm & Khảo sát hàm số</span>
        </div>
        <p className="text-gray-800 text-base font-medium">
          Cho hàm số y = f(x) có bảng biến thiên như hình vẽ. Số điểm cực trị của hàm số đã cho là bao nhiêu?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {['A. 0', 'B. 1', 'C. 2', 'D. 3'].map((opt, idx) => (
            <button
              key={idx}
              className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/30 transition text-sm text-gray-700 font-medium"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
            Nộp Bài & Chẩn Đoán
          </button>
        </div>
      </div>
    </div>
  );
}
