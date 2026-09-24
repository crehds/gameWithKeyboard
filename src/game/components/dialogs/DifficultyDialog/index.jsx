import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MODE_IDS, DEFAULT_MODE } from '../../../domain/gameMode';
import { DEFAULT_ORDER, REVERSE_ORDER } from '../../../domain/inputOrder';
import DialogWrapper from '../DialogWrapper';

const LABELS = {
  rookie: 'Novato - 10 niveles',
  normal: 'Normal - 14 niveles',
  expert: 'Experto - 18 niveles',
  eidetic: 'Eidético - 22 niveles',
  endless: 'Infinito - sin límite',
};

function DifficultyDialog({ onStart, onCancel }) {
  const dialogRef = useRef(null);
  const [modeId, setModeId] = useState(DEFAULT_MODE);
  const [reversed, setReversed] = useState(false);

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
          value={modeId}
          onChange={(event) => setModeId(event.target.value)}
        >
          {MODE_IDS.map((id) => (
            <option key={id} value={id}>{LABELS[id]}</option>
          ))}
        </select>
      </label>
      <label htmlFor="reverse-order-checkbox">
        <input
          type="checkbox"
          id="reverse-order-checkbox"
          checked={reversed}
          onChange={(event) => setReversed(event.target.checked)}
        />
        Reverso: escribe la secuencia al revés
      </label>
      <div>
        <button
          type="button"
          onClick={() => onStart(modeId, reversed ? REVERSE_ORDER : DEFAULT_ORDER)}
        >
          Jugar
        </button>
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
