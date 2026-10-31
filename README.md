# SIAP Booking System (Sistem Booking & Pendaftaran Ujian PMB Online)
> **Tugas 8 Rekayasa Perangkat Lunak:** Implementasi Coding Standard & Version Control  
> **Sekolah Tinggi Ilmu Komputer (STIKOM) El Rahma Bogor**

![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20Modular-blue.svg)
![Coding%20Standard](https://img.shields.io/badge/Coding%20Standard-Airbnb%20%2F%20Google%20JS-purple.svg)
![Version%20Control](https://img.shields.io/badge/Git-Conventional%20Commits-orange.svg)
![Tests](https://img.shields.io/badge/Unit%20Tests-16%20Passed-brightgreen.svg)

---

## 1. Identitas Mahasiswa
* **Nama Lengkap:** M. Syams Dzulqarnain
* **NIM:** 2411070084
* **Program Studi:** Teknik Informatika (S1)
* **Kelas:** Informatika 7
* **Mata Kuliah:** Rekayasa Perangkat Lunak (RPL)
* **Dosen Pengampu:** Bpk. Ferry Noorman, S.Kom., M.Kom.

---

## 2. Deskripsi & Ruang Lingkup Proyek
Proyek ini mengimplementasikan program sistem pemesanan (**Booking**) jadwal ujian seleksi penerimaan mahasiswa baru untuk aplikasi **SIAP (Sistem Informasi Penerimaan Mahasiswa Online)** di lingkungan STIKOM El Rahma.

### Fitur Fungsional Utama:
1. **Registrasi Calon Mahasiswa Baru (`registerCandidate`):**
   - Validasi ketat format NIK (16 digit angka), email (RFC regex), dan nomor WhatsApp.
   - Pencegahan registrasi ganda (*duplicate registration check*) berbasis NIK dan Email.
2. **Booking Jadwal Seleksi Masuk (`createBooking`):**
   - Alokasi sesi ujian (Pagi / Siang) dengan kapasitas kuota per sesi (maksimum 20 kursi).
   - Penolakan pemesanan jika kuota sesi pada tanggal tersebut sudah penuh.
   - Proteksi multi-booking aktif untuk satu calon mahasiswa.
3. **Reschedule & Pembatalan Jadwal (`rescheduleBooking` & `cancelBooking`):**
   - Pemindahan jadwal ke tanggal atau sesi baru dengan pengecekan kuota ulang dan pencatatan riwayat perubahan (*reschedule history audit*).
   - Pembatalan jadwal resmi disertai pencatatan alasan (*cancellation reason*).
4. **Monitoring & Ketersediaan Kuota (`getQuotaAvailability`):**
   - Menghitung sisa kursi yang tersedia secara *real-time*.

---

## 3. Penerapan Coding Standard

Proyek ini dirancang secara ketat mematuhi pedoman [CODING_STANDARD.md](CODING_STANDARD.md):
- **Naming Conventions:**
  - `camelCase`: variabel, properti, nama fungsi, dan metode (`candidateName`, `createBooking`).
  - `PascalCase`: nama kelas dan model (`Candidate`, `Booking`, `BookingService`).
  - `UPPER_SNAKE_CASE`: konstanta dan enumerasi status (`BOOKING_STATUS`, `MAX_QUOTA_PER_SESSION`).
- **Formatting:** Menggunakan indentasi 2 spasi konsisten via konfigurasi `.editorconfig`, titik koma wajib (semicolons), dan batas panjang baris.
- **Modular Architecture (Separation of Concerns):**
  - `src/models/`: Representasi entitas bisnis dengan validasi data internal.
  - `src/services/`: Logika bisnis murni (*business rules*) dan koordinasi alur data.
  - `src/repositories/`: Isolasi lapisan persistensi data (*Persistence Layer*).
  - `src/utils/`: Fungsi-fungsi bantu murni (*pure functions*) untuk validator dan generator ID.
  - `src/errors/`: Hierarki *custom error class* (`ValidationError`, `NotFoundError`, `ConflictError`).
- **Dokumentasi JSDoc:** Seluruh modul publik dilengkapi anotasi standar JSDoc (`@param`, `@returns`, `@throws`).
- **Fail-Safely & Robust Validation:** Validasi *guard clauses* dilakukan di awal pemanggilan metode sebelum mutasi state data.

---

## 4. Struktur Direktori Proyek

```text
siap-booking-system/
├── .editorconfig              # Konfigurasi konsistensi format editor
├── .gitignore                 # Konfigurasi pengabaian file Git
├── CODING_STANDARD.md         # Dokumen pedoman standar penulisan kode
├── package.json               # Konfigurasi dependensi dan skrip proyek
├── README.md                  # Dokumentasi utama proyek
├── src/
│   ├── index.js               # Entry point utama aplikasi CLI
│   ├── demo.js                # Skenario simulasi otomatis end-to-end
│   ├── constants/
│   │   └── status.js          # Enum status booking, sesi ujian, & kuota
│   ├── errors/
│   │   └── AppError.js        # Custom error classes
│   ├── models/
│   │   ├── Booking.js         # Model entitas jadwal booking
│   │   └── Candidate.js       # Model entitas calon mahasiswa
│   ├── repositories/
│   │   └── BookingRepository.js # Lapisan penyimpanan data in-memory
│   ├── services/
│   │   └── BookingService.js  # Layanan logika bisnis pendaftaran & booking
│   └── utils/
│       ├── idGenerator.js     # Generator ID unik (PMB-... & BKG-...)
│       └── validators.js      # Utilitas validasi NIK, email, no HP, & tanggal
└── tests/
    ├── BookingService.test.js # Unit test logika bisnis & validasi kuota
    └── validators.test.js     # Unit test fungsi validasi pure
```

---

## 5. Panduan Menjalankan Program

### Prasyarat:
* Node.js versi 18.0.0 atau yang lebih baru (Diuji pada Node.js v24.16.0).

### Menjalankan Aplikasi & Demo Alur Bisnis:
```bash
# Menjalankan simulasi utama
node src/index.js

# Atau menjalankan skrip demo
node src/demo.js
```

### Menjalankan Unit Test:
Proyek ini menggunakan test runner bawaan resmi Node.js (`node:test` dan `node:assert`) tanpa ketergantungan pustaka luar:
```bash
node --test tests/**/*.test.js
```
Hasil uji: **16/16 Unit Tests Passed (0 failed)**.

---

## 6. Riwayat Version Control (Git Commits)

Seluruh perubahan kode dicatat secara terstruktur dengan pesan commit semantik:
1. `c126ee8` - `feat(init): inisialisasi struktur proyek, package.json, dan konfigurasi coding standard`
2. `540df81` - `feat(core): implementasi model data dan service validasi pendaftaran serta booking jadwal PMB`
3. `0364557` - `feat(service): implementasi BookingService, repository layer, dan unit tests`
4. `7a5cf1f` - `feat(cli): pembuatan antarmuka CLI interaktif dan integrasi alur booking pendaftaran`
5. `docs: penambahan dokumentasi README.md lengkap dan panduan eksekusi sistem`
