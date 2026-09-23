import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameScreen from './GameScreen';
import {
  ROUND_INTRO_DELAY, INPUT_READY_DELAY, ROUND_COMPLETE_DELAY,
} from '../domain/timing';
import { createGameMode } from '../domain/gameMode';

function advanceToAwaitingInput(round, modeId = 'expert') {
  act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });
  const { flashInterval } = createGameMode(modeId).paceForRound(round);
  for (let i = 1; i <= round; i += 1) {
    act(() => { vi.advanceTimersByTime(flashInterval); });
  }
  act(() => { vi.advanceTimersByTime(INPUT_READY_DELAY); });
}

// Presses the correct prefix for `round` (letters are all 'A' with a fixed
// random() of 0), then, unless it is the last round, advances past the
// round-complete delay before recursing into the next round. Recursion keeps
// this sequential without an eslint-disabled await-in-loop.
async function playRoundsToVictory(gameUser, round, totalRounds, modeId = 'expert') {
  advanceToAwaitingInput(round, modeId);
  await gameUser.keyboard('a'.repeat(round + 1));
  if (round < totalRounds - 1) {
    act(() => { vi.advanceTimersByTime(ROUND_COMPLETE_DELAY); });
    await playRoundsToVictory(gameUser, round + 1, totalRounds, modeId);
  }
}

// Yields one fixed value per random() call, in order (repeating the last
// value once exhausted), so successive letters (start, each next round,
// retry) can be made to differ deterministically.
function makeSequentialRandom(values) {
  let index = 0;
  return () => {
    const value = values[index] === undefined ? values[values.length - 1] : values[index];
    index += 1;
    return value;
  };
}

// Plays `roundsToPlay` rounds correctly (letters are all 'A' with a fixed
// random() of 0), then presses a wrong key on the following round to end the
// game. Recursion keeps this sequential without an eslint-disabled
// await-in-loop.
async function playRoundsThenFail(gameUser, round, roundsToPlay, modeId) {
  advanceToAwaitingInput(round, modeId);
  if (round < roundsToPlay) {
    await gameUser.keyboard('a'.repeat(round + 1));
    act(() => { vi.advanceTimersByTime(ROUND_COMPLETE_DELAY); });
    await playRoundsThenFail(gameUser, round + 1, roundsToPlay, modeId);
  } else {
    await gameUser.keyboard('b');
  }
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
    const totalRounds = createGameMode('rookie').rounds;

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'rookie');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    await playRoundsToVictory(user, 0, totalRounds, 'rookie');

    expect(screen.getByText('Ganaste!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByText('Apagado')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('retries with a newly generated sequence while keeping the same difficulty', async () => {
    // First random() call (start's first letter) yields 'A'; the second
    // (retry's first letter) yields 'B'.
    const random = makeSequentialRandom([0, 0.05]);

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'expert');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(screen.getByRole('status')).toHaveTextContent(`Nivel 1 de ${createGameMode('expert').rounds}`);

    advanceToAwaitingInput(0);
    expect(screen.getByText('A')).toHaveAttribute('data-status', 'active');

    await user.keyboard('b'); // wrong key: the expected letter is 'A'

    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sí' }));

    expect(screen.getByRole('status')).toHaveTextContent(`Nivel 1 de ${createGameMode('expert').rounds}`);

    advanceToAwaitingInput(0);
    expect(screen.getByText('B')).toHaveAttribute('data-status', 'active');
  });

  it('plays endless mode: the banner shows no total, and a wrong key still ends the game', async () => {
    const random = () => 0; // always 'A'

    render(
      <React.StrictMode>
        <GameScreen random={random} />
      </React.StrictMode>,
    );

    await user.selectOptions(screen.getByLabelText('Selecciona la dificultad'), 'endless');
    await user.click(screen.getByRole('button', { name: 'Jugar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Nivel 1');
    expect(screen.getByRole('status')).not.toHaveTextContent('de');

    await playRoundsThenFail(user, 0, 3, 'endless');

    expect(screen.getByText('PARA ESO?, entrena la memoria')).toBeInTheDocument();
  });
});
