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
