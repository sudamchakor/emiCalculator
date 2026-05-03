import React from 'react';
import { render, screen } from '@testing-library/react';
import CapitalGoals from '../../../../src/features/profile/tabs/OnboardingSteps/CapitalGoals';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(selector => selector({
    profile: {
      goals: [],
    },
    emi: {
      currency: '₹',
    },
  })),
  useDispatch: () => jest.fn(),
}));

// Mock child components
jest.mock('../../../../src/features/profile/components/GoalForm', () => () => <div data-testid="goal-form">GoalForm</div>);

describe('CapitalGoals', () => {
  it('renders without crashing', () => {
    render(<CapitalGoals onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByText(/What are your capital goals?/i)).toBeInTheDocument();
    expect(screen.getByTestId('goal-form')).toBeInTheDocument();
  });
});