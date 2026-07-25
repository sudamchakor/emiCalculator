import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../../pages/Home';

describe('Home Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderHome = () => {
    return render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  test('renders the hero section correctly', () => {
    renderHome();
    expect(screen.getByText(/SmartFund/i)).toBeInTheDocument();
    expect(screen.getByText(/Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Free financial tools in India/i)).toBeInTheDocument();
  });

  test('renders all system modules', () => {
    renderHome();
    const modules = [
      'Wealth Dashboard',
      'Home Loan EMI',
      'Credit Card EMI',
      'SIP & Investment',
      'Personal Loan',
      'Income Tax Planner',
    ];
    
    modules.forEach((moduleTitle) => {
      expect(screen.getByText(moduleTitle)).toBeInTheDocument();
    });
  });
});