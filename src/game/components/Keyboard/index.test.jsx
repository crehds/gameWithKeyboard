import { render, screen } from '@testing-library/react';
import Keyboard from '.';

describe('Keyboard', () => {
  it('renders the 26 letters of the QWERTY layout', () => {
    render(<Keyboard getStatus={() => 'idle'} />);
    'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it('forwards each letter status from getStatus', () => {
    render(<Keyboard getStatus={(letter) => (letter === 'A' ? 'success' : 'idle')} />);
    expect(screen.getByText('A')).toHaveAttribute('data-status', 'success');
    expect(screen.getByText('B')).toHaveAttribute('data-status', 'idle');
  });
});
