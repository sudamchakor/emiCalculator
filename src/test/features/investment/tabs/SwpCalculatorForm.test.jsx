import React from 'react';
import { render, screen } from '@testing-library/react';
import SwpCalculatorForm from '../../../../src/features/investment/tabs/SwpCalculatorForm';

describe('SwpCalculatorForm', () => {
  it('renders without crashing', () => {
    render(<SwpCalculatorForm />);
    expect(screen.getByText(/SWP Calculator/i)).toBeInTheDocument();
  });
});