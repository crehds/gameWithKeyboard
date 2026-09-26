import { useEffect, useRef, useState } from 'react';
import { loadBestScore, saveBestScore } from '../infrastructure/bestScoreStorage';
import type { StorageLike } from '../infrastructure/bestScoreStorage';

export interface UseBestScoreResult {
  best: number;
  isNewRecord: boolean;
}

export default function useBestScore(
  slotId: string,
  score: number,
  finished: boolean,
  storage?: StorageLike,
): UseBestScoreResult {
  const [slot, setSlot] = useState(() => ({ id: slotId, best: loadBestScore(slotId, storage) }));
  const [recordScore, setRecordScore] = useState<number | null>(null);
  const [wasFinished, setWasFinished] = useState(false);

  let { best } = slot;

  // A new slot (mode, or mode+order) means a different best score. Reload it
  // during render, the "adjusting state when a prop changes" pattern, and
  // forget any pending "new record" left over from the previous slot's game.
  if (slot.id !== slotId) {
    best = loadBestScore(slotId, storage);
    setSlot({ id: slotId, best });
    if (recordScore !== null) setRecordScore(null);
  }

  // Detect the finished false -> true and true -> false edges during render
  // instead of in an effect, so there is no setState-in-effect. Comparing
  // against state (not a ref) is safe under StrictMode's double render: the
  // first call converges best/recordScore/wasFinished, so the second call
  // sees no mismatch and re-triggers nothing.
  if (finished !== wasFinished) {
    setWasFinished(finished);
    if (finished && score > best) {
      best = score;
      setSlot({ id: slotId, best });
      setRecordScore(score);
    } else if (!finished) {
      setRecordScore(null);
    }
  }

  // The only remaining effect: sync the new record to storage, an external
  // system. StrictMode runs a mount's effects twice (setup, cleanup, setup)
  // with no re-render in between, so the dependency array alone can't stop
  // the second run; this ref (read/written only here, never during render)
  // remembers the last (slot, score) pair already persisted.
  const lastSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (recordScore === null) return;
    const saveKey = `${slotId}:${recordScore}`;
    if (lastSavedRef.current === saveKey) return;
    lastSavedRef.current = saveKey;
    saveBestScore(slotId, recordScore, storage);
  }, [slotId, recordScore, storage]);

  return { best, isNewRecord: recordScore !== null };
}
