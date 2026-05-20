import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { auth, initials } from "@/lib/mock";
import { Pencil, Bell, Lock, Smartphone, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profil")({
  beforeLoad: createProtectedRouteGuard(),
  component: ProfilPage,
});

function ProfilPage() {
  const navigate = useNavigate();
  const [name] = useState(auth.getName());
  const role = auth.getRole();

  const items = [
    { icon: Pencil, label: "Edit Profil" },
    { icon: Bell, label: "Pengaturan Notifikasi" },
    { icon: Lock, label: "Ubah Password" },
    { icon: Smartphone, label: "Versi Aplikasi", suffix: "v1.0.0" },
    { icon: HelpCircle, label: "Bantuan & FAQ" },
  ];

  return (
    <AppShell>
      <div className="pb-6">
        <div className="gradient-navy px-5 pt-8 pb-16 text-white relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur grid place-items-center text-xl font-extrabold border-4 border-white/20">
              {initials(name)}
            </div>
            <p className="mt-3 text-base font-extrabold">{name}</p>
            <span className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${role === "bendahara" ? "bg-warning text-white" : "bg-success text-white"}`}>
              {role === "bendahara" ? "👑 Bendahara" : "👤 Anggota"}
            </span>
            <p className="mt-2 text-[11px] text-white/70">rina@patungin.id · 0812-3456-7890</p>
          </div>
        </div>

        <div className="px-5 -mt-10">
          <div className="bg-card rounded-2xl border border-border card-shadow divide-y divide-border overflow-hidden">
            {items.map((it, i) => {
              const Ic = it.icon;
              return (
                <button key={i} className="w-full flex items-center gap-3 p-4 text-left">
                  <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center">
                    <Ic className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <p className="flex-1 text-[13px] font-bold text-foreground">{it.label}</p>
                  {it.suffix && <span className="text-[11px] text-muted-foreground">{it.suffix}</span>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
            <button onClick={() => { auth.clear(); navigate({ to: "/login" }); }} className="w-full flex items-center gap-3 p-4 text-left">
              <div className="w-9 h-9 rounded-xl bg-destructive-soft grid place-items-center">
                <LogOut className="w-[18px] h-[18px] text-destructive" />
              </div>
              <p className="flex-1 text-[13px] font-bold text-destructive">Keluar</p>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
