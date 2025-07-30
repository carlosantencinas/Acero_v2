import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto'; // Asegura que Roboto esté cargado

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Estilos base reset y tipografía */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
