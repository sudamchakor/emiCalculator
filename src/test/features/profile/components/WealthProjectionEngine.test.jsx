import React from 'react';
import { render, screen } from '@testing-library/react';
import WealthProjectionEngine from '../../../src/features/profile/components/WealthProjectionEngine';

describe('WealthProjectionEngine', () => {
  it('renders without crashing', () => {
    render(<WealthProjectionEngine />);
    expect(screen.getByText(/Wealth Projection Engine/i)).toBeInTheDocument(); // Placeholder
  });
});