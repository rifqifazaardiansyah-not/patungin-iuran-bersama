import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChevronLeft, Send, CheckCircle2, Megaphone } from "lucide-react";
import { announcements, group } from "@/lib/mock";

export const Route = createFileRoute("/pengumuman")({
  component: PengumumanPage,
});

function PengumumanPage() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState<"normal" | "important">("normal");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <PhoneFrame>
        <div className="min-h-full flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-success-soft grid place-items-center animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-foreground">Pengumuman Terkirim!</h2>
          <p className="mt-2 text-[13px] text-muted-foreground">Terkirim ke {group.memberCount} anggota ✓</p>
          <button onClick={() => navigate({ to: "/home" })} className="mt-6 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
            Kembali ke Beranda
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
        <h1 className="mt-4 text-xl font-extrabold text-foreground">Kirim Pengumuman</h1>
        <p className="text-[12px] text-muted-foreground">Akan dikirim ke seluruh anggota grup</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-foreground">Judul Pengumuman</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Pengingat Iuran Mei"
              className="mt-1.5 w-full h-12 px-3.5 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-foreground">Isi Pengumuman</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="Tulis pengumuman untuk semua anggota..."
              className="mt-1.5 w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border bg-card text-sm focus:border-primary focus:outline-none" />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-foreground">Prioritas</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {([{ v: "normal", l: "Normal" }, { v: "important", l: "Penting 🔴" }] as const).map(p => (
                <button key={p.v} onClick={() => setPriority(p.v)}
                  className={`py-3 rounded-xl text-[12px] font-bold border-[1.5px] ${priority === p.v ? (p.v === "important" ? "bg-destructive text-white border-destructive" : "gradient-primary text-white border-transparent") : "bg-card border-border text-muted-foreground"}`}
                >{p.l}</button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-primary-soft border border-primary/15">
            <p className="text-[11px] font-bold text-primary">TARGET</p>
            <p className="text-[13px] font-bold text-foreground mt-0.5">Semua Anggota ({group.memberCount} orang)</p>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-foreground mb-2">Preview</p>
            <div className={`rounded-2xl p-4 border ${priority === "important" ? "border-destructive/30" : "border-border"} bg-card card-shadow flex gap-3`}>
              <div className={`w-10 h-10 rounded-xl ${priority === "important" ? "bg-destructive-soft" : "bg-primary-soft"} grid place-items-center shrink-0`}>
                <Megaphone className={`w-5 h-5 ${priority === "important" ? "text-destructive" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-bold text-foreground">{title || "Judul pengumuman"}</p>
                  {priority === "important" && <span className="px-1.5 py-0.5 rounded-md bg-destructive text-white text-[9px] font-bold">PENTING</span>}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{body || "Isi pengumuman muncul di sini..."}</p>
              </div>
            </div>
          </div>

          <button onClick={() => setSent(true)} className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Kirim Pengumuman
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-foreground mb-2.5">Riwayat Pengumuman</p>
          <div className="space-y-2.5">
            {announcements.map(a => (
              <div key={a.id} className="bg-card rounded-2xl border border-border card-shadow p-3.5">
                <p className="text-[12px] font-bold text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
