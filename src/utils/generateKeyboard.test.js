import rows from './rows';
import generateKeyBoard from './generateKeyBoard';

describe('keyboard with rows', () => {
  const keyboard = generateKeyBoard(rows);
  const rowsLength = rows.length;

  test('The keyboard should have the same length as the rows array', () => {
    const keyboardLength = keyboard.length;

    expect(keyboardLength).toBe(rowsLength);
  });

  test('One keyboard element should have the keys dataKey and letter', () => {
    const randomRow = Math.floor(Math.random() * rowsLength);
    const row = keyboard[randomRow];
    const randomKey = Math.floor(Math.random() * row.length);
    const key = row[randomKey];

    expect(key).toHaveProperty('dataKey');
    expect(key).toHaveProperty('letter');
  });
});

describe('keyboard with no rows', () => {
  const keyboard = generateKeyBoard([]);

  test('the keyboard should be empty', () => {
    const { length } = keyboard;
    expect(length).toBe(0);
  });
});
