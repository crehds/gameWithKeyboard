// Persists each best-score slot independently. A slot is a plain string id
// (see scoring.js's bestScoreSlot) that this module never interprets: it may
// be a bare mode id or a mode+order combination. The default storage
// (window.localStorage) is resolved lazily, inside a try/catch, because
// merely accessing it can throw (privacy mode, disabled storage, etc.).
// Every function here is guaranteed to never throw.

const KEY_PREFIX = 'gameWithKeyboard.bestScore.';

function keyFor(slotId) {
  return `${KEY_PREFIX}${slotId}`;
}

function resolveStorage(storage) {
  if (storage) return storage;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function toValidScore(raw) {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

export function loadBestScore(slotId, storage) {
  try {
    const resolved = resolveStorage(storage);
    if (!resolved) return 0;
    return toValidScore(resolved.getItem(keyFor(slotId)));
  } catch {
    return 0;
  }
}

export function saveBestScore(slotId, score, storage) {
  try {
    const resolved = resolveStorage(storage);
    if (!resolved) return;
    resolved.setItem(keyFor(slotId), String(toValidScore(score)));
  } catch {
    // Storage can throw (quota exceeded, privacy mode, unavailable API);
    // losing a best-score save is never worth crashing the game.
  }
}
