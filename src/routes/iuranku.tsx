import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { createAnggotaOnlyGuard } from "@/lib/route-guards";
import { myDues, formatRp, PaymentStatus } from "@/lib/mock";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/iuranku")({
  beforeLoad: createAnggotaOnlyGuard(),
  component: IurankuPage,
});

const filters: { v: "all" | PaymentStatus; l: string }[] = [
  { v: "all", l: "Semua" },
  { v: "paid", l: "Sudah" },
  { v: "unpaid", l: "Belum" },
  { v: "late", l: "Terlambat" },
];

function IurankuPage() {
  const [filter, setFilter] = useState<typeof filters[number]["v"]>("all");
  const [month, setMonth] = useState("Mei");

  const totalPaid = myDues.filter(d => d.status === "paid").reduce((s, d) => s + d.amount, 0);
  const totalUnpaid = myDues.filter(d => d.status !== "paid").reduce((s, d) => s + d.amount, 0);
  const pct = Math.round((totalPaid / (totalPaid + totalUnpaid)) * 100);

  const list = myDues.filter(d => filter === "all" || d.status === filter);
  const grouped = list.reduce<Record<string, typeof list>>((acc, d) => {
    (acc[d.month] ||= []).push(d); return acc;
  }, {});

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <h1 className="text-xl font-extrabold text-foreground">Rekap Iuran Saya</h1>

        <div className="mt-4 rounded-2xl gradient-navy p-5 text-white card-shadow-lg flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="white" strokeOpacity="0.15" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="#16A34A" strokeWidth="8" fill="none"
                strokeDasharray={`${(pct/100)*201} 201`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-sm font-extrabold">{pct}%</div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-white/60 font-medium">Total Terbayar</p>
            <p className="text-base font-extrabold">{formatRp(totalPaid)}</p>
            <p className="mt-2 text-[10px] text-white/60 font-medium">Total Belum Bayar</p>
            <p className="text-sm font-bold text-warning">{formatRp(totalUnpaid)}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border ${filter === f.v ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"}`}
            >{f.l}</button>
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu"].map(m => (
            <button key={m} onClick={() => setMonth(m)}
              className={`shrink-0 w-12 h-10 rounded-xl text-[11px] font-bold ${month === m ? "gradient-primary text-white" : "bg-card border border-border text-muted-foreground"}`}
            >{m}</button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(grouped).map(([m, items]) => (
            <div key={m}>
              <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">{m}</p>
              <div className="space-y-2.5">
                {items.map(d => (
                  <div key={d.id} className="bg-card rounded-2xl border border-border card-shadow p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-extrabold text-foreground">{d.type}</p>
                        <p className="text-[11px] text-muted-foreground">Jatuh tempo: {d.due}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-extrabold text-foreground">{formatRp(d.amount)}</p>
                        <div className="mt-1"><StatusBadge status={d.status} /></div>
                      </div>
                    </div>
                    {d.status === "paid" ? (
                      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-success-soft text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <p className="text-[11px] font-semibold">Dibayar {d.paidAt} · {d.method}</p>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          <p className="text-[11px] font-semibold">Belum dibayar</p>
                        </div>
                        <Link to="/konfirmasi-bayar" className="px-3.5 py-2 rounded-lg border-[1.5px] border-primary text-primary text-[11px] font-bold">
                          Segera Bayar
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
