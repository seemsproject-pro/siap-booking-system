/**
 * @fileoverview Model entitas calon mahasiswa pendaftar PMB.
 * @module models/Candidate
 */

import { isValidNik, isValidEmail, isValidPhoneNumber } from '../utils/validators.js';
import { ValidationError } from '../errors/AppError.js';

/**
 * Entitas Calon Mahasiswa (Candidate Entity).
 */
export class Candidate {
  /**
   * @param {Object} params - Properti calon mahasiswa.
   * @param {string} params.candidateId - ID pendaftaran unik.
   * @param {string} params.nik - NIK 16 digit.
   * @param {string} params.fullName - Nama lengkap calon mahasiswa.
   * @param {string} params.email - Alamat email aktif.
   * @param {string} params.phone - Nomor WhatsApp aktif.
   * @param {string} params.studyProgram - Pilihan program studi.
   */
  constructor({ candidateId, nik, fullName, email, phone, studyProgram }) {
    this._validateConstructor({ nik, fullName, email, phone, studyProgram });

    this.candidateId = candidateId;
    this.nik = nik.trim();
    this.fullName = fullName.trim();
    this.email = email.trim().toLowerCase();
    this.phone = phone.trim();
    this.studyProgram = studyProgram.trim();
    this.registeredAt = new Date().toISOString();
  }

  /**
   * Melakukan validasi internal saat inisialisasi entitas.
   * @private
   */
  _validateConstructor({ nik, fullName, email, phone, studyProgram }) {
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      throw new ValidationError('Nama lengkap calon mahasiswa minimal terdiri dari 3 karakter.');
    }
    if (!isValidNik(nik)) {
      throw new ValidationError('NIK tidak valid! Wajib terdiri dari tepat 16 digit numerik.');
    }
    if (!isValidEmail(email)) {
      throw new ValidationError(`Format email '${email}' tidak valid.`);
    }
    if (!isValidPhoneNumber(phone)) {
      throw new ValidationError(`Format nomor telepon '${phone}' tidak valid. Gunakan format 08...`);
    }
    if (!studyProgram || typeof studyProgram !== 'string') {
      throw new ValidationError('Pilihan program studi wajib ditentukan.');
    }
  }

  /**
   * Mengonversi entitas ke representasi objek JSON bersih.
   * @returns {Object} Representasi plain JSON.
   */
  toJSON() {
    return {
      candidateId: this.candidateId,
      nik: this.nik,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      studyProgram: this.studyProgram,
      registeredAt: this.registeredAt,
    };
  }
}
