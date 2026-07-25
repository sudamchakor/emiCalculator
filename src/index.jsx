import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/global.css'; // Updated import
import './styles/theme.css'; // New import
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {
  Box,
  Typography,
  Stack,
  Container,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';

const _MUI_SHIELD = {
  Box,
  Typography,
  Stack,
  Container,
  ThemeProvider,
  CssBaseline,
};

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter basename="/smart-fund-manager">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
