import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { createProtectedRouteGuard } from "@/lib/route-guards";
import { pricingPlans, formatRp } from "@/lib/mock";
import { Check, Crown, Building2, Zap, Star } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  beforeLoad: createProtectedRouteGuard(),
  component: PricingPage,
});

function PricingPage() {
  return (
    <AppShell>
      <div className="px-5 pt-6 pb-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground">Pilih Paket Workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Harga berdasarkan kapasitas, bukan jumlah organisasi
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft border border-primary/20">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <p className="text-[11px] font-bold text-primary">1 Organisasi = 1 Workspace</p>
          </div>
        </div>

        {/* Current Plan Badge */}
        <div className="mt-4 p-3 rounded-xl bg-success-soft border border-success/20 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-success" />
          <p className="text-[12px] font-bold text-success">Kamu saat ini menggunakan paket Free</p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-6 space-y-4">
          {pricingPlans.map((plan, idx) => {
            const isPro = plan.id === "pro";
            const isEnterprise = plan.id === "enterprise";
            const isFree = plan.id === "free";

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 ${
                  isPro ? "border-primary gradient-primary-soft" : "border-border bg-card"
                } card-shadow-lg p-5 relative overflow-hidden`}
              >
                {isPro && (
                  <>
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/5" />
                    <div className="absolute top-3 right-3">
                      <div className="px-2.5 py-1 rounded-full bg-warning text-white text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" /> POPULER
                      </div>
                    </div>
                  </>
                )}

                {isEnterprise && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-partial/5" />
                )}

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${
                    isEnterprise ? "bg-gradient-to-br from-primary to-partial" :
                    isPro ? "bg-primary" :
                    "bg-secondary"
                  } grid place-items-center text-white`}>
                    {isEnterprise ? <Building2 className="w-6 h-6" /> :
                     isPro ? <Crown className="w-6 h-6" /> :
                     <Zap className="w-6 h-6" />}
                  </div>

                  {/* Plan Name */}
                  <h3 className="mt-3 text-lg font-extrabold text-foreground">{plan.name}</h3>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1">
                    {typeof plan.price === "number" ? (
                      <>
                        <span className="text-2xl font-extrabold text-foreground">
                          {plan.price === 0 ? "Gratis" : formatRp(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-sm text-muted-foreground">
                            / {plan.period === "month" ? "bulan" : "tahun"}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xl font-extrabold text-foreground">Custom Pricing</span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mt-4 space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full ${
                          isPro || isEnterprise ? "bg-primary" : "bg-success"
                        } grid place-items-center shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <p className="text-[13px] text-foreground leading-snug flex-1">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      isFree
                        ? "bg-secondary text-foreground border-2 border-border"
                        : isPro
                        ? "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        : "bg-gradient-to-r from-primary to-partial text-white shadow-lg"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Note */}
        <div className="mt-6 p-4 rounded-2xl bg-secondary border border-border">
          <p className="text-[12px] font-bold text-foreground mb-2">💡 Tidak yakin paket mana yang cocok?</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Mulai dengan paket <span className="font-bold text-foreground">Free</span> untuk mencoba fitur dasar, 
            atau langsung upgrade ke <span className="font-bold text-foreground">Pro</span> dengan trial 14 hari gratis.
          </p>
        </div>

        {/* Enterprise Contact */}
        <div className="mt-4 p-5 rounded-2xl gradient-navy text-white card-shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold">Untuk Kampus, Yayasan, Koperasi & Perusahaan</p>
              <p className="text-[11px] text-white/70 mt-1">
                Kelola ratusan organisasi atau ribuan anggota dalam satu dashboard terpusat dengan dukungan penuh dari tim kami.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["🏛️ Universitas", "🏢 Yayasan", "🏦 Koperasi", "🏭 Perusahaan"].map((type, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 text-[10px] font-medium">
                    {type}
                  </span>
                ))}
              </div>
              <button className="mt-3 px-4 py-2 rounded-lg bg-white text-navy text-[12px] font-bold">
                Konsultasi Gratis
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-muted-foreground">
            Punya pertanyaan? <button className="font-bold text-primary">Lihat FAQ</button> atau{" "}
            <button className="font-bold text-primary">Hubungi Support</button>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
