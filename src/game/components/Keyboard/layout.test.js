import layout from './layout';

describe('keyboard layout', () => {
  it('matches the QWERTY rows', () => {
    expect(layout).toEqual([
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ]);
  });

  it('contains each of the 26 letters exactly once', () => {
    const flat = layout.flat();
    expect(flat).toHaveLength(26);
    expect(new Set(flat).size).toBe(26);
  });
});
