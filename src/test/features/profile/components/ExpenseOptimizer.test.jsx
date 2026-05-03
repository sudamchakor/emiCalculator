import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpenseOptimizer from '../../../src/features/profile/components/ExpenseOptimizer';

describe('ExpenseOptimizer', () => {
  it('renders without crashing', () => {
    render(<ExpenseOptimizer />);
    expect(screen.getByText(/Expense Optimizer/i)).toBeInTheDocument(); // Placeholder
  });
});