import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultDialog from '.';

describe('ResultDialog', () => {
  it('shows the win message and a single Aceptar button that quits', async () => {
    const user = userEvent.setup();
    const onQuit = vi.fn();
    render(<ResultDialog result="won" onRetry={() => {}} onQuit={onQuit} />);

    expect(screen.getByText('Ganaste!')).toBeInTheDocument();
    expect(screen.getByText('Tu memoria es de otro nivel')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sí' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('shows the lose message with Sí/No buttons wired to retry/quit', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onQuit = vi.fn();
    render(<ResultDialog result="lost" onRetry={onRetry} onQuit={onQuit} />);

    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();
    expect(screen.getByText('Otra oportunidad?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sí' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'No' }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('quits on Esc (native cancel event)', () => {
    const onQuit = vi.fn();
    render(<ResultDialog result="lost" onRetry={() => {}} onQuit={onQuit} />);

    screen.getByRole('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(onQuit).toHaveBeenCalledTimes(1);
  });
});
