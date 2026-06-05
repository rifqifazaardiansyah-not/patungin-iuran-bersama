import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createPublicOnlyGuard } from "@/lib/route-guards";
import logo from "@/assets/patungin-logo.png";

export const Route = createFileRoute("/")({
  beforeLoad: createPublicOnlyGuard(),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/login" }), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full grid place-items-center gradient-navy">
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="w-40 h-40 rounded-3xl bg-white/95 grid place-items-center card-shadow-lg">
          <img src={logo} alt="Patungin" className="w-32 h-32 object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Patungin</h1>
          <p className="mt-2 text-sm text-white/70 font-medium">Platform Manajemen Iuran & Keuangan Organisasi</p>
        </div>
        <div className="mt-4 w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    </div>
  );
}
