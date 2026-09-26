import { useEffect, useRef } from 'react';
import DialogWrapper from '../DialogWrapper';
import type { Phase } from '../../../domain/gameMachine';

type Result = Extract<Phase, 'won' | 'lost'>;

const CONTENT: Record<Result, { title: string; text: string }> = {
  won: {
    title: 'Ganaste!',
    text: 'Tu memoria es de otro nivel',
  },
  lost: {
    title: 'PARA ESO?, entrena la memoria',
    text: 'Otra oportunidad?',
  },
};

export interface ResultDialogProps {
  result: Result;
  onRetry: () => void;
  onQuit: () => void;
  score: number;
  best: number;
  isNewRecord?: boolean;
}

function ResultDialog({
  result,
  onRetry,
  onQuit,
  score,
  best,
  isNewRecord = false,
}: ResultDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    dialog.showModal();

    function handleCancel(event: Event) {
      event.preventDefault();
      onQuit();
    }

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.close();
    };
  }, [onQuit]);

  const { title, text } = CONTENT[result];

  return (
    <DialogWrapper ref={dialogRef}>
      <h2>{title}</h2>
      <p>{text}</p>
      <p>{`Puntos: ${score}`}</p>
      <p>{`Récord: ${best}`}</p>
      {isNewRecord && <p>Nuevo récord!</p>}
      <div>
        {result === 'won' ? (
          <button type="button" onClick={onQuit}>
            Aceptar
          </button>
        ) : (
          <>
            <button type="button" onClick={onRetry}>
              Sí
            </button>
            <button type="button" onClick={onQuit}>
              No
            </button>
          </>
        )}
      </div>
    </DialogWrapper>
  );
}

export default ResultDialog;
