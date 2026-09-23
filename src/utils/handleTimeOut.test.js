import handleTimeOut from './handleTimeOut';

describe('handleTimeOut', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('calls the callback after the default delay of 400ms', () => {
    const cb = vi.fn();

    handleTimeOut({ cb });

    vi.advanceTimersByTime(399);
    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('calls the callback after a custom delay', () => {
    const cb = vi.fn();

    handleTimeOut({ cb, time: 1000 });

    vi.advanceTimersByTime(999);
    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
