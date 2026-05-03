import React from 'react';
import { render, screen } from '@testing-library/react';
import InvestmentChart from '../../../../src/features/investment/components/InvestmentChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="recharts-responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="recharts-area-chart">{children}</div>,
  Area: () => <div data-testid="recharts-area"></div>,
  XAxis: () => <div data-testid="recharts-xaxis"></div>,
  YAxis: () => <div data-testid="recharts-yaxis"></div>,
  CartesianGrid: () => <div data-testid="recharts-cartesiangrid"></div>,
  Tooltip: () => <div data-testid="recharts-tooltip"></div>,
  Legend: () => <div data-testid="recharts-legend"></div>,
}));

describe('InvestmentChart', () => {
  it('renders without crashing', () => {
    const mockData = [{ name: 'Jan', value: 100 }];
    render(<InvestmentChart data={mockData} />);
    expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-area-chart')).toBeInTheDocument();
  });
});