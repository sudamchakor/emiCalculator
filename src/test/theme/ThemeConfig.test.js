import { createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../src/theme/ThemeConfig';

describe('ThemeConfig', () => {
  it('should return a dark theme when mode is "dark"', () => {
    const darkTheme = getAppTheme('dark');
    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.primary.main).toBe('#90caf9'); // Default dark primary
    expect(darkTheme.palette.background.default).toBe('#121212');
  });

  it('should return a light theme when mode is "light"', () => {
    const lightTheme = getAppTheme('light');
    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.primary.main).toBe('#1976d2'); // Default light primary
    expect(lightTheme.palette.background.default).toBe('#f5f5f5');
  });

  it('should return a light theme for an unknown mode', () => {
    const unknownTheme = getAppTheme('unknown');
    expect(unknownTheme.palette.mode).toBe('light');
  });

  it('should include custom typography settings', () => {
    const theme = getAppTheme('light');
    expect(theme.typography.fontFamily).toBe('"Roboto", "Helvetica", "Arial", sans-serif');
    expect(theme.typography.h1.fontWeight).toBe(700);
    expect(theme.typography.h1.fontSize).toBe('3.5rem');
  });

  it('should include custom component overrides', () => {
    const theme = getAppTheme('light');
    expect(theme.components.MuiButton.styleOverrides.root.borderRadius).toBe(8);
    expect(theme.components.MuiAppBar.defaultProps.elevation).toBe(0);
  });

  it('should include custom shadows', () => {
    const theme = getAppTheme('light');
    expect(theme.shadows.length).toBe(25); // MUI default shadows array length
    expect(theme.shadows[1]).toBe('0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)');
  });
});