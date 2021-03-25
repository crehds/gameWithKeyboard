import { useEffect } from 'react';
import Swal from 'sweetalert2';
import './App.css';
import { KeyBoard } from './components/Keyboard';
import { GlobalStyle } from './GlobalStyles';
import { useNextLevel } from './hooks/useNextLevel';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [config, setConfig] = useNextLevel();
  useEffect(() => {
    // setConfig.setPlaying(true);
    handleSetupGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSetupGame() {
    const lvlsPerDifficulty = {
      rookie: 10,
      normal: 13,
      expert: 16,
    };
    const { value: difficulty } = await Swal.fire({
      title: 'Configuración del juego',
      input: 'select',
      inputLabel: 'Selecciona la dificultad',
      inputOptions: {
        rookie: 'Novato - 10 niveles',
        normal: 'Normal - 13 niveles',
        expert: 'Experto - 16 niveles',
      },
      inputValue: 'normal',
    });

    if (!difficulty) {
      return setConfig({
        levels: lvlsPerDifficulty.normal,
        playing: true,
      });
    }
    return setConfig({
      levels: lvlsPerDifficulty[difficulty],
      playing: true,
    });
  }
  return (
    <div className='App'>
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
