# Pedoman Standar Pemrograman (Coding Standard)
**Proyek:** SIAP Booking System (Sistem Booking & Pendaftaran Ujian PMB Online)  
**Institusi:** STIKOM El Rahma Bogor  
**Pengembang:** M. Syams Dzulqarnain (NIM: 2411070084 - Kelas Informatika 7)  
**Mata Kuliah:** Rekayasa Perangkat Lunak (Tugas 8)

---

## 1. Pendahuluan
Dokumen ini menetapkan konvensi penulisan kode sumber (*coding standards*) yang diwajibkan dalam proyek **SIAP Booking System**. Penerapan standar ini bertujuan menjamin keterbacaan (*readability*), konsistensi struktur, kemudahan pemeliharaan (*maintainability*), dan pengurangan potensi bug dalam siklus hidup rekayasa perangkat lunak.

---

## 2. Konvensi Penamaan (Naming Conventions)

| Tipe Elemen | Konvensi | Contoh yang Benar | Contoh yang Salah |
|---|---|---|---|
| **Variabel & Properti** | `camelCase` | `candidateName`, `bookingDate` | `Candidate_Name`, `booking_date` |
| **Fungsi & Metode** | `camelCase` (kata kerja awal) | `createBooking()`, `isValidEmail()` | `CreateBooking()`, `valid_email()` |
| **Kelas & Model** | `PascalCase` | `Booking`, `Candidate`, `BookingService` | `booking`, `booking_service` |
| **Konstanta & Enum** | `UPPER_SNAKE_CASE` | `MAX_QUOTA_PER_SESSION`, `BOOKING_STATUS` | `maxQuota`, `bookingStatus` |
| **Nama File Modul** | `PascalCase` (Kelas) / `camelCase` (Utility) | `Booking.js`, `validators.js` | `booking.js` (untuk kelas), `Validators.js` |

---

## 3. Format & Tata Letak Kode (Formatting & Layout)

1. **Indentasi:** Menggunakan **2 spasi** (bukan Tab) sesuai konfigurasi `.editorconfig`.
2. **Karakter Akhir Baris:** Menggunakan format **LF (Unix-style `\n`)** dengan *newline* di akhir setiap file.
3. **Titik Koma (Semicolons):** **Wajib** menggunakan titik koma (`;`) di akhir setiap pernyataan pernyataan JavaScript untuk mencegah *Automatic Semicolon Insertion (ASI) hazard*.
4. **Petik Tunggal/Ganda:** Menggunakan *single quotes* (`'`) untuk string literal standar dan *template literals* (`` ` ``) untuk interpolasi string variabel.
5. **Panjang Baris:** Maksimal 100 karakter per baris untuk menjaga keterbacaan tanpa *horizontal scroll*.

---

## 4. Dokumentasi Kode (JSDoc Standard)

Setiap fungsi publik, metode kelas, dan modul wajib dilengkapi dokumentasi **JSDoc** yang menjelaskan:
- Deskripsi fungsional singkat.
- Parameter input (`@param {type} name - description`).
- Nilai kembalian (`@returns {type} description`).
- Kemungkinan *exception* yang dilempar (`@throws {ErrorClass} description`).

**Contoh Penerapan:**
```javascript
/**
 * Mendaftarkan calon mahasiswa baru ke dalam sistem.
 * 
 * @param {Object} candidateData - Objek identitas calon mahasiswa.
 * @param {string} candidateData.nik - Nomor Induk Kependudukan (16 digit).
 * @param {string} candidateData.fullName - Nama lengkap calon mahasiswa.
 * @param {string} candidateData.email - Alamat email aktif.
 * @param {string} candidateData.phone - Nomor telepon WhatsApp aktif.
 * @returns {Candidate} Objek entitas Candidate yang berhasil disimpan.
 * @throws {ValidationError} Jika NIK, email, atau nomor HP tidak valid.
 * @throws {ConflictError} Jika NIK atau email sudah terdaftar sebelumnya.
 */
registerCandidate(candidateData) { ... }
```

---

## 5. Arsitektur & Prinsip Desain (Clean Code Principles)

1. **Single Responsibility Principle (SRP):** Setiap modul hanya bertanggung jawab atas satu fungsi bisnis utama:
   - `models/` : Merepresentasikan struktur data entitas bisnis.
   - `services/` : Mengelola aturan bisnis (*business logic*) dan koordinasi alur.
   - `repositories/` : Mengisolasi manipulasi dan penyimpanan data (*persistence layer*).
   - `utils/` : Menyediakan fungsi-fungsi murni (*pure helper functions*) tanpa *side effect*.
   - `errors/` : Mendefinisikan hierarki penanganan kesalahan terstruktur.
2. **Fail-Safely & Validasi Awal:** Melakukan validasi input secara ketat di awal metode (*guard clauses*) sebelum memproses logika inti.
3. **Custom Error Classes:** Menggunakan kelas error khusus (`ValidationError`, `NotFoundError`, `ConflictError`) agar error dapat diidentifikasi dan ditangani dengan tepat.

---

## 6. Standar Version Control (Git Commit Standard)

Pesan commit Git wajib mematuhi konvensi **Conventional Commits**:
- `feat`: Penambahan fitur baru ke dalam kode.
- `fix`: Perbaikan bug atau kesalahan logika.
- `docs`: Perubahan atau penambahan dokumentasi (README, JSDoc).
- `test`: Penambahan atau penyesuaian unit test.
- `refactor`: Perubahan struktur kode tanpa mengubah fungsionalitas eksternal.

Format: `<type>(<scope>): <deskripsi singkat dalam bahasa Indonesia>`  
Contoh: `feat(core): implementasi model data dan validasi pendaftaran PMB`
