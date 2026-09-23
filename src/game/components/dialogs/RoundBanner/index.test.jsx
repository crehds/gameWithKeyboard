import { render, screen } from '@testing-library/react';
import RoundBanner from '.';

describe('RoundBanner', () => {
  it('shows the current round out of the total, both one-based', () => {
    render(<RoundBanner round={0} total={14} />);
    expect(screen.getByRole('status')).toHaveTextContent('Nivel 1 de 14');
  });

  it('is not a modal dialog', () => {
    render(<RoundBanner round={2} total={10} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
