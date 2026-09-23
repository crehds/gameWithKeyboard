import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusBar from '.';

describe('StatusBar', () => {
  it('shows a play button and "Apagado" when not playing', () => {
    render(<StatusBar playing={false} onOpenSetup={() => {}} />);
    expect(screen.getByRole('button', { name: 'play' })).toBeInTheDocument();
    expect(screen.getByText('Apagado')).toBeInTheDocument();
  });

  it('shows a refresh button and "Jugando" when playing', () => {
    render(<StatusBar playing onOpenSetup={() => {}} score={0} />);
    expect(screen.getByRole('button', { name: 'refresh' })).toBeInTheDocument();
    expect(screen.getByText('Jugando')).toBeInTheDocument();
  });

  it('shows the current score while playing', () => {
    render(<StatusBar playing onOpenSetup={() => {}} score={230} />);
    expect(screen.getByText('Puntos: 230')).toBeInTheDocument();
  });

  it('does not show a score when not playing', () => {
    render(<StatusBar playing={false} onOpenSetup={() => {}} />);
    expect(screen.queryByText(/Puntos:/)).not.toBeInTheDocument();
  });

  it('opens setup when the play button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenSetup = vi.fn();
    render(<StatusBar playing={false} onOpenSetup={onOpenSetup} />);

    await user.click(screen.getByRole('button', { name: 'play' }));

    expect(onOpenSetup).toHaveBeenCalledTimes(1);
  });

  it('opens setup when the refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenSetup = vi.fn();
    render(<StatusBar playing onOpenSetup={onOpenSetup} />);

    await user.click(screen.getByRole('button', { name: 'refresh' }));

    expect(onOpenSetup).toHaveBeenCalledTimes(1);
  });
});
