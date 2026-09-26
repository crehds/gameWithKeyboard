import { useEffect, useRef, useState } from 'react';
import { MODE_IDS, DEFAULT_MODE, isGameMode } from '../../../domain/gameMode';
import type { ModeId } from '../../../domain/gameMode';
import { DEFAULT_ORDER, REVERSE_ORDER } from '../../../domain/inputOrder';
import type { OrderId } from '../../../domain/inputOrder';
import DialogWrapper from '../DialogWrapper';

const LABELS: Record<ModeId, string> = {
  rookie: 'Novato - 10 niveles',
  normal: 'Normal - 14 niveles',
  expert: 'Experto - 18 niveles',
  eidetic: 'Eidético - 22 niveles',
  endless: 'Infinito - sin límite',
};

export interface DifficultyDialogProps {
  onStart: (modeId: ModeId, orderId: OrderId) => void;
  onCancel: () => void;
}

function DifficultyDialog({ onStart, onCancel }: DifficultyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modeId, setModeId] = useState<ModeId>(DEFAULT_MODE);
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    dialog.showModal();

    function handleCancel(event: Event) {
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
          onChange={(event) => {
            if (isGameMode(event.target.value)) setModeId(event.target.value);
          }}
        >
          {MODE_IDS.map((id) => (
            <option key={id} value={id}>
              {LABELS[id]}
            </option>
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
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </DialogWrapper>
  );
}

export default DifficultyDialog;
