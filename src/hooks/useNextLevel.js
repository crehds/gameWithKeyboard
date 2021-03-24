import { useEffect, useState } from 'react';
import { siguienteNivel } from '../components/functions';


export function useNextLevel(levels) {
  // const [level, setLevels] = useState(levels);
  const [playing, setPlaying] = useState(false);
  // let teclas = generarTeclas(15);

  useEffect(() => {
    if(playing) {
      siguienteNivel(0);
    }
  })
  return [playing, setPlaying];
}