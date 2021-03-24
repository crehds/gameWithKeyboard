import Swal from 'sweetalert2';

export function setupGame(levels) {
  let teclas = generarTeclas(levels);
  siguienteNivel(0, levels, teclas);
}

export function siguienteNivel(nivelActual, levels, teclas) {
  console.log(teclas);
  if (nivelActual === levels) {
    return Swal.fire({
      title: 'Ganaste!',
      text: 'Tu memoria es de otro nivel',
      icon: 'success',
    });
  }

  Swal.fire({
    timer: 1000,
    text: `Nivel ${nivelActual + 1}`,
    showConfirmButton: false,
  });

  for (let i = 0; i <= nivelActual; i++) {
    setTimeout((teclas) => activate(teclas[i]), 1000 * (i + 1) + 1000, teclas);
  }

  let i = 0; //para analizar cada tecla desde el principio
  let teclaActual = teclas[i];
  window.addEventListener('keydown', onkeydown);

  function onkeydown(ev) {
    if (ev.keyCode === teclaActual) {
      //compara la tecla presionada con la que se mostro a pulsar
      activate(teclaActual, { success: true });
      i++;

      //solo entrara aqui si se pulso correctamente y la misma cantidad de veces
      //que el numero del nivel. nivel 1 una tecla a pulsar y asi...
      if (i > nivelActual) {
        //
        window.removeEventListener('keydown', onkeydown);
        setTimeout(() => siguienteNivel(i, levels, teclas), 1000);
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
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }).then((ok) => {
          if (ok.value) {
            //cuanto sufri para esto....
            teclas = generarTeclas(levels);
            siguienteNivel(0, levels, teclas);
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
  el.classList.add('active'); //se le agrega la clase de css active
  //se invoca al atributo del objeto opts, es una atributo predeterminado
  //asi como el codigo que tiene cada tecla
  if (opts.success) {
    el.classList.add('success'); //esto no es el atributo, es el nombre de la clase a añadir(css)
  } else if (opts.fail) {
    el.classList.add('fail'); //esto no es el atributo, es el nombre de la clase a añadir(css)
  }

  //servira para eliminar el color, sea que se presiono o no la tecla correcta
  setTimeout(() => deactivate(el), 500);
}

//tuve que refactorizar el código por la structura de styled-components
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
