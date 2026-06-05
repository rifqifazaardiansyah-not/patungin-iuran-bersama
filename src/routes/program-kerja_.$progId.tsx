import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { programKerja, skemaIuran, formatRp, initials, type PaymentMethod, type BankType, type EwalletType } from "@/lib/mock";
import { ChevronLeft, Calendar, TrendingUp, DollarSign, Users, FileText, Clock, Edit, Settings, Plus, Trash2, Save, Upload, Copy, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/lib/toast";

export const Route = createFileRoute("/program-kerja_/$progId")({
  beforeLoad: createProtectedRouteGuard(),
  component: ProgramDetailPage,
});

const statusMeta = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-secondary" },
  active: { label: "Aktif", color: "text-success", bg: "bg-success-soft" },
  completed: { label: "Selesai", color: "text-primary", bg: "bg-primary-soft" },
  cancelled: { label: "Dibatalkan", color: "text-destructive", bg: "bg-destructive-soft" },
};

const categoryLabels = {
  event: "Event",
  kegiatan: "Kegiatan",
  pengembangan: "Pengembangan",
  sosial: "Sosial",
};

const memberCategoryLabels = {
  all: "Semua Anggota",
  panitia: "Panitia",
  peserta: "Peserta",
  pengurus: "Pengurus",
  custom: "Custom",
};

const memberCategoryColors = {
  all: { bg: "bg-secondary", text: "text-foreground" },
  panitia: { bg: "bg-warning-soft", text: "text-warning" },
  peserta: { bg: "bg-primary-soft", text: "text-primary" },
  pengurus: { bg: "bg-success-soft", text: "text-success" },
  custom: { bg: "bg-partial-soft", text: "text-partial" },
};

function ProgramDetailPage() {
  const { progId } = Route.useParams();
  const navigate = useNavigate();
  const [editingSchemaId, setEditingSchemaId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [instructions, setInstructions] = useState<string>("");
  const [newMethod, setNewMethod] = useState<PaymentMethod>({
    type: "bank",
    bank: "BCA",
    accountNumber: "",
    accountName: "",
  });
  
  const program = programKerja.find(p => p.id === progId);
  
  if (!program) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Program tidak ditemukan</p>
            <button
              onClick={() => navigate({ to: "/program-kerja" })}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Kembali ke Daftar Program
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const status = statusMeta[program.status];
  const progress = program.targetBudget > 0 
    ? Math.round((program.collectedBudget / program.targetBudget) * 100) 
    : 0;

  // Get related skema iuran
  const relatedSkema = skemaIuran.filter(s => s.programKerjaId === program.id);
  const totalFromSkema = relatedSkema.reduce((sum, s) => sum + s.collected, 0);

  const editingSchema = relatedSkema.find(s => s.id === editingSchemaId);

  const handleEditPaymentConfig = (schemaId: string) => {
    const schema = relatedSkema.find(s => s.id === schemaId);
    if (schema) {
      setEditingSchemaId(schemaId);
      setPaymentMethods(schema.paymentConfig?.methods || []);
      setInstructions(schema.paymentConfig?.instructions || "");
    }
  };

  const handleClosePaymentModal = () => {
    setEditingSchemaId(null);
    resetNewMethod();
  };

  const handleAddPaymentMethod = () => {
    if (!isValidPaymentMethod(newMethod)) {
      showError("Lengkapi data metode pembayaran");
      return;
    }
    setPaymentMethods([...paymentMethods, { ...newMethod }]);
    resetNewMethod();
    showSuccess("Metode pembayaran ditambahkan");
  };

  const handleRemovePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
    showSuccess("Metode pembayaran dihapus");
  };

  const handleSavePaymentConfig = () => {
    if (paymentMethods.length === 0) {
      showError("Tambahkan minimal 1 metode pembayaran");
      return;
    }
    if (editingSchema) {
      editingSchema.paymentConfig = {
        methods: paymentMethods,
        instructions: instructions || undefined,
      };
    }
    showSuccess("Konfigurasi pembayaran tersimpan");
    handleClosePaymentModal();
  };

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Pilih file gambar QR code");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const qrisMethod = paymentMethods.find(m => m.type === "qris");
      if (qrisMethod && qrisMethod.type === "qris") {
        qrisMethod.qrisUrl = dataUrl;
        setPaymentMethods([...paymentMethods]);
        showSuccess("QR code berhasil diunggah");
      }
    };
    reader.readAsDataURL(file);
  };

  const resetNewMethod = () => {
    setNewMethod({
      type: "bank",
      bank: "BCA",
      accountNumber: "",
      accountName: "",
    });
  };

  const isValidPaymentMethod = (method: PaymentMethod): boolean => {
    if (method.type === "bank") {
      return !!(method.accountNumber && method.accountName);
    } else if (method.type === "qris") {
      return !!method.qrisUrl;
    } else if (method.type === "ewallet") {
      return !!(method.ewalletNumber && method.ewalletProvider);
    }
    return false;
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess("Tersalin ke clipboard");
    });
  };

  const renderPaymentMethodField = (method: PaymentMethod) => {
    if (method.type === "bank") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div>
            <Label className="text-xs">Bank</Label>
            <Select value={method.bank} onValueChange={(value) => { method.bank = value as BankType; setPaymentMethods([...paymentMethods]); }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["BCA", "BRI", "BNI", "MANDIRI", "CIMB"].map(bank => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Nomor Rekening</Label>
            <Input
              type="text"
              placeholder="1234567890"
              value={method.accountNumber}
              onChange={(e) => { method.accountNumber = e.target.value; setPaymentMethods([...paymentMethods]); }}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Nama Pemilik</Label>
            <Input
              type="text"
              placeholder="Rina Andini"
              value={method.accountName}
              onChange={(e) => { method.accountName = e.target.value; setPaymentMethods([...paymentMethods]); }}
              className="h-8 text-xs"
            />
          </div>
        </div>
      );
    } else if (method.type === "qris") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs">Label QR</Label>
              <Input
                type="text"
                placeholder="QRIS"
                value={method.qrisLabel || ""}
                onChange={(e) => { method.qrisLabel = e.target.value; setPaymentMethods([...paymentMethods]); }}
                className="h-8 text-xs"
              />
            </div>
            <label className="flex-shrink-0">
              <Input
                type="file"
                accept="image/*"
                onChange={handleQrisUpload}
                className="h-8 text-xs hidden"
              />
              <button type="button" className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-xs cursor-pointer">
                <Upload className="w-3 h-3" /> Upload
              </button>
            </label>
          </div>
          {method.qrisUrl && (
            <div className="w-20 h-20 mx-auto">
              <img src={method.qrisUrl} alt="QR Code" className="w-full h-full" />
            </div>
          )}
        </div>
      );
    } else if (method.type === "ewallet") {
      return (
        <div className="space-y-2 p-2 bg-secondary/30 rounded-lg">
          <div>
            <Label className="text-xs">E-Wallet Provider</Label>
            <Select value={method.ewalletProvider} onValueChange={(value) => { method.ewalletProvider = value as EwalletType; setPaymentMethods([...paymentMethods]); }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["gopay", "ovo", "dana", "linkaja"].map(provider => (
                  <SelectItem key={provider} value={provider}>{provider.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Nomor E-Wallet</Label>
            <Input
              type="text"
              placeholder="+6282134567890"
              value={method.ewalletNumber}
              onChange={(e) => { method.ewalletNumber = e.target.value; setPaymentMethods([...paymentMethods]); }}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Nama Akun (Opsional)</Label>
            <Input
              type="text"
              placeholder="Rina Andini"
              value={method.accountName || ""}
              onChange={(e) => { method.accountName = e.target.value; setPaymentMethods([...paymentMethods]); }}
              className="h-8 text-xs"
            />
          </div>
        </div>
      );
    }
  };

  // Show payment config modal if editing
  if (editingSchemaId && editingSchema) {
    return (
      <AppShell hideNav>
        <div className="pb-8">
          {/* Payment Config Header */}
          <div className="gradient-navy px-5 pt-6 pb-6 text-white relative overflow-hidden">
            <button
              onClick={handleClosePaymentModal}
              className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-extrabold">{editingSchema.name}</h1>
            <p className="mt-1 text-sm text-white/80">Atur metode pembayaran</p>
          </div>

          <div className="px-5 mt-4 pb-8 space-y-4">
            {/* Existing Methods */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Metode Pembayaran Aktif</h3>
              {paymentMethods.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">Belum ada metode pembayaran</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold capitalize">
                          {method.type === "bank" ? `${method.bank} - ${method.accountNumber}` : method.type === "qris" ? "QRIS" : method.ewalletProvider?.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleRemovePaymentMethod(idx)}
                          className="p-1 hover:bg-destructive/20 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                      {method.type === "bank" && (
                        <>
                          <p className="text-xs text-muted-foreground">Nama: {method.accountName}</p>
                          <p className="text-xs text-muted-foreground">No: {method.accountNumber}</p>
                        </>
                      )}
                      {method.type === "qris" && method.qrisUrl && (
                        <div className="w-16 h-16">
                          <img src={method.qrisUrl} alt="QR Code" className="w-full h-full" />
                        </div>
                      )}
                      {method.type === "ewallet" && (
                        <p className="text-xs text-muted-foreground">{method.ewalletNumber}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Method */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Tambah Metode Baru</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Tipe Metode</Label>
                  <Select value={newMethod.type} onValueChange={(value: any) => {
                    if (value === "bank") {
                      setNewMethod({
                        type: "bank",
                        bank: "BCA",
                        accountNumber: "",
                        accountName: "",
                      });
                    } else if (value === "qris") {
                      setNewMethod({
                        type: "qris",
                        qrisUrl: "",
                      });
                    } else {
                      setNewMethod({
                        type: "ewallet",
                        ewalletProvider: "gopay",
                        ewalletNumber: "",
                      });
                    }
                  }}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                      <SelectItem value="ewallet">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderPaymentMethodField(newMethod)}

                <button
                  onClick={handleAddPaymentMethod}
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
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1.5 min-h-16 text-xs resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleSavePaymentConfig}
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                <Save className="w-4 h-4" /> Simpan Pembayaran
              </button>
              <button
                onClick={handleClosePaymentModal}
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

  return (
    <AppShell hideNav>
      <div className="pb-8">
        {/* Header - Non-overlapping design */}
        <div className="gradient-navy px-5 pt-6 pb-6 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="relative">
            <button
              onClick={() => history.back()}
              className="w-10 h-10 rounded-full bg-white/15 grid place-items-center mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-xl font-extrabold leading-tight">{program.name}</h1>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">{program.description}</p>
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <FileText className="w-3.5 h-3.5" />
                {categoryLabels[program.category]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(program.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                {" - "}
                {new Date(program.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                Dibuat {new Date(program.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 mt-4">{/* Changed from negative margin to positive margin */}
          {/* Budget Overview */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-soft grid place-items-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground font-medium">Budget Program</p>
                <p className="text-lg font-extrabold text-foreground">{formatRp(program.targetBudget)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-baseline justify-between text-[12px] mb-2">
                  <span className="font-bold text-success">{formatRp(program.collectedBudget)}</span>
                  <span className="text-muted-foreground">terkumpul</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                  {progress}% dari target • Sisa {formatRp(program.targetBudget - program.collectedBudget)}
                </p>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Dari Iuran</p>
                  <p className="text-[13px] font-bold text-foreground">{formatRp(totalFromSkema)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Sumber Lain</p>
                  <p className="text-[13px] font-bold text-foreground">{formatRp(program.collectedBudget - totalFromSkema)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Skema Iuran */}
          {relatedSkema.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Skema Iuran Program ({relatedSkema.length})
              </h2>
              <div className="space-y-2.5">
                {relatedSkema.map(skema => {
                  const skemaProgress = skema.target > 0 
                    ? Math.round((skema.collected / skema.target) * 100) 
                    : 0;
                  const categoryStyle = memberCategoryColors[skema.memberCategory];
                  
                  return (
                    <div key={skema.id} className="bg-card rounded-2xl border border-border card-shadow p-4 space-y-3">
                      <Link
                        to="/laporan/$catId"
                        params={{ catId: skema.id }}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[13px] font-bold text-foreground">{skema.name}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                                {memberCategoryLabels[skema.memberCategory]}
                              </span>
                            </div>
                            {skema.description && (
                              <p className="text-[11px] text-muted-foreground mt-1">{skema.description}</p>
                            )}
                          </div>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            skemaProgress >= 80 ? "bg-success-soft text-success" : "bg-primary-soft text-primary"
                          }`}>
                            {skemaProgress}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-muted-foreground">
                            {skema.paidMembers} / {skema.totalMembers} {memberCategoryLabels[skema.memberCategory].toLowerCase()}
                          </span>
                          <span className="font-bold text-foreground">
                            {formatRp(skema.collected)} / {formatRp(skema.target)}
                          </span>
                        </div>
                        
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              skemaProgress >= 80 ? "bg-success" : skemaProgress >= 50 ? "bg-warning" : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(skemaProgress, 100)}%` }}
                          />
                        </div>
                      </Link>

                      {/* Payment Config Button */}
                      <button
                        onClick={() => handleEditPaymentConfig(skema.id)}
                        className="w-full py-2 px-3 rounded-lg border border-primary/30 bg-primary/5 text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        {skema.paymentConfig?.methods?.length ? `Atur Pembayaran (${skema.paymentConfig.methods.length})` : "Atur Pembayaran"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-secondary border border-border rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Dibuat Oleh</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full gradient-primary text-white grid place-items-center text-[10px] font-bold">
                    {initials(program.createdBy)}
                  </div>
                  <p className="text-[12px] font-bold text-foreground">{program.createdBy}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Tanggal Dibuat</p>
                <p className="text-[12px] font-bold text-foreground mt-1">
                  {new Date(program.createdAt).toLocaleDateString("id-ID", { 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Event
            </button>
            <Link
              to="/program-kerja"
              className="block w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm text-center"
            >
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
