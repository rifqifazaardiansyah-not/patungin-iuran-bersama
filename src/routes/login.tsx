import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { auth } from "@/lib/mock";
import logo from "@/assets/patungin-logo.png";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("rina@patungin.id");
  const [password, setPassword] = useState("password");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Determine role automatically from "registered account type"
    const role = email.includes("anggota") ? "anggota" : "bendahara";
    auth.setSession(role, role === "bendahara" ? "Rina Andini" : "Andi Pratama");
    navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <div className="min-h-full px-6 py-8 gradient-soft">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={logo} alt="Patungin" className="w-24 h-24 object-contain" />
          <p className="text-xs text-muted-foreground font-medium">Iuran Digital, Transparan & Terorganisir</p>
        </div>

        <div className="bg-card rounded-3xl card-shadow-lg p-6">
          <h2 className="text-xl font-extrabold text-foreground">Masuk</h2>
          <p className="text-xs text-muted-foreground mt-1">Lanjutkan ke akunmu</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-foreground">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full h-12 pl-10 pr-3 rounded-xl border-[1.5px] border-border focus:border-primary focus:outline-none text-sm bg-card"
                  placeholder="email@kampus.ac.id"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-foreground">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  className="w-full h-12 pl-10 pr-10 rounded-xl border-[1.5px] border-border focus:border-primary focus:outline-none text-sm bg-card"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {show ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a className="text-xs font-semibold text-primary">Lupa Password?</a>
            </div>

            <button type="submit" className="w-full h-13 py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
              Masuk
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground font-medium">atau</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Link to="/register" className="block text-center w-full py-3.5 rounded-xl border-[1.5px] border-primary text-primary font-bold text-sm">
              Daftar Akun Baru
            </Link>
          </form>

          <p className="mt-5 text-[11px] text-muted-foreground text-center leading-relaxed">
            Role (Bendahara/Anggota) ditentukan otomatis berdasarkan tipe akun saat registrasi.
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Tip: gunakan email mengandung <span className="font-semibold text-primary">anggota</span> untuk masuk sebagai Anggota.
        </p>
      </div>
    </PhoneFrame>
  );
}
