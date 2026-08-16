"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SubjectId, AIAnalysisResponse } from "@/types";
import { analyzeSolutionWithAI } from "@/lib/api";
import { LatexRenderer } from "@/components/LatexRenderer";
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, BookOpen, RefreshCw } from "lucide-react";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject = (searchParams.get("subject") as SubjectId) || "math";
  const question = searchParams.get("question") || "Tìm nguyên hàm của hàm số $f(x) = 2x + e^x$.";
  const solution = searchParams.get("solution") || "Bước 1: f(x) = 2x + e^x\nBước 2: F(x) = x^2 + x*e^(x-1) + C";

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);

  useEffect(() => {
    async function runAI() {
      setLoading(true);
      const res = await analyzeSolutionWithAI(subject, question, solution);
      setAnalysis(res);
      setLoading(false);
    }
    runAI();
  }, [subject, question, solution]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lớp 3: Gemini AI Phân Tích Chuyên Sâu
        </div>
        <h1 className="text-2xl font-bold text-white">Chẩn Đoán Logic & Lời Giải Thích Sư Phạm</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Trợ lý AI đã đọc từng bước giải của bạn và khoanh vùng chính xác điểm nhầm lẫn.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-4 text-emerald-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-base font-semibold">Gemini AI đang đối chiếu từng bước giải với cơ sở tri thức...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Error Diagnosis Card */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Phát hiện lỗi tại Bước {analysis.detected_error_step || 1}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{analysis.error_type}</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed">
              <LatexRenderer content={analysis.detailed_feedback} />
            </div>
          </div>

          {/* Step by Step Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Phân Tích Chi Tiết Từng Bước
            </h3>

            <div className="space-y-3">
              {analysis.steps_breakdown.map((st) => (
                <div
                  key={st.step_number}
                  className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                    st.is_correct
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : "border-red-500/30 bg-red-950/20"
                  }`}
                >
                  <div className="mt-0.5">
                    {st.is_correct ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Bước {st.step_number}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        st.is_correct ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {st.is_correct ? "Hợp lý" : "Cần sửa"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-100">
                      <LatexRenderer content={st.content} />
                    </div>
                    {st.comment && (
                      <p className="text-xs text-slate-400 italic pt-1">{st.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Solution & Remedial Suggestion */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lightbulb className="w-5 h-5" />
              <h3>Lời Giải Chuẩn Mực (KaTeX)</h3>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100">
              <LatexRenderer content={analysis.remedial_latex_solution} block />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Lộ trình ôn tập:</span> {analysis.suggested_revision}
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all self-start sm:self-auto"
              >
                Cập Nhật Năng Lực Trên Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
