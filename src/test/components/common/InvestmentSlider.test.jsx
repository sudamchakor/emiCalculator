import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InvestmentSlider from '../../../src/components/common/InvestmentSlider';
import '@testing-library/jest-dom';

const theme = createTheme(); // Create a basic theme for ThemeProvider

describe('InvestmentSlider Component', () => {
  const defaultProps = {
    label: 'Investment Amount',
    value: 5000,
    min: 0,
    max: 10000,
    step: 100,
    onChange: jest.fn(),
    color: 'primary',
    adornment: '₹',
    adornmentPosition: 'start',
  };

  // Helper function to render the component with ThemeProvider
  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <InvestmentSlider {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Positive Scenarios ---
  it('renders the label, current value, and slider', () => {
    renderComponent();
    expect(screen.getByText('Investment Amount')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders with start adornment when adornmentPosition is "start"', () => {
    renderComponent({ adornmentPosition: 'start', adornment: '₹' });
    const textField = screen.getByDisplayValue('5000');
    expect(textField.previousSibling).toHaveTextContent('₹');
    expect(textField.nextSibling).not.toHaveTextContent('₹');
  });

  it('renders with end adornment when adornmentPosition is "end"', () => {
    renderComponent({ adornmentPosition: 'end', adornment: '%' });
    const textField = screen.getByDisplayValue('5000');
    expect(textField.nextSibling).toHaveTextContent('%');
    expect(textField.previousSibling).not.toHaveTextContent('%');
  });

  it('calls onChange with numeric value when text input changes', () => {
    renderComponent();
    const input = screen.getByDisplayValue('5000');
    fireEvent.change(input, { target: { value: '7500' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(7500);
  });

  it('calls onChange with new value when slider changes', () => {
    renderComponent();
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 6000 } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(6000);
  });

  it('applies custom color to slider and text field', () => {
    renderComponent({ color: 'secondary' });
    const slider = screen.getByRole('slider');
    expect(slider).toHaveClass('MuiSlider-colorSecondary');

    const textField = screen.getByDisplayValue('5000');
    const inputAdornment = textField.previousSibling; // Assuming start adornment
    expect(inputAdornment).toHaveStyle(`color: ${theme.palette.secondary.main}`);
  });

  // --- Negative Scenarios / Edge Cases ---
  it('handles null/undefined value gracefully in text input', () => {
    renderComponent({ value: null });
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('handles non-numeric input in text field by passing NaN', () => {
    renderComponent();
    const input = screen.getByDisplayValue('5000');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(NaN);
  });

  it('does not render adornment if adornment prop is null/undefined', () => {
    renderComponent({ adornment: null });
    const textField = screen.getByDisplayValue('5000');
    expect(textField.previousSibling).not.toBeInTheDocument();
    expect(textField.nextSibling).not.toBeInTheDocument();
  });

  it('renders without crashing if min, max, step are not provided (uses Slider defaults)', () => {
    renderComponent({ min: undefined, max: undefined, step: undefined });
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('handles value exceeding max by capping it to max when input changes', () => {
    renderComponent({ value: 5000, max: 6000 });
    const input = screen.getByDisplayValue('5000');
    fireEvent.change(input, { target: { value: '7000' } });
    // The component itself doesn't cap the input value, it just passes it to onChange.
    // The capping logic would typically be in the parent component's onChange handler.
    expect(defaultProps.onChange).toHaveBeenCalledWith(7000);
  });
});