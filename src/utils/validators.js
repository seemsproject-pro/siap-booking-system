/**
 * @fileoverview Kumpulan fungsi murni (pure functions) untuk validasi format data.
 * @module utils/validators
 */

/**
 * Memvalidasi apakah NIK terdiri dari tepat 16 digit angka.
 * 
 * @param {string} nik - Nomor Induk Kependudukan.
 * @returns {boolean} True jika format NIK valid.
 */
export function isValidNik(nik) {
  if (typeof nik !== 'string') return false;
  return /^[0-9]{16}$/.test(nik.trim());
}

/**
 * Memvalidasi format alamat email menggunakan RFC standard regex.
 * 
 * @param {string} email - Alamat email.
 * @returns {boolean} True jika format email valid.
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Memvalidasi format nomor handphone / WhatsApp Indonesia (08... atau 628...).
 * 
 * @param {string} phone - Nomor telepon.
 * @returns {boolean} True jika format nomor valid.
 */
export function isValidPhoneNumber(phone) {
  if (typeof phone !== 'string') return false;
  const cleanPhone = phone.trim().replace(/[-\s]/g, '');
  return /^(08|628|\+628)[0-9]{8,12}$/.test(cleanPhone);
}

/**
 * Memvalidasi format tanggal ISO (YYYY-MM-DD) dan memastikan tanggal tidak di masa lalu.
 * 
 * @param {string} dateString - String tanggal.
 * @returns {boolean} True jika tanggal valid dan merupakan hari ini atau di masa depan.
 */
export function isValidSessionDate(dateString) {
  if (typeof dateString !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) return false;

  const targetDate = new Date(dateString.trim());
  if (isNaN(targetDate.getTime())) return false;

  // Normalisasi waktu ke jam 00:00:00 untuk perbandingan hari
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate >= today;
}
