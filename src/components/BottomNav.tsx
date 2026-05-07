import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, CreditCard, BarChart3, User, ClipboardList, Bell } from "lucide-react";
import { Role } from "@/lib/mock";

const bendaharaTabs = [
  { to: "/home", label: "Beranda", icon: Home },
  { to: "/anggota", label: "Anggota", icon: Users },
  { to: "/transaksi", label: "Transaksi", icon: CreditCard },
  { to: "/laporan", label: "Laporan", icon: BarChart3 },
  { to: "/profil", label: "Profil", icon: User },
] as const;

const anggotaTabs = [
  { to: "/home", label: "Beranda", icon: Home },
  { to: "/iuranku", label: "Iuranku", icon: ClipboardList },
  { to: "/notifikasi", label: "Notifikasi", icon: Bell },
  { to: "/profil", label: "Profil", icon: User },
] as const;

export function BottomNav({ role }: { role: Role }) {
  const loc = useLocation();
  const tabs = role === "bendahara" ? bendaharaTabs : anggotaTabs;
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {tabs.map((t) => {
          const active = loc.pathname === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center gap-1 flex-1 py-1"
            >
              <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.5 : 2} fill={active ? "currentColor" : "none"} />
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
