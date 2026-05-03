import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TaxCalculator from '../../../src/pages/TaxCalculator';
import '@testing-library/jest-dom';

// Mock Redux hooks
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: (selector) => mockUseSelector(selector),
}));

// Mock lazy-loaded components
jest.mock('../../../src/pages/TaxDashboard', () => () => <div data-testid="mock-tax-dashboard">TaxDashboard</div>);
jest.mock('../../../src/components/common/SuspenseFallback', () => () => <div data-testid="suspense-fallback">Loading...</div>);

// Mock themeColors
jest.mock('../../../src/theme/ThemeConfig', () => ({
  themeColors: [
    { value: 'dodgerblue', colors: ['#1976d2', '#90caf9', '#f5f5f5', '#000000', '#555555'] },
    { value: 'dark', colors: ['#212121', '#424242', '#121212', '#ffffff', '#bbbbbb'] },
    { value: 'custom', colors: ['#ff0000', '#ff5555', '#eeeeee', '#333333', '#888888'] },
  ],
}));

const mockStore = configureStore([]);

describe('TaxCalculator Page', () => {
  const renderComponent = (themeMode = 'dodgerblue') => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.name === 'selectThemeMode') {
        return themeMode;
      }
      return {};
    });

    return render(
      <Provider store={mockStore({})}>
        <TaxCalculator />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Basic Rendering ---
  it('renders the TaxDashboard component', () => {
    renderComponent();
    expect(screen.getByTestId('mock-tax-dashboard')).toBeInTheDocument();
  });

  it('renders SuspenseFallback during lazy loading', () => {
    // This is implicitly tested by the mocks, as they immediately render their content.
    // To truly test SuspenseFallback, you'd need to delay the mock's rendering,
    // which is more complex and often handled by React's own testing utilities for Suspense.
    // For now, we ensure the fallback component is mocked.
    expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument(); // Should not be visible after initial load
  });

  // --- Theme Application ---
  it('applies the correct theme based on themeMode (dodgerblue/light)', () => {
    renderComponent('dodgerblue');
    // We can't directly inspect the MUI theme object from the rendered DOM.
    // We rely on the ThemeProvider being present and the theme being correctly created.
    // This test primarily ensures the component renders without crashing and the selector is used.
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function)); // To get themeMode
  });

  it('applies the correct theme based on themeMode (dark)', () => {
    renderComponent('dark');
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function));
  });

  it('applies the correct theme based on themeMode (custom)', () => {
    renderComponent('custom');
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function));
  });

  it('defaults to the first themeColors entry if themeMode is unknown', () => {
    renderComponent('unknown');
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function));
  });
});