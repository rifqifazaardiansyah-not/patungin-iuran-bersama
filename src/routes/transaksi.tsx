import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { recentTx, formatRp, initials, members } from "@/lib/mock";
import { ChevronDown, Image as ImageIcon, Check, X } from "lucide-react";

export const Route = createFileRoute("/transaksi")({
  beforeLoad: createProtectedRouteGuard(),
  component: TransaksiPage,
});

function TransaksiPage() {
  const [tab, setTab] = useState<"catat" | "konfirmasi">("catat");

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <h1 className="text-xl font-extrabold text-foreground">Pencatatan Transaksi</h1>

        {/* tabs */}
        <div className="mt-4 bg-card rounded-2xl p-1.5 grid grid-cols-2 gap-1 card-shadow">
          {([
            { v: "catat", l: "Catat Pembayaran" },
            { v: "konfirmasi", l: "Konfirmasi Bukti" },
          ] as const).map(t => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              className={`py-2.5 rounded-xl text-[12px] font-bold transition ${tab === t.v ? "gradient-primary text-white" : "text-muted-foreground"}`}
            >{t.l}</button>
          ))}
        </div>

        {tab === "catat" ? <CatatForm /> : <KonfirmasiList />}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-semibold text-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select className="w-full h-12 px-3.5 pr-10 rounded-xl border-[1.5px] border-border bg-card text-sm appearance-none focus:border-primary focus:outline-none">
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function CatatForm() {
  return (
    <div className="mt-5 space-y-4">
      <Field label="Pilih Anggota">
        <SelectShell>{members.map(m => <option key={m.id}>{m.name}</option>)}</SelectShell>
      </Field>
      <Field label="Jenis Iuran">
        <SelectShell>
          <option>Iuran Bulanan</option>
          <option>Iuran Mingguan</option>
          <option>Patungan Event</option>
        </SelectShell>
      </Field>
      <Field label="Jumlah (Rp)">
        <input type="number" placeholder="100000" className="w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
      </Field>
      <Field label="Metode">
        <SelectShell>
          <option>Transfer BCA</option><option>Transfer BRI</option><option>QRIS</option><option>Tunai</option><option>GoPay</option><option>OVO</option>
        </SelectShell>
      </Field>
      <Field label="Status">
        <SelectShell>
          <option>Sudah Bayar</option><option>Sebagian</option><option>Terlambat</option>
        </SelectShell>
      </Field>
      <Field label="Catatan (opsional)">
        <textarea rows={3} placeholder="Tambahkan catatan..." className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
      </Field>
      <button className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
        Simpan Pembayaran
      </button>

      <div className="mt-4">
        <p className="text-sm font-bold text-foreground mb-2.5">Transaksi Terbaru</p>
        <div className="bg-card rounded-2xl border border-border card-shadow divide-y divide-border">
          {recentTx.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-3.5">
              <div className="w-9 h-9 rounded-full gradient-primary text-white grid place-items-center text-[11px] font-bold">{initials(tx.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{tx.name}</p>
                <p className="text-[11px] text-muted-foreground">{tx.type} · {tx.date}</p>
              </div>
              <p className="text-[13px] font-extrabold text-foreground">{formatRp(tx.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KonfirmasiList() {
  const proofs = [
    { id: 1, name: "Siti Nurhaliza", amount: 100000, time: "10 menit lalu" },
    { id: 2, name: "Dewi Lestari", amount: 50000, time: "1 jam lalu" },
    { id: 3, name: "Budi Santoso", amount: 100000, time: "3 jam lalu" },
  ];
  return (
    <div className="mt-5 space-y-3">
      {proofs.map(p => (
        <div key={p.id} className="bg-card rounded-2xl border border-border card-shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary text-white grid place-items-center text-[11px] font-extrabold">{initials(p.name)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.time}</p>
            </div>
            <p className="text-[14px] font-extrabold text-foreground">{formatRp(p.amount)}</p>
          </div>
          <div className="mt-3 h-32 rounded-xl bg-secondary border border-dashed border-border grid place-items-center">
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[11px] font-medium">Bukti Transfer</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-xl bg-success text-white font-bold text-[12px] flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" /> Konfirmasi Lunas
            </button>
            <button className="py-2.5 rounded-xl border-[1.5px] border-destructive text-destructive font-bold text-[12px] flex items-center justify-center gap-1.5">
              <X className="w-4 h-4" /> Tolak
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
