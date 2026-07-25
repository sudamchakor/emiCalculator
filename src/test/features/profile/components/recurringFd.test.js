import { calculatePlanResults } from '../../../../features/profile/components/goalFormUtils';

describe('recurring FD plan calculations', () => {
  it('uses the monthly contribution for recurring FD invested amount', () => {
    const plan = {
      type: 'fd',
      monthlyInvestment: 5000,
      interestRate: 7,
      timePeriod: 3,
      compoundingFrequency: 'annually',
      depositType: 'recurring',
    };

    const result = calculatePlanResults(plan);

    expect(result.investedAmount).toBe(180000);
    expect(result.totalValue).toBeGreaterThan(result.investedAmount);
  });

  it('keeps recurring FD returns based on monthly interest regardless of compounding frequency', () => {
    const recurringQuarterlyPlan = {
      type: 'fd',
      monthlyInvestment: 5000,
      interestRate: 7,
      timePeriod: 3,
      compoundingFrequency: 'quarterly',
      depositType: 'recurring',
    };

    const recurringHalfYearlyPlan = {
      type: 'fd',
      monthlyInvestment: 5000,
      interestRate: 7,
      timePeriod: 3,
      compoundingFrequency: 'half-yearly',
      depositType: 'recurring',
    };

    const recurringMonthlyPlan = {
      type: 'fd',
      monthlyInvestment: 5000,
      interestRate: 7,
      timePeriod: 3,
      compoundingFrequency: 'monthly',
      depositType: 'recurring',
    };

    const recurringResult = calculatePlanResults(recurringQuarterlyPlan);
    const halfYearlyResult = calculatePlanResults(recurringHalfYearlyPlan);
    const monthlyResult = calculatePlanResults(recurringMonthlyPlan);

    expect(recurringResult.investedAmount).toBe(180000);
    expect(halfYearlyResult.investedAmount).toBe(180000);
    expect(monthlyResult.investedAmount).toBe(180000);
    expect(halfYearlyResult.totalValue).toBe(recurringResult.totalValue);
    expect(halfYearlyResult.estimatedReturns).toBe(recurringResult.estimatedReturns);
    expect(monthlyResult.totalValue).toBe(recurringResult.totalValue);
    expect(monthlyResult.estimatedReturns).toBe(recurringResult.estimatedReturns);
  });

  it('supports yearly recurring FD contributions and invests only the number of annual deposits', () => {
    const yearlyPlan = {
      type: 'fd',
      monthlyInvestment: 20000,
      interestRate: 7,
      timePeriod: 3,
      compoundingFrequency: 'annually',
      recurringFrequency: 'yearly',
      depositType: 'recurring',
    };

    const yearlyResult = calculatePlanResults(yearlyPlan);

    expect(yearlyResult.investedAmount).toBe(60000);
    expect(yearlyResult.totalValue).toBeGreaterThan(yearlyResult.investedAmount);
  });
});
