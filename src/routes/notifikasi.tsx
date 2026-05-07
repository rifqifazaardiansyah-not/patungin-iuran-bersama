import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { notifications } from "@/lib/mock";
import { Megaphone, CheckCircle2, AlertTriangle, Bell } from "lucide-react";

export const Route = createFileRoute("/notifikasi")({
  component: NotifikasiPage,
});

const iconMap = {
  broadcast: { Ic: Megaphone, c: "text-primary", bg: "bg-primary-soft" },
  payment:   { Ic: CheckCircle2, c: "text-success", bg: "bg-success-soft" },
  reminder:  { Ic: AlertTriangle, c: "text-warning", bg: "bg-warning-soft" },
  success:   { Ic: CheckCircle2, c: "text-success", bg: "bg-success-soft" },
};

const filters = ["Semua", "Pengumuman", "Pembayaran", "Sistem"];

function NotifikasiPage() {
  const [active, setActive] = useState("Semua");

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Notifikasi</h1>
          <button className="text-[11px] text-primary font-bold">Tandai dibaca</button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border ${active === f ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"}`}
            >{f}</button>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {notifications.map(n => {
            const m = iconMap[n.type];
            return (
              <div key={n.id} className={`rounded-2xl p-4 flex gap-3 ${n.unread ? "bg-card border-l-[3px] border-primary card-shadow" : "bg-secondary border border-border"}`}>
                <div className={`w-10 h-10 rounded-xl ${m.bg} grid place-items-center shrink-0`}>
                  <m.Ic className={`w-5 h-5 ${m.c}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-foreground truncate">{n.title}</p>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-soft grid place-items-center">
              <Bell className="w-9 h-9 text-primary" />
            </div>
            <p className="mt-4 text-sm font-bold">Belum ada notifikasi</p>
            <p className="text-[11px] text-muted-foreground">Notifikasimu akan muncul di sini.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
