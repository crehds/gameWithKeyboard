import { render, screen } from '@testing-library/react';
import Key from '.';

describe('Key', () => {
  it('renders the letter', () => {
    render(<Key letter="A" status="idle" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it.each([
    ['idle'],
    ['active'],
    ['success'],
    ['fail'],
  ])('exposes its status as data-status="%s"', (status) => {
    render(<Key letter="B" status={status} />);
    expect(screen.getByText('B')).toHaveAttribute('data-status', status);
  });

  it('defaults to idle when no status is given', () => {
    render(<Key letter="C" />);
    expect(screen.getByText('C')).toHaveAttribute('data-status', 'idle');
  });
});
