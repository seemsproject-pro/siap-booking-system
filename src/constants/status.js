/**
 * @fileoverview Definisi konstanta dan enum status untuk sistem booking PMB.
 * Mengikuti standar penamaan UPPER_SNAKE_CASE.
 * @module constants/status
 */

/**
 * Status siklus hidup pendaftaran seleksi / booking.
 * @readonly
 * @enum {string}
 */
export const BOOKING_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  RESCHEDULED: 'RESCHEDULED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
});

/**
 * Pilihan sesi ujian masuk PMB.
 * @readonly
 * @enum {string}
 */
export const EXAM_SESSIONS = Object.freeze({
  PAGI: 'Pagi (08:30 - 11:30 WIB)',
  SIANG: 'Siang (13:00 - 16:00 WIB)',
});

/**
 * Batas maksimum kuota calon mahasiswa per sesi ujian per hari.
 * @constant {number}
 */
export const MAX_QUOTA_PER_SESSION = 20;

/**
 * Daftar program studi terdaftar di STIKOM El Rahma.
 * @readonly
 * @type {readonly string[]}
 */
export const STUDY_PROGRAMS = Object.freeze([
  'Teknik Informatika (S1)',
  'Sistem Informasi (S1)',
  'Manajemen Informatika (D3)',
  'Komputerisasi Akuntansi (D3)',
]);
