import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { programKerja, formatRp, ProgramStatus } from "@/lib/mock";
import { Plus, FolderOpen, Calendar, TrendingUp, Filter, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/program-kerja")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: ProgramKerjaPage,
});

const statusMeta: Record<ProgramStatus, { label: string; color: string; bg: string }> = {
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

function ProgramKerjaPage() {
  const [filter, setFilter] = useState<"all" | ProgramStatus>("all");

  const filtered = filter === "all" 
    ? programKerja 
    : programKerja.filter(p => p.status === filter);

  const stats = {
    total: programKerja.length,
    active: programKerja.filter(p => p.status === "active").length,
    completed: programKerja.filter(p => p.status === "completed").length,
    draft: programKerja.filter(p => p.status === "draft").length,
  };

  const totalBudget = programKerja
    .filter(p => p.status === "active" || p.status === "completed")
    .reduce((sum, p) => sum + p.targetBudget, 0);
  
  const totalCollected = programKerja
    .filter(p => p.status === "active" || p.status === "completed")
    .reduce((sum, p) => sum + p.collectedBudget, 0);

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Event Organisasi</h1>
          <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold">
            {stats.total} Program
          </span>
        </div>

        {/* Stats Overview */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border card-shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-[10px] text-muted-foreground font-medium">Total Budget</p>
            </div>
            <p className="text-base font-extrabold text-foreground">{formatRp(totalBudget)}</p>
            <p className="text-[10px] text-success mt-0.5">
              {formatRp(totalCollected)} terkumpul
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-success" />
              <p className="text-[10px] text-muted-foreground font-medium">Program Aktif</p>
            </div>
            <p className="text-base font-extrabold text-foreground">{stats.active}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              dari {stats.total} program
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {([
            { v: "all", l: "Semua" },
            { v: "active", l: "Aktif" },
            { v: "completed", l: "Selesai" },
            { v: "draft", l: "Draft" },
          ] as const).map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border ${
                filter === f.v
                  ? "bg-primary text-white border-primary"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {f.l}
              {f.v !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({f.v === "active" ? stats.active : f.v === "completed" ? stats.completed : stats.draft})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Program List */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
              <p className="mt-3 text-sm font-bold text-foreground">Belum ada program</p>
              <p className="text-[11px] text-muted-foreground">
                {filter === "all" ? "Buat event pertama Anda" : `Tidak ada event ${statusMeta[filter as ProgramStatus].label.toLowerCase()}`}
              </p>
            </div>
          ) : (
            filtered.map(program => {
              const status = statusMeta[program.status];
              const progress = program.targetBudget > 0 
                ? Math.round((program.collectedBudget / program.targetBudget) * 100) 
                : 0;
              
              return (
                <Link
                  key={program.id}
                  to="/program-kerja/$progId"
                  params={{ progId: program.id }}
                  className="block bg-card rounded-2xl border border-border card-shadow p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-extrabold text-foreground truncate">
                          {program.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium text-foreground">
                      {categoryLabels[program.category]}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(program.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      {" - "}
                      {new Date(program.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Budget Progress */}
                  {program.status !== "draft" && (
                    <div>
                      <div className="flex items-baseline justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-foreground">{formatRp(program.collectedBudget)}</span>
                        <span className="text-muted-foreground">dari {formatRp(program.targetBudget)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-primary"
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                        {progress}% terkumpul
                      </p>
                    </div>
                  )}

                  {/* Arrow */}
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-[11px] font-bold text-primary inline-flex items-center gap-1">
                      Lihat Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* FAB - Buat Program Baru */}
      <Link
        to="/program-kerja/buat"
        className="fixed bottom-24 right-6 sm:right-[calc(50%-180px)] w-14 h-14 rounded-full gradient-primary text-white grid place-items-center card-shadow-lg z-10"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </Link>
    </AppShell>
  );
}
