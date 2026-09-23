import PropTypes from 'prop-types';
import useGame from '../hooks/useGame';
import useLetterInput from '../hooks/useLetterInput';
import { isPlaying, keyStatus } from '../domain/gameMachine';
import StatusBar from './StatusBar';
import Keyboard from './Keyboard';
import DifficultyDialog from './dialogs/DifficultyDialog';
import RoundBanner from './dialogs/RoundBanner';
import ResultDialog from './dialogs/ResultDialog';

function GameScreen({ random }) {
  const {
    state, openSetup, start, cancelSetup, retry, quit, pressLetter,
  } = useGame(random);

  useLetterInput(pressLetter);

  const {
    phase, sequence, round, showIndex,
  } = state;

  return (
    <>
      <StatusBar playing={isPlaying(state)} onOpenSetup={openSetup} />
      <Keyboard getStatus={(letter) => keyStatus(state, letter)} />
      {phase === 'configuring' && (
        <DifficultyDialog onStart={start} onCancel={cancelSetup} />
      )}
      {phase === 'showing' && showIndex === -1 && (
        <RoundBanner round={round} total={sequence.length} />
      )}
      {(phase === 'won' || phase === 'lost') && (
        <ResultDialog result={phase} onRetry={retry} onQuit={quit} />
      )}
    </>
  );
}

GameScreen.propTypes = {
  random: PropTypes.func,
};

GameScreen.defaultProps = {
  random: Math.random,
};

export default GameScreen;
