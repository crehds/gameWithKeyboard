import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DifficultyDialog from '.';

describe('DifficultyDialog', () => {
  it('opens as a modal dialog with the configuration title and label', () => {
    render(<DifficultyDialog onStart={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Configuración del juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Selecciona la dificultad')).toBeInTheDocument();
  });

  it('offers the four fixed difficulties with their level counts', () => {
    render(<DifficultyDialog onStart={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('Novato - 10 niveles')).toBeInTheDocument();
    expect(screen.getByText('Normal - 14 niveles')).toBeInTheDocument();
    expect(screen.getByText('Experto - 18 niveles')).toBeInTheDocument();
    expect(screen.getByText('Eidético - 22 niveles')).toBeInTheDocument();
  });

  it('offers an endless option last', () => {
    render(<DifficultyDialog onStart={() => {}} onCancel={() => {}} />);
    const options = screen.getAllByRole('option');
    expect(options[options.length - 1]).toHaveTextContent('Infinito - sin límite');
  });

  it('starts the game with the endless mode when selected', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<DifficultyDialog onStart={onStart} onCancel={() => {}} />);

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'endless');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(onStart).toHaveBeenCalledWith('endless', 'forward');
  });

  it('defaults to normal', () => {
    render(<DifficultyDialog onStart={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('Selecciona la dificultad')).toHaveValue('normal');
  });

  it('starts the game with the selected difficulty when Jugar is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<DifficultyDialog onStart={onStart} onCancel={() => {}} />);

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'expert');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(onStart).toHaveBeenCalledWith('expert', 'forward');
  });

  it('the reverse checkbox is unchecked by default', () => {
    render(<DifficultyDialog onStart={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('Reverso: escribe la secuencia al revés')).not.toBeChecked();
  });

  it('starts with the reverse order when the reverse checkbox is checked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<DifficultyDialog onStart={onStart} onCancel={() => {}} />);

    await user.click(screen.getByLabelText('Reverso: escribe la secuencia al revés'));
    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'normal');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(onStart).toHaveBeenCalledWith('normal', 'reverse');
  });

  it('cancels setup when Cancelar is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<DifficultyDialog onStart={() => {}} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels setup on Esc (native cancel event)', () => {
    const onCancel = vi.fn();
    render(<DifficultyDialog onStart={() => {}} onCancel={onCancel} />);

    screen.getByRole('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
