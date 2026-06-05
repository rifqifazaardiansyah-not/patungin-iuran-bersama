import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { group, formatRp, programKerja } from "@/lib/mock";
import { ChevronLeft, Copy, Share2, QrCode, Building2, FolderOpen, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/info-grup")({
  beforeLoad: createProtectedRouteGuard(),
  component: InfoGrupPage,
});

function InfoGrupPage() {
  const activePrograms = programKerja.filter(p => p.status === "active" && p.organizationId === "hmti-2025");
  
  return (
    <PhoneFrame>
      <div className="pb-8">
        <div className="gradient-navy px-5 pt-6 pb-6 text-white">{/* Non-overlapping */}
          <button onClick={() => history.back()} className="w-10 h-10 rounded-full bg-white/15 grid place-items-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="mt-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-primary grid place-items-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-lg font-extrabold">{group.name}</p>
            <p className="text-[11px] text-white/70">{group.institution}</p>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-3">{/* Positive margin */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 grid grid-cols-2 gap-3">
            {[
              { l: "Program", v: group.program },
              { l: "Periode", v: group.period },
              { l: "Bendahara", v: group.bendahara },
              { l: "Anggota", v: `${group.memberCount} orang` },
            ].map((r, i) => (
              <div key={i}>
                <p className="text-[10px] text-muted-foreground font-medium">{r.l}</p>
                <p className="text-[12px] font-bold text-foreground">{r.v}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-4">
            <p className="text-[11px] text-primary font-bold">KODE ORGANISASI</p>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-2xl font-extrabold text-foreground tracking-wider">{group.code}</p>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-xl bg-secondary grid place-items-center"><Copy className="w-4 h-4 text-primary" /></button>
                <button className="w-9 h-9 rounded-xl gradient-primary grid place-items-center"><Share2 className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </div>

          {/* NEW: Event Aktif (V2.0) */}
          {activePrograms.length > 0 && (
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <p className="text-[12px] font-bold text-foreground">Event Aktif</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-success-soft text-success text-[10px] font-bold">
                  {activePrograms.length} Program
                </span>
              </div>
              <div className="space-y-2">
                {activePrograms.slice(0, 3).map(prog => {
                  const progress = prog.targetBudget > 0 ? Math.round((prog.collectedBudget / prog.targetBudget) * 100) : 0;
                  return (
                    <div key={prog.id} className="p-3 rounded-xl bg-secondary">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-[12px] font-bold text-foreground flex-1">{prog.name}</p>
                        <span className="text-[10px] font-bold text-primary">{progress}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {formatRp(prog.collectedBudget)} / {formatRp(prog.targetBudget)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {activePrograms.length > 3 && (
                <button className="mt-2 w-full text-center text-[11px] font-bold text-primary inline-flex items-center justify-center gap-1">
                  Lihat Semua Program <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border card-shadow p-4">
            <p className="text-[12px] font-bold text-foreground mb-3">Iuran Aktif</p>
            <div className="space-y-2">
              {group.duesTypes.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{d.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatRp(d.amount)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${d.status === "Aktif" ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground border border-border"}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-4">
            <p className="text-[12px] font-bold text-foreground mb-3">Rekening Pembayaran</p>
            <div className="space-y-2">
              {group.banks.map((b, i) => (
                <div key={i} className="p-3 rounded-xl bg-secondary flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium">Bank {b.bank} · a.n. {b.holder}</p>
                    <p className="text-[14px] font-extrabold text-foreground tracking-wider">{b.number}</p>
                  </div>
                  <button className="w-9 h-9 rounded-xl bg-card border border-border grid place-items-center"><Copy className="w-4 h-4 text-primary" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-4 text-center">
            <p className="text-[12px] font-bold text-foreground">QRIS</p>
            <div className="mt-3 mx-auto w-44 h-44 rounded-2xl bg-secondary border border-dashed border-border grid place-items-center">
              <QrCode className="w-20 h-20 text-muted-foreground" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Scan dengan aplikasi e-wallet kamu</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
