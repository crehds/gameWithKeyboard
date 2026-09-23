import { loadBestScore, saveBestScore } from './bestScoreStorage';

function makeMemoryStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
  };
}

describe('bestScoreStorage', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('defaults to 0 when nothing is stored yet', () => {
    expect(loadBestScore('rookie', makeMemoryStorage())).toBe(0);
  });

  it('saves and loads a score for a mode', () => {
    const storage = makeMemoryStorage();
    saveBestScore('rookie', 120, storage);
    expect(loadBestScore('rookie', storage)).toBe(120);
  });

  it('keeps scores separate per mode', () => {
    const storage = makeMemoryStorage();
    saveBestScore('rookie', 50, storage);
    saveBestScore('expert', 300, storage);
    expect(loadBestScore('rookie', storage)).toBe(50);
    expect(loadBestScore('expert', storage)).toBe(300);
  });

  it('namespaces the storage key with the mode id', () => {
    const storage = makeMemoryStorage();
    saveBestScore('normal', 77, storage);
    expect(storage.getItem('gameWithKeyboard.bestScore.normal')).toBe('77');
  });

  it('uses window.localStorage when no storage is given', () => {
    saveBestScore('normal', 77);
    expect(loadBestScore('normal')).toBe(77);
  });

  it.each([
    ['not-a-number'],
    ['-5'],
    ['12.5'],
  ])('treats a corrupt stored value (%s) as 0', (raw) => {
    const storage = makeMemoryStorage({ 'gameWithKeyboard.bestScore.rookie': raw });
    expect(loadBestScore('rookie', storage)).toBe(0);
  });

  it('never throws when the given storage throws on read or write', () => {
    const throwingStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    };
    expect(() => loadBestScore('rookie', throwingStorage)).not.toThrow();
    expect(loadBestScore('rookie', throwingStorage)).toBe(0);
    expect(() => saveBestScore('rookie', 10, throwingStorage)).not.toThrow();
  });

  it('never throws when merely accessing the default storage throws', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new Error('SecurityError'); },
    });

    try {
      expect(() => loadBestScore('rookie')).not.toThrow();
      expect(loadBestScore('rookie')).toBe(0);
      expect(() => saveBestScore('rookie', 10)).not.toThrow();
    } finally {
      Object.defineProperty(window, 'localStorage', original);
    }
  });
});
