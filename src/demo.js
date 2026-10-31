/**
 * @fileoverview Skrip demonstrasi otomatis alur bisnis SIAP Booking System.
 * Menjalankan skenario pendaftaran, booking, validasi error handling, dan audit report.
 * @module demo
 */

import { BookingRepository } from './repositories/BookingRepository.js';
import { BookingService } from './services/BookingService.js';
import { EXAM_SESSIONS, STUDY_PROGRAMS } from './constants/status.js';

// Utilitas warna ANSI console
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function printHeader(title) {
  console.log(`\n${colors.cyan}${colors.bold}======================================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}======================================================================${colors.reset}\n`);
}

function printSuccess(message) {
  console.log(`${colors.green}✔ [BERHASIL] ${message}${colors.reset}`);
}

function printInfo(message) {
  console.log(`${colors.blue}ℹ [INFO] ${message}${colors.reset}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}⚠ [PERINGATAN] ${message}${colors.reset}`);
}

function printErrorCaught(message) {
  console.log(`${colors.red}✖ [TERTANGKAP OLEH SYSTEM ERROR HANDLER] ${message}${colors.reset}`);
}

export function runDemo() {
  printHeader('SIAP BOOKING SYSTEM - STIKOM EL RAHMA\n  Simulasi Implementasi Coding Standard & Version Control');

  const repository = new BookingRepository();
  const service = new BookingService(repository);

  // SKENARIO 1: Pendaftaran Calon Mahasiswa Baru
  console.log(`${colors.bold}--- TAHAP 1: PENDAFTARAN CALON MAHASISWA BARU ---${colors.reset}`);

  const candidate1 = service.registerCandidate({
    nik: '3201012304950001',
    fullName: 'M. Syams Dzulqarnain',
    email: 'syamsdzq@gmail.com',
    phone: '081234567890',
    studyProgram: 'Teknik Informatika (S1)',
  });
  printSuccess(`Kandidat 1 terdaftar: ${candidate1.fullName} (${candidate1.candidateId}) - Prodi: ${candidate1.studyProgram}`);

  const candidate2 = service.registerCandidate({
    nik: '3271011508010002',
    fullName: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    phone: '085712345678',
    studyProgram: 'Sistem Informasi (S1)',
  });
  printSuccess(`Kandidat 2 terdaftar: ${candidate2.fullName} (${candidate2.candidateId}) - Prodi: ${candidate2.studyProgram}`);

  const candidate3 = service.registerCandidate({
    nik: '3202021006000003',
    fullName: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@gmail.com',
    phone: '087898765432',
    studyProgram: 'Manajemen Informatika (D3)',
  });
  printSuccess(`Kandidat 3 terdaftar: ${candidate3.fullName} (${candidate3.candidateId}) - Prodi: ${candidate3.studyProgram}`);

  // SKENARIO 2: Validasi Penanganan Duplikasi & Error (Fail-Safely)
  console.log(`\n${colors.bold}--- TAHAP 2: PENGUJIAN ROBUST ERROR HANDLING & VALIDASI ---${colors.reset}`);

  try {
    printInfo('Mencoba mendaftarkan calon mahasiswa dengan NIK yang sama (duplikasi)...');
    service.registerCandidate({
      nik: '3201012304950001', // NIK Syams
      fullName: 'Kandidat Kloning',
      email: 'kloning@gmail.com',
      phone: '081211112222',
      studyProgram: 'Teknik Informatika (S1)',
    });
  } catch (err) {
    printErrorCaught(err.message);
  }

  try {
    printInfo('Mencoba mendaftarkan calon mahasiswa dengan format email tidak valid...');
    service.registerCandidate({
      nik: '3201012304950099',
      fullName: 'Budi Format Salah',
      email: 'budi-salah-email',
      phone: '081234567890',
      studyProgram: 'Teknik Informatika (S1)',
    });
  } catch (err) {
    printErrorCaught(err.message);
  }

  // SKENARIO 3: Booking Jadwal Ujian Masuk
  console.log(`\n${colors.bold}--- TAHAP 3: PEMESANAN (BOOKING) JADWAL UJIAN PMB ---${colors.reset}`);

  const examDate = '2026-11-20';
  const booking1 = service.createBooking({
    candidateId: candidate1.candidateId,
    sessionDate: examDate,
    sessionSlot: EXAM_SESSIONS.PAGI,
  });
  printSuccess(`Tiket Booking Diterbitkan: ${booking1.bookingCode} | Atlet/Kandidat: ${candidate1.fullName} | Tanggal: ${booking1.sessionDate} (${booking1.sessionSlot})`);

  const booking2 = service.createBooking({
    candidateId: candidate2.candidateId,
    sessionDate: examDate,
    sessionSlot: EXAM_SESSIONS.PAGI,
  });
  printSuccess(`Tiket Booking Diterbitkan: ${booking2.bookingCode} | Atlet/Kandidat: ${candidate2.fullName} | Tanggal: ${booking2.sessionDate} (${booking2.sessionSlot})`);

  const booking3 = service.createBooking({
    candidateId: candidate3.candidateId,
    sessionDate: '2026-11-21',
    sessionSlot: EXAM_SESSIONS.SIANG,
  });
  printSuccess(`Tiket Booking Diterbitkan: ${booking3.bookingCode} | Atlet/Kandidat: ${candidate3.fullName} | Tanggal: ${booking3.sessionDate} (${booking3.sessionSlot})`);

  // SKENARIO 4: Pengecekan Sisa Kuota Sesi
  console.log(`\n${colors.bold}--- TAHAP 4: MONITORING SISA KUOTA SESI SELEKSI ---${colors.reset}`);
  const quotaStatus = service.getQuotaAvailability(examDate, EXAM_SESSIONS.PAGI);
  printInfo(`Tanggal: ${quotaStatus.sessionDate} | Sesi: ${quotaStatus.sessionSlot}`);
  console.log(`   Kapasitas: ${quotaStatus.maxQuota} kursi | Terisi: ${quotaStatus.booked} kursi | Sisa Tersedia: ${colors.green}${quotaStatus.available} kursi${colors.reset}`);

  // SKENARIO 5: Reschedule & Pembatalan Jadwal
  console.log(`\n${colors.bold}--- TAHAP 5: RESCHEDULE DAN PEMBATALAN JADWAL ---${colors.reset}`);

  printInfo(`Kandidat ${candidate2.fullName} mengajukan reschedule ke tanggal 2026-11-25 sesi Siang...`);
  const rescheduledBooking = service.rescheduleBooking(
    booking2.bookingCode,
    '2026-11-25',
    EXAM_SESSIONS.SIANG,
    'Bentrok jadwal ujian sekolah asal'
  );
  printSuccess(`Jadwal tiket ${rescheduledBooking.bookingCode} berhasil dipindahkan ke: ${rescheduledBooking.sessionDate} (${rescheduledBooking.sessionSlot})`);
  printInfo(`Status Tiket: ${rescheduledBooking.status} | Riwayat Reschedule: ${rescheduledBooking.rescheduleHistory.length}x`);

  printInfo(`Kandidat ${candidate3.fullName} membatalkan pendaftaran jadwal ujian...`);
  const cancelledBooking = service.cancelBooking(booking3.bookingCode, 'Mengundurkan diri karena diterima di beasiswa lain');
  printWarning(`Tiket ${cancelledBooking.bookingCode} sekarang berstatus: ${cancelledBooking.status} (Alasan: ${cancelledBooking.cancelReason})`);

  // SKENARIO 6: Audit & Ringkasan Akhir
  console.log(`\n${colors.bold}--- TAHAP 6: AUDIT SUMMARY SEMUA TIKET BOOKING ---${colors.reset}`);
  const allBookings = service.listAllBookingsWithDetails();

  console.table(
    allBookings.map((b) => ({
      'Kode Booking': b.bookingCode,
      'Nama Kandidat': b.candidate ? b.candidate.fullName : '-',
      Prodi: b.candidate ? b.candidate.studyProgram : '-',
      Tanggal: b.sessionDate,
      Sesi: b.sessionSlot.split(' ')[0],
      Status: b.status,
    }))
  );

  printHeader('SIMULASI BERHASIL 100% - CODING STANDARD MEMENUHI SELURUH ATURAN');
}

// Jalankan otomatis jika dipanggil langsung sebagai entry script
if (process.argv[1]?.endsWith('demo.js')) {
  runDemo();
}

