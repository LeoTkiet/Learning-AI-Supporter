"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SubjectId, OCRProcessResponse } from "@/types";
import { FileUploader } from "@/components/FileUploader";
import { uploadEssayImage } from "@/lib/api";
import { LatexRenderer } from "@/components/LatexRenderer";
import { Camera, Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function SubmissionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subject = (searchParams.get("subject") as SubjectId) || "math";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRProcessResponse | null>(null);

  const sampleQuestionContent = subject === "math"
    ? "Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$."
    : subject === "physics"
    ? "Tính tần số góc con lắc lò xo $m = 100\\text{ g}, k = 100\\text{ N/m}$."
    : "Nhận biết este no đơn chức mạch hở $\\text{HCOOCH}_3$.";

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    try {
      const res = await uploadEssayImage(file, subject);
      setOcrResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToAI = () => {
    // Navigate to Layer 3: AI Analysis
    const encodedSolution = encodeURIComponent(ocrResult?.raw_text || "");
    const encodedQuestion = encodeURIComponent(sampleQuestionContent);
    router.push(`/analysis?subject=${subject}&question=${encodedQuestion}&solution=${encodedSolution}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
          Lớp 2: Tự Luận Với OCR Chữ Viết Tay
        </div>
        <h1 className="text-2xl font-bold text-white">Chụp Ảnh & Nhận Diện Bài Làm</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Hệ thống sẽ dùng công nghệ OCR kết hợp tiền xử lý OpenCV để trích xuất chữ viết tay và công thức toán học từ ảnh.
        </p>
      </div>

      {/* Target Question Reminder */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đề Bài Cần Khắc Phục:</span>
        <div className="text-base text-slate-200 font-medium">
          <LatexRenderer content={sampleQuestionContent} />
        </div>
      </div>

      {/* File Upload Area */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-400" />
          Tải Lên Ảnh Chụp Vở Bài Tập
        </h2>
        
        <FileUploader onFileSelected={handleFileSelected} isLoading={isProcessing} />

        {isProcessing && (
          <div className="flex items-center justify-center gap-3 py-4 text-purple-400 text-sm font-medium">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tiền xử lý ảnh & trích xuất chữ viết tay qua OCR...</span>
          </div>
        )}
      </div>

      {/* OCR Result Preview */}
      {ocrResult && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white">Kết Quả Nhận Diện OCR Thành Công</h3>
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-semibold border border-purple-500/30">
              Độ tin cậy: {ocrResult.confidence_score}%
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400">Văn bản & Công thức trích xuất:</span>
              <div className="mt-1.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-sm text-slate-200 whitespace-pre-wrap">
                {ocrResult.raw_text}
              </div>
            </div>

            {ocrResult.latex_extracted && (
              <div>
                <span className="text-xs font-semibold text-slate-400">Công thức nhận diện dạng KaTeX:</span>
                <div className="mt-1.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-blue-300">
                  <LatexRenderer content={`$$${ocrResult.latex_extracted}$$`} block />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceedToAI}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              Chuyển Sang Lớp 3: Gemini AI Phân Tích Lỗi Sai
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
