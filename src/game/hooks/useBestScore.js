import { useEffect, useRef, useState } from 'react';
import { loadBestScore, saveBestScore } from '../infrastructure/bestScoreStorage';

export default function useBestScore(modeId, score, finished, storage) {
  const [best, setBest] = useState(() => loadBestScore(modeId, storage));
  const [isNewRecord, setIsNewRecord] = useState(false);
  const savedForGameRef = useRef(false);
  const previousModeIdRef = useRef(modeId);

  // A new mode means a different best-score slot: reload it and forget any
  // pending "new record" state from a previous mode's game. Guarded by an
  // actual modeId change (not just an effect re-run) so StrictMode's
  // double-invocation of this effect can't stomp on the save guard below.
  useEffect(() => {
    if (previousModeIdRef.current === modeId) return;
    previousModeIdRef.current = modeId;
    setBest(loadBestScore(modeId, storage));
    setIsNewRecord(false);
    savedForGameRef.current = false;
  }, [modeId, storage]);

  useEffect(() => {
    if (!finished) {
      savedForGameRef.current = false;
      setIsNewRecord(false);
      return;
    }

    // Guards against StrictMode's double effect invocation and re-renders
    // while still finished: only ever save once per finished game.
    if (savedForGameRef.current) return;
    savedForGameRef.current = true;

    if (score > best) {
      saveBestScore(modeId, score, storage);
      setBest(score);
      setIsNewRecord(true);
    }
  }, [finished, score, best, modeId, storage]);

  return { best, isNewRecord };
}
