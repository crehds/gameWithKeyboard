import { ALPHABET, isLetter, toLetter, randomLetter, generateSequence } from './letters';

describe('letters', () => {
  it('contains all 26 uppercase letters from A to Z', () => {
    expect(ALPHABET).toHaveLength(26);
    expect(ALPHABET[0]).toBe('A');
    expect(ALPHABET[25]).toBe('Z');
  });

  describe('isLetter', () => {
    it('returns true for an uppercase letter', () => {
      expect(isLetter('A')).toBe(true);
    });

    it('returns false for a lowercase letter', () => {
      expect(isLetter('a')).toBe(false);
    });

    it('returns false for a non-letter value', () => {
      expect(isLetter('1')).toBe(false);
      expect(isLetter(null)).toBe(false);
    });
  });

  describe('toLetter', () => {
    it('uppercases a single lowercase key', () => {
      expect(toLetter('a')).toBe('A');
    });

    it('returns null for multi-character keys', () => {
      expect(toLetter('Shift')).toBeNull();
      expect(toLetter('Enter')).toBeNull();
    });

    it('returns null for a non-alphabet single character', () => {
      expect(toLetter('ñ')).toBeNull();
      expect(toLetter('1')).toBeNull();
    });
  });

  describe('randomLetter', () => {
    it('does not have the A/Z bias of the old Math.round formula', () => {
      expect(randomLetter(() => 0.03)).toBe('A');
      expect(randomLetter(() => 0.999999)).toBe('Z');
    });

    it('produces every letter i from random = (i + 0.5) / 26', () => {
      ALPHABET.forEach((letter, i) => {
        expect(randomLetter(() => (i + 0.5) / 26)).toBe(letter);
      });
    });
  });

  describe('generateSequence', () => {
    it('generates a sequence of the requested length using the injected random', () => {
      const random = vi.fn(() => 0);
      const sequence = generateSequence(3, random);
      expect(sequence).toEqual(['A', 'A', 'A']);
      expect(random).toHaveBeenCalledTimes(3);
    });
  });
});
