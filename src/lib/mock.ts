export type Role = "bendahara" | "anggota";

export type PaymentStatus = "paid" | "partial" | "unpaid" | "late";

export const statusMeta: Record<PaymentStatus, { label: string; color: string; dot: string; bg: string }> = {
  paid:    { label: "Sudah Bayar", color: "text-success",     dot: "bg-success",     bg: "bg-success-soft" },
  partial: { label: "Sebagian",    color: "text-partial",     dot: "bg-partial",     bg: "bg-partial-soft" },
  unpaid:  { label: "Belum Bayar", color: "text-destructive", dot: "bg-destructive", bg: "bg-destructive-soft" },
  late:    { label: "Terlambat",   color: "text-warning",     dot: "bg-warning",     bg: "bg-warning-soft" },
};

export const formatRp = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

export const initials = (name: string) =>
  name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

export const group = {
  name: "HMTI 2025",
  code: "PTGN-7823",
  institution: "Universitas Indonesia",
  program: "Teknik Industri",
  period: "Mei 2025",
  bendahara: "Rina Andini",
  memberCount: 32,
  target: 3200000,
  collected: 2150000,
  duesTypes: [
    { name: "Iuran Bulanan", amount: 100000, status: "Aktif" },
    { name: "Patungan Event", amount: 50000, status: "Aktif" },
    { name: "Iuran Mingguan", amount: 25000, status: "Selesai" },
  ],
  banks: [
    { bank: "BCA", number: "1234567890", holder: "Rina Andini" },
    { bank: "BRI", number: "9876543210", holder: "Rina Andini" },
  ],
};

export const members = [
  { id: 1, name: "Andi Pratama", nim: "2021001", phone: "0812-3456-7890", status: "paid"    as PaymentStatus, lastPaid: "12 Mei 2025" },
  { id: 2, name: "Siti Nurhaliza", nim: "2021002", phone: "0813-1111-2222", status: "unpaid" as PaymentStatus, lastPaid: null },
  { id: 3, name: "Budi Santoso", nim: "2021003", phone: "0856-7777-8888", status: "partial" as PaymentStatus, lastPaid: "10 Mei 2025" },
  { id: 4, name: "Dewi Lestari", nim: "2021004", phone: "0821-3333-4444", status: "late"    as PaymentStatus, lastPaid: "Apr 2025" },
  { id: 5, name: "Rio Hidayat",  nim: "2021005", phone: "0857-2222-9999", status: "paid"    as PaymentStatus, lastPaid: "5 Mei 2025" },
  { id: 6, name: "Maya Putri",   nim: "2021006", phone: "0838-1010-5050", status: "paid"    as PaymentStatus, lastPaid: "8 Mei 2025" },
];

export type CategoryKind = "rutin" | "event" | "done";

export const categories = [
  {
    id: "iuran-april",
    name: "Iuran Bulanan – April 2025",
    kind: "rutin" as CategoryKind,
    period: "April 2025",
    typeLabel: "Iuran Rutin",
    target: 400000,
    collected: 300000,
    totalMembers: 8,
    paidMembers: 6,
    paid: [
      { id: 1, name: "Andi Pratama", amount: 50000, date: "5 Apr 2025", method: "BCA Transfer" },
      { id: 2, name: "Maya Putri",   amount: 50000, date: "6 Apr 2025", method: "QRIS" },
      { id: 3, name: "Rio Hidayat",  amount: 50000, date: "7 Apr 2025", method: "BCA Transfer" },
      { id: 4, name: "Budi Santoso", amount: 50000, date: "8 Apr 2025", method: "Tunai" },
      { id: 5, name: "Dewi Lestari", amount: 50000, date: "9 Apr 2025", method: "QRIS" },
      { id: 6, name: "Sinta Maharani", amount: 50000, date: "10 Apr 2025", method: "BRI Transfer" },
    ],
    unpaid: [
      { id: 7, name: "Siti Nurhaliza" },
      { id: 8, name: "Tono Wijaya" },
    ],
  },
  {
    id: "ospek-2025",
    name: "Patungan Ospek 2025",
    kind: "event" as CategoryKind,
    period: "Event Ospek 2025",
    typeLabel: "Patungan Event",
    target: 600000,
    collected: 375000,
    totalMembers: 8,
    paidMembers: 5,
    paid: [
      { id: 1, name: "Andi Pratama", amount: 75000, date: "12 Apr 2025", method: "QRIS" },
      { id: 2, name: "Maya Putri",   amount: 75000, date: "12 Apr 2025", method: "BCA Transfer" },
      { id: 3, name: "Rio Hidayat",  amount: 75000, date: "13 Apr 2025", method: "BCA Transfer" },
      { id: 4, name: "Dewi Lestari", amount: 75000, date: "14 Apr 2025", method: "QRIS" },
      { id: 5, name: "Sinta Maharani", amount: 75000, date: "15 Apr 2025", method: "Tunai" },
    ],
    unpaid: [
      { id: 6, name: "Siti Nurhaliza" },
      { id: 7, name: "Budi Santoso" },
      { id: 8, name: "Tono Wijaya" },
    ],
  },
  {
    id: "iuran-mingguan",
    name: "Iuran Mingguan – Maret 2025",
    kind: "done" as CategoryKind,
    period: "Maret 2025",
    typeLabel: "Iuran Rutin",
    target: 200000,
    collected: 200000,
    totalMembers: 8,
    paidMembers: 8,
    paid: [],
    unpaid: [],
  },
];

export const recentTx = [
  { id: 1, name: "Andi Pratama", type: "Iuran Bulanan", amount: 100000, status: "paid"    as PaymentStatus, date: "12 Mei" },
  { id: 2, name: "Maya Putri",   type: "Patungan Event", amount: 50000, status: "paid"    as PaymentStatus, date: "10 Mei" },
  { id: 3, name: "Budi Santoso", type: "Iuran Bulanan", amount: 50000, status: "partial" as PaymentStatus, date: "9 Mei" },
  { id: 4, name: "Rio Hidayat",  type: "Iuran Bulanan", amount: 100000, status: "paid"    as PaymentStatus, date: "5 Mei" },
];

export const announcements = [
  { id: 1, title: "Pengingat Iuran Mei", body: "Mohon segera bayar iuran bulanan sebelum tanggal 20 Mei 2025.", date: "2 hari lalu", priority: "important" },
  { id: 2, title: "Patungan Acara Buka Bersama", body: "Yuk patungan untuk buka bersama HMTI! Target Rp 50.000 per orang.", date: "5 hari lalu", priority: "normal" },
];

export const notifications = [
  { id: 1, type: "broadcast" as const, title: "Pengingat Iuran Mei", message: "Mohon segera bayar iuran bulanan sebelum 20 Mei.", time: "2 jam lalu", unread: true },
  { id: 2, type: "payment"   as const, title: "Pembayaran Dikonfirmasi", message: "Bukti pembayaran kamu telah dikonfirmasi.", time: "1 hari lalu", unread: true },
  { id: 3, type: "reminder"  as const, title: "Iuran Jatuh Tempo", message: "Iuran bulanan jatuh tempo besok.", time: "1 hari lalu", unread: false },
  { id: 4, type: "success"   as const, title: "Bukti Diterima", message: "Bukti transfer berhasil diunggah.", time: "3 hari lalu", unread: false },
];

export const myDues = [
  { id: 1, month: "Mei 2025",   type: "Iuran Bulanan", due: "20 Mei 2025", amount: 100000, status: "unpaid" as PaymentStatus },
  { id: 2, month: "April 2025", type: "Iuran Bulanan", due: "20 Apr 2025", amount: 100000, status: "paid"   as PaymentStatus, paidAt: "18 Apr 2025", method: "BCA Transfer" },
  { id: 3, month: "April 2025", type: "Patungan Event", due: "15 Apr 2025", amount: 50000,  status: "paid"   as PaymentStatus, paidAt: "14 Apr 2025", method: "QRIS" },
  { id: 4, month: "Maret 2025", type: "Iuran Bulanan", due: "20 Mar 2025", amount: 100000, status: "late"   as PaymentStatus },
  { id: 5, month: "Maret 2025", type: "Iuran Mingguan", due: "10 Mar 2025", amount: 25000, status: "paid"   as PaymentStatus, paidAt: "9 Mar 2025", method: "Tunai" },
];

// === NEW: Organizations Data (V1.1) ===
export interface Organization {
  id: string;
  name: string;
  type: "kampus" | "ukm" | "bem" | "komunitas" | "panitia";
  memberCount: number;
  role: Role;
  balance: number;
  duesStatus: PaymentStatus;
  period: string;
  isActive: boolean;
}

export const organizations: Organization[] = [
  {
    id: "hmti-2025",
    name: "HMTI 2025",
    type: "kampus",
    memberCount: 32,
    role: "bendahara",
    balance: 2150000,
    duesStatus: "paid",
    period: "Mei 2025",
    isActive: true,
  },
  {
    id: "bem-fakultas",
    name: "BEM Fakultas Teknik",
    type: "bem",
    memberCount: 125,
    role: "anggota",
    balance: 4500000,
    duesStatus: "paid",
    period: "Mei 2025",
    isActive: true,
  },
  {
    id: "panitia-semnas",
    name: "Panitia Seminar Nasional 2025",
    type: "panitia",
    memberCount: 45,
    role: "anggota",
    balance: 8750000,
    duesStatus: "unpaid",
    period: "Event 2025",
    isActive: true,
  },
];

// === NEW: Pricing Plans Data (V1.1) ===
export interface PricingPlan {
  id: string;
  name: string;
  price: number | "custom";
  period: "month" | "year" | "one-time";
  features: string[];
  popular?: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    cta: "Mulai Gratis",
    features: [
      "1 Organisasi",
      "Maksimal 50 Anggota",
      "Fitur Dasar Iuran",
      "Laporan Sederhana",
      "Support Komunitas",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29000,
    period: "month",
    popular: true,
    cta: "Coba 14 Hari Gratis",
    features: [
      "Hingga 5 Organisasi",
      "Unlimited Anggota",
      "Reminder Otomatis (WhatsApp & Email)",
      "Export PDF & Excel",
      "Laporan Lengkap",
      "Priority Support",
      "Custom Kategori Iuran",
    ],
  },
  {
    id: "campus",
    name: "Campus",
    price: "custom",
    period: "year",
    cta: "Hubungi Sales",
    features: [
      "Dashboard Kampus Terpusat",
      "Monitoring Seluruh Organisasi",
      "Laporan Konsolidasi",
      "White Label (Custom Branding)",
      "API Access",
      "Dedicated Account Manager",
      "On-Premise Deployment (Optional)",
      "Training & Onboarding",
    ],
  },
];

// === NEW: Campus Stats (V1.1) ===
export const campusStats = {
  totalOrganizations: 47,
  totalMembers: 1834,
  totalBalance: 127500000,
  activeOrganizations: 42,
};

const ROLE_KEY = "patungin_role";
const NAME_KEY = "patungin_name";

export const auth = {
  getRole(): Role {
    if (typeof window === "undefined") return "bendahara";
    return (localStorage.getItem(ROLE_KEY) as Role) || "bendahara";
  },
  getName(): string {
    if (typeof window === "undefined") return "Rina";
    return localStorage.getItem(NAME_KEY) || "Rina Andini";
  },
  setSession(role: Role, name: string) {
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(NAME_KEY, name);
  },
  clear() {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
  },
};
