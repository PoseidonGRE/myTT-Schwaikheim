import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import ErrorBoundary from './ErrorBoundary';          // ← Neu
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Temporärer Duplikate-Check für React
;(window as any).React2 = require('react');
console.log(
  'Same React copy?',
  (window as any).React1 === (window as any).React2
);

const theme = createTheme({
  // Beispiel für Light Mode:
  // palette: { mode: 'light' },
});

serviceWorkerRegistration.register();  // Statt unregister()

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>                      {/* ← Hier */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ErrorBoundary>                     {/* ← Und hier */}
  </React.StrictMode>
);

reportWebVitals();
