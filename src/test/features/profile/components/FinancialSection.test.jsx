import React from 'react';
import { render, screen } from '@testing-library/react';
import FinancialSection from '../../../src/features/profile/components/FinancialSection';

describe('FinancialSection', () => {
  it('renders without crashing', () => {
    render(<FinancialSection />);
    expect(screen.getByText(/Financial Section/i)).toBeInTheDocument(); // Placeholder
  });
});