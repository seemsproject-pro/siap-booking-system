/**
 * @fileoverview Hierarki kelas error terstruktur untuk penanganan pengecualian aplikasi.
 * @module errors/AppError
 */

/**
 * Base custom error class untuk SIAP Booking System.
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Pesan penjelasan error.
   * @param {number} statusCode - Kode status HTTP terkait.
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error yang dilemparkan ketika validasi input gagal.
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * @param {string} message - Deskripsi field yang tidak valid.
   */
  constructor(message) {
    super(message, 400);
  }
}

/**
 * Error yang dilemparkan ketika entitas tidak ditemukan.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} message - Deskripsi entitas yang dicari.
   */
  constructor(message) {
    super(message, 404);
  }
}

/**
 * Error yang dilemparkan ketika terjadi konflik data (misal NIK ganda atau kuota habis).
 * @extends AppError
 */
export class ConflictError extends AppError {
  /**
   * @param {string} message - Deskripsi konflik data yang terjadi.
   */
  constructor(message) {
    super(message, 409);
  }
}
