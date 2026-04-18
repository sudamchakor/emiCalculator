import { calculateSIP, calculateStepUpSIP } from "./financialCalculations";

describe("Financial Calculations Utility", () => {
  
  // Helper to extract standardized values from the varied return payload structures
  const extractResultValues = (result) => {
    const investedAmount = result.totalInvestment ?? result.investedAmount ?? result.principal ?? 0;
    const estimatedReturns = result.totalReturns ?? result.estimatedReturns ?? result.totalInterest ?? 0;
    const totalValue = result.futureValue ?? result.totalValue ?? result.maturityAmount ?? 0;
    
    return { investedAmount, estimatedReturns, totalValue };
  };

  describe("calculateSIP", () => {
    it("should return zero for all fields if the monthly investment is 0", () => {
      const result = calculateSIP(0, 12, 10);
      const { investedAmount, totalValue, estimatedReturns } = extractResultValues(result);
      
      expect(investedAmount).toBe(0);
      expect(totalValue).toBe(0);
      expect(estimatedReturns).toBe(0);
    });

    it("should return the expected shape and logically consistent mathematical results", () => {
      // 10,000/month, 12% annual return, 10 years
      const result = calculateSIP(10000, 12, 10);
      const { investedAmount, totalValue, estimatedReturns } = extractResultValues(result);

      expect(investedAmount).toBeGreaterThan(0);
      expect(totalValue).toBeGreaterThan(investedAmount);
      // The estimated returns should precisely equal Total Value - Invested Amount (allow minor floating point variance)
      expect(Math.round(totalValue - investedAmount)).toBe(Math.round(estimatedReturns));
    });

    it("should accurately calculate the principal investment amount over time", () => {
      const result = calculateSIP(10000, 12, 10);
      const { investedAmount, totalValue } = extractResultValues(result);

      // 10,000 * 12 months * 10 years = 1,200,000
      expect(investedAmount).toBe(1200000);
      
      // Expected Future Value for 10k PM @ 12% for 10 years is approx 23,23,390
      expect(totalValue).toBeGreaterThan(2300000);
      expect(totalValue).toBeLessThan(2350000);
    });
  });

  describe("calculateStepUpSIP", () => {
    it("should handle the basic shape and logic correctly", () => {
      // 10,000/month, 12% return, 10 years, 10% annual step-up
      const result = calculateStepUpSIP(10000, 12, 10, 10);
      const { investedAmount, totalValue } = extractResultValues(result);

      expect(investedAmount).toBeGreaterThan(0);
      expect(totalValue).toBeGreaterThan(investedAmount);
    });

    it("should yield a higher total value and invested amount than a standard SIP", () => {
      const standardResult = extractResultValues(calculateSIP(10000, 12, 10));
      const stepUpResult = extractResultValues(calculateStepUpSIP(10000, 12, 10, 10));

      expect(stepUpResult.investedAmount).toBeGreaterThan(standardResult.investedAmount);
      expect(stepUpResult.totalValue).toBeGreaterThan(standardResult.totalValue);
      expect(stepUpResult.estimatedReturns).toBeGreaterThan(standardResult.estimatedReturns);
    });

    it("should equal a standard SIP if the step-up rate is 0", () => {
      const standardResult = extractResultValues(calculateSIP(10000, 12, 10));
      const zeroStepUpResult = extractResultValues(calculateStepUpSIP(10000, 12, 10, 0));

      expect(Math.round(zeroStepUpResult.totalValue)).toBe(Math.round(standardResult.totalValue));
      expect(Math.round(zeroStepUpResult.investedAmount)).toBe(Math.round(standardResult.investedAmount));
    });
    
    it("should handle decimal step-up rates accurately", () => {
        const result = calculateStepUpSIP(10000, 12, 10, 5.5);
        const { investedAmount } = extractResultValues(result);
        
        // It should be larger than standard SIP (1,200,000) but less than a 10% step-up
        expect(investedAmount).toBeGreaterThan(1200000);
        expect(investedAmount).toBeLessThan(extractResultValues(calculateStepUpSIP(10000, 12, 10, 10)).investedAmount);
    });
  });
});