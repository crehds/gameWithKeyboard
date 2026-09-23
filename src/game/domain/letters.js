export const ALPHABET = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

export function isLetter(value) {
  return typeof value === 'string' && ALPHABET.includes(value);
}

export function toLetter(eventKey) {
  if (typeof eventKey !== 'string' || eventKey.length !== 1) {
    return null;
  }

  const upperCased = eventKey.toUpperCase();
  return isLetter(upperCased) ? upperCased : null;
}

export function randomLetter(random = Math.random) {
  return ALPHABET[Math.floor(random() * ALPHABET.length)];
}

export function generateSequence(length, random = Math.random) {
  return Array.from({ length }, () => randomLetter(random));
}
