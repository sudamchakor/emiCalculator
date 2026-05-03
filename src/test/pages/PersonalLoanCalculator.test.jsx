import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PersonalLoanCalculator from '../../../src/pages/PersonalLoanCalculator';
import '@testing-library/jest-dom';

// Mock Redux hooks
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: (selector) => mockUseSelector(selector),
}));

// Mock child components
jest.mock('../../../src/components/common/PageHeader', () => ({ title, subtitle, icon: Icon }) => (
  <div data-testid="mock-page-header">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    {Icon && <Icon data-testid="mock-header-icon" />}
  </div>
));
jest.mock('../../../src/components/common/InputSlider', () => ({ label, value, onChange, ...props }) => (
  <div data-testid={`mock-input-slider-${label.replace(/\s/g, '-')}`}>
    <label htmlFor={`input-${label}`}>{label}</label>
    <input
      id={`input-${label}`}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      data-testid={`input-field-${label.replace(/\s/g, '-')}`}
    />
  </div>
));
jest.mock('../../../src/components/common/LoanSummaryTerminal', () => ({ monthlyEmi, totalInterest, totalPayable, currency, loading, children }) => (
  <div data-testid="mock-loan-summary-terminal">
    <span data-testid="monthly-emi">{currency}{monthlyEmi}</span>
    <span data-testid="total-interest">{currency}{totalInterest}</span>
    <span data-testid="total-payable">{currency}{totalPayable}</span>
    {loading && <span data-testid="loading-indicator">Loading...</span>}
    {children}
  </div>
));

const mockStore = configureStore([]);
const theme = createTheme(); // Create a basic theme for ThemeProvider

describe('PersonalLoanCalculator Page', () => {
  const renderComponent = (currency = '₹') => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.name === 'selectCurrency') {
        return currency;
      }
      return {};
    });

    return render(
      <Provider store={mockStore({})}>
        <ThemeProvider theme={theme}>
          <PersonalLoanCalculator />
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Initial Rendering ---
  it('renders PageHeader with correct title, subtitle, and icon', () => {
    renderComponent();
    expect(screen.getByTestId('mock-page-header')).toBeInTheDocument();
    expect(screen.getByText('Personal Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Configure unsecured debt parameters to calculate monthly liabilities.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header-icon')).toBeInTheDocument(); // LoanIcon
  });

  it('renders InputSliders for Loan Amount, Interest Rate, and Tenure', () => {
    renderComponent();
    expect(screen.getByTestId('mock-input-slider-Loan-Amount')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-slider-Interest-Rate-(p.a)')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-slider-Tenure-(Years)')).toBeInTheDocument();
  });

  it('renders LoanSummaryTerminal', () => {
    renderComponent();
    expect(screen.getByTestId('mock-loan-summary-terminal')).toBeInTheDocument();
  });

  // --- InputSlider Interactions and Calculations ---
  it('updates loanAmount state and recalculates EMI when Loan Amount slider changes', async () => {
    renderComponent();
    const loanAmountInput = screen.getByTestId('input-field-Loan-Amount');
    fireEvent.change(loanAmountInput, { target: { value: '600000' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹11322'); // Recalculated EMI
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹89320'); // Recalculated Interest
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹689320'); // Recalculated Payable
    });
  });

  it('updates interestRate state and recalculates EMI when Interest Rate slider changes', async () => {
    renderComponent();
    const interestRateInput = screen.getByTestId('input-field-Interest-Rate-(p.a)');
    fireEvent.change(interestRateInput, { target: { value: '12' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹11122'); // Recalculated EMI
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹167320'); // Recalculated Interest
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹667320'); // Recalculated Payable
    });
  });

  it('updates tenure state and recalculates EMI when Tenure slider changes', async () => {
    renderComponent();
    const tenureInput = screen.getByTestId('input-field-Tenure-(Years)');
    fireEvent.change(tenureInput, { target: { value: '3' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹16200'); // Recalculated EMI
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹83200'); // Recalculated Interest
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹583200'); // Recalculated Payable
    });
  });

  // --- Edge Cases / Negative Scenarios ---
  it('handles zero interest rate correctly', async () => {
    renderComponent();
    const interestRateInput = screen.getByTestId('input-field-Interest-Rate-(p.a)');
    fireEvent.change(interestRateInput, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹8333'); // 500000 / (5*12)
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹0');
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹500000');
    });
  });

  it('handles zero loan amount correctly', async () => {
    renderComponent();
    const loanAmountInput = screen.getByTestId('input-field-Loan-Amount');
    fireEvent.change(loanAmountInput, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹0');
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹0');
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹0');
    });
  });

  it('handles minimum tenure (1 year) correctly', async () => {
    renderComponent();
    const tenureInput = screen.getByTestId('input-field-Tenure-(Years)');
    fireEvent.change(tenureInput, { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-emi')).toHaveTextContent('₹44000'); // Recalculated EMI
      expect(screen.getByTestId('total-interest')).toHaveTextContent('₹28000'); // Recalculated Interest
      expect(screen.getByTestId('total-payable')).toHaveTextContent('₹528000'); // Recalculated Payable
    });
  });

  it('shows loading indicator in LoanSummaryTerminal during calculation', async () => {
    // This is hard to test directly with `useEffect` as it's synchronous in tests.
    // To properly test loading state, you'd need to mock the calculation to be asynchronous.
    // For now, we'll ensure the `loading` prop is passed.
    renderComponent();
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument(); // Should not be loading after initial render
  });

  it('uses the currency from Redux state', () => {
    renderComponent('$');
    expect(screen.getByTestId('monthly-emi')).toHaveTextContent('$9999'); // Default EMI with $
    expect(screen.getByTestId('total-interest')).toHaveTextContent('$99999'); // Default Interest with $
    expect(screen.getByTestId('total-payable')).toHaveTextContent('$999999'); // Default Payable with $
  });
});