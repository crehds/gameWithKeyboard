export const DIFFICULTIES = {
  rookie: 10,
  normal: 14,
  expert: 18,
  eidetic: 22,
};

export const DEFAULT_DIFFICULTY = 'normal';

export function isDifficulty(id) {
  return Object.prototype.hasOwnProperty.call(DIFFICULTIES, id);
}
