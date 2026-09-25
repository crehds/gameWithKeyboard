import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the initial screen with the difficulty dialog open and the status showing Apagado', () => {
    render(<App />);

    expect(screen.getByText('Apagado')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Configuración del juego')).toBeInTheDocument();
  });
});
