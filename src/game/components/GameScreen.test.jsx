import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameScreen from './GameScreen';
import {
  ROUND_INTRO_DELAY, FLASH_INTERVAL, INPUT_READY_DELAY, ROUND_COMPLETE_DELAY,
} from '../domain/timing';
import { DIFFICULTIES } from '../domain/difficulty';

function advanceToAwaitingInput(round) {
  act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });
  for (let i = 1; i <= round; i += 1) {
    act(() => { vi.advanceTimersByTime(FLASH_INTERVAL); });
  }
  act(() => { vi.advanceTimersByTime(INPUT_READY_DELAY); });
}

// Presses the correct prefix for `round` (letters are all 'A' with a fixed
// random() of 0), then, unless it is the last round, advances past the
// round-complete delay before recursing into the next round. Recursion keeps
// this sequential without an eslint-disabled await-in-loop.
async function playRoundsToVictory(gameUser, round, totalRounds) {
  advanceToAwaitingInput(round);
  await gameUser.keyboard('a'.repeat(round + 1));
  if (round < totalRounds - 1) {
    act(() => { vi.advanceTimersByTime(ROUND_COMPLETE_DELAY); });
    await playRoundsToVictory(gameUser, round + 1, totalRounds);
  }
}

// Yields a fixed random() value per "generation" of generateSequence calls
// (each generation being `generationLength` calls long), so the sequence
// produced by start() differs deterministically from the one produced by a
// later retry().
function makeGenerationalRandom(generationLength, valuesPerGeneration) {
  let calls = 0;
  return () => {
    const generationIndex = Math.floor(calls / generationLength);
    calls += 1;
    const value = valuesPerGeneration[generationIndex];
    return value === undefined ? valuesPerGeneration[valuesPerGeneration.length - 1] : value;
  };
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

  it('wins the game after completing every round on the easiest difficulty', async () => {
    const random = () => 0; // always 'A'
    const totalRounds = DIFFICULTIES.rookie;

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'rookie');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    await playRoundsToVictory(user, 0, totalRounds);

    expect(screen.getByText('Ganaste!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByText('Apagado')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('retries with a newly generated sequence while keeping the same difficulty', async () => {
    // First generation (initial sequence) is all 'A'; second generation
    // (after retry) is all 'B'.
    const random = makeGenerationalRandom(DIFFICULTIES.expert, [0, 0.05]);

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'expert');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(screen.getByRole('status')).toHaveTextContent(`Nivel 1 de ${DIFFICULTIES.expert}`);

    advanceToAwaitingInput(0);
    expect(screen.getByText('A')).toHaveAttribute('data-status', 'active');

    await user.keyboard('b'); // wrong key: the expected letter is 'A'

    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sí' }));

    expect(screen.getByRole('status')).toHaveTextContent(`Nivel 1 de ${DIFFICULTIES.expert}`);

    advanceToAwaitingInput(0);
    expect(screen.getByText('B')).toHaveAttribute('data-status', 'active');
  });
});
