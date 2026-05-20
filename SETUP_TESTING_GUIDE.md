# 🛠️ Setup & Testing Guide - Patungin Frontend

## 📋 Daftar Perubahan Ringkas

| Kategori | Jumlah | Detail |
|----------|--------|--------|
| Files Baru | 4 | schemas.ts, auth-context.tsx, route-guards.ts, toast.ts |
| Files Dimodifikasi | 16 | 1 root, 1 component, 14 routes |
| Lines Ditambah | ~500+ | Validation, Auth Context, Guards, Error Handling |
| Critical Issues Fixed | 5/5 | 100% ✅ |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "e:\SEMESTER 4\Kewirausahaan\Proyek Akhir\patungin-iuran-bersama"
npm install
```

Jika ada error tentang missing types, jalankan:
```bash
npm install --save-dev vite @types/react @types/react-dom
```

### 2. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Testing Checklist

### A. Initial Load & Routing
```
✅ Buka http://localhost:5173
   ├─ Lihat splash screen 1-2 detik
   └─ Auto redirect ke /login ✓

✅ Direct access http://localhost:5173/home
   └─ Redirect ke /login (belum login) ✓
```

### B. Login Form Validation
```
✅ Email validation
   ├─ Input: "invalid" → Error: "Format email tidak valid"
   ├─ Input: "" → Error: "Email harus diisi"
   └─ Input: "rina@patungin.id" → OK ✓

✅ Password validation
   ├─ Input: "" → Error: "Password harus diisi"
   ├─ Input: "12345" → Error: "Password minimal 6 karakter"
   └─ Input: "password" → OK ✓

✅ Form submission
   ├─ Submit dengan valid data → Loading state ✓
   ├─ Success → Toast "Login Berhasil" ✓
   └─ Redirect ke /home ✓
```

### C. Login Functionality
```
✅ Role detection
   ├─ Email mengandung "anggota" → Role: anggota
   ├─ Email lain → Role: bendahara
   └─ Session tersimpan di localStorage ✓

✅ Login dengan berbagai email
   ├─ bendahara@email.com → Bendahara dashboard
   ├─ anggota@email.com → Anggota dashboard
   └─ testemail@email.com → Bendahara dashboard ✓

✅ Remember session
   ├─ Login → Refresh page → Tetap login ✓
   ├─ Logout → Refresh page → Redirect ke login ✓
```

### D. Register Form Validation
```
✅ Name validation
   ├─ Input: "" → Error: "Nama harus diisi"
   ├─ Input: "ab" → Error: "Nama minimal 3 karakter"
   └─ Input: "Andi Pratama" → OK ✓

✅ Email validation
   ├─ Input: "invalid" → Error: "Format email tidak valid"
   ├─ Input: "test@domain.com" → OK ✓

✅ Phone validation
   ├─ Input: "123" → Error: "Format nomor HP tidak valid"
   ├─ Input: "081234567890" → OK ✓
   ├─ Input: "+6281234567890" → OK ✓

✅ Password validation
   ├─ Input: "12345" → Error: "Password minimal 6 karakter"
   ├─ Input: "password123" → OK ✓

✅ Password confirmation
   ├─ Input password: "password123", confirm: "password124"
   └─ Error: "Password tidak cocok" ✓
   ├─ Input password: "password123", confirm: "password123"
   └─ OK ✓

✅ Form submission
   ├─ Bendahara register → Redirect ke /home ✓
   ├─ Anggota register → Redirect ke /join-grup ✓
   ├─ Success toast → Muncul ✓
```

### E. Route Protection

#### Protected Routes (Semua role harus login)
```
✅ /home - Bendahara & Anggota bisa akses
   ├─ Tanpa login → Redirect ke /login
   ├─ Dengan login → Show dashboard ✓

✅ /notifikasi - Bendahara & Anggota bisa akses
✅ /profil - Bendahara & Anggota bisa akses
✅ /info-grup - Bendahara & Anggota bisa akses
```

#### Bendahara-Only Routes
```
✅ /anggota - Manajemen anggota
   ├─ Bendahara login → Akses ✓
   ├─ Anggota login → Redirect ke /home ✗

✅ /transaksi - Pencatatan transaksi
   ├─ Bendahara login → Akses ✓
   ├─ Anggota login → Redirect ke /home ✗

✅ /laporan - Laporan keuangan
   ├─ Bendahara login → Akses ✓
   ├─ Anggota login → Redirect ke /home ✗

✅ /laporan/$catId - Detail kategori
✅ /pengumuman - Kirim pengumuman
```

#### Anggota-Only Routes
```
✅ /iuranku - Rekap iuran personal
   ├─ Anggota login → Akses ✓
   ├─ Bendahara login → Redirect ke /home ✗

✅ /join-grup - Join group
✅ /konfirmasi-bayar - Upload bukti pembayaran
```

#### Public Routes (Hanya untuk logout users)
```
✅ /login
   ├─ Tidak login → Akses ✓
   ├─ Sudah login → Redirect ke /home ✗

✅ /register
   ├─ Tidak login → Akses ✓
   ├─ Sudah login → Redirect ke /home ✗

✅ /
   ├─ Tidak login → Show splash, redirect ke /login ✓
   ├─ Sudah login → Redirect ke /home ✗
```

### F. Navigation & Role-Based UI
```
✅ Bottom Navigation
   ├─ Bendahara login
   │  ├─ Show: Home, Anggota, Laporan, Profil
   │  └─ Menu items correct ✓
   ├─ Anggota login
   │  ├─ Show: Home, Iuranku, Notifikasi, Profil
   │  └─ Menu items correct ✓

✅ Home Dashboard
   ├─ Bendahara view → Show stats bendahara
   ├─ Anggota view → Show stats anggota
   └─ Role indicator correct ✓
```

### G. Error Handling
```
✅ localStorage errors
   ├─ Clear localStorage → App show error "Terjadi Kesalahan"
   ├─ Button "Kembali ke Login" → Click → Go to /login ✓

✅ Validation errors
   ├─ Form errors → Display per field
   ├─ Errors clear saat user input
   └─ Toast error notification ✓

✅ Toast notifications
   ├─ Success → Green toast, 3 sec
   ├─ Error → Red toast, 4 sec
   └─ Info → Blue toast, 3 sec ✓
```

### H. UI/UX Polish
```
✅ Loading states
   ├─ Login button → Disabled saat loading
   ├─ Register button → Disabled saat loading
   └─ "Memproses..." text visible ✓

✅ Input states
   ├─ Valid field → Green border on focus
   ├─ Error field → Red border on focus
   └─ Error message below input ✓

✅ Password visibility
   ├─ Click eye icon → Password visible
   ├─ Click eye icon lagi → Password hidden ✓

✅ Smooth transitions
   ├─ Page navigation → No lag
   ├─ Button interactions → Smooth
   └─ Form validation → Real-time ✓
```

---

## 📱 Test Credentials

### Bendahara Account
```
Email: rina@patungin.id
Password: password (minimal 6 karakter)
Role: Bendahara
```

### Anggota Account
```
Email: andi.anggota@email.com (atau email mengandung "anggota")
Password: password (minimal 6 karakter)
Role: Anggota
```

---

## 🔍 Manual Testing Scripts

### Test 1: Complete Login Flow
```javascript
// Buka console (F12)
// Jalankan setelah login berhasil:
console.log("Auth Data:", {
  role: localStorage.getItem("patungin_role"),
  name: localStorage.getItem("patungin_name")
});
```

### Test 2: Route Protection
```javascript
// Hapus session dan coba akses protected route
localStorage.removeItem("patungin_role");
localStorage.removeItem("patungin_name");
// Buka http://localhost:5173/home
// Harusnya redirect ke /login
```

### Test 3: Form Validation
```javascript
// Testing register form validation
const testData = {
  name: "a", // Too short
  email: "invalid-email",
  phone: "123", // Invalid format
  password: "12345", // Too short
  passwordConfirm: "wrong"
};
// Lihat error messages untuk setiap field
```

---

## ⚠️ Common Issues & Fixes

### Issue: Module not found errors
```bash
# Solution:
rm node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use
```bash
# Solution: Gunakan port berbeda
npm run dev -- --port 3000
```

### Issue: Hot reload tidak bekerja
```bash
# Solution: Restart dev server
# Ctrl+C, kemudian npm run dev lagi
```

### Issue: localStorage undefined
```
# Solution: Ini hanya di server-side
# Tidak akan terjadi di browser
```

---

## 📊 Performance Tips

### Current Optimizations
- ✅ Lazy loading routes dengan TanStack Router
- ✅ Optimized re-renders dengan Context API
- ✅ CSS-in-JS dengan Tailwind (compiled)
- ✅ Sonner toasts (lightweight)

### Recommendations
- [ ] Add Suspense boundaries untuk code splitting
- [ ] Implement react-query untuk data caching
- [ ] Add Web Vitals monitoring
- [ ] Optimize bundle size dengan tree-shaking

---

## 🎯 Next Steps

### Immediate (Sudah fix)
- ✅ Form validation
- ✅ Auth context
- ✅ Route protection
- ✅ Error handling

### This Week
- [ ] Copy to clipboard helper
- [ ] File upload handler
- [ ] Delete member feature
- [ ] Reminder functionality
- [ ] Route parameter validation

### This Month
- [ ] Global error boundaries
- [ ] Export to PDF/CSV
- [ ] Edit profile features
- [ ] Backend API integration
- [ ] Offline support

---

## 📞 Support

Jika ada issues:
1. Check [FIXES_SUMMARY.md](FIXES_SUMMARY.md) untuk overview
2. Check [AUDIT_REPORT.md](AUDIT_REPORT.md) untuk detail
3. Check [ISSUES_CHECKLIST.md](ISSUES_CHECKLIST.md) untuk tracking

---

**Happy Testing! 🚀**
