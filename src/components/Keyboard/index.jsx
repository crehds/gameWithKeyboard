import React from 'react';
import { arr1, arr2, arr3 } from '../../arrKeys';
import { Row } from '../Row';
import { KeyboardWrapper } from './stylex';

export const KeyBoard = () => {
  return (
    <KeyboardWrapper>
      <Row arrKeys={arr1} />
      <Row arrKeys={arr2} />
      <Row arrKeys={arr3} />
    </KeyboardWrapper>
  );
};
