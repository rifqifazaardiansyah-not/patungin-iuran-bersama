import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { formatRp, recentTx } from "@/lib/mock";
import { Download, ChevronDown, X, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/laporan")({
  component: LaporanPage,
});

function LaporanPage() {
  const [exportOpen, setExportOpen] = useState(false);

  const stats = [
    { l: "Total Terkumpul", v: formatRp(2150000), c: "from-primary to-primary-light" },
    { l: "Target Iuran",    v: formatRp(3200000), c: "from-success to-emerald-400" },
    { l: "Total Transaksi", v: "24",              c: "from-warning to-amber-400" },
    { l: "Periode Aktif",   v: "Mei 2025",        c: "from-partial to-violet-400" },
  ];

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

        <div className="mt-5 flex gap-2">
          <button className="flex-1 h-11 px-3 rounded-xl bg-card border border-border text-[12px] font-semibold text-foreground inline-flex items-center justify-between">
            Bulan ini <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="flex-1 h-11 px-3 rounded-xl bg-card border border-border text-[12px] font-semibold text-foreground inline-flex items-center justify-between">
            Semua Jenis <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setExportOpen(true)} className="h-11 w-11 rounded-xl gradient-primary grid place-items-center text-white">
            <Download className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-5 text-sm font-bold text-foreground">Riwayat Transaksi</p>
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
              <button className="w-full p-4 rounded-2xl border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-soft grid place-items-center"><FileSpreadsheet className="w-5 h-5 text-success" /></div>
                <div className="text-left flex-1">
                  <p className="text-[13px] font-bold text-foreground">Export Excel</p>
                  <p className="text-[11px] text-muted-foreground">Format .xlsx untuk diolah lebih lanjut</p>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl border border-border flex items-center gap-3">
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
