import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Key from '.';

describe('Key', () => {
  it('renders a button named by its letter', () => {
    render(<Key letter="A" status="idle" onPress={() => {}} />);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });

  it('calls onPress with its letter when clicked', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Key letter="A" status="idle" onPress={onPress} />);

    await user.click(screen.getByRole('button', { name: 'A' }));

    expect(onPress).toHaveBeenCalledWith('A');
  });

  it('does not keep focus after a click, so Enter or Space cannot replay its letter', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Key letter="A" status="idle" onPress={onPress} />);

    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('stays reachable with Tab for keyboard users', async () => {
    const user = userEvent.setup();
    render(<Key letter="A" status="idle" onPress={() => {}} />);

    await user.tab();

    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
  });

  it.each([['idle'], ['active'], ['success'], ['fail']])(
    'exposes its status as data-status="%s"',
    (status) => {
      render(<Key letter="B" status={status} onPress={() => {}} />);
      expect(screen.getByText('B')).toHaveAttribute('data-status', status);
    },
  );

  it('defaults to idle when no status is given', () => {
    render(<Key letter="C" onPress={() => {}} />);
    expect(screen.getByText('C')).toHaveAttribute('data-status', 'idle');
  });
});
