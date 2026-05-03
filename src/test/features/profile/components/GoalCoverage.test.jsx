import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalCoverage from '../../../src/features/profile/components/GoalCoverage';

describe('GoalCoverage', () => {
  it('renders without crashing', () => {
    render(<GoalCoverage />);
    expect(screen.getByText(/Goal Coverage/i)).toBeInTheDocument(); // Placeholder
  });
});