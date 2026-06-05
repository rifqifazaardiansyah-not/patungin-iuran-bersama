import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { createAnggotaOnlyGuard } from "@/lib/route-guards";
import { myDues, formatRp, PaymentStatus, skemaIuran, programKerja, type SkemaIuran } from "@/lib/mock";
import { CheckCircle2, AlertTriangle, ChevronDown, FolderOpen, Coins } from "lucide-react";

export const Route = createFileRoute("/iuranku")({
  beforeLoad: createAnggotaOnlyGuard(),
  component: IurankuPage,
});

const filters: { v: "all" | PaymentStatus; l: string }[] = [
  { v: "all", l: "Semua" },
  { v: "paid", l: "Sudah" },
  { v: "unpaid", l: "Belum" },
  { v: "late", l: "Terlambat" },
];

function IurankuPage() {
  const [filter, setFilter] = useState<typeof filters[number]["v"]>("all");
  const [month, setMonth] = useState("Mei");
  const [expandedPaymentId, setExpandedPaymentId] = useState<number | null>(null);
  const currentUserId = 1; // Simulate logged in user (Andi Pratama)

  // Get all my dues: organization + event-based
  const allMyDues = useMemo(() => {
    // Original organization dues
    const orgDues = myDues;
    
    // Event-based dues where I'm targeted
    const eventDues = skemaIuran
      .filter(skema => 
        skema.targetType === "program" &&
        (skema.targetMemberIds === "all" || 
         (Array.isArray(skema.targetMemberIds) && skema.targetMemberIds.includes(currentUserId)))
      )
      .map(skema => {
        const isPaid = skema.paid.some(p => p.id === currentUserId);
        const paidRecord = skema.paid.find(p => p.id === currentUserId);
        const program = programKerja.find(p => p.id === skema.programKerjaId);
        
        return {
          id: parseInt(skema.id.replace(/[^0-9]/g, '')) + 1000, // Unique ID
          month: program ? new Date(program.startDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "Mei 2025",
          type: skema.name,
          due: skema.dueDate || "Segera",
          amount: skema.amount || 0,
          status: (isPaid ? "paid" : "unpaid") as PaymentStatus,
          paidAt: paidRecord?.date,
          method: paidRecord?.method,
          eventName: program?.name,
          eventId: skema.programKerjaId,
          skemaId: skema.id, // Add skema ID for payment config lookup
        };
      });
    
    return [...orgDues, ...eventDues];
  }, [currentUserId]);

  const totalPaid = allMyDues.filter(d => d.status === "paid").reduce((s, d) => s + d.amount, 0);
  const totalUnpaid = allMyDues.filter(d => d.status !== "paid").reduce((s, d) => s + d.amount, 0);
  const pct = totalPaid + totalUnpaid > 0 ? Math.round((totalPaid / (totalPaid + totalUnpaid)) * 100) : 0;

  const list = allMyDues.filter(d => filter === "all" || d.status === filter);
  const grouped = list.reduce<Record<string, typeof list>>((acc, d) => {
    (acc[d.month] ||= []).push(d); return acc;
  }, {});

  const getPaymentConfig = (dueType: string, skemaId?: string): SkemaIuran | undefined => {
    // First try to find by skemaId (for event dues)
    if (skemaId) {
      const found = skemaIuran.find(s => s.id === skemaId);
      if (found) return found;
    }
    
    // Fallback: search by name (for organization dues and fallback)
    // Try exact match first
    let found = skemaIuran.find(s => s.name === dueType);
    if (found) return found;
    
    // Try partial match (e.g., "Iuran Bulanan" matches "Iuran Bulanan – April 2025")
    found = skemaIuran.find(s => s.name.includes(dueType) || dueType.includes(s.name));
    if (found) return found;
    
    // Last resort: find any organization skema with matching type label
    if (dueType.includes("Bulanan")) {
      return skemaIuran.find(s => s.targetType === "organization" && s.typeLabel === "Iuran Rutin");
    }
    if (dueType.includes("Event") || dueType.includes("Patungan")) {
      return skemaIuran.find(s => s.targetType === "organization" && s.typeLabel === "Patungan Event");
    }
    
    return undefined;
  };

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <h1 className="text-xl font-extrabold text-foreground">Rekap Iuran Saya</h1>

        <div className="mt-4 rounded-2xl gradient-navy p-5 text-white card-shadow-lg flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="white" strokeOpacity="0.15" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="#16A34A" strokeWidth="8" fill="none"
                strokeDasharray={`${(pct/100)*201} 201`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-sm font-extrabold">{pct}%</div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-white/60 font-medium">Total Terbayar</p>
            <p className="text-base font-extrabold">{formatRp(totalPaid)}</p>
            <p className="mt-2 text-[10px] text-white/60 font-medium">Total Belum Bayar</p>
            <p className="text-sm font-bold text-warning">{formatRp(totalUnpaid)}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border ${filter === f.v ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"}`}
            >{f.l}</button>
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu"].map(m => (
            <button key={m} onClick={() => setMonth(m)}
              className={`shrink-0 w-12 h-10 rounded-xl text-[11px] font-bold ${month === m ? "gradient-primary text-white" : "bg-card border border-border text-muted-foreground"}`}
            >{m}</button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(grouped).map(([m, items]) => (
            <div key={m}>
              <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">{m}</p>
              <div className="space-y-2.5">
                {items.map(d => {
                  const isEventDue = 'eventName' in d && 'skemaId' in d;
                  const scheme = getPaymentConfig(d.type, isEventDue ? (d as any).skemaId : undefined);
                  const isExpanded = expandedPaymentId === d.id;
                  
                  return (
                    <div key={d.id} className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {isEventDue && d.eventName && (
                              <div className="flex items-center gap-1.5 mb-1">
                                <FolderOpen className="w-3 h-3 text-primary" />
                                <p className="text-[10px] font-bold text-primary">{d.eventName}</p>
                              </div>
                            )}
                            {!isEventDue && (
                              <div className="flex items-center gap-1.5 mb-1">
                                <Coins className="w-3 h-3 text-success" />
                                <p className="text-[10px] font-bold text-success">Iuran Organisasi</p>
                              </div>
                            )}
                            <p className="text-[13px] font-extrabold text-foreground">{d.type}</p>
                            <p className="text-[11px] text-muted-foreground">Jatuh tempo: {d.due}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-extrabold text-foreground">{formatRp(d.amount)}</p>
                            <div className="mt-1"><StatusBadge status={d.status} /></div>
                          </div>
                        </div>
                        {d.status === "paid" ? (
                          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-success-soft text-success">
                            <CheckCircle2 className="w-4 h-4" />
                            <p className="text-[11px] font-semibold">Dibayar {d.paidAt} · {d.method}</p>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-destructive">
                              <AlertTriangle className="w-4 h-4" />
                              <p className="text-[11px] font-semibold">Belum dibayar</p>
                            </div>
                            <button
                              onClick={() => setExpandedPaymentId(isExpanded ? null : d.id)}
                              className="px-3 py-1 rounded-lg border-[1.5px] border-primary text-primary text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>Cara Bayar</span>
                              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Payment Methods Expansion */}
                      {isExpanded && (
                        <div className="border-t border-border px-4 py-3 bg-secondary/40 space-y-3">
                          {scheme?.paymentConfig ? (
                            <>
                              {scheme.paymentConfig.instructions && (
                                <p className="text-[11px] text-muted-foreground italic">{scheme.paymentConfig.instructions}</p>
                              )}
                              
                              <div className="space-y-2">
                                {scheme.paymentConfig.methods.map((method, idx) => (
                                  <div key={idx} className="p-2 bg-card rounded-lg border border-border/50">
                                    {method.type === "bank" && (
                                      <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-foreground">{method.bank} - {method.accountNumber}</p>
                                        <p className="text-[10px] text-muted-foreground">a.n. {method.accountName}</p>
                                      </div>
                                    )}
                                    {method.type === "qris" && (
                                      <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-foreground">{method.qrisLabel || "QRIS"}</p>
                                        {method.qrisUrl && (
                                          <img src={method.qrisUrl} alt="QRIS" className="w-20 h-20" />
                                        )}
                                      </div>
                                    )}
                                    {method.type === "ewallet" && (
                                      <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-foreground">{method.ewalletProvider?.toUpperCase()}</p>
                                        <p className="text-[10px] text-muted-foreground">{method.ewalletNumber}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <Link to="/konfirmasi-bayar" className="block mt-2 px-3.5 py-2.5 rounded-lg gradient-primary text-white text-[11px] font-bold text-center">
                                Segera Bayar Sekarang
                              </Link>
                            </>
                          ) : (
                            <>
                              <p className="text-[11px] text-muted-foreground italic">
                                Info pembayaran untuk iuran ini dapat dilihat di halaman Info Grup atau hubungi bendahara.
                              </p>
                              
                              <div className="space-y-2">
                                <Link to="/info-grup" className="block px-3.5 py-2.5 rounded-lg border-[1.5px] border-primary text-primary text-[11px] font-bold text-center">
                                  Lihat Info Rekening Grup
                                </Link>
                                <Link to="/konfirmasi-bayar" className="block px-3.5 py-2.5 rounded-lg gradient-primary text-white text-[11px] font-bold text-center">
                                  Upload Bukti Bayar
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
