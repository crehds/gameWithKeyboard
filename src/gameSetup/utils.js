// genera una tecla aleatoria para pulsar
export function generarTeclaAleatoria() {
  const min = 65;
  const max = 90;
  return Math.round(Math.random() * (max - min) + min);
}

export function generarTeclas(niveles) {
  return new Array(niveles).fill(0).map(generarTeclaAleatoria);
}

// obtiene las propiedades de la tecla presionada
function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`);
}

// tuve que refactorizar el código por la structura de styled-components
export function deactivate(el) {
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

// activara la tecla segun si se presiono o no
export function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode); // se le asigna a la variable el, la tecla presionada
  if (!el) return null;
  el.classList.add('active'); // se le agrega la clase de css active
  // se invoca al atributo del objeto opts, es una atributo predeterminado
  // asi como el codigo que tiene cada tecla
  if (opts.success) {
    el.classList.add('success'); // esto no es el atributo, es el nombre de la clase a añadir(css)
  } else if (opts.fail) {
    el.classList.add('fail'); // esto no es el atributo, es el nombre de la clase a añadir(css)
  }

  // servira para eliminar el color, sea que se presiono o no la tecla correcta
  return setTimeout(() => deactivate(el), 500);
}
