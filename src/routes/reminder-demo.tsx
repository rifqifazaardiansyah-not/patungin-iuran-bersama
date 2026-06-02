import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { MessageSquare, Mail, Bell, Clock, Users, CheckCircle2, Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/reminder-demo")({
  beforeLoad: createProtectedRouteGuard(),
  component: ReminderDemoPage,
});

function ReminderDemoPage() {
  const navigate = useNavigate();
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(true);
  const [autoReminder, setAutoReminder] = useState(true);

  const handleScheduleReminder = () => {
    const activeChannels = [
      whatsapp && "WhatsApp",
      email && "Email",
      push && "Push Notification"
    ].filter(Boolean);

    if (activeChannels.length === 0) {
      toast.error("Pilih minimal satu channel reminder");
      return;
    }

    toast.loading("Menjadwalkan reminder...", { duration: 1500 });
    
    setTimeout(() => {
      toast.success(
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Reminder Berhasil Dijadwalkan!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Via {activeChannels.join(", ")} untuk 25 anggota
            </p>
          </div>
        </div>,
        { duration: 3000 }
      );
    }, 1500);
  };

  return (
    <AppShell hideNav>
      <div className="min-h-screen bg-background pb-6">
        {/* Header */}
        <div className="gradient-navy px-5 pt-6 pb-8 text-white">
          <button onClick={() => navigate({ to: "/home" })} className="mb-4 w-9 h-9 rounded-xl bg-white/10 grid place-items-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 grid place-items-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold">Reminder Otomatis</h1>
              <p className="text-sm text-white/80 mt-1">
                Kirim pengingat pembayaran otomatis ke anggota
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-4">
          {/* Feature Card */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <p className="text-sm font-bold text-foreground">Fitur Pro</p>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-warning text-white text-[10px] font-bold">
                DEMO
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Fitur ini tersedia di paket <span className="font-bold text-foreground">Pro</span> dan{" "}
              <span className="font-bold text-foreground">Campus</span>. 
              Upgrade untuk menggunakan reminder otomatis.
            </p>
          </div>

          {/* Auto Reminder Toggle */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-soft grid place-items-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-foreground">Reminder Otomatis</p>
                  <p className="text-[11px] text-muted-foreground">Kirim 3 hari sebelum jatuh tempo</p>
                </div>
              </div>
              <button
                onClick={() => setAutoReminder(!autoReminder)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  autoReminder ? "bg-primary" : "bg-secondary"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    autoReminder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="mb-4">
            <p className="text-sm font-bold text-foreground mb-3">Pilih Channel Reminder</p>
            <div className="space-y-2.5">
              {/* WhatsApp */}
              <button
                onClick={() => setWhatsapp(!whatsapp)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  whatsapp
                    ? "border-success bg-success-soft"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${whatsapp ? "bg-success" : "bg-secondary"} grid place-items-center`}>
                    <MessageSquare className={`w-5 h-5 ${whatsapp ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-foreground">WhatsApp Reminder</p>
                    <p className="text-[11px] text-muted-foreground">Via WhatsApp Business API</p>
                  </div>
                  {whatsapp && <CheckCircle2 className="w-5 h-5 text-success" />}
                </div>
              </button>

              {/* Email */}
              <button
                onClick={() => setEmail(!email)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  email
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${email ? "bg-primary" : "bg-secondary"} grid place-items-center`}>
                    <Mail className={`w-5 h-5 ${email ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-foreground">Email Reminder</p>
                    <p className="text-[11px] text-muted-foreground">Email dengan detail lengkap</p>
                  </div>
                  {email && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
              </button>

              {/* Push Notification */}
              <button
                onClick={() => setPush(!push)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  push
                    ? "border-warning bg-warning-soft"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${push ? "bg-warning" : "bg-secondary"} grid place-items-center`}>
                    <Bell className={`w-5 h-5 ${push ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-foreground">Push Notification</p>
                    <p className="text-[11px] text-muted-foreground">Notifikasi di aplikasi</p>
                  </div>
                  {push && <CheckCircle2 className="w-5 h-5 text-warning" />}
                </div>
              </button>
            </div>
          </div>

          {/* Target Recipients */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive-soft grid place-items-center">
                <Users className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-foreground">Target Penerima</p>
                <p className="text-[11px] text-muted-foreground">25 anggota yang belum bayar</p>
              </div>
              <p className="text-xl font-extrabold text-foreground">25</p>
            </div>
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleScheduleReminder}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Jadwalkan Reminder Sekarang
          </button>

          {/* Info */}
          <div className="mt-4 p-4 rounded-xl bg-secondary border border-border">
            <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
              💡 <span className="font-bold text-foreground">Tips:</span> Reminder otomatis akan dikirim 3 hari sebelum jatuh tempo, 
              1 hari sebelum, dan saat hari H jika belum bayar.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
