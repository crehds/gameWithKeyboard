import PropTypes from 'prop-types';
import useGame from '../hooks/useGame';
import useLetterInput from '../hooks/useLetterInput';
import useBestScore from '../hooks/useBestScore';
import { isPlaying, keyStatus } from '../domain/gameMachine';
import { createGameMode } from '../domain/gameMode';
import { REVERSE_ORDER } from '../domain/inputOrder';
import { bestScoreSlot } from '../domain/scoring';
import StatusBar from './StatusBar';
import Keyboard from './Keyboard';
import DifficultyDialog from './dialogs/DifficultyDialog';
import RoundBanner from './dialogs/RoundBanner';
import ResultDialog from './dialogs/ResultDialog';

function GameScreen({ random = Math.random, bestScoreStorage = undefined }) {
  const {
    state, openSetup, start, cancelSetup, retry, quit, pressLetter,
  } = useGame(random);

  useLetterInput(pressLetter);

  const {
    phase, round, showIndex, modeId, orderId, score,
  } = state;
  const mode = createGameMode(modeId);
  const finished = phase === 'won' || phase === 'lost';
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
      {phase === 'configuring' && (
        <DifficultyDialog onStart={start} onCancel={cancelSetup} />
      )}
      {phase === 'showing' && showIndex === -1 && (
        <RoundBanner
          round={round}
          total={mode ? mode.rounds : round + 1}
          reversed={orderId === REVERSE_ORDER}
        />
      )}
      {finished && (
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

GameScreen.propTypes = {
  random: PropTypes.func,
  bestScoreStorage: PropTypes.shape({
    getItem: PropTypes.func.isRequired,
    setItem: PropTypes.func.isRequired,
  }),
};

export default GameScreen;
