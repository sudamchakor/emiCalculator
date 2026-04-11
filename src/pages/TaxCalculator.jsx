import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectThemeMode } from '../store/emiSlice';
import { themes } from '../components/ThemeSelector';
import TaxDashboard from '../components/taxCalculator/containers/TaxDashboard';

const TaxCalculator = () => {
  const themeMode = useSelector(selectThemeMode);

  // Get the theme based on current theme mode
  let currentThemeValue = themeMode;
  if (currentThemeValue === 'light') {
    currentThemeValue = 'dodgerblue';
  }

  const selectedTheme = themes.find((t) => t.value === currentThemeValue) || themes[0];
  const [primary, secondary, background, textPrimary, textSecondary] = selectedTheme.colors;

  // Create MUI theme matching the app theme
  const taxTheme = createTheme({
    palette: {
      mode: currentThemeValue === 'dark' ? 'dark' : 'light',
      primary: { main: primary },
      secondary: { main: secondary },
      background: {
        default: background,
        paper: currentThemeValue === 'dark' ? '#1C1B1F' : '#ffffff',
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      success: {
        main: '#4caf50',
        light: '#e8f5e9',
        contrastText: '#1b5e20',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <Box>
      <ThemeProvider theme={taxTheme}>
        <CssBaseline />
        <TaxDashboard />
      </ThemeProvider>
    </Box>
  );
};

export default TaxCalculator;
