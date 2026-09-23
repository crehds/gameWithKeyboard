import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameScreen from './GameScreen';
import {
  ROUND_INTRO_DELAY, FLASH_INTERVAL, INPUT_READY_DELAY, ROUND_COMPLETE_DELAY,
} from '../domain/timing';

function advanceToAwaitingInput(round) {
  act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });
  for (let i = 1; i <= round; i += 1) {
    act(() => { vi.advanceTimersByTime(FLASH_INTERVAL); });
  }
  act(() => { vi.advanceTimersByTime(INPUT_READY_DELAY); });
}

describe('GameScreen integration', () => {
  let user;

  beforeEach(() => {
    vi.useFakeTimers();
    user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('plays through a difficulty selection, a completed round and a loss', async () => {
    const random = () => 0; // always 'A'

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByText('Configuración del juego')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'expert');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Nivel 1 de 18');

    advanceToAwaitingInput(0);
    expect(screen.getByText('A')).toHaveAttribute('data-status', 'active');

    await user.keyboard('a');

    act(() => { vi.advanceTimersByTime(ROUND_COMPLETE_DELAY); });

    expect(screen.getByRole('status')).toHaveTextContent('Nivel 2 de 18');

    advanceToAwaitingInput(1);

    await user.keyboard('b');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'No' }));

    expect(screen.getByText('Apagado')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
