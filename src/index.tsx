import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // createRoot(null) already throws today; this just gives that failure a
  // clear message instead of relying on React's internal check.
  throw new Error('Failed to find the root element (#root) to mount the app.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
