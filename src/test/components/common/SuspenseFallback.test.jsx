import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SuspenseFallback from '../../../src/components/common/SuspenseFallback';
import '@testing-library/jest-dom';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    error: { main: '#d32f2f' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    text: { primary: '#000000', secondary: '#555555' },
  },
});

describe('SuspenseFallback Component', () => {
  // Helper function to render the component with ThemeProvider
  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <SuspenseFallback {...props} />
      </ThemeProvider>
    );
  };

  // --- Positive Scenarios ---
  it('renders the "SMART ENGINE ACTIVE" title', () => {
    renderComponent();
    expect(screen.getByText('SMART ENGINE ACTIVE')).toBeInTheDocument();
  });

  it('renders the default message', () => {
    renderComponent();
    expect(screen.getByText('Calculating wealth projections...')).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    renderComponent({ message: 'Loading custom data...' });
    expect(screen.getByText('Loading custom data...')).toBeInTheDocument();
    expect(screen.queryByText('Calculating wealth projections...')).not.toBeInTheDocument();
  });

  it('renders the four calculator key symbols', () => {
    renderComponent();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('−')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('applies correct styling to the calculator keys', () => {
    renderComponent();
    const plusKey = screen.getByText('+').closest('.MuiBox-root');
    expect(plusKey).toHaveStyle(`background-color: ${theme.palette.primary.main}`);
    expect(plusKey).toHaveStyle('color: #fff');
    expect(plusKey).toHaveStyle('font-size: 1.4rem');
    expect(plusKey).toHaveStyle('font-weight: bold');
    expect(plusKey).toHaveStyle('border-radius: 10px');
  });

  // --- Negative Scenarios / Edge Cases ---
  it('renders with an empty message string', () => {
    renderComponent({ message: '' });
    expect(screen.getByText('SMART ENGINE ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('')).toBeInTheDocument(); // Empty message should still render its Typography
  });

  it('renders without crashing when no message prop is provided', () => {
    renderComponent({});
    expect(screen.getByText('Calculating wealth projections...')).toBeInTheDocument();
  });

  it('ensures the animation properties are set (visual check, not directly testable with JSDOM)', () => {
    // Testing keyframe animations directly in JSDOM is not straightforward.
    // We can assert that the `animation` CSS property is present.
    renderComponent();
    const rootBox = screen.getByText('SMART ENGINE ACTIVE').closest('.MuiBox-root').closest('.MuiBox-root');
    expect(rootBox).toHaveStyle('animation: fadeIn 0.3s ease-out');

    const plusKey = screen.getByText('+').closest('.MuiBox-root');
    expect(plusKey).toHaveStyle('animation: popAndGlow 1.5s infinite ease-in-out');
  });
});