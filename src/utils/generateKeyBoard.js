function generateLetterWithDataKey(row = []) {
  return row.map((letter) => {
    const dataKey = letter.toUpperCase().charCodeAt();
    return {
      dataKey,
      letter,
    };
  });
}

export default function generateKeyBoard(rows = []) {
  return rows.map(generateLetterWithDataKey);
}
