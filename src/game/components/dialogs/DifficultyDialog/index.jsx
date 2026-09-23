import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../../../domain/difficulty';
import DialogWrapper from '../DialogWrapper';

const LABELS = {
  rookie: 'Novato - 10 niveles',
  normal: 'Normal - 14 niveles',
  expert: 'Experto - 18 niveles',
  eidetic: 'Eidético - 22 niveles',
};

function DifficultyDialog({ onStart, onCancel }) {
  const dialogRef = useRef(null);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();

    function handleCancel(event) {
      event.preventDefault();
      onCancel();
    }

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.close();
    };
  }, [onCancel]);

  return (
    <DialogWrapper ref={dialogRef}>
      <h2>Configuración del juego</h2>
      <label htmlFor="difficulty-select">
        Selecciona la dificultad
        <select
          id="difficulty-select"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          {Object.keys(DIFFICULTIES).map((key) => (
            <option key={key} value={key}>{LABELS[key]}</option>
          ))}
        </select>
      </label>
      <div>
        <button type="button" onClick={() => onStart(difficulty)}>Jugar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </DialogWrapper>
  );
}

DifficultyDialog.propTypes = {
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DifficultyDialog;
