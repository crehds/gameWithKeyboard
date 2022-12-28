import Swal from 'sweetalert2';
import levelsPerDifficulty from '../gameSetup/levelsPerDifficulty';

async function configModal() {
  const { value: difficulty } = await Swal.fire({
    title: 'Configuración del juego',
    input: 'select',
    inputLabel: 'Selecciona la dificultad',
    inputOptions: {
      rookie: 'Novato - 10 niveles',
      normal: 'Normal - 14 niveles',
      expert: 'Experto - 18 niveles',
      eidetic: 'Eidético - 22 niveles',
    },
    inputValue: 'normal',
    showCancelButton: true,
  });

  if (difficulty) {
    return {
      levels: levelsPerDifficulty[difficulty],
      playing: true,
    };
  }

  return {
    levels: 0,
    playing: false,
  };
}

export default configModal;
