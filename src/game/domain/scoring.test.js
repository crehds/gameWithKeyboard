import { pointsForKey, roundBonus } from './scoring';

describe('scoring', () => {
  describe('pointsForKey', () => {
    it('scales with the round (0-based) and the mode multiplier', () => {
      expect(pointsForKey(0, 1)).toBe(10);
      expect(pointsForKey(4, 1)).toBe(50);
      expect(pointsForKey(0, 2)).toBe(20);
    });

    it('rounds to the nearest integer', () => {
      expect(pointsForKey(1, 1.5)).toBe(Math.round(10 * 2 * 1.5));
      expect(pointsForKey(1, 1.5)).toBe(30);
    });
  });

  describe('roundBonus', () => {
    it('scales with the round (0-based) and the mode multiplier', () => {
      expect(roundBonus(0, 1)).toBe(25);
      expect(roundBonus(4, 1)).toBe(125);
      expect(roundBonus(0, 2)).toBe(50);
    });

    it('rounds to the nearest integer', () => {
      expect(roundBonus(0, 1.5)).toBe(Math.round(25 * 1 * 1.5));
      expect(roundBonus(0, 1.5)).toBe(38);
    });
  });
});
