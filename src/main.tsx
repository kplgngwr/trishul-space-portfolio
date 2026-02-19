import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './app/App';
import './app/styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Fatal: Root element #root not found in document');
}

createRoot(rootElement).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
);
