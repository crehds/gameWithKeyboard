import React from 'react';
import { OptionsWrapper } from './styles';
import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar } from 'react-icons/gi';
import { GiPlayButton } from 'react-icons/gi';

export const Options = (props) => {
  return (
    <OptionsWrapper statusGame={props.statusGame}>
      {props.statusGame ? (
        <BiRefresh className='refreshGame' onClick={props.handleSetupGame} />
      ) : (
        <div onClick={props.handleSetupGame}>
          <GiPlayButton />
        </div>
      )}
      <GiStarAltar className='statusGame' />
      {props.statusGame ? 'Jugando' : 'Apagado'}
    </OptionsWrapper>
  );
};
