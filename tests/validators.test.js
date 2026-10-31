/**
 * @fileoverview Unit test untuk utilitas validasi (pure functions).
 * Menjalankan test runner bawaan Node.js (node:test).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidNik,
  isValidEmail,
  isValidPhoneNumber,
  isValidSessionDate,
} from '../src/utils/validators.js';

describe('Validator Helpers Test Suite', () => {
  describe('isValidNik()', () => {
    it('harus menerima NIK 16 digit yang valid', () => {
      assert.strictEqual(isValidNik('3201012304950001'), true);
      assert.strictEqual(isValidNik('3271011508010002'), true);
    });

    it('harus menolak NIK yang kurang dari atau lebih dari 16 digit', () => {
      assert.strictEqual(isValidNik('12345'), false);
      assert.strictEqual(isValidNik('320101230495000199'), false);
    });

    it('harus menolak NIK yang mengandung huruf atau simbol', () => {
      assert.strictEqual(isValidNik('320101230495000a'), false);
      assert.strictEqual(isValidNik('3201-0123-049500'), false);
    });
  });

  describe('isValidEmail()', () => {
    it('harus menerima format email standar yang valid', () => {
      assert.strictEqual(isValidEmail('syamsdzq@gmail.com'), true);
      assert.strictEqual(isValidEmail('mahasiswa.rpl@stikomelrahma.ac.id'), true);
    });

    it('harus menolak format email yang tidak memiliki @ atau domain', () => {
      assert.strictEqual(isValidEmail('syamsdzqgmail.com'), false);
      assert.strictEqual(isValidEmail('syams@'), false);
      assert.strictEqual(isValidEmail('@stikomelrahma.ac.id'), false);
    });
  });

  describe('isValidPhoneNumber()', () => {
    it('harus menerima nomor handphone format Indonesia', () => {
      assert.strictEqual(isValidPhoneNumber('081234567890'), true);
      assert.strictEqual(isValidPhoneNumber('6281298765432'), true);
      assert.strictEqual(isValidPhoneNumber('+6285712345678'), true);
    });

    it('harus menolak nomor telepon terlalu pendek atau non-numerik', () => {
      assert.strictEqual(isValidPhoneNumber('0812'), false);
      assert.strictEqual(isValidPhoneNumber('0812-abcd-efgh'), false);
    });
  });

  describe('isValidSessionDate()', () => {
    it('harus menerima tanggal hari ini atau masa depan (YYYY-MM-DD)', () => {
      const futureDate = '2026-11-15';
      assert.strictEqual(isValidSessionDate(futureDate), true);
    });

    it('harus menolak format tanggal salah atau tanggal di masa lalu', () => {
      assert.strictEqual(isValidSessionDate('15-11-2026'), false);
      assert.strictEqual(isValidSessionDate('2020-01-01'), false);
      assert.strictEqual(isValidSessionDate('invalid-date'), false);
    });
  });
});
