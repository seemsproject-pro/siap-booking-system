/**
 * @fileoverview Repositori penyimpanan data kandidat dan booking (Persistence Layer).
 * Mengimplementasikan pola Repository untuk pemisahan data akses dari logika bisnis.
 * @module repositories/BookingRepository
 */

import { BOOKING_STATUS } from '../constants/status.js';

export class BookingRepository {
  constructor() {
    /** @type {Map<string, import('../models/Candidate.js').Candidate>} */
    this._candidates = new Map();

    /** @type {Map<string, import('../models/Booking.js').Booking>} */
    this._bookings = new Map();
  }

  // ================= CANDIDATE OPERATIONS =================

  /**
   * Menyimpan data calon mahasiswa baru.
   * @param {import('../models/Candidate.js').Candidate} candidate
   * @returns {import('../models/Candidate.js').Candidate}
   */
  saveCandidate(candidate) {
    this._candidates.set(candidate.candidateId, candidate);
    return candidate;
  }

  /**
   * Mencari kandidat berdasarkan candidateId.
   * @param {string} candidateId
   * @returns {import('../models/Candidate.js').Candidate | undefined}
   */
  findCandidateById(candidateId) {
    return this._candidates.get(candidateId);
  }

  /**
   * Mencari kandidat berdasarkan NIK.
   * @param {string} nik
   * @returns {import('../models/Candidate.js').Candidate | undefined}
   */
  findCandidateByNik(nik) {
    for (const candidate of this._candidates.values()) {
      if (candidate.nik === nik) return candidate;
    }
    return undefined;
  }

  /**
   * Mencari kandidat berdasarkan email.
   * @param {string} email
   * @returns {import('../models/Candidate.js').Candidate | undefined}
   */
  findCandidateByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    for (const candidate of this._candidates.values()) {
      if (candidate.email === cleanEmail) return candidate;
    }
    return undefined;
  }

  // ================= BOOKING OPERATIONS =================

  /**
   * Menyimpan atau memperbarui data booking.
   * @param {import('../models/Booking.js').Booking} booking
   * @returns {import('../models/Booking.js').Booking}
   */
  saveBooking(booking) {
    this._bookings.set(booking.bookingCode, booking);
    return booking;
  }

  /**
   * Mencari booking berdasarkan kode tiket.
   * @param {string} bookingCode
   * @returns {import('../models/Booking.js').Booking | undefined}
   */
  findBookingByCode(bookingCode) {
    return this._bookings.get(bookingCode);
  }

  /**
   * Mencari seluruh booking aktif untuk kandidat tertentu.
   * @param {string} candidateId
   * @returns {import('../models/Booking.js').Booking[]}
   */
  findActiveBookingsByCandidate(candidateId) {
    const activeStatuses = [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESCHEDULED];
    return Array.from(this._bookings.values()).filter(
      (b) => b.candidateId === candidateId && activeStatuses.includes(b.status)
    );
  }

  /**
   * Menghitung jumlah booking aktif pada tanggal dan sesi tertentu.
   * @param {string} sessionDate - YYYY-MM-DD
   * @param {string} sessionSlot - Pagi / Siang
   * @returns {number}
   */
  countActiveBookingsBySession(sessionDate, sessionSlot) {
    const activeStatuses = [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESCHEDULED];
    return Array.from(this._bookings.values()).filter(
      (b) =>
        b.sessionDate === sessionDate &&
        b.sessionSlot === sessionSlot &&
        activeStatuses.includes(b.status)
    ).length;
  }

  /**
   * Mengambil semua daftar booking yang tersimpan.
   * @returns {import('../models/Booking.js').Booking[]}
   */
  findAllBookings() {
    return Array.from(this._bookings.values());
  }

  /**
   * Mengosongkan data untuk keperluan testing.
   */
  clear() {
    this._candidates.clear();
    this._bookings.clear();
  }
}
