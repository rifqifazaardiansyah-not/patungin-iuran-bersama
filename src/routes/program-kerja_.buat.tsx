import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { ProgramCategory, ProgramStatus } from "@/lib/mock";
import { ChevronLeft, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/program-kerja_/buat")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: BuatProgramPage,
});

function BuatProgramPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProgramCategory>("event");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetBudget, setTargetBudget] = useState("");
  const [status, setStatus] = useState<ProgramStatus>("draft");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !startDate || !endDate || !targetBudget) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    toast.loading("Menyimpan event...", { duration: 1500 });
    
    setTimeout(() => {
      toast.success(
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Program Berhasil Dibuat!</p>
            <p className="text-xs text-muted-foreground mt-0.5">{name}</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      
      setTimeout(() => {
        navigate({ to: "/program-kerja" });
      }, 1000);
    }, 1500);
  };

  return (
    <AppShell hideNav>
      <div className="pb-8">
        {/* Header - Non-overlapping */}
        <div className="gradient-navy px-5 pt-6 pb-6 text-white">
          <button
            onClick={() => history.back()}
            className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold">Buat Event Baru</h1>
          <p className="mt-1 text-sm text-white/80">Kelola event dan kegiatan organisasi</p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 mt-4">{/* Positive margin */}
          <div className="space-y-4">
            {/* Nama Program */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">
                Nama Program <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Seminar Nasional Teknologi 2025"
                className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">
                Deskripsi <span className="text-destructive">*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Jelaskan detail event ini..."
                className="mt-1.5 w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
                required
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {description.length} / 500 karakter
              </p>
            </div>

            {/* Kategori */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">
                Kategori <span className="text-destructive">*</span>
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {([
                  { v: "event", l: "Event", emoji: "🎉" },
                  { v: "kegiatan", l: "Kegiatan", emoji: "🎯" },
                  { v: "pengembangan", l: "Pengembangan", emoji: "📚" },
                  { v: "sosial", l: "Sosial", emoji: "🤝" },
                ] as const).map(cat => (
                  <button
                    key={cat.v}
                    type="button"
                    onClick={() => setCategory(cat.v)}
                    className={`py-3 rounded-xl text-[12px] font-bold border-[1.5px] transition-all ${
                      category === cat.v
                        ? "gradient-primary text-white border-transparent"
                        : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    {cat.emoji} {cat.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-foreground">
                  Tanggal Mulai <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-foreground">
                  Tanggal Selesai <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate}
                  className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Target Budget */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">
                Target Budget (Rp) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={targetBudget}
                onChange={e => setTargetBudget(e.target.value)}
                placeholder="5000000"
                min="0"
                step="10000"
                className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
                required
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                Total anggaran yang dibutuhkan untuk program ini
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">
                Status Awal <span className="text-destructive">*</span>
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {([
                  { v: "draft", l: "Draft", desc: "Belum dipublikasi" },
                  { v: "active", l: "Aktif", desc: "Langsung aktif" },
                ] as const).map(s => (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => setStatus(s.v)}
                    className={`p-3 rounded-xl text-left border-[1.5px] transition-all ${
                      status === s.v
                        ? "border-primary bg-primary-soft"
                        : "bg-card border-border"
                    }`}
                  >
                    <p className="text-[12px] font-bold text-foreground">{s.l}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-primary-soft border border-primary/15">
              <p className="text-[11px] font-bold text-primary mb-1">💡 Tips</p>
              <p className="text-[11px] text-foreground leading-relaxed">
                Setelah program dibuat, Anda dapat membuat Skema Iuran yang terkait dengan program ini untuk memudahkan pengelolaan keuangan.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Event
              </button>
              <button
                type="button"
                onClick={() => history.back()}
                className="w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
