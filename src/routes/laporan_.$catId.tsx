import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { categories, formatRp, initials } from "@/lib/mock";
import { ArrowLeft, Bell, Send } from "lucide-react";

export const Route = createFileRoute("/laporan_/$catId")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: DetailKategoriPage,
});

function DetailKategoriPage() {
  const { catId } = useParams({ from: "/laporan/$catId" });
  const cat = categories.find(c => c.id === catId) || categories[0];
  const [tab, setTab] = useState<"paid" | "unpaid">("paid");
  const pct = Math.round((cat.collected / cat.target) * 100);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="px-5 pt-5 pb-6 bg-gradient-to-br from-navy to-primary text-white rounded-b-3xl">
          <div className="flex items-center gap-3">
            <Link to="/laporan" className="w-9 h-9 rounded-full bg-white/15 grid place-items-center">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="text-sm font-bold">Detail Kategori</p>
          </div>

          <div className="mt-5">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold">{cat.typeLabel}</span>
            <p className="mt-2 text-lg font-extrabold leading-tight">{cat.name}</p>
            <p className="mt-0.5 text-[11px] text-white/70">{cat.period}</p>

            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-xl font-extrabold">{formatRp(cat.collected)}</p>
              <p className="text-[11px] text-white/70">dari {formatRp(cat.target)}</p>
            </div>
            <div className="mt-2 h-2 w-full bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-white/80 font-semibold">{pct}% terkumpul · {cat.paidMembers}/{cat.totalMembers} anggota</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mt-5">
          <div className="flex bg-secondary rounded-xl p-1">
            <button onClick={() => setTab("paid")} className={`flex-1 h-9 rounded-lg text-[12px] font-bold ${tab === "paid" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"}`}>
              Sudah Bayar ({cat.paid.length})
            </button>
            <button onClick={() => setTab("unpaid")} className={`flex-1 h-9 rounded-lg text-[12px] font-bold ${tab === "unpaid" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"}`}>
              Belum Bayar ({cat.unpaid.length})
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 mt-3 pb-32">
          {tab === "paid" ? (
            <div className="space-y-2.5">
              {cat.paid.length === 0 && (
                <p className="text-center text-[12px] text-muted-foreground py-10">Belum ada pembayaran.</p>
              )}
              {cat.paid.map(m => (
                <div key={m.id} className="bg-card rounded-2xl border border-border card-shadow p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-soft text-primary grid place-items-center text-xs font-extrabold">{initials(m.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">{m.date} · {m.method}</p>
                  </div>
                  <p className="text-[13px] font-extrabold text-success">{formatRp(m.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {cat.unpaid.length === 0 && (
                <p className="text-center text-[12px] text-muted-foreground py-10">Semua anggota sudah membayar 🎉</p>
              )}
              {cat.unpaid.map(m => (
                <div key={m.id} className="bg-card rounded-2xl border border-border card-shadow p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive-soft text-destructive grid place-items-center text-xs font-extrabold">{initials(m.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{m.name}</p>
                    <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-destructive-soft text-destructive text-[10px] font-bold">Belum Bayar</span>
                  </div>
                  <button className="h-8 px-3 rounded-lg bg-primary-soft text-primary text-[11px] font-bold inline-flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" /> Ingatkan
                  </button>
                </div>
              ))}
              {cat.unpaid.length > 0 && (
                <button className="w-full h-11 mt-2 rounded-xl gradient-primary text-white text-[13px] font-bold inline-flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Kirim Pengingat ke Semua
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground font-medium">Total terkumpul kategori ini</p>
          <p className="text-base font-extrabold text-primary">{formatRp(cat.collected)}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}
