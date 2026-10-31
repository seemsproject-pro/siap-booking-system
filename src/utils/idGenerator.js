/**
 * @fileoverview Pembangkit kode identitas unik yang mudah dibaca (Human-Readable ID Generator).
 * @module utils/idGenerator
 */

let candidateCounter = 1000;
let bookingCounter = 5000;

/**
 * Menghasilkan Nomor Pendaftaran Calon Mahasiswa (PMB).
 * Format: PMB-YYYY-XXXX (contoh: PMB-2026-1001)
 * 
 * @param {number} [year=2026] - Tahun akademik.
 * @returns {string} Nomor pendaftaran unik.
 */
export function generateCandidateId(year = 2026) {
  candidateCounter += 1;
  return `PMB-${year}-${candidateCounter}`;
}

/**
 * Menghasilkan Kode Tiket Booking Ujian PMB.
 * Format: BKG-YYYY-XXXX (contoh: BKG-2026-5001)
 * 
 * @param {number} [year=2026] - Tahun akademik.
 * @returns {string} Kode booking tiket unik.
 */
export function generateBookingCode(year = 2026) {
  bookingCounter += 1;
  return `BKG-${year}-${bookingCounter}`;
}

/**
 * Reset counter untuk kebutuhan isolasi unit testing.
 * @private
 */
export function _resetCountersForTesting() {
  candidateCounter = 1000;
  bookingCounter = 5000;
}
