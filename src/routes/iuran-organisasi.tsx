import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { skemaIuran, formatRp } from "@/lib/mock";
import { Coins, Users, ChevronRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/iuran-organisasi")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: IuranOrganisasiPage,
});

function IuranOrganisasiPage() {
  const organizationSkema = skemaIuran.filter(s => s.targetType === "organization");
  
  const stats = {
    total: organizationSkema.length,
    active: organizationSkema.filter(s => s.status === "active").length,
    totalTarget: organizationSkema.reduce((sum, s) => sum + s.target, 0),
    totalCollected: organizationSkema.reduce((sum, s) => sum + s.collected, 0),
  };

  const collectionRate = stats.totalTarget > 0 
    ? Math.round((stats.totalCollected / stats.totalTarget) * 100) 
    : 0;

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-24">
        <h1 className="text-xl font-extrabold text-foreground">Iuran Organisasi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola iuran rutin dan umum organisasi</p>

        {/* Stats Overview */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center mb-2">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-extrabold text-foreground">{stats.total}</p>
            <p className="text-[11px] text-muted-foreground font-medium">Total Jenis Iuran</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <div className="w-9 h-9 rounded-xl bg-success-soft grid place-items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-lg font-extrabold text-foreground">{stats.active}</p>
            <p className="text-[11px] text-muted-foreground font-medium">Jenis Aktif</p>
          </div>
        </div>

        {/* Collection Summary */}
        <div className="mt-4 bg-card rounded-2xl border border-border card-shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Total Terkumpul</p>
            <span className="px-2.5 py-1 rounded-full bg-success-soft text-success text-[11px] font-bold">
              {collectionRate}%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mb-2">{formatRp(stats.totalCollected)}</p>
          <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-emerald-300 rounded-full"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Target: {formatRp(stats.totalTarget)} · Sisa {formatRp(stats.totalTarget - stats.totalCollected)}
          </p>
        </div>

        {/* Organization Dues List */}
        <div className="mt-6">
          <h2 className="text-sm font-bold text-foreground mb-3">Daftar Iuran</h2>
          <div className="space-y-2.5">
            {organizationSkema.map(skema => {
              const progress = skema.target > 0 
                ? Math.round((skema.collected / skema.target) * 100) 
                : 0;
              
              return (
                <Link
                  key={skema.id}
                  to="/laporan/$catId"
                  params={{ catId: skema.id }}
                  className="block bg-card rounded-2xl border border-border card-shadow p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-[14px] font-bold text-foreground">{skema.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{skema.period}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      skema.status === "active" 
                        ? "bg-success-soft text-success" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {skema.status === "active" ? "Aktif" : "Selesai"}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-baseline justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">
                        {skema.paidMembers} / {skema.totalMembers} anggota
                      </span>
                      <span className="font-bold text-foreground">
                        {formatRp(skema.collected)} / {formatRp(skema.target)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Members Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {skema.totalMembers} anggota terdaftar
                    </div>
                    <div className="flex items-center text-[11px] text-primary font-bold">
                      Kelola <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {organizationSkema.length === 0 && (
          <div className="mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary grid place-items-center mx-auto">
              <Coins className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">Belum ada iuran organisasi</p>
            <p className="text-[11px] text-muted-foreground">
              Buat iuran rutin pertama untuk organisasi
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
