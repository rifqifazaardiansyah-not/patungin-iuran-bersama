import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, useRole } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { auth, formatRp, group, recentTx, announcements, initials, myDues } from "@/lib/mock";
import { Plus, Megaphone, Users, BarChart3, Camera, ClipboardList, Building2, CheckCircle2, AlertTriangle, Clock, Wallet, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/home")({
  beforeLoad: createProtectedRouteGuard(),
  component: HomePage,
});

function HomePage() {
  const role = useRole();
  return <AppShell>{role === "bendahara" ? <BendaharaHome /> : <AnggotaHome />}</AppShell>;
}

function BendaharaHome() {
  const name = auth.getName();
  const pct = Math.round((group.collected / group.target) * 100);
  return (
    <div className="pb-4">
      <AppHeader name={name} period={group.period} />

      {/* Active Group Card */}
      <div className="px-5">
        <div className="rounded-2xl gradient-navy p-5 text-white card-shadow-lg overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-6 -bottom-12 w-28 h-28 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-[11px] text-white/60 font-medium">Grup Aktif</p>
            <h3 className="text-lg font-extrabold">{group.name}</h3>
            <p className="text-[11px] text-white/60">Periode {group.period}</p>

            <div className="mt-4">
              <div className="flex items-baseline justify-between text-[12px]">
                <span className="font-bold">{formatRp(group.collected)}</span>
                <span className="text-white/60">/ {formatRp(group.target)}</span>
              </div>
              <div className="mt-2 h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-success to-emerald-300" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-white/70 font-semibold">{pct}% terkumpul</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px]">
              {[
                { c: "bg-success", l: "Sudah" },
                { c: "bg-partial", l: "Sebagian" },
                { c: "bg-destructive", l: "Belum" },
                { c: "bg-warning", l: "Terlambat" },
              ].map(d => (
                <span key={d.l} className="inline-flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${d.c}`} /> {d.l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: CheckCircle2, color: "text-success", bg: "bg-success-soft", n: "18", l: "Sudah Bayar" },
          { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive-soft", n: "9", l: "Belum Bayar" },
          { icon: Clock, color: "text-warning", bg: "bg-warning-soft", n: "5", l: "Terlambat" },
          { icon: Wallet, color: "text-primary", bg: "bg-primary-soft", n: formatRp(2150000), l: "Terkumpul" },
        ].map((s, i) => {
          const Ic = s.icon;
          return (
            <div key={i} className="bg-card rounded-2xl p-3.5 border border-border card-shadow">
              <div className={`w-9 h-9 rounded-xl ${s.bg} grid place-items-center`}>
                <Ic className={`w-[18px] h-[18px] ${s.color}`} />
              </div>
              <p className="mt-2.5 text-[15px] font-extrabold text-foreground leading-tight">{s.n}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{s.l}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5">
        <h4 className="text-sm font-bold text-foreground mb-3">Aksi Cepat</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/transaksi", icon: Plus, label: "Catat Pembayaran", c: "from-primary to-primary-light" },
            { to: "/pengumuman", icon: Megaphone, label: "Kirim Pengumuman", c: "from-warning to-amber-400" },
            { to: "/anggota", icon: Users, label: "Kelola Anggota", c: "from-success to-emerald-400" },
            { to: "/laporan", icon: BarChart3, label: "Lihat Laporan", c: "from-partial to-violet-400" },
          ].map((a, i) => {
            const Ic = a.icon;
            return (
              <Link key={i} to={a.to} className="bg-card rounded-2xl p-4 border border-border card-shadow flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.c} grid place-items-center`}>
                  <Ic className="w-5 h-5 text-white" />
                </div>
                <p className="text-[12px] font-bold text-foreground leading-tight">{a.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">Transaksi Terbaru</h4>
          <Link to="/transaksi" className="text-[11px] text-primary font-bold inline-flex items-center">Lihat Semua <ChevronRight className="w-3 h-3" /></Link>
        </div>
        <div className="bg-card rounded-2xl border border-border card-shadow divide-y divide-border">
          {recentTx.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-3.5">
              <div className="w-9 h-9 rounded-full gradient-primary text-white grid place-items-center text-[11px] font-bold">{initials(tx.name)}</div>
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
      </div>

      {/* Last announcement */}
      <div className="px-5 mt-6">
        <h4 className="text-sm font-bold text-foreground mb-3">Pengumuman Terakhir</h4>
        <div className="bg-card rounded-2xl border border-border card-shadow p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft grid place-items-center shrink-0">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-foreground">{announcements[0].title}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{announcements[0].body}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5">{announcements[0].date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnggotaHome() {
  const name = auth.getName();
  const myStatus = myDues[0]; // current month
  const pct = Math.round((group.collected / group.target) * 100);

  return (
    <div className="pb-4">
      <AppHeader name={name} period={group.period} />

      {/* My status */}
      <div className="px-5">
        <div className="rounded-2xl gradient-primary p-5 text-white card-shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <p className="text-[11px] text-white/80 font-medium relative">Status Iuranmu Bulan Ini</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-destructive text-[12px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> BELUM BAYAR
          </div>
          <p className="mt-3 text-sm font-bold">{group.name}</p>
          <p className="text-[11px] text-white/80">{myStatus.type} · {formatRp(myStatus.amount)}</p>
          <div className="mt-3 p-2.5 rounded-lg bg-white/15 backdrop-blur-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-[11px] font-medium">Segera bayar sebelum {myStatus.due}</p>
          </div>
        </div>
      </div>

      {/* Group summary */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-2xl border border-border card-shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] font-extrabold text-foreground">{group.name}</p>
              <p className="text-[11px] text-muted-foreground">{group.code} · {group.memberCount} anggota</p>
            </div>
            <Link to="/info-grup" className="text-[11px] text-primary font-bold">Detail</Link>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full gradient-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground"><span className="font-bold text-foreground">{formatRp(group.collected)}</span> terkumpul dari {formatRp(group.target)}</p>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="mt-4 pl-5 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { to: "/konfirmasi-bayar", icon: Camera, label: "Konfirmasi Bayar" },
          { to: "/iuranku", icon: ClipboardList, label: "Rekap Iuranku" },
          { to: "/notifikasi", icon: Megaphone, label: "Pengumuman" },
          { to: "/info-grup", icon: Building2, label: "Info Grup" },
        ].map((c, i) => {
          const Ic = c.icon;
          return (
            <Link key={i} to={c.to} className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-card border border-border card-shadow text-[12px] font-bold text-foreground">
              <Ic className="w-4 h-4 text-primary" /> {c.label}
            </Link>
          );
        })}
        <div className="w-2 shrink-0" />
      </div>

      {/* Announcements feed */}
      <div className="px-5 mt-6">
        <h4 className="text-sm font-bold text-foreground mb-3">Pengumuman Terbaru</h4>
        <div className="space-y-2.5">
          {announcements.map(a => (
            <div key={a.id} className={`bg-card rounded-2xl border ${a.priority === "important" ? "border-destructive/30" : "border-border"} card-shadow p-4 flex gap-3`}>
              <div className={`w-10 h-10 rounded-xl ${a.priority === "important" ? "bg-destructive-soft" : "bg-primary-soft"} grid place-items-center shrink-0`}>
                <Megaphone className={`w-5 h-5 ${a.priority === "important" ? "text-destructive" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-bold text-foreground">{a.title}</p>
                  {a.priority === "important" && <span className="px-1.5 py-0.5 rounded-md bg-destructive text-white text-[9px] font-bold">PENTING</span>}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
