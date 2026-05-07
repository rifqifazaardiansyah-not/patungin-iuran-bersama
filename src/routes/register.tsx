import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { auth, Role } from "@/lib/mock";
import { Crown, User } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("bendahara");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    auth.setSession(role, name || (role === "bendahara" ? "Rina Andini" : "Andi Pratama"));
    if (role === "anggota") navigate({ to: "/join-grup" });
    else navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <div className="min-h-full px-6 py-8 gradient-soft">
        <h1 className="text-2xl font-extrabold text-foreground">Buat Akun</h1>
        <p className="text-xs text-muted-foreground mt-1">Pilih peranmu untuk memulai</p>

        <div className="mt-5 bg-card rounded-2xl p-1.5 grid grid-cols-2 gap-1 card-shadow">
          {([
            { v: "bendahara", icon: Crown, label: "Bendahara" },
            { v: "anggota", icon: User, label: "Anggota" },
          ] as const).map((r) => {
            const Icon = r.icon;
            const active = role === r.v;
            return (
              <button
                key={r.v}
                onClick={() => setRole(r.v)}
                type="button"
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition ${
                  active ? "gradient-primary text-white" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {r.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 p-3.5 rounded-xl bg-primary-soft border border-primary/15">
          <p className="text-[12px] text-foreground leading-relaxed">
            {role === "bendahara"
              ? "👑 Kelola iuran, catat pembayaran, dan kelola anggota grup."
              : "👤 Lihat status iuran, konfirmasi bayar, dan join grup."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3.5">
          {[
            { l: "Nama Lengkap", t: "text", p: "Nama kamu", v: name, on: setName },
            { l: "Email",        t: "email", p: "email@kampus.ac.id" },
            { l: "No. HP",       t: "tel",   p: "08xx-xxxx-xxxx" },
            { l: "Password",     t: "password", p: "••••••••" },
            { l: "Konfirmasi Password", t: "password", p: "••••••••" },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-[12px] font-semibold text-foreground">{f.l}</label>
              <input
                type={f.t}
                value={(f as any).v}
                onChange={(e) => (f as any).on?.(e.target.value)}
                className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border focus:border-primary focus:outline-none text-sm bg-card"
                placeholder={f.p}
              />
            </div>
          ))}

          <button type="submit" className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 mt-2">
            Daftar
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary font-bold">Masuk</Link>
          </p>
        </form>
      </div>
    </PhoneFrame>
  );
}
