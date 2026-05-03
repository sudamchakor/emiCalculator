import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalMonthlyPayment from '../../../../src/features/emiCalculator/components/TotalMonthlyPayment';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(selector => selector({
    emiCalculator: {
      emi: 1500,
      totalInterest: 50000,
      totalPayment: 150000,
    },
    emi: {
      currency: '₹',
    },
  })),
  useDispatch: () => jest.fn(),
}));

describe('TotalMonthlyPayment', () => {
  it('renders without crashing', () => {
    render(<TotalMonthlyPayment />);
    expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Interest Payable/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Payment/i)).toBeInTheDocument();
  });
});