import React from 'react';
import { render, screen } from '@testing-library/react';
import SipCalculatorForm from '../../../../src/features/investment/tabs/SipCalculatorForm';

describe('SipCalculatorForm', () => {
  it('renders without crashing', () => {
    render(<SipCalculatorForm />);
    expect(screen.getByText(/SIP Calculator/i)).toBeInTheDocument();
  });
});