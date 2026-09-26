// Spelled out (not generated) so the type system knows each letter.
// prettier-ignore
export const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;

export type Letter = (typeof ALPHABET)[number];

export function isLetter(value: unknown): value is Letter {
  // ALPHABET.includes(value) itself would require value to already be a
  // Letter; comparing element-by-element checks membership without that.
  return typeof value === 'string' && ALPHABET.some((letter) => letter === value);
}

export function toLetter(eventKey: unknown): Letter | null {
  if (typeof eventKey !== 'string' || eventKey.length !== 1) {
    return null;
  }

  const upperCased = eventKey.toUpperCase();
  return isLetter(upperCased) ? upperCased : null;
}

export function randomLetter(random: () => number = Math.random): Letter {
  const index = Math.floor(random() * ALPHABET.length);
  const letter = ALPHABET[index];
  // noUncheckedIndexedAccess guard: index is only out of range when random()
  // breaks its documented [0, 1) contract.
  if (letter === undefined) {
    throw new RangeError(`random() must return a value in [0, 1); produced index ${index}`);
  }
  return letter;
}

export function generateSequence(length: number, random: () => number = Math.random): Letter[] {
  return Array.from({ length }, () => randomLetter(random));
}
