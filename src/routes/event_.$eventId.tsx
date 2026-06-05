import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createAnggotaOnlyGuard } from "@/lib/route-guards";
import { programKerja, skemaIuran, formatRp, initials } from "@/lib/mock";
import { ChevronLeft, Calendar, TrendingUp, DollarSign, FileText, Clock, CheckCircle2, AlertTriangle, Users as UsersIcon } from "lucide-react";

export const Route = createFileRoute("/event_/$eventId")({
  beforeLoad: createAnggotaOnlyGuard(),
  component: EventDetailPage,
});

const statusMeta = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-secondary" },
  active: { label: "Aktif", color: "text-success", bg: "bg-success-soft" },
  completed: { label: "Selesai", color: "text-primary", bg: "bg-primary-soft" },
  cancelled: { label: "Dibatalkan", color: "text-destructive", bg: "bg-destructive-soft" },
};

const categoryLabels = {
  event: "Event",
  kegiatan: "Kegiatan",
  pengembangan: "Pengembangan",
  sosial: "Sosial",
};

const memberCategoryLabels = {
  all: "Semua Anggota",
  panitia: "Panitia",
  peserta: "Peserta",
  pengurus: "Pengurus",
  custom: "Custom",
};

const memberCategoryColors = {
  all: { bg: "bg-secondary", text: "text-foreground" },
  panitia: { bg: "bg-warning-soft", text: "text-warning" },
  peserta: { bg: "bg-primary-soft", text: "text-primary" },
  pengurus: { bg: "bg-success-soft", text: "text-success" },
  custom: { bg: "bg-partial-soft", text: "text-partial" },
};

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const currentUserId = 1; // Simulate logged in user (Andi Pratama)
  
  const event = programKerja.find(p => p.id === eventId);
  
  if (!event) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Event tidak ditemukan</p>
            <button
              onClick={() => navigate({ to: "/event-saya" })}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Kembali ke Event Saya
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const status = statusMeta[event.status];
  const progress = event.targetBudget > 0 
    ? Math.round((event.collectedBudget / event.targetBudget) * 100) 
    : 0;

  // Get skema iuran that target current user
  const mySkema = skemaIuran.filter(s => 
    s.programKerjaId === event.id && 
    (s.targetMemberIds === "all" || 
     (Array.isArray(s.targetMemberIds) && s.targetMemberIds.includes(currentUserId)))
  );

  const totalFromSkema = skemaIuran
    .filter(s => s.programKerjaId === event.id)
    .reduce((sum, s) => sum + s.collected, 0);

  return (
    <AppShell>
      <div className="pb-24">
        {/* Header */}
        <div className="gradient-navy px-5 pt-6 pb-6 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="relative">
            <button
              onClick={() => history.back()}
              className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-xl font-extrabold leading-tight">{event.name}</h1>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">{event.description}</p>
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <FileText className="w-3.5 h-3.5" />
                {categoryLabels[event.category]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(event.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                {" - "}
                {new Date(event.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                Dibuat {new Date(event.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 mt-4">
          {/* Budget Overview - Read-only untuk anggota */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground font-medium">Budget Event</p>
                <p className="text-lg font-extrabold text-foreground">{formatRp(event.targetBudget)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-baseline justify-between text-[12px] mb-2">
                  <span className="font-bold text-success">{formatRp(event.collectedBudget)}</span>
                  <span className="text-muted-foreground">terkumpul</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                  {progress}% dari target • Sisa {formatRp(event.targetBudget - event.collectedBudget)}
                </p>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Dari Iuran</p>
                  <p className="text-[13px] font-bold text-foreground">{formatRp(totalFromSkema)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Sumber Lain</p>
                  <p className="text-[13px] font-bold text-foreground">{formatRp(event.collectedBudget - totalFromSkema)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* My Participation */}
          {mySkema.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Iuran Kamu di Event Ini ({mySkema.length})
              </h2>
              <div className="space-y-2.5">
                {mySkema.map(skema => {
                  const isPaid = skema.paid.some(p => p.id === currentUserId);
                  const paidRecord = skema.paid.find(p => p.id === currentUserId);
                  const categoryStyle = memberCategoryColors[skema.memberCategory];
                  
                  return (
                    <div key={skema.id} className="bg-card rounded-2xl border border-border card-shadow p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                              {memberCategoryLabels[skema.memberCategory]}
                            </span>
                          </div>
                          <p className="text-[13px] font-bold text-foreground">{skema.name}</p>
                          {skema.description && (
                            <p className="text-[11px] text-muted-foreground mt-1">{skema.description}</p>
                          )}
                          {skema.dueDate && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Jatuh tempo: {skema.dueDate}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] font-extrabold text-foreground">{formatRp(skema.amount || 0)}</p>
                        </div>
                      </div>

                      {/* Payment Status */}
                      {isPaid ? (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success-soft text-success">
                          <CheckCircle2 className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-[11px] font-semibold">Sudah Dibayar</p>
                            {paidRecord && (
                              <p className="text-[10px]">{paidRecord.date} · {paidRecord.method}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive-soft text-destructive">
                            <AlertTriangle className="w-4 h-4" />
                            <p className="text-[11px] font-semibold">Belum dibayar</p>
                          </div>
                          
                          {/* Payment Methods */}
                          {skema.paymentConfig && (
                            <div className="pt-2 border-t border-border space-y-2">
                              {skema.paymentConfig.instructions && (
                                <p className="text-[11px] text-muted-foreground italic">{skema.paymentConfig.instructions}</p>
                              )}
                              
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-foreground">Metode Pembayaran:</p>
                                {skema.paymentConfig.methods.map((method, idx) => (
                                  <div key={idx} className="p-2 bg-secondary/30 rounded-lg text-[11px]">
                                    {method.type === "bank" && (
                                      <div>
                                        <p className="font-semibold text-foreground">{method.bank} - {method.accountNumber}</p>
                                        <p className="text-[10px] text-muted-foreground">a.n. {method.accountName}</p>
                                      </div>
                                    )}
                                    {method.type === "qris" && (
                                      <div className="space-y-1">
                                        <p className="font-semibold text-foreground">{method.qrisLabel || "QRIS"}</p>
                                        {method.qrisUrl && (
                                          <img src={method.qrisUrl} alt="QRIS" className="w-20 h-20" />
                                        )}
                                      </div>
                                    )}
                                    {method.type === "ewallet" && (
                                      <div>
                                        <p className="font-semibold text-foreground">{method.ewalletProvider?.toUpperCase()}</p>
                                        <p className="text-[10px] text-muted-foreground">{method.ewalletNumber}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <Link
                                to="/konfirmasi-bayar"
                                className="block mt-2 px-3.5 py-2.5 rounded-lg gradient-primary text-white text-[11px] font-bold text-center"
                              >
                                Bayar Sekarang
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Stats */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 mb-4">
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-primary" />
              Statistik Partisipasi
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {skemaIuran
                .filter(s => s.programKerjaId === event.id)
                .map(skema => (
                  <div key={skema.id} className="bg-secondary/30 rounded-xl p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mb-2 ${memberCategoryColors[skema.memberCategory].bg} ${memberCategoryColors[skema.memberCategory].text}`}>
                      {memberCategoryLabels[skema.memberCategory]}
                    </span>
                    <p className="text-[13px] font-bold text-foreground">
                      {skema.paidMembers} / {skema.totalMembers}
                    </p>
                    <p className="text-[10px] text-muted-foreground">sudah bayar</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-secondary border border-border rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Penyelenggara</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full gradient-primary text-white grid place-items-center text-[10px] font-bold">
                    {initials(event.createdBy)}
                  </div>
                  <p className="text-[12px] font-bold text-foreground">{event.createdBy}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Tanggal Dibuat</p>
                <p className="text-[12px] font-bold text-foreground mt-1">
                  {new Date(event.createdAt).toLocaleDateString("id-ID", { 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              to="/iuranku"
              className="block w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm text-center shadow-lg shadow-primary/30"
            >
              Lihat Semua Iuranku
            </Link>
            <Link
              to="/event-saya"
              className="block w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm text-center"
            >
              Kembali ke Event Saya
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
