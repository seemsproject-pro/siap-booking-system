/**
 * @fileoverview Service layer yang mengimplementasikan aturan bisnis pendaftaran dan booking PMB.
 * @module services/BookingService
 */

import { Candidate } from '../models/Candidate.js';
import { Booking } from '../models/Booking.js';
import { generateCandidateId, generateBookingCode } from '../utils/idGenerator.js';
import { isValidSessionDate } from '../utils/validators.js';
import { MAX_QUOTA_PER_SESSION, BOOKING_STATUS, STUDY_PROGRAMS } from '../constants/status.js';
import { ValidationError, NotFoundError, ConflictError } from '../errors/AppError.js';

export class BookingService {
  /**
   * @param {import('../repositories/BookingRepository.js').BookingRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * Mendaftarkan calon mahasiswa baru.
   * 
   * @param {Object} candidateData
   * @param {string} candidateData.nik - NIK 16 digit.
   * @param {string} candidateData.fullName - Nama lengkap.
   * @param {string} candidateData.email - Email aktif.
   * @param {string} candidateData.phone - Nomor WhatsApp.
   * @param {string} candidateData.studyProgram - Program studi pilihan.
   * @returns {Candidate}
   * @throws {ConflictError} Jika NIK atau email sudah terdaftar.
   * @throws {ValidationError} Jika prodi tidak terdaftar.
   */
  registerCandidate(candidateData) {
    // Cek apakah program studi valid
    if (!STUDY_PROGRAMS.includes(candidateData.studyProgram)) {
      throw new ValidationError(
        `Program studi '${candidateData.studyProgram}' tidak terdaftar di STIKOM El Rahma.`
      );
    }

    // Cek duplikasi NIK
    const existingByNik = this._repository.findCandidateByNik(candidateData.nik);
    if (existingByNik) {
      throw new ConflictError(
        `Calon mahasiswa dengan NIK ${candidateData.nik} sudah terdaftar dengan ID ${existingByNik.candidateId}.`
      );
    }

    // Cek duplikasi Email
    const existingByEmail = this._repository.findCandidateByEmail(candidateData.email);
    if (existingByEmail) {
      throw new ConflictError(
        `Email '${candidateData.email}' sudah terdaftar untuk kandidat lain.`
      );
    }

    const candidateId = generateCandidateId();
    const candidate = new Candidate({
      candidateId,
      ...candidateData,
    });

    return this._repository.saveCandidate(candidate);
  }

  /**
   * Membuat booking jadwal ujian seleksi baru.
   * 
   * @param {Object} bookingData
   * @param {string} bookingData.candidateId - ID Calon Mahasiswa (PMB-...).
   * @param {string} bookingData.sessionDate - Tanggal ujian (YYYY-MM-DD).
   * @param {string} bookingData.sessionSlot - Sesi ujian (Pagi / Siang).
   * @returns {Booking}
   * @throws {NotFoundError} Jika kandidat tidak ditemukan.
   * @throws {ValidationError} Jika tanggal tidak valid atau di masa lalu.
   * @throws {ConflictError} Jika kandidat masih memiliki jadwal aktif atau kuota sesi penuh.
   */
  createBooking({ candidateId, sessionDate, sessionSlot }) {
    // 1. Verifikasi keberadaan kandidat
    const candidate = this._repository.findCandidateById(candidateId);
    if (!candidate) {
      throw new NotFoundError(`Calon mahasiswa dengan ID '${candidateId}' tidak ditemukan.`);
    }

    // 2. Verifikasi validitas tanggal sesi
    if (!isValidSessionDate(sessionDate)) {
      throw new ValidationError(
        `Tanggal sesi '${sessionDate}' tidak valid. Wajib berupa format YYYY-MM-DD dan tidak di masa lalu.`
      );
    }

    // 3. Verifikasi apakah kandidat sudah memiliki booking aktif
    const activeBookings = this._repository.findActiveBookingsByCandidate(candidateId);
    if (activeBookings.length > 0) {
      throw new ConflictError(
        `Kandidat ${candidate.fullName} sudah memiliki jadwal aktif pada tiket ${activeBookings[0].bookingCode} (${activeBookings[0].sessionDate}). Batalkan terlebih dahulu untuk membuat jadwal baru.`
      );
    }

    // 4. Verifikasi sisa kuota sesi ujian
    const bookedCount = this._repository.countActiveBookingsBySession(sessionDate, sessionSlot);
    if (bookedCount >= MAX_QUOTA_PER_SESSION) {
      throw new ConflictError(
        `Kuota untuk sesi ${sessionSlot} pada tanggal ${sessionDate} sudah PENUH (${bookedCount}/${MAX_QUOTA_PER_SESSION}). Silakan pilih tanggal atau sesi lain.`
      );
    }

    // 5. Terbitkan tiket booking
    const bookingCode = generateBookingCode();
    const booking = new Booking({
      bookingCode,
      candidateId,
      sessionDate,
      sessionSlot,
      status: BOOKING_STATUS.CONFIRMED,
    });

    return this._repository.saveBooking(booking);
  }

  /**
   * Membatalkan jadwal booking aktif.
   * 
   * @param {string} bookingCode - Kode tiket booking.
   * @param {string} [reason] - Alasan pembatalan.
   * @returns {Booking}
   * @throws {NotFoundError} Jika booking tidak ditemukan.
   */
  cancelBooking(bookingCode, reason) {
    const booking = this._repository.findBookingByCode(bookingCode);
    if (!booking) {
      throw new NotFoundError(`Tiket booking dengan kode '${bookingCode}' tidak ditemukan.`);
    }

    booking.cancel(reason);
    return this._repository.saveBooking(booking);
  }

  /**
   * Memindahkan (reschedule) jadwal ujian ke sesi atau tanggal lain.
   * 
   * @param {string} bookingCode - Kode tiket booking.
   * @param {string} newDate - Tanggal baru (YYYY-MM-DD).
   * @param {string} newSlot - Sesi baru.
   * @param {string} [reason] - Alasan reschedule.
   * @returns {Booking}
   */
  rescheduleBooking(bookingCode, newDate, newSlot, reason) {
    const booking = this._repository.findBookingByCode(bookingCode);
    if (!booking) {
      throw new NotFoundError(`Tiket booking dengan kode '${bookingCode}' tidak ditemukan.`);
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new ValidationError('Jadwal booking yang sudah dibatalkan tidak dapat di-reschedule.');
    }

    if (!isValidSessionDate(newDate)) {
      throw new ValidationError(`Tanggal baru '${newDate}' tidak valid atau di masa lalu.`);
    }

    // Cek kuota sesi baru
    const bookedCount = this._repository.countActiveBookingsBySession(newDate, newSlot);
    if (bookedCount >= MAX_QUOTA_PER_SESSION) {
      throw new ConflictError(
        `Kuota sesi ${newSlot} pada tanggal ${newDate} sudah penuh (${bookedCount}/${MAX_QUOTA_PER_SESSION}).`
      );
    }

    booking.reschedule(newDate, newSlot, reason);
    return this._repository.saveBooking(booking);
  }

  /**
   * Mengecek ketersediaan sisa kuota pada sesi dan tanggal tertentu.
   * 
   * @param {string} sessionDate - YYYY-MM-DD
   * @param {string} sessionSlot - Pagi / Siang
   * @returns {Object}
   */
  getQuotaAvailability(sessionDate, sessionSlot) {
    const booked = this._repository.countActiveBookingsBySession(sessionDate, sessionSlot);
    const available = Math.max(0, MAX_QUOTA_PER_SESSION - booked);
    return {
      sessionDate,
      sessionSlot,
      maxQuota: MAX_QUOTA_PER_SESSION,
      booked,
      available,
      isFull: available === 0,
    };
  }

  /**
   * Mengambil semua daftar booking beserta informasi kandidat.
   * @returns {Array<Object>}
   */
  listAllBookingsWithDetails() {
    return this._repository.findAllBookings().map((booking) => {
      const candidate = this._repository.findCandidateById(booking.candidateId);
      return {
        ...booking.toJSON(),
        candidate: candidate ? candidate.toJSON() : null,
      };
    });
  }
}
