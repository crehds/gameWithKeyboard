import { DIFFICULTIES, DEFAULT_DIFFICULTY } from './difficulty';

describe('difficulty', () => {
  it('maps each difficulty to its sequence length', () => {
    expect(DIFFICULTIES).toEqual({
      rookie: 10,
      normal: 14,
      expert: 18,
      eidetic: 22,
    });
  });

  it('defaults to normal', () => {
    expect(DEFAULT_DIFFICULTY).toBe('normal');
    expect(DIFFICULTIES[DEFAULT_DIFFICULTY]).toBe(14);
  });
});
