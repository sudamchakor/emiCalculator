// src/utils/investmentCalculations.js

export const calculateSIP = (
  monthlyInvestment,
  expectedReturnRate,
  timePeriod
) => {
  const monthlyRate = expectedReturnRate / 100 / 12;
  const numberOfMonths = timePeriod * 12;

  let totalValue = 0;
  if (monthlyRate === 0) {
    totalValue = monthlyInvestment * numberOfMonths;
  } else {
    totalValue =
      monthlyInvestment *
      (((1 + monthlyRate) ** numberOfMonths - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  const investedAmount = monthlyInvestment * numberOfMonths;
  const estimatedReturns = totalValue - investedAmount;

  // Chart Data (simplified for now)
  const chartData = [];
  let currentInvestment = 0;
  let currentValue = 0;
  for (let i = 1; i <= numberOfMonths; i++) {
    currentInvestment += monthlyInvestment;
    currentValue =
      monthlyInvestment *
      (((1 + monthlyRate) ** i - 1) / monthlyRate) *
      (1 + monthlyRate);
    chartData.push({
      month: i,
      invested: currentInvestment,
      value: currentValue,
    });
  }

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    chartData,
  };
};

export const calculateLumpsum = (
  totalInvestment,
  expectedReturnRate,
  timePeriod
) => {
  const annualRate = expectedReturnRate / 100;

  const totalValue = totalInvestment * (1 + annualRate) ** timePeriod;
  const estimatedReturns = totalValue - totalInvestment;

  // Chart Data (simplified for now)
  const chartData = [];
  for (let i = 0; i <= timePeriod; i++) {
    chartData.push({
      year: i,
      invested: totalInvestment,
      value: totalInvestment * (1 + annualRate) ** i,
    });
  }

  return {
    investedAmount: totalInvestment,
    estimatedReturns,
    totalValue,
    chartData,
  };
};

export const calculateStepUpSIP = (
  monthlyInvestment,
  expectedReturnRate,
  timePeriod,
  stepUpPercentage
) => {
  const monthlyRate = expectedReturnRate / 100 / 12;
  const numberOfMonths = timePeriod * 12;
  const stepUpFactor = 1 + stepUpPercentage / 100;

  let totalValue = 0;
  let investedAmount = 0;
  let currentMonthlyInvestment = monthlyInvestment;

  const chartData = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;

  for (let i = 1; i <= numberOfMonths; i++) {
    cumulativeInvestment += currentMonthlyInvestment;
    investedAmount += currentMonthlyInvestment;

    // Calculate future value of current month's investment
    const futureValueOfCurrentMonth =
      currentMonthlyInvestment * (1 + monthlyRate) ** (numberOfMonths - i + 1);
    totalValue += futureValueOfCurrentMonth;

    // Update current value for chart
    cumulativeValue =
      (cumulativeValue + currentMonthlyInvestment) * (1 + monthlyRate);

    chartData.push({
      month: i,
      invested: cumulativeInvestment,
      value: cumulativeValue,
    });

    if (i % 12 === 0) {
      // Step up annually
      currentMonthlyInvestment *= stepUpFactor;
    }
  }

  const estimatedReturns = totalValue - investedAmount;

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    chartData,
  };
};

export const calculateSWP = (
  totalInvestment,
  withdrawalPerMonth,
  expectedReturnRate,
  timePeriod
) => {
  const monthlyRate = expectedReturnRate / 100 / 12;
  const numberOfMonths = timePeriod * 12;

  let remainingBalance = totalInvestment;
  let totalWithdrawn = 0;
  let investedAmount = totalInvestment; // For SWP, initial investment is the "invested amount"

  const chartData = [];

  for (let i = 1; i <= numberOfMonths; i++) {
    remainingBalance = remainingBalance * (1 + monthlyRate) - withdrawalPerMonth;
    totalWithdrawn += withdrawalPerMonth;

    chartData.push({
      month: i,
      withdrawn: totalWithdrawn,
      balance: remainingBalance,
    });

    if (remainingBalance <= 0) {
      remainingBalance = 0;
      // Optionally, break if balance runs out
      // break;
    }
  }

  return {
    investedAmount: investedAmount,
    estimatedReturns: totalWithdrawn - investedAmount, // This might be negative
    totalValue: remainingBalance,
    totalWithdrawn: totalWithdrawn,
    chartData,
  };
};

export const calculateFD = (
  principalAmount,
  interestRate,
  timePeriod,
  compoundingFrequency
) => {
  console.log("calculateFD inputs:", { principalAmount, interestRate, timePeriod, compoundingFrequency });

  const annualRate = interestRate / 100;
  let n; // Number of times interest is compounded per year

  switch (compoundingFrequency) {
    case "annually":
      n = 1;
      break;
    case "half-annually":
      n = 2;
      break;
    case "quarterly":
      n = 4;
      break;
    case "monthly":
      n = 12;
      break;
    default:
      n = 1; // Default to annually
  }

  const totalNumberOfCompoundingPeriods = timePeriod * n;
  const ratePerCompoundingPeriod = annualRate / n;

  const totalValue =
    principalAmount * (1 + ratePerCompoundingPeriod) ** totalNumberOfCompoundingPeriods;

  const investedAmount = principalAmount;
  const estimatedReturns = totalValue - principalAmount;

  const chartData = [];
  for (let i = 0; i <= timePeriod; i++) {
    const valueAtYear = principalAmount * (1 + ratePerCompoundingPeriod) ** (i * n);
    chartData.push({
      year: i,
      invested: principalAmount,
      value: valueAtYear,
    });
  }

  const result = {
    investedAmount,
    estimatedReturns,
    totalValue,
    chartData,
  };
  console.log("calculateFD output:", result);
  return result;
};
