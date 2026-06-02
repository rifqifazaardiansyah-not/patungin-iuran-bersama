import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { formatRp, recentTx, categories } from "@/lib/mock";
import { Download, ChevronDown, X, FileSpreadsheet, FileText, BarChart3, List, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/laporan")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: LaporanPage,
});

function pctColor(p: number) {
  if (p >= 80) return { text: "text-success", bg: "bg-success-soft", bar: "bg-success" };
  if (p >= 50) return { text: "text-warning", bg: "bg-warning-soft", bar: "bg-warning" };
  return { text: "text-destructive", bg: "bg-destructive-soft", bar: "bg-destructive" };
}

function kindStyle(kind: string) {
  if (kind === "event") return { dot: "bg-partial", soft: "bg-partial-soft", text: "text-partial" };
  if (kind === "done") return { dot: "bg-success", soft: "bg-success-soft", text: "text-success" };
  return { dot: "bg-primary", soft: "bg-primary-soft", text: "text-primary" };
}

function LaporanPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [view, setView] = useState<"list" | "chart">("list");
  const [jenis, setJenis] = useState<"all" | "rutin" | "event">("all");
  const [jenisOpen, setJenisOpen] = useState(false);

  const filtered = useMemo(() => {
    if (jenis === "all") return categories;
    if (jenis === "rutin") return categories.filter(c => c.kind !== "event");
    return categories.filter(c => c.kind === "event");
  }, [jenis]);

  // NEW: Demo export handler (V1.1)
  const handleExport = (type: "excel" | "pdf") => {
    setExportOpen(false);
    toast.loading(`Menyiapkan ${type.toUpperCase()}...`, { duration: 1500 });
    
    setTimeout(() => {
      toast.success(
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Export Berhasil!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Laporan_{type}_{new Date().getTime()}.{type === "excel" ? "xlsx" : "pdf"}
            </p>
          </div>
        </div>,
        { duration: 3000 }
      );
    }, 1500);
  };

  const stats = [
    { l: "Total Terkumpul", v: formatRp(2150000), c: "from-primary to-primary-light" },
    { l: "Target Iuran",    v: formatRp(3200000), c: "from-success to-emerald-400" },
    { l: "Total Transaksi", v: "24",              c: "from-warning to-amber-400" },
    { l: "Periode Aktif",   v: "Mei 2025",        c: "from-partial to-violet-400" },
  ];

  const maxTarget = Math.max(...filtered.map(c => c.target));

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <h1 className="text-xl font-extrabold text-foreground">Laporan Keuangan</h1>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-2xl p-4 text-white card-shadow bg-gradient-to-br ${s.c}`}>
              <p className="text-[10px] text-white/80 font-medium">{s.l}</p>
              <p className="mt-1.5 text-base font-extrabold leading-tight">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-5 flex gap-2">
          <button className="flex-1 h-11 px-3 rounded-xl bg-card border border-border text-[12px] font-semibold text-foreground inline-flex items-center justify-between">
            Bulan ini <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="relative flex-1">
            <button onClick={() => setJenisOpen(o => !o)} className="w-full h-11 px-3 rounded-xl bg-card border border-border text-[12px] font-semibold text-foreground inline-flex items-center justify-between">
              {jenis === "all" ? "Semua Jenis" : jenis === "rutin" ? "Iuran Rutin" : "Patungan Event"}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {jenisOpen && (
              <div className="absolute z-10 mt-1 left-0 right-0 bg-card border border-border rounded-xl card-shadow overflow-hidden">
                {([["all","Semua"],["rutin","Iuran Rutin saja"],["event","Patungan Event saja"]] as const).map(([k,l]) => (
                  <button key={k} onClick={() => { setJenis(k); setJenisOpen(false); }} className="w-full text-left px-3 py-2.5 text-[12px] font-semibold text-foreground hover:bg-secondary">{l}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setExportOpen(true)} className="h-11 w-11 rounded-xl gradient-primary grid place-items-center text-white">
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Rekap per Kategori */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Rekap per Kategori</p>
          <div className="flex items-center bg-secondary rounded-xl p-1">
            <button onClick={() => setView("list")} className={`w-8 h-7 rounded-lg grid place-items-center ${view === "list" ? "bg-card card-shadow text-primary" : "text-muted-foreground"}`}>
              <List className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setView("chart")} className={`w-8 h-7 rounded-lg grid place-items-center ${view === "chart" ? "bg-card card-shadow text-primary" : "text-muted-foreground"}`}>
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="mt-3 space-y-3">
            {filtered.map(cat => {
              const pct = Math.round((cat.collected / cat.target) * 100);
              const pc = pctColor(pct);
              const ks = kindStyle(cat.kind);
              return (
                <Link key={cat.id} to="/laporan/$catId" params={{ catId: cat.id }} className="block bg-card rounded-2xl border border-border card-shadow p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${ks.soft} grid place-items-center shrink-0`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${ks.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-extrabold text-foreground leading-tight">{cat.name}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${pc.bg} ${pc.text}`}>{pct}%</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{cat.paidMembers} / {cat.totalMembers} anggota sudah bayar</p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <p className="text-[12px] font-bold text-primary">{formatRp(cat.collected)}</p>
                        <p className="text-[11px] text-muted-foreground">Target: {formatRp(cat.target)}</p>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${pc.bar} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div className="mt-2.5 flex items-center justify-end text-[11px] font-semibold text-primary">
                        Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 bg-card rounded-2xl border border-border card-shadow p-4">
            <div className="space-y-3.5">
              {filtered.map(cat => {
                const pct = Math.round((cat.collected / cat.target) * 100);
                const ks = kindStyle(cat.kind);
                const wTotal = (cat.target / maxTarget) * 100;
                const wCollected = (cat.collected / maxTarget) * 100;
                return (
                  <Link key={cat.id} to="/laporan/$catId" params={{ catId: cat.id }} className="block">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-bold text-foreground truncate max-w-[60%]">{cat.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatRp(cat.collected)} / {formatRp(cat.target)}</p>
                    </div>
                    <div className="relative h-3.5 bg-secondary rounded-full overflow-hidden" style={{ width: `${wTotal}%` }}>
                      <div className={`absolute inset-y-0 left-0 ${ks.dot} rounded-full`} style={{ width: `${(wCollected / wTotal) * 100}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Iuran Rutin</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-partial" />Event</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" />Selesai</span>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm font-bold text-foreground">Riwayat Transaksi</p>
        <div className="mt-2.5 space-y-2.5">
          {[...recentTx, ...recentTx].map((tx, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border card-shadow p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft grid place-items-center text-primary font-extrabold text-xs">{tx.type[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{tx.name}</p>
                <p className="text-[11px] text-muted-foreground">{tx.type} · {tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-extrabold text-foreground">{formatRp(tx.amount)}</p>
                <div className="mt-1"><StatusBadge status={tx.status} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-navy text-white flex items-center justify-between">
          <p className="text-[12px] text-white/70 font-medium">Total Bulan Ini</p>
          <p className="text-base font-extrabold">{formatRp(2150000)}</p>
        </div>
      </div>

      {exportOpen && (
        <div className="fixed inset-0 z-20 sm:absolute" onClick={() => setExportOpen(false)}>
          <div className="absolute inset-0 bg-navy/40" />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-extrabold text-foreground">Export Laporan</p>
              <button onClick={() => setExportOpen(false)} className="w-9 h-9 rounded-full bg-secondary grid place-items-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2.5">
              <button onClick={() => handleExport("excel")} className="w-full p-4 rounded-2xl border border-border flex items-center gap-3 hover:bg-secondary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-success-soft grid place-items-center"><FileSpreadsheet className="w-5 h-5 text-success" /></div>
                <div className="text-left flex-1">
                  <p className="text-[13px] font-bold text-foreground">Export Excel</p>
                  <p className="text-[11px] text-muted-foreground">Format .xlsx untuk diolah lebih lanjut</p>
                </div>
              </button>
              <button onClick={() => handleExport("pdf")} className="w-full p-4 rounded-2xl border border-border flex items-center gap-3 hover:bg-secondary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-destructive-soft grid place-items-center"><FileText className="w-5 h-5 text-destructive" /></div>
                <div className="text-left flex-1">
                  <p className="text-[13px] font-bold text-foreground">Export PDF</p>
                  <p className="text-[11px] text-muted-foreground">Format .pdf untuk dicetak</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
