import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { auth, Role } from "@/lib/mock";
import { useAuth } from "@/context/auth-context";
import { registerSchema } from "@/lib/schemas";
import { showError, showSuccess } from "@/lib/toast";
import { createPublicOnlyGuard } from "@/lib/route-guards";
import { Crown, User, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/register")({
  beforeLoad: createPublicOnlyGuard(),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [role, setRole] = useState<Role>("bendahara");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = registerSchema.safeParse({
        role,
        name,
        email,
        phone,
        password,
        passwordConfirm,
      });

      if (!result.success) {
        const formErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const path = err.path.join(".");
          formErrors[path] = err.message;
        });
        setErrors(formErrors);
        showError("Validasi Gagal", "Silakan periksa kembali input Anda");
        return;
      }

      // Set session
      auth.setSession(role, name);
      authLogin(role, name);

      showSuccess("Registrasi Berhasil", `Selamat datang, ${name}!`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (role === "anggota") {
        navigate({ to: "/join-grup" });
      } else {
        navigate({ to: "/home" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      showError("Registrasi Gagal", message);
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => errors[field];
  const hasError = (field: string) => !!getFieldError(field);

  return (
    <PhoneFrame>
      <div className="min-h-full px-6 py-8 gradient-soft">
        <h1 className="text-2xl font-extrabold text-foreground">Buat Akun</h1>
        <p className="text-xs text-muted-foreground mt-1">Pilih peranmu untuk memulai</p>

        <div className="mt-5 bg-card rounded-2xl p-1.5 grid grid-cols-2 gap-1 card-shadow">
          {(
            [
              { v: "bendahara", icon: Crown, label: "Bendahara" },
              { v: "anggota", icon: User, label: "Anggota" },
            ] as const
          ).map((r) => {
            const Icon = r.icon;
            const active = role === r.v;
            return (
              <button
                key={r.v}
                onClick={() => setRole(r.v)}
                type="button"
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
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

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="text-[12px] font-semibold text-foreground">Nama Lengkap *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  const newErrors = { ...errors };
                  delete newErrors.name;
                  setErrors(newErrors);
                }
              }}
              className={`mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] focus:outline-none text-sm bg-card transition ${
                hasError("name")
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
              placeholder="Nama kamu"
              disabled={isLoading}
            />
            {getFieldError("name") && (
              <p className="text-xs text-destructive mt-1">{getFieldError("name")}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-semibold text-foreground">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              className={`mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] focus:outline-none text-sm bg-card transition ${
                hasError("email")
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
              placeholder="email@kampus.ac.id"
              disabled={isLoading}
            />
            {getFieldError("email") && (
              <p className="text-xs text-destructive mt-1">{getFieldError("email")}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-semibold text-foreground">No. HP *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) {
                  const newErrors = { ...errors };
                  delete newErrors.phone;
                  setErrors(newErrors);
                }
              }}
              className={`mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] focus:outline-none text-sm bg-card transition ${
                hasError("phone")
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
              placeholder="08xx-xxxx-xxxx"
              disabled={isLoading}
            />
            {getFieldError("phone") && (
              <p className="text-xs text-destructive mt-1">{getFieldError("phone")}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-semibold text-foreground">Password *</label>
            <div className="mt-1.5 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    const newErrors = { ...errors };
                    delete newErrors.password;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full h-12 px-3.5 pr-10 rounded-xl border-[1.5px] focus:outline-none text-sm bg-card transition ${
                  hasError("password")
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {getFieldError("password") && (
              <p className="text-xs text-destructive mt-1">{getFieldError("password")}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-semibold text-foreground">Konfirmasi Password *</label>
            <div className="mt-1.5 relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (errors.passwordConfirm) {
                    const newErrors = { ...errors };
                    delete newErrors.passwordConfirm;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full h-12 px-3.5 pr-10 rounded-xl border-[1.5px] focus:outline-none text-sm bg-card transition ${
                  hasError("passwordConfirm")
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPasswordConfirm ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {getFieldError("passwordConfirm") && (
              <p className="text-xs text-destructive mt-1">{getFieldError("passwordConfirm")}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary font-bold">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </PhoneFrame>
  );
}
