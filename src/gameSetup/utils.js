export function generateRandomKey() {
  const min = 65;
  const max = 90;
  return Math.round(Math.random() * (max - min) + min);
}

export function generateKeys(niveles) {
  return new Array(niveles).fill(0).map(generateRandomKey);
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`);
}

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

export function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode);
  if (!el) return null;
  el.classList.add('active');
  if (opts.success) {
    el.classList.add('success');
  } else if (opts.fail) {
    el.classList.add('fail');
  }

  return setTimeout(() => deactivate(el), 500);
}
