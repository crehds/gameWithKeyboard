import {
  generateRandomKey, generateKeys, activate, deactivate,
} from './utils';

describe('generateRandomKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the minimum key code (65, "A") when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const key = generateRandomKey();

    expect(key).toBe(65);
  });

  it('returns the maximum key code (90, "Z") when Math.random returns just under 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);

    const key = generateRandomKey();

    expect(key).toBe(90);
  });

  it('always returns a key code within the A-Z range for any random value', () => {
    for (let i = 0; i <= 10; i += 1) {
      vi.spyOn(Math, 'random').mockReturnValue(i / 10);

      const key = generateRandomKey();

      expect(key).toBeGreaterThanOrEqual(65);
      expect(key).toBeLessThanOrEqual(90);
    }
  });
});

describe('generateKeys', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an array with the same length as the requested number of levels', () => {
    const keys = generateKeys(5);

    expect(keys).toHaveLength(5);
  });

  it('returns an empty array when 0 levels are requested', () => {
    const keys = generateKeys(0);

    expect(keys).toHaveLength(0);
  });

  it('fills every position with a key code within the A-Z range', () => {
    const keys = generateKeys(20);

    keys.forEach((key) => {
      expect(key).toBeGreaterThanOrEqual(65);
      expect(key).toBeLessThanOrEqual(90);
    });
  });
});

describe('activate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div data-key="65"></div>';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('adds the active class to the matching element', () => {
    activate(65);

    const el = document.querySelector('[data-key="65"]');
    expect(el.classList.contains('active')).toBe(true);
  });

  it('adds the success class in addition to active when opts.success is true', () => {
    activate(65, { success: true });

    const el = document.querySelector('[data-key="65"]');
    expect(el.classList.contains('active')).toBe(true);
    expect(el.classList.contains('success')).toBe(true);
  });

  it('adds the fail class in addition to active when opts.fail is true', () => {
    activate(65, { fail: true });

    const el = document.querySelector('[data-key="65"]');
    expect(el.classList.contains('active')).toBe(true);
    expect(el.classList.contains('fail')).toBe(true);
  });

  it('removes the active/success classes after the delay elapses', () => {
    activate(65, { success: true });

    vi.advanceTimersByTime(500);

    const el = document.querySelector('[data-key="65"]');
    expect(el.classList.contains('active')).toBe(false);
    expect(el.classList.contains('success')).toBe(false);
  });

  it('does not throw and returns null when no element matches the key code', () => {
    document.body.innerHTML = '';

    const result = activate(65);

    expect(result).toBeNull();
  });
});

describe('deactivate', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('removes active, success and fail classes from the element', () => {
    document.body.innerHTML = '<div data-key="65" class="active success fail"></div>';
    const el = document.querySelector('[data-key="65"]');

    deactivate(el);

    expect(el.classList.contains('active')).toBe(false);
    expect(el.classList.contains('success')).toBe(false);
    expect(el.classList.contains('fail')).toBe(false);
  });

  it('does nothing when the element has none of the tracked classes', () => {
    document.body.innerHTML = '<div data-key="65"></div>';
    const el = document.querySelector('[data-key="65"]');

    deactivate(el);

    expect(el.className).toBe('');
  });
});
