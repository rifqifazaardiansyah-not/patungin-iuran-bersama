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

// === REMOVED: Organizations List (V2.1) ===
// Workspace model: 1 Organization = 1 Workspace
// No need for multi-org per user - removed organizations array

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

// === UPDATED: Pricing Plans Data (V2.1 - Workspace Model) ===
export interface PricingPlan {
  id: string;
  name: string;
  price: number | "custom";
  period: "month" | "year" | "one-time";
  features: string[];
  popular?: boolean;
  cta: string;
  limits?: {
    members?: number;
    admins?: number;
    programs?: number;
    skemaIuran?: number;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    cta: "Paket Aktif",
    limits: {
      members: 30,
      admins: 1,
      programs: 1,
      skemaIuran: 2,
    },
    features: [
      "Maksimal 30 Anggota",
      "1 Admin/Bendahara",
      "Maksimal 1 Event Aktif",
      "Maksimal 2 Skema Iuran per Event",
      "Dashboard Dasar",
      "Laporan Sederhana (PDF)",
      "Upload Bukti Pembayaran",
      "Pengumuman Broadcast",
      "Support Email (2-3 hari)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79000,
    period: "month",
    popular: true,
    cta: "Coba 14 Hari Gratis",
    limits: {
      members: 999999,
      admins: 999999,
      programs: 999999,
      skemaIuran: 999999,
    },
    features: [
      "Anggota Unlimited",
      "Multi Admin/Bendahara",
      "Event Unlimited",
      "Skema Iuran Unlimited per Event",
      "Target Anggota Spesifik (Panitia, Peserta, Pengurus)",
      "Reminder Otomatis via WhatsApp",
      "Export Excel & PDF Lengkap",
      "Dashboard Analytics & Statistik",
      "Laporan Detail per Event & Skema",
      "QR Code & Payment Gateway",
      "Custom Role & Permission",
      "Priority Support (24 jam)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "custom",
    period: "year",
    cta: "Hubungi Sales",
    features: [
      "Semua Fitur Pro",
      "Multi-Organization Dashboard",
      "Kapasitas Custom (Ribuan Anggota)",
      "Dedicated Server/Instance",
      "White Label (Custom Branding)",
      "API Access untuk Integrasi",
      "Single Sign-On (SSO)",
      "Audit Log Lengkap",
      "Auto Backup & Recovery",
      "Dedicated Account Manager",
      "Training & Onboarding Tim",
      "24/7 Priority Support",
      "On-Premise Deployment (Optional)",
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

// === NEW: Program Kerja Data (V2.0) ===
export type ProgramStatus = "draft" | "active" | "completed" | "cancelled";
export type ProgramCategory = "event" | "kegiatan" | "pengembangan" | "sosial";

export interface ProgramKerja {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: ProgramStatus;
  startDate: string;
  endDate: string;
  targetBudget: number;
  collectedBudget: number;
  category: ProgramCategory;
  createdAt: string;
  createdBy: string;
}

export const programKerja: ProgramKerja[] = [
  {
    id: "semnas-2025",
    organizationId: "hmti-2025",
    name: "Seminar Nasional Teknologi 2025",
    description: "Seminar nasional tentang perkembangan teknologi industri 4.0 dan artificial intelligence",
    status: "active",
    startDate: "2025-06-01",
    endDate: "2025-06-15",
    targetBudget: 5000000,
    collectedBudget: 3750000,
    category: "event",
    createdAt: "2025-04-01",
    createdBy: "Rina Andini"
  },
  {
    id: "studytour-bandung",
    organizationId: "hmti-2025",
    name: "Study Tour Bandung",
    description: "Kunjungan industri ke pabrik-pabrik teknologi di Bandung",
    status: "active",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    targetBudget: 3200000,
    collectedBudget: 2400000,
    category: "kegiatan",
    createdAt: "2025-04-15",
    createdBy: "Rina Andini"
  },
  {
    id: "baksos-ramadan",
    organizationId: "hmti-2025",
    name: "Bakti Sosial Ramadan",
    description: "Berbagi takjil dan santunan untuk warga sekitar kampus",
    status: "completed",
    startDate: "2025-03-15",
    endDate: "2025-04-10",
    targetBudget: 1500000,
    collectedBudget: 1500000,
    category: "sosial",
    createdAt: "2025-02-20",
    createdBy: "Rina Andini"
  },
  {
    id: "workshop-python",
    organizationId: "hmti-2025",
    name: "Workshop Python for Data Science",
    description: "Pelatihan Python dasar hingga data analysis untuk anggota",
    status: "draft",
    startDate: "2025-08-01",
    endDate: "2025-08-03",
    targetBudget: 2000000,
    collectedBudget: 0,
    category: "pengembangan",
    createdAt: "2025-05-01",
    createdBy: "Rina Andini"
  },
  {
    id: "teknofest-2025",
    organizationId: "hmti-2025",
    name: "Teknofest HMTI 2025",
    description: "Festival teknologi tahunan dengan kompetisi robotik dan IoT",
    status: "active",
    startDate: "2025-09-15",
    endDate: "2025-09-17",
    targetBudget: 8000000,
    collectedBudget: 1200000,
    category: "event",
    createdAt: "2025-04-20",
    createdBy: "Rina Andini"
  }
];

// === EVOLVED: Skema Iuran (V2.1) ===
// Evolved to support targeted members and multiple skema per program
export type TargetType = "organization" | "program";
export type MemberCategory = "all" | "panitia" | "peserta" | "pengurus" | "custom";

// === NEW: Payment Methods & Configuration (V2.2) ===
export type PaymentMethodType = "bank" | "qris" | "ewallet";
export type BankType = "BCA" | "BRI" | "BNI" | "MANDIRI" | "CIMB" | "OJK";
export type EwalletType = "gopay" | "ovo" | "dana" | "linkaja";

export interface BankPaymentMethod {
  type: "bank";
  bank: BankType;
  accountNumber: string;
  accountName: string;
}

export interface QrisPaymentMethod {
  type: "qris";
  qrisUrl: string; // URL or base64 data URI
  qrisLabel?: string; // e.g., "QRIS Rina Andini"
}

export interface EwalletPaymentMethod {
  type: "ewallet";
  ewalletProvider: EwalletType;
  ewalletNumber: string;
  accountName?: string;
}

export type PaymentMethod = BankPaymentMethod | QrisPaymentMethod | EwalletPaymentMethod;

export interface PaymentConfig {
  methods: PaymentMethod[];
  instructions?: string; // Custom instructions for payment
  dueDate?: string; // Override scheme's dueDate if needed
}

export interface SkemaIuran {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  targetType: TargetType;
  programKerjaId?: string;
  kind: CategoryKind;
  period: string;
  typeLabel: string;
  amount?: number;
  target: number;
  collected: number;
  totalMembers: number;
  paidMembers: number;
  dueDate?: string;
  status?: "active" | "completed" | "cancelled";
  // NEW in V2.1: Targeted members
  memberCategory: MemberCategory;
  targetMemberIds: number[] | "all"; // specific member IDs or "all"
  // NEW in V2.2: Payment configuration
  paymentConfig?: PaymentConfig;
  paid: Array<{ id: number; name: string; amount: number; date: string; method: string }>;
  unpaid: Array<{ id: number; name: string }>;
}

// Migrate existing categories to SkemaIuran format
export const skemaIuran: SkemaIuran[] = [
  // Existing data (migrated with backward compatibility)
  {
    id: "iuran-april",
    organizationId: "hmti-2025",
    name: "Iuran Bulanan – April 2025",
    targetType: "organization",
    kind: "rutin" as CategoryKind,
    period: "April 2025",
    typeLabel: "Iuran Rutin",
    amount: 50000,
    target: 400000,
    collected: 300000,
    totalMembers: 8,
    paidMembers: 6,
    status: "completed",
    memberCategory: "all",
    targetMemberIds: "all",
    paymentConfig: {
      methods: [
        {
          type: "bank",
          bank: "BCA",
          accountNumber: "1234567890",
          accountName: "Rina Andini",
        },
        {
          type: "bank",
          bank: "BRI",
          accountNumber: "9876543210",
          accountName: "Rina Andini",
        },
        {
          type: "qris",
          qrisUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // Placeholder QR image
          qrisLabel: "QRIS Rina Andini",
        },
      ],
      instructions: "Bayar langsung dengan QR atau transfer ke rekening BCA/BRI atas nama Rina Andini",
    },
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
    organizationId: "hmti-2025",
    name: "Patungan Ospek 2025",
    targetType: "organization",
    kind: "event" as CategoryKind,
    period: "Event Ospek 2025",
    typeLabel: "Patungan Event",
    amount: 75000,
    target: 600000,
    collected: 375000,
    totalMembers: 8,
    paidMembers: 5,
    status: "completed",
    memberCategory: "all",
    targetMemberIds: "all",
    paymentConfig: {
      methods: [
        {
          type: "qris",
          qrisUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          qrisLabel: "QRIS",
        },
        {
          type: "ewallet",
          ewalletProvider: "gopay",
          ewalletNumber: "+6282134567890",
          accountName: "Rina Andini",
        },
        {
          type: "ewallet",
          ewalletProvider: "ovo",
          ewalletNumber: "082134567890",
          accountName: "Rina Andini",
        },
      ],
      instructions: "Pilih metode pembayaran sesuai kenyamanan Anda",
    },
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
    organizationId: "hmti-2025",
    name: "Iuran Mingguan – Maret 2025",
    targetType: "organization",
    kind: "done" as CategoryKind,
    period: "Maret 2025",
    typeLabel: "Iuran Rutin",
    amount: 25000,
    target: 200000,
    collected: 200000,
    totalMembers: 8,
    paidMembers: 8,
    status: "completed",
    memberCategory: "all",
    targetMemberIds: "all",
    paid: [],
    unpaid: [],
  },
  // NEW: Program-linked skema iuran with TARGETED MEMBERS (V2.1)
  {
    id: "iuran-semnas-peserta",
    organizationId: "hmti-2025",
    name: "Biaya Pendaftaran Peserta Seminar",
    description: "Biaya pendaftaran untuk peserta seminar (kit, sertifikat, konsumsi)",
    targetType: "program",
    programKerjaId: "semnas-2025",
    kind: "event",
    period: "Mei 2025",
    typeLabel: "Iuran Program",
    amount: 150000,
    target: 3000000,
    collected: 2250000,
    totalMembers: 20,
    paidMembers: 15,
    dueDate: "2025-05-25",
    status: "active",
    memberCategory: "peserta",
    targetMemberIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // 20 peserta
    paymentConfig: {
      methods: [
        {
          type: "bank",
          bank: "BCA",
          accountNumber: "1234567890",
          accountName: "Rina Andini - Seminar HMTI",
        },
        {
          type: "qris",
          qrisUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          qrisLabel: "QRIS Seminar",
        },
      ],
      instructions: "Biaya pendaftaran mencakup goodie bag, sertifikat, dan konsumsi 2 hari",
    },
    paid: [
      { id: 1, name: "Andi Pratama", amount: 150000, date: "10 Mei 2025", method: "BCA Transfer" },
      { id: 2, name: "Maya Putri", amount: 150000, date: "11 Mei 2025", method: "QRIS" },
      { id: 5, name: "Rio Hidayat", amount: 150000, date: "12 Mei 2025", method: "BCA Transfer" },
    ],
    unpaid: [
      { id: 3, name: "Budi Santoso" },
      { id: 4, name: "Dewi Lestari" },
    ],
  },
  {
    id: "iuran-semnas-panitia",
    organizationId: "hmti-2025",
    name: "Iuran Panitia Seminar",
    description: "Iuran untuk panitia pelaksana (seragam, konsumsi panitia, transport)",
    targetType: "program",
    programKerjaId: "semnas-2025",
    kind: "event",
    period: "Mei 2025",
    typeLabel: "Iuran Program",
    amount: 100000,
    target: 1200000,
    collected: 900000,
    totalMembers: 12,
    paidMembers: 9,
    dueDate: "2025-05-20",
    status: "active",
    memberCategory: "panitia",
    targetMemberIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 12 panitia
    paymentConfig: {
      methods: [
        {
          type: "bank",
          bank: "BRI",
          accountNumber: "9876543210",
          accountName: "Rina Andini - Panitia Seminar",
        },
        {
          type: "ewallet",
          ewalletProvider: "gopay",
          ewalletNumber: "+6282134567890",
          accountName: "Rina Andini",
        },
      ],
      instructions: "Iuran panitia untuk seragam, konsumsi, dan transport panitia",
    },
    paid: [
      { id: 1, name: "Andi Pratama", amount: 100000, date: "8 Mei 2025", method: "BCA Transfer" },
      { id: 2, name: "Maya Putri", amount: 100000, date: "9 Mei 2025", method: "QRIS" },
    ],
    unpaid: [
      { id: 3, name: "Budi Santoso" },
      { id: 4, name: "Dewi Lestari" },
      { id: 6, name: "Siti Nurhaliza" },
    ],
  },
  {
    id: "iuran-semnas-sponsor",
    organizationId: "hmti-2025",
    name: "Kontribusi Sponsorship Internal",
    description: "Kontribusi sukarela dari pengurus untuk mendukung seminar",
    targetType: "program",
    programKerjaId: "semnas-2025",
    kind: "event",
    period: "Mei 2025",
    typeLabel: "Iuran Program",
    amount: 200000,
    target: 1000000,
    collected: 600000,
    totalMembers: 5,
    paidMembers: 3,
    dueDate: "2025-05-15",
    status: "active",
    memberCategory: "pengurus",
    targetMemberIds: [1, 2, 3, 4, 5], // 5 pengurus
    paid: [
      { id: 1, name: "Andi Pratama", amount: 200000, date: "5 Mei 2025", method: "BCA Transfer" },
      { id: 2, name: "Maya Putri", amount: 200000, date: "6 Mei 2025", method: "QRIS" },
    ],
    unpaid: [
      { id: 3, name: "Budi Santoso" },
      { id: 4, name: "Dewi Lestari" },
    ],
  },
  {
    id: "iuran-studytour-transport",
    organizationId: "hmti-2025",
    name: "Biaya Transportasi Study Tour",
    description: "Biaya bus untuk study tour ke Bandung",
    targetType: "program",
    programKerjaId: "studytour-bandung",
    kind: "event",
    period: "Juni 2025",
    typeLabel: "Iuran Program",
    amount: 100000,
    target: 2500000,
    collected: 1800000,
    totalMembers: 25,
    paidMembers: 18,
    dueDate: "2025-06-30",
    status: "active",
    memberCategory: "peserta",
    targetMemberIds: "all", // Semua anggota bisa ikut
    paymentConfig: {
      methods: [
        {
          type: "bank",
          bank: "BCA",
          accountNumber: "1234567890",
          accountName: "Rina Andini - Study Tour",
        },
        {
          type: "bank",
          bank: "MANDIRI",
          accountNumber: "1400012345678",
          accountName: "Rina Andini",
        },
        {
          type: "ewallet",
          ewalletProvider: "dana",
          ewalletNumber: "082134567890",
          accountName: "Rina Andini",
        },
      ],
      instructions: "Bayar biaya transportasi study tour sebelum 30 Juni 2025. Pembayaran termasuk biaya bus PP Jakarta-Bandung.",
    },
    paid: [],
    unpaid: [],
  },
  {
    id: "iuran-studytour-penginapan",
    organizationId: "hmti-2025",
    name: "Biaya Penginapan Study Tour",
    description: "Biaya hotel 1 malam di Bandung",
    targetType: "program",
    programKerjaId: "studytour-bandung",
    kind: "event",
    period: "Juni 2025",
    typeLabel: "Iuran Program",
    amount: 150000,
    target: 3750000,
    collected: 2400000,
    totalMembers: 25,
    paidMembers: 16,
    dueDate: "2025-06-30",
    status: "active",
    memberCategory: "peserta",
    targetMemberIds: "all",
    paymentConfig: {
      methods: [
        {
          type: "bank",
          bank: "BCA",
          accountNumber: "1234567890",
          accountName: "Rina Andini - Study Tour",
        },
        {
          type: "qris",
          qrisUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          qrisLabel: "QRIS Study Tour",
        },
        {
          type: "ewallet",
          ewalletProvider: "ovo",
          ewalletNumber: "082134567890",
          accountName: "Rina Andini",
        },
      ],
      instructions: "Biaya penginapan untuk 1 malam di hotel Bandung. Pembayaran mencakup kamar twin sharing.",
    },
    paid: [],
    unpaid: [],
  },
];

// Backward compatibility: keep 'categories' name for old code
export const categories = skemaIuran;

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
