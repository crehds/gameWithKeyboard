import React from 'react';
import { Key } from '../Key';
import { RowWrapper } from './styles';

export const Row = ({arrKeys = []}) => {
  return (
    <RowWrapper>
      {arrKeys.map((e, i) => (
        <Key key={i} letter={e.letter} dataKey={e.dataKey} />
      ))}
    </RowWrapper>
  );
};
