import React from 'react';
import { render, screen } from '@testing-library/react';
import ScenarioManager from '../../../src/features/profile/components/ScenarioManager';

describe('ScenarioManager', () => {
  it('renders without crashing', () => {
    render(<ScenarioManager />);
    expect(screen.getByText(/Scenario Manager/i)).toBeInTheDocument(); // Placeholder
  });
});