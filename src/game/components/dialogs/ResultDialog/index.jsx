import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DialogWrapper from '../DialogWrapper';

const CONTENT = {
  won: {
    title: 'Ganaste!',
    text: 'Tu memoria es de otro nivel',
  },
  lost: {
    title: 'PARA ESO?, entrena la memoria',
    text: 'Otra oportunidad?',
  },
};

function ResultDialog({ result, onRetry, onQuit }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();

    function handleCancel(event) {
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
      <div>
        {result === 'won' ? (
          <button type="button" onClick={onQuit}>Aceptar</button>
        ) : (
          <>
            <button type="button" onClick={onRetry}>Sí</button>
            <button type="button" onClick={onQuit}>No</button>
          </>
        )}
      </div>
    </DialogWrapper>
  );
}

ResultDialog.propTypes = {
  result: PropTypes.oneOf(['won', 'lost']).isRequired,
  onRetry: PropTypes.func.isRequired,
  onQuit: PropTypes.func.isRequired,
};

export default ResultDialog;
