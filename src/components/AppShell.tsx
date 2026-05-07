import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "./PhoneFrame";
import { BottomNav } from "./BottomNav";
import { auth, Role } from "@/lib/mock";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const r = localStorage.getItem("patungin_role") as Role | null;
    if (!r) {
      navigate({ to: "/login" });
      return;
    }
    setRole(r);
  }, [navigate]);

  if (!role) return null;

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-4">{children}</div>
        {!hideNav && <BottomNav role={role} />}
      </div>
    </PhoneFrame>
  );
}

export function useRole(): Role {
  const [role, setRole] = useState<Role>("bendahara");
  useEffect(() => { setRole(auth.getRole()); }, []);
  return role;
}
