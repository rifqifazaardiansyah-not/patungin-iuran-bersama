import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { createAnggotaOnlyGuard } from "@/lib/route-guards";
import { ChevronLeft, Building2, CheckCircle2, Users } from "lucide-react";
import { group } from "@/lib/mock";

export const Route = createFileRoute("/join-grup")({
  beforeLoad: createAnggotaOnlyGuard(),
  component: JoinPage,
});

function JoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "preview" | "done">("input");

  return (
    <PhoneFrame>
      <div className="px-5 pt-6 pb-8 min-h-full">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-full bg-card border border-border grid place-items-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        {step === "input" && (
          <>
            <h1 className="mt-4 text-xl font-extrabold text-foreground">Gabung Grup</h1>
            <p className="text-[12px] text-muted-foreground">Masukkan kode grup dari Bendahara</p>

            <div className="mt-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary-soft grid place-items-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="PTGN-XXXX"
                className="mt-6 w-full h-14 text-center text-lg font-extrabold tracking-widest rounded-xl border-[1.5px] border-border bg-card focus:border-primary focus:outline-none"
              />
              <p className="mt-2 text-[11px] text-muted-foreground text-center">Contoh: {group.code}</p>
            </div>

            <button
              onClick={() => setStep("preview")}
              disabled={code.length < 4}
              className="mt-8 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 disabled:opacity-40"
            >
              Bergabung
            </button>
          </>
        )}

        {step === "preview" && (
          <>
            <h1 className="mt-4 text-xl font-extrabold text-foreground">Konfirmasi Grup</h1>
            <p className="text-[12px] text-muted-foreground">Pastikan ini grup yang benar</p>
            <div className="mt-6 bg-card rounded-2xl border border-border card-shadow p-5 text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary grid place-items-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <p className="mt-3 text-base font-extrabold text-foreground">{group.name}</p>
              <p className="text-[11px] text-muted-foreground">{group.institution}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Bendahara: {group.bendahara}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-[11px] font-bold">
                <Users className="w-3.5 h-3.5" /> {group.memberCount} anggota
              </div>
            </div>
            <button onClick={() => setStep("done")} className="mt-6 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
              Konfirmasi & Gabung
            </button>
          </>
        )}

        {step === "done" && (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-success-soft grid place-items-center animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-foreground">Berhasil Bergabung!</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">Permintaanmu menunggu persetujuan Bendahara.</p>
            <button onClick={() => navigate({ to: "/home" })} className="mt-8 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
              Lanjut ke Beranda
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
