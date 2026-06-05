import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createBendaharaOnlyGuard } from "@/lib/route-guards";
import { skemaIuran, formatRp, initials, type PaymentMethod, type BankType, type EwalletType } from "@/lib/mock";
import {
  ChevronLeft,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Coins,
  Calendar,
  Copy,
  CreditCard,
  Smartphone,
  QrCode,
  Clock,
  AlertTriangle,
  Settings,
  Plus,
  Trash2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/lib/toast";
import { toast } from "sonner";

export const Route = createFileRoute("/iuran-organisasi_/$iuranId")({
  beforeLoad: createBendaharaOnlyGuard(),
  component: IuranDetailPage,
});

type TabType = "ringkasan" | "sudah-bayar" | "belum-bayar";

function pctColor(p: number) {
  if (p >= 80) return { text: "text-success", bg: "bg-success-soft", bar: "bg-success" };
  if (p >= 50) return { text: "text-warning",  bg: "bg-warning-soft",  bar: "bg-warning" };
  return { text: "text-destructive", bg: "bg-destructive-soft", bar: "bg-destructive" };
}

const kindLabels: Record<string, string> = {
  rutin: "Iuran Rutin",
  event: "Patungan Event",
  done:  "Selesai",
};

const statusMeta = {
  active:    { label: "Aktif",      color: "text-success",     bg: "bg-success-soft" },
  completed: { label: "Selesai",    color: "text-primary",     bg: "bg-primary-soft" },
  cancelled: { label: "Dibatalkan", color: "text-destructive", bg: "bg-destructive-soft" },
};

function IuranDetailPage() {
  const { iuranId } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("ringkasan");

  // Payment config state (mirrors program-kerja_.$progId pattern)
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [instructions, setInstructions] = useState("");
  const [newMethod, setNewMethod] = useState<PaymentMethod>({
    type: "bank",
    bank: "BCA",
    accountNumber: "",
    accountName: "",
  });

  const skema = skemaIuran.find(s => s.id === iuranId && s.targetType === "organization");

  if (!skema) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <Coins className="w-16 h-16 text-muted-foreground mx-auto opacity-40 mb-4" />
            <p className="text-lg font-bold text-foreground">Iuran tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">Data iuran organisasi tidak tersedia</p>
            <button
              onClick={() => navigate({ to: "/iuran-organisasi" })}
              className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30"
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const pct    = Math.round((skema.collected / skema.target) * 100);
  const pc     = pctColor(pct);
  const status = skema.status ? statusMeta[skema.status] : statusMeta["active"];
  const sisa   = skema.totalMembers - skema.paidMembers;

  // ── Payment config handlers ──────────────────────────────────────────────
  const handleOpenPaymentEditor = () => {
    setPaymentMethods(skema.paymentConfig?.methods ? [...skema.paymentConfig.methods] : []);
    setInstructions(skema.paymentConfig?.instructions ?? "");
    resetNewMethod();
    setIsEditingPayment(true);
  };

  const handleClosePaymentEditor = () => {
    setIsEditingPayment(false);
    resetNewMethod();
  };

  const resetNewMethod = () => {
    setNewMethod({ type: "bank", bank: "BCA", accountNumber: "", accountName: "" });
  };

  const isValidMethod = (m: PaymentMethod): boolean => {
    if (m.type === "bank")    return !!(m.accountNumber && m.accountName);
    if (m.type === "qris")    return !!m.qrisUrl;
    if (m.type === "ewallet") return !!(m.ewalletNumber && m.ewalletProvider);
    return false;
  };

  const handleAddMethod = () => {
    if (!isValidMethod(newMethod)) {
      showError("Lengkapi data metode pembayaran");
      return;
    }
    setPaymentMethods(prev => [...prev, { ...newMethod }]);
    resetNewMethod();
    showSuccess("Metode pembayaran ditambahkan");
  };

  const handleRemoveMethod = (idx: number) => {
    setPaymentMethods(prev => prev.filter((_, i) => i !== idx));
    showSuccess("Metode pembayaran dihapus");
  };

  const handleSavePayment = () => {
    if (paymentMethods.length === 0) {
      showError("Tambahkan minimal 1 metode pembayaran");
      return;
    }
    // Mutate mock data (same pattern as program-kerja_.$progId)
    skema.paymentConfig = {
      methods: paymentMethods,
      instructions: instructions || undefined,
    };
    showSuccess("Konfigurasi pembayaran tersimpan");
    handleClosePaymentEditor();
  };

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showError("Pilih file gambar QR code"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setNewMethod(prev => prev.type === "qris" ? { ...prev, qrisUrl: url } : prev);
      showSuccess("QR code berhasil diunggah");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Tersalin ke clipboard!"));
  };

  // ── Payment method form renderer ─────────────────────────────────────────
  const renderMethodFields = () => {
    if (newMethod.type === "bank") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div>
            <Label className="text-xs">Bank</Label>
            <Select
              value={(newMethod as any).bank}
              onValueChange={v => setNewMethod(prev => ({ ...prev, bank: v as BankType } as any))}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["BCA","BRI","BNI","MANDIRI","CIMB"].map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Nomor Rekening</Label>
            <Input
              className="h-8 text-xs" placeholder="1234567890"
              value={(newMethod as any).accountNumber}
              onChange={e => setNewMethod(prev => ({ ...prev, accountNumber: e.target.value } as any))}
            />
          </div>
          <div>
            <Label className="text-xs">Nama Pemilik</Label>
            <Input
              className="h-8 text-xs" placeholder="Rina Andini"
              value={(newMethod as any).accountName}
              onChange={e => setNewMethod(prev => ({ ...prev, accountName: e.target.value } as any))}
            />
          </div>
        </div>
      );
    }
    if (newMethod.type === "qris") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs">Label QR</Label>
              <Input
                className="h-8 text-xs" placeholder="QRIS Bendahara"
                value={(newMethod as any).qrisLabel ?? ""}
                onChange={e => setNewMethod(prev => ({ ...prev, qrisLabel: e.target.value } as any))}
              />
            </div>
            <label>
              <input type="file" accept="image/*" onChange={handleQrisUpload} className="hidden" />
              <span className="flex items-center gap-1 px-2 py-1.5 bg-primary text-white rounded text-xs cursor-pointer">
                <Upload className="w-3 h-3" /> Upload
              </span>
            </label>
          </div>
          {(newMethod as any).qrisUrl && (
            <div className="w-20 h-20 mx-auto">
              <img src={(newMethod as any).qrisUrl} alt="QR" className="w-full h-full" />
            </div>
          )}
        </div>
      );
    }
    if (newMethod.type === "ewallet") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div>
            <Label className="text-xs">Provider</Label>
            <Select
              value={(newMethod as any).ewalletProvider}
              onValueChange={v => setNewMethod(prev => ({ ...prev, ewalletProvider: v as EwalletType } as any))}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["gopay","ovo","dana","linkaja"].map(p => (
                  <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Nomor E-Wallet</Label>
            <Input
              className="h-8 text-xs" placeholder="+6282134567890"
              value={(newMethod as any).ewalletNumber}
              onChange={e => setNewMethod(prev => ({ ...prev, ewalletNumber: e.target.value } as any))}
            />
          </div>
          <div>
            <Label className="text-xs">Nama Akun (Opsional)</Label>
            <Input
              className="h-8 text-xs" placeholder="Rina Andini"
              value={(newMethod as any).accountName ?? ""}
              onChange={e => setNewMethod(prev => ({ ...prev, accountName: e.target.value } as any))}
            />
          </div>
        </div>
      );
    }
  };

  // ── Payment Config Modal View ─────────────────────────────────────────────
  if (isEditingPayment) {
    return (
      <AppShell hideNav>
        <div className="pb-8">
          <div className="gradient-navy px-5 pt-6 pb-6 text-white relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
            <button onClick={handleClosePaymentEditor} className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-extrabold">{skema.name}</h1>
            <p className="mt-1 text-sm text-white/80">Atur metode pembayaran iuran</p>
          </div>

          <div className="px-5 mt-5 pb-8 space-y-5">
            {/* Existing methods */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Metode Pembayaran Aktif</h3>
              {paymentMethods.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">
                  Belum ada metode pembayaran
                </p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((m, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold capitalize">
                          {m.type === "bank"
                            ? `${(m as any).bank} – ${(m as any).accountNumber}`
                            : m.type === "qris"
                            ? "QRIS"
                            : (m as any).ewalletProvider?.toUpperCase()}
                        </span>
                        <button onClick={() => handleRemoveMethod(idx)} className="p-1 hover:bg-destructive/20 rounded">
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                      {m.type === "bank" && (
                        <p className="text-xs text-muted-foreground">Nama: {(m as any).accountName}</p>
                      )}
                      {m.type === "ewallet" && (
                        <p className="text-xs text-muted-foreground">{(m as any).ewalletNumber}</p>
                      )}
                      {m.type === "qris" && (m as any).qrisUrl && (
                        <div className="w-14 h-14">
                          <img src={(m as any).qrisUrl} alt="QR" className="w-full h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add new method */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Tambah Metode Baru</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Tipe Metode</Label>
                  <Select
                    value={newMethod.type}
                    onValueChange={(v: any) => {
                      if (v === "bank")    setNewMethod({ type: "bank", bank: "BCA", accountNumber: "", accountName: "" });
                      else if (v === "qris") setNewMethod({ type: "qris", qrisUrl: "" });
                      else setNewMethod({ type: "ewallet", ewalletProvider: "gopay", ewalletNumber: "" });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                      <SelectItem value="ewallet">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {renderMethodFields()}
                <button
                  onClick={handleAddMethod}
                  className="w-full py-2 px-3 rounded-lg bg-primary/10 border border-primary text-primary text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Tambah Metode
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t border-border pt-4">
              <Label className="text-xs font-bold">Instruksi Pembayaran (Opsional)</Label>
              <Textarea
                placeholder="Contoh: Bayar langsung dengan QR atau transfer ke rekening BCA"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="mt-1.5 min-h-16 text-xs resize-none"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleSavePayment}
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                <Save className="w-4 h-4" /> Simpan Pembayaran
              </button>
              <button
                onClick={handleClosePaymentEditor}
                className="w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Main Detail View ──────────────────────────────────────────────────────
  return (
    <AppShell hideNav>
      <div className="pb-10">
        {/* Hero Header */}
        <div className="gradient-navy px-5 pt-6 pb-8 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="relative">
            <button
              onClick={() => history.back()}
              className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider mb-1">
                  {kindLabels[skema.kind] ?? skema.typeLabel}
                </p>
                <h1 className="text-xl font-extrabold leading-tight">{skema.name}</h1>
                {skema.description && (
                  <p className="mt-2 text-sm text-white/75 leading-relaxed">{skema.description}</p>
                )}
              </div>
              <span className={`shrink-0 mt-1 px-3 py-1.5 rounded-full text-[11px] font-bold ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Meta badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Calendar className="w-3.5 h-3.5" />{skema.period}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Users className="w-3.5 h-3.5" />{skema.totalMembers} Anggota
              </span>
              {skema.amount && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                  <Coins className="w-3.5 h-3.5" />{formatRp(skema.amount)}/orang
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex items-baseline justify-between text-[12px] mb-2">
                <span className="font-extrabold text-lg">{formatRp(skema.collected)}</span>
                <span className="text-white/60">dari {formatRp(skema.target)}</span>
              </div>
              <div className="h-2.5 w-full bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-emerald-300 rounded-full transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/70 font-semibold">{pct}% terkumpul</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="px-5 -mt-4 grid grid-cols-3 gap-3 relative z-10">
          {[
            { icon: CheckCircle2, color: "text-success",     bg: "bg-success-soft",     value: skema.paidMembers, label: "Sudah Bayar" },
            { icon: XCircle,      color: "text-destructive", bg: "bg-destructive-soft", value: sisa,              label: "Belum Bayar" },
            { icon: TrendingUp,   color: "text-primary",     bg: "bg-primary-soft",     value: `${pct}%`,         label: "Progress" },
          ].map((s, i) => {
            const Ic = s.icon;
            return (
              <div key={i} className="bg-card rounded-2xl border border-border card-shadow p-3.5">
                <div className={`w-8 h-8 rounded-xl ${s.bg} grid place-items-center mb-2`}>
                  <Ic className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-[15px] font-extrabold text-foreground leading-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="px-5 mt-5">
          <div className="flex bg-secondary rounded-xl p-1 gap-1">
            {([
              { v: "ringkasan",   l: "Ringkasan" },
              { v: "sudah-bayar", l: "Sudah Bayar" },
              { v: "belum-bayar", l: "Belum Bayar" },
            ] as const).map(t => (
              <button
                key={t.v}
                onClick={() => setActiveTab(t.v)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === t.v ? "bg-card card-shadow text-primary" : "text-muted-foreground"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Ringkasan ── */}
        {activeTab === "ringkasan" && (
          <div className="px-5 mt-4 space-y-4">
            {/* Rekapitulasi Dana */}
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />Rekapitulasi Dana
              </h3>
              <div className="space-y-2.5">
                {[
                  { l: "Target Iuran",   v: formatRp(skema.target),                    c: "text-foreground" },
                  { l: "Terkumpul",      v: formatRp(skema.collected),                 c: "text-success" },
                  { l: "Kekurangan",     v: formatRp(skema.target - skema.collected),  c: "text-destructive" },
                  ...(skema.amount ? [{ l: "Nominal/Orang", v: formatRp(skema.amount), c: "text-primary" }] : []),
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                    <p className="text-[12px] text-muted-foreground">{row.l}</p>
                    <p className={`text-[13px] font-bold ${row.c}`}>{row.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pc.bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className={`mt-1.5 text-[11px] font-bold ${pc.text}`}>{pct}% terkumpul</p>
              </div>
            </div>

            {/* Status Anggota */}
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />Status Anggota
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sudah Bayar", value: skema.paidMembers,  color: "text-success",     dot: "bg-success" },
                  { label: "Belum Bayar", value: sisa,               color: "text-destructive", dot: "bg-destructive" },
                  { label: "Total",       value: skema.totalMembers, color: "text-foreground",  dot: "bg-primary" },
                  { label: "Kehadiran",   value: `${pct}%`,          color: "text-primary",     dot: "bg-partial" },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                    </div>
                    <p className={`text-[16px] font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-card rounded-2xl border border-border card-shadow p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />Metode Pembayaran
              </h3>

              {skema.paymentConfig?.methods && skema.paymentConfig.methods.length > 0 ? (
                <div className="space-y-2.5 mb-3">
                  {skema.paymentConfig.methods.map((method, idx) => {
                    if (method.type === "bank") return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                        <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center shrink-0">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-foreground">{method.bank}</p>
                          <p className="text-[11px] text-muted-foreground">{method.accountNumber}</p>
                          <p className="text-[10px] text-muted-foreground">{method.accountName}</p>
                        </div>
                        <button onClick={() => handleCopy(method.accountNumber)} className="p-2 rounded-lg bg-secondary hover:bg-border transition-colors">
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    );
                    if (method.type === "qris") return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                        <div className="w-9 h-9 rounded-xl bg-warning-soft grid place-items-center shrink-0">
                          <QrCode className="w-4 h-4 text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] font-bold text-foreground">QRIS</p>
                          <p className="text-[11px] text-muted-foreground">{method.qrisLabel ?? "Scan untuk bayar"}</p>
                        </div>
                      </div>
                    );
                    if (method.type === "ewallet") return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                        <div className="w-9 h-9 rounded-xl bg-success-soft grid place-items-center shrink-0">
                          <Smartphone className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-foreground uppercase">{method.ewalletProvider}</p>
                          <p className="text-[11px] text-muted-foreground">{method.ewalletNumber}</p>
                        </div>
                        <button onClick={() => handleCopy(method.ewalletNumber)} className="p-2 rounded-lg bg-secondary hover:bg-border transition-colors">
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    );
                    return null;
                  })}
                  {skema.paymentConfig.instructions && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-[11px] text-muted-foreground">{skema.paymentConfig.instructions}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-3 bg-secondary/30 rounded-lg mb-3">
                  Belum ada metode pembayaran yang dikonfigurasi
                </p>
              )}

              {/* Atur Pembayaran button — always visible */}
              <button
                onClick={handleOpenPaymentEditor}
                className="w-full py-2.5 px-3 rounded-xl border border-primary/30 bg-primary/5 text-primary text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                {skema.paymentConfig?.methods?.length
                  ? `Atur Pembayaran (${skema.paymentConfig.methods.length} Metode)`
                  : "Atur Pembayaran"}
              </button>
            </div>

            {/* Due Date */}
            {skema.dueDate && (
              <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning grid place-items-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-foreground">Jatuh Tempo</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(skema.dueDate).toLocaleDateString("id-ID", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Sudah Bayar ── */}
        {activeTab === "sudah-bayar" && (
          <div className="px-5 mt-4">
            {skema.paid.length === 0 ? (
              <div className="py-14 text-center">
                <AlertTriangle className="w-14 h-14 text-muted-foreground mx-auto opacity-40 mb-3" />
                <p className="text-sm font-bold text-foreground">Belum ada yang bayar</p>
                <p className="text-[11px] text-muted-foreground">Konfirmasi pembayaran anggota di menu transaksi</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">{skema.paid.length} anggota sudah membayar</p>
                {skema.paid.map((p, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border card-shadow p-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary text-white grid place-items-center text-[11px] font-bold shrink-0">
                      {initials(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.method} · {p.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-extrabold text-success">{formatRp(p.amount)}</p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        <span className="text-[10px] text-success font-semibold">Lunas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Belum Bayar ── */}
        {activeTab === "belum-bayar" && (
          <div className="px-5 mt-4">
            {skema.unpaid.length === 0 ? (
              <div className="py-14 text-center">
                <CheckCircle2 className="w-14 h-14 text-success mx-auto opacity-60 mb-3" />
                <p className="text-sm font-bold text-foreground">Semua sudah bayar! 🎉</p>
                <p className="text-[11px] text-muted-foreground">Tidak ada anggota yang belum membayar</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">{skema.unpaid.length} anggota belum membayar</p>
                {skema.unpaid.map((u, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-destructive/20 card-shadow p-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive-soft text-destructive grid place-items-center text-[11px] font-bold shrink-0">
                      {initials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">Belum konfirmasi pembayaran</p>
                    </div>
                    <div className="text-right shrink-0">
                      {skema.amount && <p className="text-[13px] font-extrabold text-destructive">{formatRp(skema.amount)}</p>}
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <XCircle className="w-3 h-3 text-destructive" />
                        <span className="text-[10px] text-destructive font-semibold">Belum</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back button */}
        <div className="px-5 mt-6">
          <Link
            to="/iuran-organisasi"
            className="block w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm text-center"
          >
            Kembali ke Daftar Iuran
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
