/**
 * @fileoverview Unit test untuk logika bisnis BookingService.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { BookingService } from '../src/services/BookingService.js';
import { BookingRepository } from '../src/repositories/BookingRepository.js';
import { EXAM_SESSIONS, BOOKING_STATUS, MAX_QUOTA_PER_SESSION } from '../src/constants/status.js';
import { _resetCountersForTesting } from '../src/utils/idGenerator.js';
import { ValidationError, ConflictError, NotFoundError } from '../src/errors/AppError.js';

describe('BookingService Test Suite', () => {
  let repository;
  let service;

  beforeEach(() => {
    _resetCountersForTesting();
    repository = new BookingRepository();
    service = new BookingService(repository);
  });

  describe('Pendaftaran Calon Mahasiswa (registerCandidate)', () => {
    it('harus berhasil mendaftarkan calon mahasiswa dengan data valid', () => {
      const candidate = service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syamsdzq@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      assert.strictEqual(candidate.candidateId, 'PMB-2026-1001');
      assert.strictEqual(candidate.fullName, 'M. Syams Dzulqarnain');
      assert.strictEqual(candidate.email, 'syamsdzq@gmail.com');
    });

    it('harus melempar ConflictError jika NIK sudah pernah didaftarkan', () => {
      service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syams1@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      assert.throws(() => {
        service.registerCandidate({
          nik: '3201012304950001', // NIK sama
          fullName: 'Budi Santoso',
          email: 'budi@gmail.com',
          phone: '081299998888',
          studyProgram: 'Sistem Informasi (S1)',
        });
      }, ConflictError);
    });
  });

  describe('Booking Jadwal Seleksi (createBooking)', () => {
    it('harus berhasil membuat booking jadwal jika kuota masih tersedia', () => {
      const candidate = service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syamsdzq@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      const booking = service.createBooking({
        candidateId: candidate.candidateId,
        sessionDate: '2026-11-20',
        sessionSlot: EXAM_SESSIONS.PAGI,
      });

      assert.strictEqual(booking.bookingCode, 'BKG-2026-5001');
      assert.strictEqual(booking.status, BOOKING_STATUS.CONFIRMED);
      assert.strictEqual(booking.sessionDate, '2026-11-20');
    });

    it('harus menolak booking ganda jika kandidat sudah memiliki jadwal aktif', () => {
      const candidate = service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syamsdzq@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      service.createBooking({
        candidateId: candidate.candidateId,
        sessionDate: '2026-11-20',
        sessionSlot: EXAM_SESSIONS.PAGI,
      });

      // Percobaan booking kedua tanpa membatalkan jadwal pertama
      assert.throws(() => {
        service.createBooking({
          candidateId: candidate.candidateId,
          sessionDate: '2026-11-22',
          sessionSlot: EXAM_SESSIONS.SIANG,
        });
      }, ConflictError);
    });

    it('harus melempar NotFoundError jika candidateId tidak terdaftar', () => {
      assert.throws(() => {
        service.createBooking({
          candidateId: 'PMB-2026-9999',
          sessionDate: '2026-11-20',
          sessionSlot: EXAM_SESSIONS.PAGI,
        });
      }, NotFoundError);
    });
  });

  describe('Pembatalan & Reschedule Booking', () => {
    it('harus berhasil membatalkan jadwal booking aktif', () => {
      const candidate = service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syamsdzq@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      const booking = service.createBooking({
        candidateId: candidate.candidateId,
        sessionDate: '2026-11-20',
        sessionSlot: EXAM_SESSIONS.PAGI,
      });

      const cancelledBooking = service.cancelBooking(booking.bookingCode, 'Ada urusan dinas');
      assert.strictEqual(cancelledBooking.status, BOOKING_STATUS.CANCELLED);
      assert.strictEqual(cancelledBooking.cancelReason, 'Ada urusan dinas');
    });

    it('harus berhasil me-reschedule jadwal ke sesi baru dan mencatat riwayat', () => {
      const candidate = service.registerCandidate({
        nik: '3201012304950001',
        fullName: 'M. Syams Dzulqarnain',
        email: 'syamsdzq@gmail.com',
        phone: '081234567890',
        studyProgram: 'Teknik Informatika (S1)',
      });

      const booking = service.createBooking({
        candidateId: candidate.candidateId,
        sessionDate: '2026-11-20',
        sessionSlot: EXAM_SESSIONS.PAGI,
      });

      const rescheduled = service.rescheduleBooking(
        booking.bookingCode,
        '2026-11-25',
        EXAM_SESSIONS.SIANG,
        'Bentrok kegiatan sekolah'
      );

      assert.strictEqual(rescheduled.status, BOOKING_STATUS.RESCHEDULED);
      assert.strictEqual(rescheduled.sessionDate, '2026-11-25');
      assert.strictEqual(rescheduled.rescheduleHistory.length, 1);
      assert.strictEqual(rescheduled.rescheduleHistory[0].previousDate, '2026-11-20');
    });
  });
});
