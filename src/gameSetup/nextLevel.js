import Swal from 'sweetalert2';
import { activate, generarTeclas } from './utils';

function nextLevel(nivelActual, levels, teclas, setConfig) {
  if (nivelActual === levels) {
    Swal.fire({
      title: 'Ganaste!',
      text: 'Tu memoria es de otro nivel',
      icon: 'success',
    });
    return true;
  }

  Swal.fire({
    timer: 1000,
    text: `Nivel ${nivelActual + 1} de ${levels}`,
    showConfirmButton: false,
  });

  let i = 0; // para analizar cada tecla desde el principio
  let teclaActual = teclas[i];

  function onkeydown(ev) {
    if (ev.keyCode < 65 || ev.keyCode > 90) {
      Swal.fire({
        title: 'Tecla fuera del juego',
        text:
          'Presiona una tecla dentro de las mostradas en pantalla y que sea la correcta para seguir adelante',
        icon: 'info',
      });
      return null;
    }
    if (ev.keyCode === teclaActual) {
      // compara la tecla presionada con la que se mostro a pulsar
      activate(teclaActual, { success: true });
      i += 1;

      // solo entrara aqui si se pulso correctamente y la misma cantidad de veces
      // que el numero del nivel. nivel 1 una tecla a pulsar y asi...
      if (i > nivelActual) {
        //
        window.removeEventListener('keydown', onkeydown);
        setTimeout(() => nextLevel(i, levels, teclas, setConfig), 1000);
      }

      teclaActual = teclas[i];
      return true;
    }

    activate(ev.keyCode, { fail: true });
    window.removeEventListener('keydown', onkeydown);
    return setTimeout(() => {
      Swal.fire({
        title: 'PARA ESO?, entrena la memoria',
        text: 'Otra oportunidad?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((ok) => {
        if (ok.value) {
          // cuanto sufri para esto....
          const newKeys = generarTeclas(levels);
          return nextLevel(0, levels, newKeys, setConfig);
        }

        return setConfig({ levels: 0, playing: false });
      });
    }, 400);
    // termina else
  } // termina funcion onkeydown

  for (let j = 0; j <= nivelActual; j += 1) {
    setTimeout((keyboard) => activate(keyboard[j]), 1000 * (j + 1) + 1000, teclas);
    if (j === nivelActual) {
      return setTimeout(
        () => window.addEventListener('keydown', onkeydown),
        1000 * (j + 1) + 1400,
      );
    }
  }

  return false;
} // termina funcion siguiente nivel*/

export default nextLevel;
