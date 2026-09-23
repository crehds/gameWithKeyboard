import {
  validateKeyCode, handleKeyResult, handleActivateKeys,
} from './game';

describe('validateKeyCode', () => {
  it.each([13, 16, 64, 91])('returns false for the non-letter key code %i', (keyCode) => {
    expect(validateKeyCode({ keyCode, min: 65, max: 90 })).toBe(false);
  });

  it.each([65, 77, 90])('returns true for the letter key code %i (A-Z inclusive)', (keyCode) => {
    expect(validateKeyCode({ keyCode, min: 65, max: 90 })).toBe(true);
  });
});

describe('handleKeyResult', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-key="65"></div>
      <div data-key="66"></div>
      <div data-key="67"></div>
      <div data-key="16"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it("returns 'playing' and marks the key as success when it is correct but the round is not finished yet", () => {
    const result = handleKeyResult(65, 0, 2, 65, 5);

    expect(result).toBe('playing');
    expect(document.querySelector('[data-key="65"]').classList.contains('success')).toBe(true);
  });

  it("returns 'next' and marks the key as success when the correct key completes the current round", () => {
    const result = handleKeyResult(66, 1, 1, 66, 5);

    expect(result).toBe('next');
    expect(document.querySelector('[data-key="66"]').classList.contains('success')).toBe(true);
  });

  it("returns 'win' and marks the key as success when the correct key is the last one of the whole game", () => {
    const result = handleKeyResult(67, 2, 2, 67, 3);

    expect(result).toBe('win');
    expect(document.querySelector('[data-key="67"]').classList.contains('success')).toBe(true);
  });

  it("returns 'lose' and marks the pressed key as fail when a letter key is pressed but it is the wrong one", () => {
    const result = handleKeyResult(66, 0, 2, 65, 5);

    expect(result).toBe('lose');
    expect(document.querySelector('[data-key="66"]').classList.contains('fail')).toBe(true);
  });

  it("returns 'out' and does not mark any key as fail when the key code is outside the A-Z range (bug #1 fix)", () => {
    const result = handleKeyResult(16, 0, 0, 65, 3);

    expect(result).toBe('out');
    expect(document.querySelector('[data-key="65"]').classList.contains('fail')).toBe(false);
    expect(document.querySelector('[data-key="16"]').classList.contains('fail')).toBe(false);
  });
});

describe('handleActivateKeys', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div data-key="65"></div>
      <div data-key="66"></div>
      <div data-key="67"></div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('flashes each key of the current sequence in order, then attaches the keydown listener only after the last flash', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const listener = vi.fn();
    const boardKeys = [65, 66, 67];

    handleActivateKeys({ currentLevel: 2, boardKeys, listener });

    expect(addEventListenerSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);
    expect(document.querySelector('[data-key="65"]').classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-key="66"]').classList.contains('active')).toBe(false);
    expect(document.querySelector('[data-key="67"]').classList.contains('active')).toBe(false);
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(document.querySelector('[data-key="66"]').classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-key="67"]').classList.contains('active')).toBe(false);
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(document.querySelector('[data-key="67"]').classList.contains('active')).toBe(true);
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', listener);
  });

  it.todo('clears the previously scheduled flash timers so a fresh call cannot attach an orphan keydown listener (known bug #3, fixed in step 3)');
});
