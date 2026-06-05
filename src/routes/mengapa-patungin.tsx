import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { campusStats, formatRp } from "@/lib/mock";
import { 
  TrendingUp, Target, Users, Building2, Zap, Shield, 
  LineChart, MessageSquare, Crown, CheckCircle2, ArrowRight 
} from "lucide-react";

export const Route = createFileRoute("/mengapa-patungin")({
  beforeLoad: createProtectedRouteGuard(),
  component: MengapaPatunginPage,
});

function MengapaPatunginPage() {
  return (
    <AppShell>
      <div className="pb-6">
        {/* Hero Section - Non-overlapping */}
        <div className="gradient-navy px-5 pt-8 pb-6 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-[11px] font-bold mb-4">
              <Zap className="w-3.5 h-3.5" />
              Platform Iuran Digital #1
            </div>
            <h1 className="text-2xl font-extrabold leading-tight">
              Revolusi Pengelolaan
              <br />Iuran Organisasi
            </h1>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Transparansi penuh, efisiensi maksimal, dan kontrol total untuk setiap organisasi
            </p>
          </div>
        </div>

        <div className="px-5 mt-4">{/* Positive margin */}
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center mb-2">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-extrabold text-foreground">{campusStats.totalOrganizations}+</p>
              <p className="text-[11px] text-muted-foreground">Organisasi Aktif</p>
            </div>
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <div className="w-9 h-9 rounded-xl bg-success-soft grid place-items-center mb-2">
                <Users className="w-4 h-4 text-success" />
              </div>
              <p className="text-xl font-extrabold text-foreground">{campusStats.totalMembers.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Pengguna</p>
            </div>
          </div>

          {/* Problem Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-destructive-soft grid place-items-center">
                <MessageSquare className="w-4 h-4 text-destructive" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground">Masalah yang Kami Selesaikan</h2>
            </div>
            <div className="space-y-2.5">
              {[
                "Pencatatan iuran masih manual di spreadsheet atau buku",
                "Sulit tracking siapa yang sudah/belum bayar",
                "Tidak ada transparansi penggunaan dana",
                "Reminder pembayaran dilakukan manual via broadcast",
                "Laporan keuangan memakan waktu lama",
                "Rawan kesalahan pencatatan dan kehilangan data",
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive-soft border border-destructive/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0 mt-1.5" />
                  <p className="text-[12px] text-foreground leading-relaxed">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-success-soft grid place-items-center">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground">Solusi Patungin</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: Zap, title: "Automasi Penuh", desc: "Sistem mencatat dan melacak semua pembayaran otomatis" },
                { icon: Shield, title: "Transparansi Real-time", desc: "Semua anggota bisa lihat status iuran dan penggunaan dana" },
                { icon: LineChart, title: "Laporan Instan", desc: "Export laporan lengkap dalam hitungan detik" },
                { icon: MessageSquare, title: "Reminder Otomatis", desc: "WhatsApp & email reminder terjadwal tanpa manual" },
              ].map((solution, i) => {
                const Icon = solution.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-card border border-border card-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-soft grid place-items-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-extrabold text-foreground">{solution.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{solution.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Market */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-soft grid place-items-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground">Target Pasar</h2>
            </div>
            
            {/* B2C Segment */}
            <div className="mb-3">
              <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">B2C - Organisasi & Komunitas</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Organisasi Kampus", icon: "🎓", color: "primary" },
                  { label: "UKM & Himpunan", icon: "🏛️", color: "success" },
                  { label: "BEM & ORMAWA", icon: "👥", color: "warning" },
                  { label: "Komunitas", icon: "🤝", color: "partial" },
                  { label: "Panitia Event", icon: "🎉", color: "destructive" },
                  { label: "Lembaga Kampus", icon: "🏫", color: "primary" },
                ].map((market, i) => (
                  <div key={i} className={`p-3 rounded-xl bg-${market.color}-soft border border-${market.color}/10 text-center`}>
                    <div className="text-2xl mb-1">{market.icon}</div>
                    <p className="text-[11px] font-bold text-foreground">{market.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* B2B/Enterprise Segment */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">B2B - Enterprise</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Universitas", icon: "🏛️", color: "primary", desc: "Kelola ratusan organisasi" },
                  { label: "Yayasan", icon: "🏢", color: "success", desc: "Multi lembaga" },
                  { label: "Koperasi", icon: "🏦", color: "warning", desc: "Iuran anggota besar" },
                  { label: "Perusahaan", icon: "🏭", color: "partial", desc: "Employee contributions" },
                ].map((market, i) => (
                  <div key={i} className={`p-3 rounded-xl bg-${market.color}-soft border border-${market.color}/10`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xl">{market.icon}</div>
                      <p className="text-[11px] font-bold text-foreground flex-1">{market.label}</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground">{market.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Model */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-warning-soft grid place-items-center">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground">Model Bisnis</h2>
            </div>
            <div className="space-y-2.5">
              <div className="p-4 rounded-2xl bg-card border border-border card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <p className="text-[13px] font-extrabold text-foreground">Freemium Model</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Gratis untuk organisasi kecil (hingga 30 anggota), upgrade untuk fitur premium
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-card border border-border card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-success" />
                  <p className="text-[13px] font-extrabold text-foreground">Subscription (B2C)</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Rp79.000/bulan - pricing berbasis kapasitas (anggota, program, skema iuran)
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-card border border-border card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-warning" />
                  <p className="text-[13px] font-extrabold text-foreground">Enterprise License (B2B)</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Custom pricing untuk kampus - kelola ratusan organisasi dengan dashboard terpusat
                </p>
              </div>
            </div>
            
            {/* NEW: Workspace Model Explanation */}
            <div className="mt-3 p-3.5 rounded-xl bg-primary-soft border border-primary/20">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-primary">Model Workspace</p>
                  <p className="text-[11px] text-foreground mt-1">
                    1 Organisasi = 1 Workspace. Kami tidak menjual jumlah organisasi, tapi kapasitas dan kemampuan pengelolaan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Traction */}
          <div className="mb-6 rounded-2xl gradient-primary p-5 text-white card-shadow-lg">
            <h3 className="text-base font-extrabold mb-3">Traction Saat Ini</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-[12px] text-white/80">Total Transaksi Diproses</span>
                <span className="text-sm font-bold">{formatRp(campusStats.totalBalance)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-[12px] text-white/80">Organisasi Aktif</span>
                <span className="text-sm font-bold">{campusStats.activeOrganizations} organisasi</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[12px] text-white/80">Retention Rate</span>
                <span className="text-sm font-bold">94%</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2.5">
            <button className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
              Mulai Gunakan Patungin <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-sm">
              Lihat Demo Lengkap
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 rounded-xl bg-secondary border border-border text-center">
            <p className="text-[11px] text-muted-foreground">
              Tertarik untuk investasi atau kemitraan?
              <br />
              <button className="font-bold text-primary mt-1">Hubungi Tim Kami</button>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
