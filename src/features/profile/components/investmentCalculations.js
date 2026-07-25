export const calculateSip = (monthlyContribution, annualRate, timePeriod) => {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfMonths = timePeriod * 12;
  let futureValue = 0;
  if (monthlyRate === 0) {
    futureValue = monthlyContribution * numberOfMonths;
  } else {
    futureValue =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate);
  }
  const investedAmount = monthlyContribution * numberOfMonths;
  const estimatedReturns = futureValue - investedAmount;
  return { investedAmount, estimatedReturns, totalValue: futureValue };
};

export const calculateLumpsum = (principal, annualRate, timePeriod) => {
  const futureValue = principal * Math.pow(1 + annualRate / 100, timePeriod);
  const investedAmount = principal;
  const estimatedReturns = futureValue - investedAmount;
  return { investedAmount, estimatedReturns, totalValue: futureValue };
};

export const calculateStepUpSip = (
  monthlyContribution,
  annualRate,
  timePeriod,
  stepUpPercentage,
) => {
  let totalInvested = 0;
  let totalValue = 0;
  let currentMonthlyContribution = monthlyContribution;
  const monthlyRate = annualRate / 12 / 100;

  for (let year = 1; year <= timePeriod; year++) {
    for (let month = 1; month <= 12; month++) {
      totalValue = totalValue * (1 + monthlyRate) + currentMonthlyContribution;
      totalInvested += currentMonthlyContribution;
    }
    if (year < timePeriod) {
      currentMonthlyContribution *= 1 + stepUpPercentage / 100;
    }
  }
  const estimatedReturns = totalValue - totalInvested;
  return { investedAmount: totalInvested, estimatedReturns, totalValue };
};

export const calculateSwp = (
  principal,
  withdrawalPerMonth,
  annualRate,
  timePeriod,
) => {
  const P = parseFloat(principal) || 0;
  const W = parseFloat(withdrawalPerMonth) || 0;
  const n = (parseFloat(timePeriod) || 0) * 12;
  const r = (parseFloat(annualRate) || 0) / 100 / 12;

  let finalBalance = 0;
  if (r > 0) {
    const r_plus_1_pow_n = Math.pow(1 + r, n);
    finalBalance = P * r_plus_1_pow_n - W * ((r_plus_1_pow_n - 1) / r);
  } else {
    finalBalance = P - W * n;
  }

  finalBalance = Math.max(0, finalBalance);
  const totalWithdrawn = W * n;
  const estimatedReturns = finalBalance + totalWithdrawn - P;

  return {
    investedAmount: P,
    totalWithdrawn: totalWithdrawn,
    totalValue: finalBalance,
    estimatedReturns: estimatedReturns,
  };
};

export const calculateFd = (
  principal,
  annualRate,
  timePeriod,
  compoundingFrequency,
  recurringFrequency = 'monthly',
  monthlyInvestment = 0,
  depositType = 'single',
) => {
  const r = annualRate / 100;
  const t = timePeriod;
  const M = monthlyInvestment;

  let n;
  switch (compoundingFrequency) {
    case 'annually':
      n = 1;
      break;
    case 'semi-annually':
    case 'half-yearly':
      n = 2;
      break;
    case 'quarterly':
      n = 4;
      break;
    case 'monthly':
      n = 12;
      break;
    default:
      n = 1;
  }

  const isRecurringDeposit = depositType === 'recurring' || M > 0;

  let totalValue = 0;
  let investedAmount = 0;

  if (isRecurringDeposit) {
    const totalMonths = t * 12;
    const frequencyPeriods =
      recurringFrequency === 'monthly'
        ? 12
        : recurringFrequency === 'quarterly'
        ? 4
        : recurringFrequency === 'half-yearly'
        ? 2
        : recurringFrequency === 'yearly'
        ? 1
        : 12;
    const monthsPerContribution = 12 / frequencyPeriods;
    const totalContributions = t * frequencyPeriods;
    investedAmount = M * totalContributions;

    if (r > 0 && M > 0 && t > 0) {
      const monthlyRate = r / 12;
      totalValue = 0;
      for (let contribution = 1; contribution <= totalContributions; contribution += 1) {
        const contributionMonth = contribution * monthsPerContribution;
        const remainingMonths = totalMonths - contributionMonth;
        totalValue += M * Math.pow(1 + monthlyRate, remainingMonths);
      }
    } else {
      totalValue = investedAmount;
    }
  } else {
    investedAmount = principal;
    if (r > 0 && t > 0) {
      totalValue = principal * Math.pow(1 + r / n, n * t);
    } else {
      totalValue = principal;
    }
  }

  const estimatedReturns = totalValue - investedAmount;
  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
  };
};