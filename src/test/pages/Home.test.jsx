import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from '../../../src/pages/Home';
import '@testing-library/jest-dom';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock OnboardingModal (lazy loaded)
jest.mock('../../../src/features/profile/tabs/OnboardingModal', () => ({ open, onClose }) => (
  open ? <div data-testid="mock-onboarding-modal"><button onClick={onClose}>Close Onboarding</button></div> : null
));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const theme = createTheme(); // Create a basic theme for ThemeProvider

describe('Home Component', () => {
  // Helper function to render the component with ThemeProvider and Router
  const renderComponent = () => {
    return render(
      <ThemeProvider theme={theme}>
        <Router>
          <Home />
        </Router>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  // --- Hero Section ---
  it('renders the hero section with title and description', () => {
    renderComponent();
    expect(screen.getByText('SmartFund')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Your centralized financial command center for precision planning and capital growth.')).toBeInTheDocument();
  });

  // --- System Modules Grid ---
  it('renders all system modules', () => {
    renderComponent();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('EMI Calculator')).toBeInTheDocument();
    expect(screen.getByText('Credit Card EMI')).toBeInTheDocument();
    expect(screen.getByText('Investment Strategy')).toBeInTheDocument();
    expect(screen.getByText('Personal Loan')).toBeInTheDocument();
    expect(screen.getByText('Tax Optimization')).toBeInTheDocument();
  });

  it('navigates to the correct path when a module card is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('User Profile').closest('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');

    fireEvent.click(screen.getByText('EMI Calculator').closest('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/calculator');
  });

  it('renders module icons and descriptions', () => {
    renderComponent();
    expect(screen.getByText('Manage your demographics, operational liabilities, and capital goals.')).toBeInTheDocument();
    expect(screen.getByText('Calculate monthly amortization schedules and prepayment impacts.')).toBeInTheDocument();
    // Check for presence of icons (mocked or actual)
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('CalculateIcon')).toBeInTheDocument();
  });

  // --- Onboarding Modal ---
  it('shows OnboardingModal if "hasOnboarded" is not in localStorage', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('mock-onboarding-modal')).toBeInTheDocument();
    });
  });

  it('does not show OnboardingModal if "hasOnboarded" is true in localStorage', () => {
    localStorage.setItem('hasOnboarded', 'true');
    renderComponent();
    expect(screen.queryByTestId('mock-onboarding-modal')).not.toBeInTheDocument();
  });

  it('closes OnboardingModal and sets "hasOnboarded" in localStorage when onClose is called', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('mock-onboarding-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close Onboarding'));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-onboarding-modal')).not.toBeInTheDocument();
    });
    expect(localStorage.getItem('hasOnboarded')).toBe('true');
  });

  // --- Edge Cases / Negative Scenarios ---
  it('handles empty module list gracefully (no modules rendered)', () => {
    // Temporarily modify systemModules for this test
    const originalModules = [...systemModules];
    systemModules.length = 0; // Clear the array

    renderComponent();
    expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0); // Only the hero section buttons might exist

    // Restore original modules
    systemModules.push(...originalModules);
  });

  it('ensures module cards have correct styling and hover effects (visual check, not directly testable with JSDOM)', () => {
    // Direct testing of :hover pseudo-classes and keyframe animations with JSDOM is not straightforward.
    // We can assert that the `sx` prop contains the responsive styles and animation properties.
    renderComponent();
    const userProfileCard = screen.getByText('User Profile').closest('button');
    expect(userProfileCard).toHaveStyle('border: 1px solid');
    expect(userProfileCard).toHaveStyle('transition: all 0.3s ease');
    // Check for animation properties
    expect(userProfileCard).toHaveStyle('animation: moduleBootUp 2250ms ease-in-out both');
  });
});

// Re-import systemModules after the test to ensure it's reset for other tests
import { systemModules } from '../../../src/pages/Home';
