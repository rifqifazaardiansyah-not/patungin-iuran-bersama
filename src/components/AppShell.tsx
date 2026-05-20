import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "./PhoneFrame";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/context/auth-context";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading, error } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <PhoneFrame>
        <div className="flex items-center justify-center min-h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PhoneFrame>
    );
  }

  if (error || !role) {
    return (
      <PhoneFrame>
        <div className="flex flex-col items-center justify-center min-h-full px-6 gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-bold">Terjadi Kesalahan</h2>
          <p className="text-sm text-muted-foreground text-center">{error || "Gagal memverifikasi session"}</p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm"
          >
            Kembali ke Login
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-4">{children}</div>
        {!hideNav && <BottomNav role={role} />}
      </div>
    </PhoneFrame>
  );
}

export function useRole() {
  const { role } = useAuth();
  return role || "anggota";
}
