import Swal from 'sweetalert2';

export function setupGame(levels, setConfig) {
  let teclas = generarTeclas(levels);
  const result = siguienteNivel(0, levels, teclas, setConfig);
  return result;
}

export function siguienteNivel(nivelActual, levels, teclas, setConfig) {
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

  for (let i = 0; i <= nivelActual; i++) {
    setTimeout((teclas) => activate(teclas[i]), 1000 * (i + 1) + 1000, teclas);
    if (i === nivelActual) {
      setTimeout(
        () => window.addEventListener('keydown', onkeydown),
        1000 * (i + 1) + 1400
      );
    }
  }

  let i = 0; //para analizar cada tecla desde el principio
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
      //compara la tecla presionada con la que se mostro a pulsar
      activate(teclaActual, { success: true });
      i++;

      //solo entrara aqui si se pulso correctamente y la misma cantidad de veces
      //que el numero del nivel. nivel 1 una tecla a pulsar y asi...
      if (i > nivelActual) {
        //
        window.removeEventListener('keydown', onkeydown);
        setTimeout(() => siguienteNivel(i, levels, teclas, setConfig), 1000);
      }

      teclaActual = teclas[i];
    } else {
      activate(ev.keyCode, { fail: true });
      window.removeEventListener('keydown', onkeydown);
      setTimeout(function () {
        Swal.fire({
          title: 'PARA ESO?, entrena la memoria',
          text: 'Otra oportunidad?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'S??',
          cancelButtonText: 'No',
        }).then((ok) => {
          if (ok.value) {
            //cuanto sufri para esto....
            teclas = generarTeclas(levels);
            siguienteNivel(0, levels, teclas, setConfig);
          } else {
            return setConfig({ levels: 0, playing: false });
          }
        });
      }, 400);
    } //termina else
  } //termina funcion onkeydown
} //termina funcion siguiente nivel*/

function generarTeclas(niveles) {
  return new Array(niveles).fill(0).map(generarTeclaAleatoria);
}

//genera una tecla aleatoria para pulsar
function generarTeclaAleatoria() {
  const min = 65;
  const max = 90;
  return Math.round(Math.random() * (max - min) + min);
}

//obtiene las propiedades de la tecla presionada
function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`);
}

//activara la tecla segun si se presiono o no
function activate(keyCode, opts = {}) {
  console.log('en el activate');
  const el = getElementByKeyCode(keyCode); //se le asigna a la variable el, la tecla presionada
  if (!el) return null;
  el.classList.add('active'); //se le agrega la clase de css active
  //se invoca al atributo del objeto opts, es una atributo predeterminado
  //asi como el codigo que tiene cada tecla
  if (opts.success) {
    el.classList.add('success'); //esto no es el atributo, es el nombre de la clase a a??adir(css)
  } else if (opts.fail) {
    el.classList.add('fail'); //esto no es el atributo, es el nombre de la clase a a??adir(css)
  }

  //servira para eliminar el color, sea que se presiono o no la tecla correcta
  setTimeout(() => deactivate(el), 500);
}

//tuve que refactorizar el c??digo por la structura de styled-components
function deactivate(el) {
  if (el.classList.contains('success')) {
    el.classList.remove('success');
  }
  if (el.classList.contains('fail')) {
    el.classList.remove('fail');
  }
  if (el.classList.contains('active')) {
    el.classList.remove('active');
  }
}
