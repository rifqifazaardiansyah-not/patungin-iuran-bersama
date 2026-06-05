import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { programKerja, skemaIuran, formatRp, members, auth } from "@/lib/mock";
import { FolderOpen, Calendar, Users, DollarSign, CheckCircle2, Clock, ChevronRight, Coins } from "lucide-react";

export const Route = createFileRoute("/event-saya")({
  beforeLoad: createProtectedRouteGuard(),
  component: EventSayaPage,
});

const statusMeta = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-secondary" },
  active: { label: "Aktif", color: "text-success", bg: "bg-success-soft" },
  completed: { label: "Selesai", color: "text-primary", bg: "bg-primary-soft" },
  cancelled: { label: "Dibatalkan", color: "text-destructive", bg: "bg-destructive-soft" },
};

const memberCategoryColors = {
  all: { bg: "bg-secondary", text: "text-foreground" },
  panitia: { bg: "bg-warning-soft", text: "text-warning" },
  peserta: { bg: "bg-primary-soft", text: "text-primary" },
  pengurus: { bg: "bg-success-soft", text: "text-success" },
  custom: { bg: "bg-partial-soft", text: "text-partial" },
};

const memberCategoryLabels = {
  all: "Semua Anggota",
  panitia: "Panitia",
  peserta: "Peserta",
  pengurus: "Pengurus",
  custom: "Custom",
};

function EventSayaPage() {
  const currentUserId = 1; // Simulate logged in user (Andi Pratama)
  
  // Find all events where current user is targeted in any skema
  const myEvents = programKerja.filter(program => {
    const programSkema = skemaIuran.filter(s => s.programKerjaId === program.id);
    return programSkema.some(skema => {
      if (skema.targetMemberIds === "all") return true;
      return Array.isArray(skema.targetMemberIds) && skema.targetMemberIds.includes(currentUserId);
    });
  });

  const activeEvents = myEvents.filter(e => e.status === "active");
  const upcomingEvents = myEvents.filter(e => e.status === "draft");
  const completedEvents = myEvents.filter(e => e.status === "completed");

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-24">
        <h1 className="text-xl font-extrabold text-foreground">Event Saya</h1>
        <p className="mt-1 text-sm text-muted-foreground">Event yang kamu ikuti sebagai peserta, panitia, atau pengurus</p>

        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-3.5 border border-border card-shadow">
            <div className="w-8 h-8 rounded-xl bg-success-soft grid place-items-center mb-2">
              <FolderOpen className="w-4 h-4 text-success" />
            </div>
            <p className="text-lg font-extrabold text-foreground">{activeEvents.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Aktif</p>
          </div>
          <div className="bg-card rounded-2xl p-3.5 border border-border card-shadow">
            <div className="w-8 h-8 rounded-xl bg-primary-soft grid place-items-center mb-2">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-extrabold text-foreground">{upcomingEvents.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Akan Datang</p>
          </div>
          <div className="bg-card rounded-2xl p-3.5 border border-border card-shadow">
            <div className="w-8 h-8 rounded-xl bg-secondary grid place-items-center mb-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-extrabold text-foreground">{completedEvents.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Selesai</p>
          </div>
        </div>

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold text-foreground mb-3">Event Aktif</h2>
            <div className="space-y-3">
              {activeEvents.map(event => {
                const eventSkema = skemaIuran.filter(s => s.programKerjaId === event.id && (
                  s.targetMemberIds === "all" || 
                  (Array.isArray(s.targetMemberIds) && s.targetMemberIds.includes(currentUserId))
                ));
                
                const myRoles = eventSkema.map(s => s.memberCategory).filter((v, i, a) => a.indexOf(v) === i);
                const status = statusMeta[event.status];
                
                return (
                  <div key={event.id} className="bg-card rounded-2xl border border-border card-shadow p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-[14px] font-bold text-foreground">{event.name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* My roles in this event */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {myRoles.map(role => {
                        const categoryStyle = memberCategoryColors[role];
                        return (
                          <span key={role} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                            {memberCategoryLabels[role]}
                          </span>
                        );
                      })}
                    </div>

                    {/* Event info */}
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" />
                        {eventSkema.length} Iuran
                      </span>
                    </div>

                    {/* My dues for this event */}
                    {eventSkema.length > 0 && (
                      <div className="pt-3 border-t border-border space-y-2">
                        {eventSkema.map(skema => {
                          const isPaid = skema.paid.some(p => p.id === currentUserId);
                          const categoryStyle = memberCategoryColors[skema.memberCategory];
                          
                          return (
                            <div key={skema.id} className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                                  {memberCategoryLabels[skema.memberCategory]}
                                </span>
                                <span className="font-medium text-foreground truncate">{skema.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-foreground">{formatRp(skema.amount || 0)}</span>
                                {isPaid ? (
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                ) : (
                                  <Link to="/konfirmasi-bayar" className="px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-bold">
                                    Bayar
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <Link 
                      to="/event/$eventId" 
                      params={{ eventId: event.id }}
                      className="mt-3 flex items-center justify-end text-[11px] text-primary font-bold"
                    >
                      Lihat Detail <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold text-foreground mb-3">Akan Datang</h2>
            <div className="space-y-2.5">
              {upcomingEvents.map(event => {
                const eventSkema = skemaIuran.filter(s => s.programKerjaId === event.id && (
                  s.targetMemberIds === "all" || 
                  (Array.isArray(s.targetMemberIds) && s.targetMemberIds.includes(currentUserId))
                ));
                const myRoles = eventSkema.map(s => s.memberCategory).filter((v, i, a) => a.indexOf(v) === i);
                
                return (
                  <Link
                    key={event.id}
                    to="/event/$eventId"
                    params={{ eventId: event.id }}
                    className="block bg-card rounded-2xl border border-border card-shadow p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[13px] font-bold text-foreground flex-1">{event.name}</p>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground">
                        Draft
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {myRoles.map(role => {
                        const categoryStyle = memberCategoryColors[role];
                        return (
                          <span key={role} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                            {memberCategoryLabels[role]}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold text-foreground mb-3">Event Selesai</h2>
            <div className="space-y-2.5">
              {completedEvents.map(event => {
                const eventSkema = skemaIuran.filter(s => s.programKerjaId === event.id && (
                  s.targetMemberIds === "all" || 
                  (Array.isArray(s.targetMemberIds) && s.targetMemberIds.includes(currentUserId))
                ));
                
                return (
                  <Link
                    key={event.id}
                    to="/event/$eventId"
                    params={{ eventId: event.id }}
                    className="block bg-card rounded-2xl border border-border card-shadow p-3.5 opacity-75"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-foreground">{event.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Selesai · {new Date(event.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {myEvents.length === 0 && (
          <div className="mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary grid place-items-center mx-auto">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">Belum ada event</p>
            <p className="text-[11px] text-muted-foreground">
              Kamu belum terdaftar di event manapun
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
