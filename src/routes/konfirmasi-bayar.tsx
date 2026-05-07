import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Camera, ChevronLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { formatRp } from "@/lib/mock";

export const Route = createFileRoute("/konfirmasi-bayar")({
  component: KonfirmasiPage,
});

function KonfirmasiPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <PhoneFrame>
        <div className="min-h-full flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-success-soft grid place-items-center animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-foreground">Konfirmasi Terkirim!</h2>
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
            Bukti pembayaranmu telah dikirim. Menunggu konfirmasi dari bendahara.
          </p>
          <button onClick={() => navigate({ to: "/iuranku" })} className="mt-6 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
            Kembali ke Iuranku
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="px-5 pt-6 pb-8">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-full bg-card border border-border grid place-items-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="mt-4 text-xl font-extrabold text-foreground">Konfirmasi Bayar</h1>
        <p className="text-[12px] text-muted-foreground">Upload bukti pembayaran iuranmu</p>

        <div className="mt-4 p-4 rounded-2xl bg-primary-soft border border-primary/15">
          <p className="text-[11px] text-primary font-bold">DETAIL IURAN</p>
          <p className="mt-1 text-[14px] font-extrabold text-foreground">Iuran Bulanan Mei 2025</p>
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">Jatuh tempo: 20 Mei 2025</span>
            <span className="font-extrabold text-foreground">{formatRp(100000)}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[12px] font-semibold text-foreground mb-1.5">Bukti Pembayaran</p>
          <button className="w-full h-44 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/40 grid place-items-center">
            <div className="flex flex-col items-center gap-2 text-primary">
              <div className="w-12 h-12 rounded-full bg-card grid place-items-center card-shadow">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-[12px] font-bold">Tap untuk upload foto</p>
              <p className="text-[10px] text-muted-foreground">Foto struk atau screenshot transfer</p>
            </div>
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <div>
            <label className="text-[12px] font-semibold text-foreground">Jumlah yang dibayar</label>
            <input type="number" defaultValue={100000} className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-foreground">Metode Pembayaran</label>
            <div className="relative mt-1.5">
              <select className="w-full h-12 px-3.5 pr-10 rounded-xl border-[1.5px] border-border bg-card text-sm appearance-none focus:border-primary focus:outline-none">
                <option>Transfer BCA</option><option>Transfer BRI</option><option>QRIS</option><option>GoPay</option><option>OVO</option><option>Tunai</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-foreground">Catatan (opsional)</label>
            <textarea rows={3} placeholder="Tambahkan catatan..." className="mt-1.5 w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <button onClick={() => setDone(true)} className="mt-6 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
          Kirim Konfirmasi Bayar
        </button>
      </div>
    </PhoneFrame>
  );
}
