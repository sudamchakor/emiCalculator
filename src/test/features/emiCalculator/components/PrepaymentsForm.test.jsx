import React from 'react';
import { render, screen } from '@testing-library/react';
import PrepaymentsForm from '../../../../src/features/emiCalculator/components/PrepaymentsForm';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(selector => selector({
    emiCalculator: {
      prepayments: [],
      loanTenure: 120,
    },
    emi: {
      currency: '₹',
    },
  })),
  useDispatch: () => jest.fn(),
}));

describe('PrepaymentsForm', () => {
  it('renders without crashing', () => {
    render(<PrepaymentsForm />);
    expect(screen.getByText(/Prepayments/i)).toBeInTheDocument();
  });
});