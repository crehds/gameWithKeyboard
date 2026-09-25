import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Keyboard from '.';

describe('Keyboard', () => {
  it('renders the 26 letters of the QWERTY layout', () => {
    render(<Keyboard getStatus={() => 'idle'} onPress={() => {}} />);
    'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it('forwards each letter status from getStatus', () => {
    render(
      <Keyboard getStatus={(letter) => (letter === 'A' ? 'success' : 'idle')} onPress={() => {}} />,
    );
    expect(screen.getByText('A')).toHaveAttribute('data-status', 'success');
    expect(screen.getByText('B')).toHaveAttribute('data-status', 'idle');
  });

  it('forwards a tapped letter to onPress', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Keyboard getStatus={() => 'idle'} onPress={onPress} />);

    await user.click(screen.getByRole('button', { name: 'A' }));

    expect(onPress).toHaveBeenCalledWith('A');
  });
});
