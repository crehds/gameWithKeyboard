import nextLevel from './nextLevel';
import { generarTeclas } from './utils';

function initGame(levels, setConfig) {
  const teclas = generarTeclas(levels);
  const result = nextLevel(0, levels, teclas, setConfig);
  return result;
}

export default initGame;
