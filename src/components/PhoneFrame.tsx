import { ReactNode } from "react";

export function PhoneFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-soft to-background p-0 sm:p-6">
      <div
        className={`relative w-full sm:w-[390px] sm:h-[844px] sm:rounded-[44px] sm:border-[10px] sm:border-navy sm:card-shadow-lg overflow-hidden flex flex-col ${
          dark ? "bg-navy" : "bg-background"
        }`}
        style={{ minHeight: "100vh" }}
      >
        {/* Status bar */}
        <div className={`hidden sm:flex h-7 items-center justify-between px-7 text-[12px] font-semibold ${dark ? "text-white" : "text-navy"}`}>
          <span>9:41</span>
          <span>•••</span>
          <span>100%</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
