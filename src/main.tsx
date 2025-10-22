import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TumuloProvider } from './context/TumuloContext..tsx';
import 'leaflet/dist/leaflet.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TumuloProvider>
      <App />
    </TumuloProvider>
  </StrictMode>
);

