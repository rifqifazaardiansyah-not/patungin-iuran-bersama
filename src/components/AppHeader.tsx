import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { initials } from "@/lib/mock";

export function AppHeader({ name, period }: { name: string; period?: string }) {
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full gradient-primary text-white grid place-items-center font-bold text-sm">
            {initials(name)}
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Selamat datang</p>
            <p className="text-[15px] font-bold text-foreground">Halo, {name.split(" ")[0]}! 👋</p>
          </div>
        </div>
        <Link to="/notifikasi" className="relative w-11 h-11 rounded-full bg-card border border-border grid place-items-center card-shadow">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Link>
      </div>
      {period && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Periode: {period}
        </div>
      )}
    </div>
  );
}
