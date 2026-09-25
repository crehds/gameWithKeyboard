import {
  ORDER_IDS,
  DEFAULT_ORDER,
  REVERSE_ORDER,
  isInputOrder,
  createInputOrder,
} from './inputOrder';

describe('inputOrder', () => {
  it('offers forward and reverse', () => {
    expect(ORDER_IDS).toEqual(['forward', 'reverse']);
  });

  it('defaults to forward', () => {
    expect(DEFAULT_ORDER).toBe('forward');
  });

  it('names the reverse order with a valid id', () => {
    expect(REVERSE_ORDER).toBe('reverse');
    expect(isInputOrder(REVERSE_ORDER)).toBe(true);
  });

  describe('isInputOrder', () => {
    it('is true for every known order id', () => {
      ORDER_IDS.forEach((id) => {
        expect(isInputOrder(id)).toBe(true);
      });
    });

    it('is false for an unknown id', () => {
      expect(isInputOrder('sideways')).toBe(false);
    });

    it('is false for inherited Object.prototype properties', () => {
      expect(isInputOrder('toString')).toBe(false);
      expect(isInputOrder('__proto__')).toBe(false);
    });

    it('is false for undefined', () => {
      expect(isInputOrder(undefined)).toBe(false);
    });
  });

  describe('createInputOrder', () => {
    it('returns null for an unknown id', () => {
      expect(createInputOrder('sideways')).toBeNull();
    });

    it('returns a frozen object', () => {
      expect(Object.isFrozen(createInputOrder('forward'))).toBe(true);
    });

    describe('forward', () => {
      const order = createInputOrder('forward');
      const sequence = ['A', 'B', 'C'];

      it('expects the letter at inputIndex', () => {
        expect(order.expectedLetter(sequence, 0)).toBe('A');
        expect(order.expectedLetter(sequence, 1)).toBe('B');
        expect(order.expectedLetter(sequence, 2)).toBe('C');
      });

      it('has a scoreMultiplier of 1', () => {
        expect(order.scoreMultiplier).toBe(1);
      });
    });

    describe('reverse', () => {
      const order = createInputOrder('reverse');
      const sequence = ['A', 'B', 'C'];

      it('expects the letter counting back from the end', () => {
        expect(order.expectedLetter(sequence, 0)).toBe('C');
        expect(order.expectedLetter(sequence, 1)).toBe('B');
        expect(order.expectedLetter(sequence, 2)).toBe('A');
      });

      it('has a scoreMultiplier of 1.5', () => {
        expect(order.scoreMultiplier).toBe(1.5);
      });
    });
  });
});
