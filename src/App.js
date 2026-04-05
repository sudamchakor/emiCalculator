import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Context
import { EmiProvider } from './context/EmiContext';

// Components
import Header from './components/Header';
import Calculator from './pages/Calculator';
import FAQ from './pages/FAQ';

// Styles
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e90ff', // DodgerBlue
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <EmiProvider>
          <Box className="app-container">
            {/* Sticky Header */}
            <Header />
            <Box component="main" className="main-content">
              {/* Routes for pages */}
              <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </Box>
          </Box>
        </EmiProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
