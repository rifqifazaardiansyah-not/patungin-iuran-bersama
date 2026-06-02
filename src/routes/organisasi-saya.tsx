import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { organizations, formatRp, initials } from "@/lib/mock";
import { Building2, Users, Wallet, ChevronRight, Crown, Plus, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/organisasi-saya")({
  beforeLoad: createProtectedRouteGuard(),
  component: OrganisasiSayaPage,
});

const orgTypeLabels = {
  kampus: "Organisasi Kampus",
  ukm: "Unit Kegiatan Mahasiswa",
  bem: "BEM",
  komunitas: "Komunitas",
  panitia: "Panitia Event",
};

const orgTypeColors = {
  kampus: { bg: "bg-primary-soft", text: "text-primary", icon: "bg-primary" },
  ukm: { bg: "bg-success-soft", text: "text-success", icon: "bg-success" },
  bem: { bg: "bg-warning-soft", text: "text-warning", icon: "bg-warning" },
  komunitas: { bg: "bg-partial-soft", text: "text-partial", icon: "bg-partial" },
  panitia: { bg: "bg-destructive-soft", text: "text-destructive", icon: "bg-destructive" },
};

function OrganisasiSayaPage() {
  const active = organizations.filter(o => o.isActive);
  const myActiveOrg = active.find(o => o.id === "hmti-2025");

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Organisasi Saya</h1>
          <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold">
            {active.length} Aktif
          </span>
        </div>

        {/* Current Active Organization */}
        {myActiveOrg && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-[11px] font-bold text-success uppercase tracking-wider">Organisasi Aktif Sekarang</p>
            </div>
            <div className="rounded-2xl gradient-navy p-5 text-white card-shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -right-6 -bottom-12 w-28 h-28 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <h3 className="text-lg font-extrabold">{myActiveOrg.name}</h3>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1">{orgTypeLabels[myActiveOrg.type]} · {myActiveOrg.period}</p>
                  </div>
                  {myActiveOrg.role === "bendahara" && (
                    <div className="px-2.5 py-1 rounded-lg bg-warning text-white text-[10px] font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" /> BENDAHARA
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      <Wallet className="w-3.5 h-3.5" />
                      <p className="text-[10px] font-medium">Saldo Organisasi</p>
                    </div>
                    <p className="text-[15px] font-extrabold">{formatRp(myActiveOrg.balance)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <p className="text-[10px] font-medium">Total Anggota</p>
                    </div>
                    <p className="text-[15px] font-extrabold">{myActiveOrg.memberCount}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-white/10">
                  <div className="flex items-center gap-2">
                    {myActiveOrg.duesStatus === "paid" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <p className="text-[12px] font-semibold">Iuran Kamu Lunas</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <p className="text-[12px] font-semibold">Iuran Belum Lunas</p>
                      </>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Organizations List */}
        <div className="mt-6">
          <p className="text-sm font-bold text-foreground mb-3">Semua Organisasi ({active.length})</p>
          <div className="space-y-2.5">
            {active.map(org => {
              const colors = orgTypeColors[org.type];
              const isActive = org.id === myActiveOrg?.id;

              return (
                <button
                  key={org.id}
                  className={`w-full text-left bg-card rounded-2xl border ${isActive ? "border-primary/30 ring-2 ring-primary/10" : "border-border"} card-shadow p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} grid place-items-center shrink-0 text-[13px] font-extrabold ${colors.text}`}>
                      {initials(org.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <p className="text-[13px] font-extrabold text-foreground truncate">{org.name}</p>
                          <p className="text-[11px] text-muted-foreground">{orgTypeLabels[org.type]}</p>
                        </div>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md bg-success text-white text-[9px] font-bold">AKTIF</span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {org.memberCount} anggota
                        </span>
                        {org.role === "bendahara" && (
                          <span className="flex items-center gap-1 text-warning font-semibold">
                            <Crown className="w-3.5 h-3.5" />
                            Bendahara
                          </span>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Saldo</p>
                          <p className="text-[12px] font-bold text-foreground">{formatRp(org.balance)}</p>
                        </div>
                        {!isActive && (
                          <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold">
                            Buka
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Join New Organization */}
        <button className="mt-4 w-full p-4 rounded-2xl border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center gap-2 text-primary hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" />
          <span className="text-sm font-bold">Gabung Organisasi Baru</span>
        </button>

        {/* Info Card */}
        <div className="mt-4 p-4 rounded-2xl bg-primary-soft border border-primary/15">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white grid place-items-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-foreground">Kelola Banyak Organisasi</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Upgrade ke Pro untuk mengelola hingga 5 organisasi sekaligus dengan fitur lengkap.
              </p>
              <button className="mt-2 text-[11px] font-bold text-primary">
                Lihat Paket Pro →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
