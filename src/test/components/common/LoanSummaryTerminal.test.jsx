import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoanSummaryTerminal from '../../../src/components/common/LoanSummaryTerminal';
import '@testing-library/jest-dom';

const theme = createTheme(); // Create a basic theme for ThemeProvider

describe('LoanSummaryTerminal Component', () => {
  const defaultProps = {
    title: 'Loan Summary',
    monthlyEmi: 15000,
    totalInterest: 100000,
    totalPayable: 1600000,
    currency: '₹',
    interestColor: 'warning.main',
    loading: false,
    children: null,
  };

  // Helper function to render the component with ThemeProvider
  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <LoanSummaryTerminal {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  // --- Positive Scenarios ---
  it('renders with default title and financial figures', () => {
    renderComponent();
    expect(screen.getByText('Loan Summary')).toBeInTheDocument();
    expect(screen.getByText('Monthly EMI')).toBeInTheDocument();
    expect(screen.getByText('₹15,000')).toBeInTheDocument();
    expect(screen.getByText('Total Interest Burden')).toBeInTheDocument();
    expect(screen.getByText('₹1,00,000')).toBeInTheDocument();
    expect(screen.getByText('Total Amount Payable')).toBeInTheDocument();
    expect(screen.getByText('₹16,00,000')).toBeInTheDocument();
  });

  it('renders with a custom title', () => {
    renderComponent({ title: 'My Mortgage Details' });
    expect(screen.getByText('My Mortgage Details')).toBeInTheDocument();
    expect(screen.queryByText('Loan Summary')).not.toBeInTheDocument();
  });

  it('renders with a custom currency symbol', () => {
    renderComponent({ currency: '$' });
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    expect(screen.getByText('$1,00,000')).toBeInTheDocument();
    expect(screen.getByText('$16,00,000')).toBeInTheDocument();
  });

  it('applies custom interestColor to Total Interest Burden', () => {
    renderComponent({ interestColor: 'error.main' });
    const totalInterestElement = screen.getByText('₹1,00,000');
    // MUI uses theme.palette.error.main for 'error.main'
    expect(totalInterestElement).toHaveStyle(`color: ${theme.palette.error.main}`);
  });

  it('renders children when provided', () => {
    renderComponent({ children: <div data-testid="child-content">Extra Info</div> });
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Extra Info')).toBeInTheDocument();
  });

  // --- Loading State ---
  it('renders CircularProgress when loading is true', () => {
    renderComponent({ loading: true });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    // Ensure other content is still present but potentially obscured
    expect(screen.getByText('Loan Summary')).toBeInTheDocument();
  });

  it('does not render CircularProgress when loading is false', () => {
    renderComponent({ loading: false });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  // --- Negative Scenarios / Edge Cases ---
  it('handles zero values for financial figures gracefully', () => {
    renderComponent({
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayable: 0,
    });
    expect(screen.getByText('₹0')).toBeInTheDocument(); // Monthly EMI
    expect(screen.getByText('₹0')).toBeInTheDocument(); // Total Interest Burden
    expect(screen.getByText('₹0')).toBeInTheDocument(); // Total Amount Payable
  });

  it('handles null/undefined values for financial figures gracefully (renders 0)', () => {
    renderComponent({
      monthlyEmi: null,
      totalInterest: undefined,
      totalPayable: null,
    });
    expect(screen.getAllByText('₹0')).toHaveLength(3);
  });

  it('handles empty string for title gracefully (renders empty)', () => {
    renderComponent({ title: '' });
    expect(screen.getByText('')).toBeInTheDocument(); // Empty typography element
    expect(screen.queryByText('Loan Summary')).not.toBeInTheDocument();
  });

  it('does not render children when children prop is null/undefined', () => {
    renderComponent({ children: null });
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });
});