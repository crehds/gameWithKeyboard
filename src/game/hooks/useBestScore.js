import { useEffect, useRef, useState } from 'react';
import { loadBestScore, saveBestScore } from '../infrastructure/bestScoreStorage';

export default function useBestScore(slotId, score, finished, storage) {
  const [best, setBest] = useState(() => loadBestScore(slotId, storage));
  const [isNewRecord, setIsNewRecord] = useState(false);
  const savedForGameRef = useRef(false);
  const previousSlotIdRef = useRef(slotId);

  // A new slot (mode, or mode+order) means a different best score: reload it
  // and forget any pending "new record" state from a previous slot's game.
  // Guarded by an actual slotId change (not just an effect re-run) so
  // StrictMode's double-invocation of this effect can't stomp on the save
  // guard below.
  useEffect(() => {
    if (previousSlotIdRef.current === slotId) return;
    previousSlotIdRef.current = slotId;
    setBest(loadBestScore(slotId, storage));
    setIsNewRecord(false);
    savedForGameRef.current = false;
  }, [slotId, storage]);

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
      saveBestScore(slotId, score, storage);
      setBest(score);
      setIsNewRecord(true);
    }
  }, [finished, score, best, slotId, storage]);

  return { best, isNewRecord };
}
