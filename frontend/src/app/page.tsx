import Link from "next/link";
import { Calculator, Zap, FlaskConical, Sparkles, ArrowRight, ShieldCheck, Camera, Cpu, Award } from "lucide-react";

export default function HomePage() {
  const subjects = [
    {
      id: "math",
      name: "Toán Học",
      description: "Chẩn đoán điểm yếu Giải tích, Đại số lũy thừa, Tọa độ Oxyz và Hình học không gian.",
      icon: Calculator,
      color: "from-blue-600 to-cyan-500",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      topicsCount: 5,
      activeCount: "1,240 học sinh",
    },
    {
      id: "physics",
      name: "Vật Lý",
      description: "Khắc phục lỗi nhầm lẫn Dao động cơ, Sóng dừng, Mạch điện xoay chiều RLC và Hạt nhân.",
      icon: Zap,
      color: "from-purple-600 to-pink-500",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      topicsCount: 5,
      activeCount: "980 học sinh",
    },
    {
      id: "chemistry",
      name: "Hóa Học",
      description: "Chấm điểm tự luận phản ứng Oxi hóa - Khử, Este - Lipit, Kim loại và Bảo toàn electron.",
      icon: FlaskConical,
      color: "from-emerald-600 to-teal-500",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      topicsCount: 5,
      activeCount: "850 học sinh",
    },
  ];

  const features = [
    {
      layer: "Lớp 1",
      title: "Trắc Nghiệm Chẩn Đoán",
      description: "Khoanh vùng chính xác mảng kiến thức và dạng bài tập còn chưa vững trong thời gian ngắn.",
      icon: ShieldCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      layer: "Lớp 2",
      title: "Tự Luận OCR Viết Tay",
      description: "Không cần gõ công thức phức tạp. Chỉ cần chụp ảnh bài làm tay trên giấy và tải lên.",
      icon: Camera,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      layer: "Lớp 3",
      title: "Gemini AI Phân Tích Sâu",
      description: "AI chỉ ra chính xác từng bước sai, lý do sai lầm và đưa ra lời giải chuẩn kèm công thức KaTeX.",
      icon: Cpu,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Hệ Thống Đánh Giá Học Tập 3 Lớp Mới Nhất
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Khắc Phục Lỗ Hổng Kiến Thức Với Trợ Lý{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              AI Sư Phạm Đa Môn
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Kết hợp nhận diện ảnh chụp bài giải tự luận (OCR) và mô hình ngôn ngữ lớn Google Gemini để phân tích logic từng bước cho 3 môn cốt lõi: <strong>Toán Học, Vật Lý, Hóa Học</strong>.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/quiz?subject=math"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Bắt Đầu Chẩn Đoán Ngay
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-medium transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Xem Biểu Đồ Radar & Bảng Xếp Hạng
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Subject Selector */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Chọn Môn Học Cần Rèn Luyện</h2>
            <p className="text-slate-400 text-sm mt-1">Dữ liệu câu hỏi và bộ tiêu chí đánh giá được tối ưu hóa cho từng môn học</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                className="glass-card rounded-2xl p-6 border flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sub.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sub.badgeColor}`}>
                      {sub.topicsCount} Chuyên đề
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{sub.activeCount}</span>
                  <Link
                    href={`/quiz?subject=${sub.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-transform"
                  >
                    Vào luyện tập
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Layer Architecture Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Quy Trình Khắc Phục Điểm Yếu 3 Lớp</h2>
          <p className="text-slate-400 text-sm">Học sinh không còn loay hoay tự tìm lỗi sai trong hàng tá công thức toán học</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                    {feat.layer}
                  </span>
                  <div className={`p-2 rounded-lg ${feat.bg}`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
