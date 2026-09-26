import { useEffect, useRef } from 'react';
import { toLetter } from '../domain/letters';
import type { Letter } from '../domain/letters';

export default function useLetterInput(onLetter: (letter: Letter) => void): void {
  const onLetterRef = useRef(onLetter);

  useEffect(() => {
    onLetterRef.current = onLetter;
  }, [onLetter]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const letter = toLetter(event.key);
      if (letter) {
        onLetterRef.current(letter);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
