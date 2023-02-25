import Swal from 'sweetalert2';

function SweetAlert() {
  const success = () => Swal.fire({
    title: 'Ganaste!',
    text: 'Tu memoria es de otro nivel',
    icon: 'success',
  });

  const fail = ({ confirm, cancel }) => Swal.fire({
    title: 'PARA ESO?, entrena la memoria',
    text: 'Otra oportunidad?',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((ok) => {
    if (ok.value) {
      return confirm();
    }

    return cancel();
  });

  const warning = () => Swal.fire({
    title: 'Tecla fuera del juego',
    text:
      'Presiona una tecla dentro de las mostradas en pantalla y que sea la correcta para seguir adelante',
    icon: 'info',
  });

  const showLevel = (nivelActual, levels) => Swal.fire({
    timer: 1000,
    text: `Nivel ${nivelActual + 1} de ${levels}`,
    showConfirmButton: false,
  });

  return {
    success, fail, warning, showLevel,
  };
}

export default SweetAlert;
