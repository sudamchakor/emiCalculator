import React from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getAppTheme } from './ThemeConfig';
import {
  selectThemeMode,
  selectDesignSystem,
  selectVisualStyle,
} from '../store/emiSlice';

const ThemeResolver = ({ children }) => {
  const themeMode = useSelector(selectThemeMode);
  const designSystem = useSelector(selectDesignSystem);
  const visualStyle = useSelector(selectVisualStyle);

  const theme = getAppTheme(themeMode, designSystem, visualStyle);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeResolver;