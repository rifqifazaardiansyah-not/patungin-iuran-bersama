import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { members, group, initials, PaymentStatus } from "@/lib/mock";
import { Plus, Search, Copy, Lock, X, Bell, Trash2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/anggota")({
  component: AnggotaPage,
});

const filters: { v: "all" | PaymentStatus; l: string }[] = [
  { v: "all", l: "Semua" },
  { v: "paid", l: "Sudah Bayar" },
  { v: "unpaid", l: "Belum Bayar" },
  { v: "partial", l: "Sebagian" },
  { v: "late", l: "Terlambat" },
];

function AnggotaPage() {
  const [filter, setFilter] = useState<typeof filters[number]["v"]>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const list = members.filter(m =>
    (filter === "all" || m.status === filter) &&
    (q === "" || m.name.toLowerCase().includes(q.toLowerCase()))
  );

  const open = members.find(m => m.id === openId);

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Manajemen Anggota</h1>
          <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold">{members.length}</span>
        </div>

        {/* Group code banner */}
        <div className="mt-4 rounded-2xl bg-primary-soft border border-primary/15 p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <p className="text-[11px] text-primary font-bold">KODE GRUP</p>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-xl font-extrabold text-foreground tracking-wider">{group.code}</p>
            <button className="w-9 h-9 rounded-xl bg-card border border-border grid place-items-center">
              <Copy className="w-4 h-4 text-primary" />
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Bagikan kode ini agar anggota bisa join sendiri.</p>
        </div>

        {/* Pending requests */}
        <div className="mt-3 rounded-2xl bg-warning-soft border border-warning/20 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-warning text-white grid place-items-center font-extrabold text-sm">2</div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-foreground">Permintaan join menunggu persetujuan</p>
            <p className="text-[11px] text-muted-foreground">Tap untuk meninjau & menyetujui</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Cari anggota..."
            className="w-full h-12 pl-10 pr-3 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {/* Filter chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border ${
                filter === f.v ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"
              }`}
            >{f.l}</button>
          ))}
        </div>

        {/* List */}
        <div className="mt-4 space-y-2.5">
          {list.map(m => (
            <button
              key={m.id}
              onClick={() => setOpenId(m.id)}
              className="w-full text-left bg-card rounded-2xl border border-border card-shadow p-3.5 flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-full gradient-primary text-white grid place-items-center text-[12px] font-extrabold shrink-0">
                {initials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{m.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">NIM {m.nim} · {m.phone}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {m.lastPaid ? `Terakhir bayar: ${m.lastPaid}` : "Belum bayar"}
                </p>
              </div>
              <StatusBadge status={m.status} />
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <Link to="/anggota" className="fixed bottom-24 right-6 sm:right-[calc(50%-180px)] w-14 h-14 rounded-full gradient-primary text-white grid place-items-center card-shadow-lg z-10">
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </Link>

      {/* Bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-20 sm:absolute" onClick={() => setOpenId(null)}>
          <div className="absolute inset-0 bg-navy/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-5 pb-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full gradient-primary text-white grid place-items-center text-base font-extrabold">{initials(open.name)}</div>
              <div className="flex-1">
                <p className="text-base font-extrabold text-foreground">{open.name}</p>
                <p className="text-[11px] text-muted-foreground">Anggota · NIM {open.nim}</p>
              </div>
              <button onClick={() => setOpenId(null)} className="w-9 h-9 rounded-full bg-secondary grid place-items-center"><X className="w-4 h-4" /></button>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-bold text-foreground mb-2">Riwayat Pembayaran</p>
              <div className="space-y-2">
                {[
                  { d: "12 Mei 2025", t: "Iuran Bulanan", a: 100000, s: "paid" as PaymentStatus },
                  { d: "12 Apr 2025", t: "Iuran Bulanan", a: 100000, s: "paid" as PaymentStatus },
                  { d: "20 Mar 2025", t: "Iuran Bulanan", a: 100000, s: "late" as PaymentStatus },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-foreground">{h.t}</p>
                      <p className="text-[10px] text-muted-foreground">{h.d}</p>
                    </div>
                    <StatusBadge status={h.s} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button className="w-full py-3 rounded-xl bg-success text-white font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Tandai Sudah Bayar
              </button>
              <button className="w-full py-3 rounded-xl border-[1.5px] border-primary text-primary font-bold text-sm flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" /> Kirim Pengingat
              </button>
              <button className="w-full py-3 rounded-xl border-[1.5px] border-destructive text-destructive font-bold text-sm flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Hapus Anggota
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
