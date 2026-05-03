import React from 'react';
import { render, screen } from '@testing-library/react';
import DebtAccelerator from '../../../src/features/profile/components/DebtAccelerator';

describe('DebtAccelerator', () => {
  it('renders without crashing', () => {
    render(<DebtAccelerator />);
    expect(screen.getByText(/Debt Accelerator/i)).toBeInTheDocument(); // Placeholder
  });
});