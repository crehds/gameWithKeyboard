import { render } from '@testing-library/react';
import Key from './index';

function generateAlphabet({ start, end }) {
  const arr = [];
  for (let i = start; i <= end; i += 1) {
    const letter = String.fromCharCode(i);
    arr.push(letter);
  }
  return arr;
}

const ALPHABET = generateAlphabet({ start: 97, end: 122 });

test('render a key component with x text', () => {
  const random = Math.floor(Math.random() * ALPHABET.length);
  const letter = ALPHABET[random];
  const dataKey = letter.charCodeAt().toString();

  const component = render(<Key dataKey={dataKey} letter={letter} />);
  component.getByText(letter);
});
