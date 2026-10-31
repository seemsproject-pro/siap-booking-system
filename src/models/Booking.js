/**
 * @fileoverview Model entitas booking jadwal seleksi ujian PMB.
 * @module models/Booking
 */

import { BOOKING_STATUS, EXAM_SESSIONS } from '../constants/status.js';
import { ValidationError } from '../errors/AppError.js';

/**
 * Entitas Booking Jadwal Seleksi Masuk (Booking Entity).
 */
export class Booking {
  /**
   * @param {Object} params - Properti booking jadwal.
   * @param {string} params.bookingCode - Kode tiket booking unik (BKG-...).
   * @param {string} params.candidateId - ID kandidat terdaftar (PMB-...).
   * @param {string} params.sessionDate - Tanggal sesi ujian (YYYY-MM-DD).
   * @param {string} params.sessionSlot - Sesi waktu (Pagi / Siang).
   * @param {string} [params.status=BOOKING_STATUS.CONFIRMED] - Status booking awal.
   */
  constructor({
    bookingCode,
    candidateId,
    sessionDate,
    sessionSlot,
    status = BOOKING_STATUS.CONFIRMED,
  }) {
    this._validateConstructor({ sessionSlot });

    this.bookingCode = bookingCode;
    this.candidateId = candidateId;
    this.sessionDate = sessionDate;
    this.sessionSlot = sessionSlot;
    this.status = status;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    this.rescheduleHistory = [];
  }

  /**
   * @private
   */
  _validateConstructor({ sessionSlot }) {
    const validSessions = Object.values(EXAM_SESSIONS);
    if (!validSessions.includes(sessionSlot)) {
      throw new ValidationError(
        `Sesi ujian '${sessionSlot}' tidak valid. Pilihan valid: ${validSessions.join(', ')}.`
      );
    }
  }

  /**
   * Membatalkan booking jadwal ujian.
   * 
   * @param {string} reason - Alasan pembatalan booking.
   * @throws {ValidationError} Jika status booking sudah dibatalkan atau selesai.
   */
  cancel(reason = 'Dibatalkan oleh calon mahasiswa') {
    if (this.status === BOOKING_STATUS.CANCELLED) {
      throw new ValidationError('Jadwal booking ini sudah dibatalkan sebelumnya.');
    }
    if (this.status === BOOKING_STATUS.COMPLETED) {
      throw new ValidationError('Jadwal ujian yang sudah selesai tidak dapat dibatalkan.');
    }

    this.status = BOOKING_STATUS.CANCELLED;
    this.cancelReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Mengubah jadwal (reschedule) ke tanggal atau sesi baru.
   * 
   * @param {string} newDate - Tanggal sesi baru (YYYY-MM-DD).
   * @param {string} newSlot - Sesi baru (Pagi / Siang).
   * @param {string} reason - Alasan pemindahan jadwal.
   */
  reschedule(newDate, newSlot, reason = 'Permintaan pemindahan jadwal') {
    this._validateConstructor({ sessionSlot: newSlot });

    this.rescheduleHistory.push({
      previousDate: this.sessionDate,
      previousSlot: this.sessionSlot,
      rescheduledAt: new Date().toISOString(),
      reason,
    });

    this.sessionDate = newDate;
    this.sessionSlot = newSlot;
    this.status = BOOKING_STATUS.RESCHEDULED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Representasi JSON murni.
   * @returns {Object}
   */
  toJSON() {
    return {
      bookingCode: this.bookingCode,
      candidateId: this.candidateId,
      sessionDate: this.sessionDate,
      sessionSlot: this.sessionSlot,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      rescheduleHistory: this.rescheduleHistory,
    };
  }
}
