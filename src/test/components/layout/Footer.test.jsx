import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../../../src/components/layout/Footer';
import '@testing-library/jest-dom';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const theme = createTheme(); // Create a basic theme for ThemeProvider

describe('Footer Component', () => {
  // Helper function to render the component with ThemeProvider and Router
  const renderComponent = () => {
    return render(
      <ThemeProvider theme={theme}>
        <Router>
          <Footer />
        </Router>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Positive Scenarios ---
  it('renders the copyright text with current year', () => {
    renderComponent();
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear}`)).toBeInTheDocument();
    expect(screen.getByText('SmartFund Manager')).toBeInTheDocument();
  });

  it('renders all footer links', () => {
    renderComponent();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('calls navigate with "/" when "SmartFund Manager" link is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('SmartFund Manager'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls navigate with correct path when Privacy Policy link is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Privacy Policy'));
    expect(mockNavigate).toHaveBeenCalledWith('/privacy-policy');
  });

  it('calls navigate with correct path when Terms of Service link is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Terms of Service'));
    expect(mockNavigate).toHaveBeenCalledWith('/terms-of-service');
  });

  it('calls navigate with correct path when Contact Us link is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Contact Us'));
    expect(mockNavigate).toHaveBeenCalledWith('/contact-us');
  });

  it('renders the tagline "Built for precision. Managed with intelligence."', () => {
    renderComponent();
    expect(screen.getByText('Built for precision. Managed with intelligence.')).toBeInTheDocument();
  });

  // --- Styling and Responsiveness (visual checks, but can test presence of props) ---
  it('applies fixed positioning and zIndex', () => {
    renderComponent();
    const footer = screen.getByRole('contentinfo'); // footer element has role 'contentinfo'
    expect(footer).toHaveStyle('position: fixed');
    expect(footer).toHaveStyle(`z-index: ${theme.zIndex.appBar}`);
  });

  it('applies dynamic background and border styles', () => {
    renderComponent();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle(`background-color: ${alpha(theme.palette.background.paper, 0.9)}`);
    expect(footer).toHaveStyle(`border-top: 1px solid ${theme.palette.divider}`);
  });

  it('adjusts stack direction for small screens', () => {
    // This is a CSS media query, hard to test directly with JSDOM.
    // We can only assert that the `sx` prop contains the responsive styles.
    renderComponent();
    const stack = screen.getByText('SmartFund Manager').closest('.MuiStack-root');
    expect(stack).toHaveStyle('flex-direction: column'); // Default for xs
    // For sm, it should be row, but JSDOM doesn't simulate viewport width.
  });

  it('hides tagline on small screens (md: "block")', () => {
    // Similar to above, this is a CSS media query.
    // We can assert the presence of the element, and its style prop.
    renderComponent();
    const tagline = screen.getByText('Built for precision. Managed with intelligence.');
    expect(tagline).toHaveStyle('display: none'); // Default for xs, sm
  });
});