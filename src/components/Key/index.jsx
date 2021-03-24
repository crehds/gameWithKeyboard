import React from 'react';
import { KeyWrapper } from './styles';

export const Key = (props) => {
  return (
    <KeyWrapper data-key={props.dataKey}>
      {props.letter}
    </KeyWrapper>
  );
};
