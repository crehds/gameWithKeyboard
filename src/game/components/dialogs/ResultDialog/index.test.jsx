import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultDialog from '.';

describe('ResultDialog', () => {
  it('shows the win message and a single Aceptar button that quits', async () => {
    const user = userEvent.setup();
    const onQuit = vi.fn();
    render(<ResultDialog result="won" onRetry={() => {}} onQuit={onQuit} score={0} best={0} />);

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
    render(<ResultDialog result="lost" onRetry={onRetry} onQuit={onQuit} score={0} best={0} />);

    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();
    expect(screen.getByText('Otra oportunidad?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sí' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'No' }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('quits on Esc (native cancel event)', () => {
    const onQuit = vi.fn();
    render(<ResultDialog result="lost" onRetry={() => {}} onQuit={onQuit} score={0} best={0} />);

    screen.getByRole('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('shows the final score and the current record', () => {
    render(
      <ResultDialog result="lost" onRetry={() => {}} onQuit={() => {}} score={230} best={500} />,
    );

    expect(screen.getByText('Puntos: 230')).toBeInTheDocument();
    expect(screen.getByText('Récord: 500')).toBeInTheDocument();
    expect(screen.queryByText('Nuevo récord!')).not.toBeInTheDocument();
  });

  it('announces a new record when isNewRecord is true', () => {
    render(
      <ResultDialog
        result="won"
        onRetry={() => {}}
        onQuit={() => {}}
        score={600}
        best={600}
        isNewRecord
      />,
    );

    expect(screen.getByText('Puntos: 600')).toBeInTheDocument();
    expect(screen.getByText('Récord: 600')).toBeInTheDocument();
    expect(screen.getByText('Nuevo récord!')).toBeInTheDocument();
  });
});
