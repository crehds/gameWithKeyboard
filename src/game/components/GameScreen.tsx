import useGame from '../hooks/useGame';
import useLetterInput from '../hooks/useLetterInput';
import useBestScore from '../hooks/useBestScore';
import { isPlaying, keyStatus } from '../domain/gameMachine';
import type { Phase } from '../domain/gameMachine';
import { createGameMode } from '../domain/gameMode';
import { REVERSE_ORDER } from '../domain/inputOrder';
import { bestScoreSlot } from '../domain/scoring';
import type { StorageLike } from '../infrastructure/bestScoreStorage';
import StatusBar from './StatusBar';
import Keyboard from './Keyboard';
import DifficultyDialog from './dialogs/DifficultyDialog';
import RoundBanner from './dialogs/RoundBanner';
import ResultDialog from './dialogs/ResultDialog';

export interface GameScreenProps {
  random?: () => number;
  bestScoreStorage?: StorageLike;
}

// Narrows Phase to the two phases ResultDialog accepts. Called directly in
// the conditions below (never through the `finished` boolean) so TypeScript
// can actually narrow `phase` at the call site instead of casting it.
function isFinishedPhase(phase: Phase): phase is Extract<Phase, 'won' | 'lost'> {
  return phase === 'won' || phase === 'lost';
}

function GameScreen({ random = Math.random, bestScoreStorage = undefined }: GameScreenProps) {
  const { state, openSetup, start, cancelSetup, retry, quit, pressLetter } = useGame(random);

  useLetterInput(pressLetter);

  const { phase, round, showIndex, modeId, orderId, score } = state;
  const mode = createGameMode(modeId);
  const finished = isFinishedPhase(phase);
  const { best, isNewRecord } = useBestScore(
    bestScoreSlot(modeId, orderId),
    score,
    finished,
    bestScoreStorage,
  );

  return (
    <>
      <StatusBar playing={isPlaying(state)} onOpenSetup={openSetup} score={score} />
      <Keyboard getStatus={(letter) => keyStatus(state, letter)} onPress={pressLetter} />
      {phase === 'configuring' && <DifficultyDialog onStart={start} onCancel={cancelSetup} />}
      {phase === 'showing' && showIndex === -1 && (
        <RoundBanner
          round={round}
          total={mode ? mode.rounds : round + 1}
          reversed={orderId === REVERSE_ORDER}
        />
      )}
      {isFinishedPhase(phase) && (
        <ResultDialog
          result={phase}
          onRetry={retry}
          onQuit={quit}
          score={score}
          best={best}
          isNewRecord={isNewRecord}
        />
      )}
    </>
  );
}

export default GameScreen;
