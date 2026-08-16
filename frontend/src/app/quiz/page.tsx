"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Question, SubjectId } from "@/types";
import { fetchDiagnosticQuiz, submitQuizAnswers } from "@/lib/api";
import { LatexRenderer } from "@/components/LatexRenderer";
import { Calculator, Zap, FlaskConical, CheckCircle2, XCircle, ArrowRight, HelpCircle, RefreshCw } from "lucide-react";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawSubject = (searchParams.get("subject") as SubjectId) || "math";
  const [subject, setSubject] = useState<SubjectId>(rawSubject);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      setQuizResult(null);
      setSelectedAnswers({});
      const data = await fetchDiagnosticQuiz(subject);
      setQuestions(data);
      setLoading(false);
    }
    loadQuiz();
  }, [subject]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const answersPayload = Object.entries(selectedAnswers).map(([qid, opt]) => ({
      question_id: qid,
      selected_option: opt,
    }));

    const result = await submitQuizAnswers(subject, answersPayload);
    setQuizResult(result);
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header & Subject Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            Lớp 1: Trắc Nghiệm Chẩn Đoán
          </div>
          <h1 className="text-2xl font-bold text-white">Kiểm Tra Khoanh Vùng Điểm Yếu</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Trả lời các câu hỏi sau để hệ thống phát hiện các lỗ hổng kiến thức</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: "math", label: "Toán", icon: Calculator },
            { id: "physics", label: "Lý", icon: Zap },
            { id: "chemistry", label: "Hóa", icon: FlaskConical },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subject === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubject(tab.id as SubjectId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <p className="text-sm">Đang tải bộ câu hỏi chẩn đoán...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  Câu hỏi {idx + 1} ({q.difficulty.toUpperCase()})
                </span>
                <span className="text-xs text-slate-400">Chuyên đề: {q.topic_id}</span>
              </div>

              {/* Question Content */}
              <div className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                <LatexRenderer content={q.content} block />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}>
                        {opt.id}
                      </span>
                      <div className="text-sm">
                        <LatexRenderer content={opt.text} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {q.hint && (
                <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gợi ý: {q.hint}</span>
                </div>
              )}
            </div>
          ))}

          {/* Submit Action */}
          {!quizResult && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(selectedAnswers).length === 0}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                {submitting ? "Đang chấm điểm..." : "Nộp Bài Chẩn Đoán"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Result Card */}
          {quizResult && (
            <div className="glass-panel p-8 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Kết Quả Chẩn Đoán</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Đúng {quizResult.correct_count}/{quizResult.total_questions} câu ({quizResult.score_percentage}%)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold">
                    +{quizResult.xp_earned} XP
                  </div>
                </div>
              </div>

              {/* Weak Points Notice for Layer 2 */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-amber-300 text-sm">
                <XCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Hệ thống phát hiện mảng kiến thức cần rèn luyện:</p>
                  <p className="text-xs text-amber-200/80">
                    Bạn hãy giải chi tiết câu hỏi sai ra giấy, sau đó chụp ảnh gửi qua <strong>Lớp 2 (OCR & AI Phân Tích)</strong> để AI chỉ rõ bước sai.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => router.push(`/submission?subject=${subject}&question=${questions[0]?.id || ""}`)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                >
                  Chuyển Sang Lớp 2: Upload Bài Giải Tự Luận
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
