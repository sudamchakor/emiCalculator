import React, { createContext, useState, useContext, useMemo } from 'react';
import dayjs from 'dayjs';

// Create the Context
const EmiContext = createContext();

// Create a custom hook for easier usage
export const useEmiContext = () => useContext(EmiContext);

// The Provider Component
export const EmiProvider = ({ children }) => {
  // State for Home Loan Details
  const [loanDetails, setLoanDetails] = useState({
    homeValue: 5000000,
    marginAmount: 1000000,
    marginUnit: 'Rs', // 'Rs' or '%'
    loanInsurance: 0,
    interestRate: 8.5,
    loanTenure: 20,
    tenureUnit: 'years', // 'years' or 'months'
    loanFees: 10000,
    feesUnit: 'Rs', // 'Rs' or '%'
    startDate: dayjs(),
  });

  // Default Loan Amount is 5000000 + 0 - 1000000 = 4000000. 20% of 4000000 = 800000.
  // State for Partial Prepayments
  const [prepayments, setPrepayments] = useState({
    monthly: { amount: 0, startDate: dayjs() },
    yearly: { amount: 0, startDate: dayjs() },
    quarterly: { amount: 0, startDate: dayjs() },
    oneTime: { amount: 800000, date: dayjs() },
  });

  // State for Homeowner Expenses
  const [expenses, setExpenses] = useState({
    oneTimeExpenses: 0,
    oneTimeUnit: 'Rs', // 'Rs' or '%'
    propertyTaxes: 0,
    taxesUnit: 'Rs', // 'Rs' or '%'
    homeInsurance: 0,
    homeInsUnit: 'Rs', // 'Rs' or '%'
    maintenance: 0, // monthly Rs
  });

  // Derived values & Calculations
  const calculatedValues = useMemo(() => {
    // 1. Resolve units to Rupees
    const marginInRs = loanDetails.marginUnit === '%' ? (loanDetails.homeValue * loanDetails.marginAmount) / 100 : loanDetails.marginAmount;

    // Loan Amount = Home Value + Loan Insurance - Down Payment
    const loanAmount = loanDetails.homeValue + loanDetails.loanInsurance - marginInRs;

    const feesInRs = loanDetails.feesUnit === '%' ? (loanAmount * loanDetails.loanFees) / 100 : loanDetails.loanFees;

    const tenureInMonths = loanDetails.tenureUnit === 'years' ? loanDetails.loanTenure * 12 : loanDetails.loanTenure;

    const oneTimeInRs = expenses.oneTimeUnit === '%' ? (loanDetails.homeValue * expenses.oneTimeExpenses) / 100 : expenses.oneTimeExpenses;
    const taxesYearlyInRs = expenses.taxesUnit === '%' ? (loanDetails.homeValue * expenses.propertyTaxes) / 100 : expenses.propertyTaxes;
    const homeInsYearlyInRs = expenses.homeInsUnit === '%' ? (loanDetails.homeValue * expenses.homeInsurance) / 100 : expenses.homeInsurance;

    // Monthly Interest Rate
    const monthlyInterestRate = loanDetails.interestRate / 12 / 100;

    // EMI Calculation (standard formula)
    let emi = 0;
    if (monthlyInterestRate > 0 && tenureInMonths > 0 && loanAmount > 0) {
      emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths) / (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    } else if (tenureInMonths > 0) {
      emi = loanAmount / tenureInMonths;
    }

    // Schedule generation
    let balance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let totalPrepayments = 0;
    const schedule = [];

    // Helper to format date
    const getMonthDate = (start, addMonths) => start.add(addMonths, 'month');

    for (let i = 1; i <= tenureInMonths && balance > 0; i++) {
      const currentDate = getMonthDate(loanDetails.startDate, i - 1);

      // Calculate Interest for the month
      let interestForMonth = balance * monthlyInterestRate;

      // Calculate Prepayments for the month
      let prepayForMonth = 0;

      // Monthly prepayment
      if (prepayments.monthly.amount > 0 && !currentDate.isBefore(prepayments.monthly.startDate, 'month')) {
        prepayForMonth += prepayments.monthly.amount;
      }

      // Yearly prepayment
      if (prepayments.yearly.amount > 0 && !currentDate.isBefore(prepayments.yearly.startDate, 'month')) {
         // Check if it's the same month of the year as start date
         if (currentDate.month() === prepayments.yearly.startDate.month()) {
            prepayForMonth += prepayments.yearly.amount;
         }
      }

      // Quarterly prepayment
      if (prepayments.quarterly.amount > 0 && !currentDate.isBefore(prepayments.quarterly.startDate, 'month')) {
        const monthsDiff = currentDate.diff(prepayments.quarterly.startDate, 'month');
        if (monthsDiff >= 0 && monthsDiff % 3 === 0) {
          prepayForMonth += prepayments.quarterly.amount;
        }
      }

      // One-time prepayment
      if (prepayments.oneTime.amount > 0 && currentDate.isSame(prepayments.oneTime.date, 'month')) {
        prepayForMonth += prepayments.oneTime.amount;
      }

      // Calculate Principal for the month
      let principalForMonth = emi - interestForMonth;

      // Adjust last month if overpaying
      if (balance < principalForMonth + prepayForMonth) {
         if (balance < principalForMonth) {
            principalForMonth = balance;
            prepayForMonth = 0;
         } else {
            prepayForMonth = balance - principalForMonth;
         }
      }

      balance -= (principalForMonth + prepayForMonth);
      if (balance < 0) balance = 0;

      totalInterest += interestForMonth;
      totalPrincipal += principalForMonth;
      totalPrepayments += prepayForMonth;

      schedule.push({
        month: i,
        date: currentDate.format('MMM YYYY'),
        principal: principalForMonth,
        interest: interestForMonth,
        prepayment: prepayForMonth,
        balance: balance,
        taxes: taxesYearlyInRs / 12,
        homeInsurance: homeInsYearlyInRs / 12,
        maintenance: expenses.maintenance
      });
    }

    const totalPayments = marginInRs + feesInRs + oneTimeInRs + totalPrincipal + totalPrepayments + totalInterest + (taxesYearlyInRs * (schedule.length/12)) + (homeInsYearlyInRs * (schedule.length/12)) + (expenses.maintenance * schedule.length);

    return {
      marginInRs,
      loanAmount,
      feesInRs,
      tenureInMonths,
      oneTimeInRs,
      taxesYearlyInRs,
      homeInsYearlyInRs,
      emi,
      totalInterest,
      totalPrincipal,
      totalPrepayments,
      schedule,
      totalPayments
    };
  }, [loanDetails, expenses, prepayments]);

  // Handle Updates
  const updateLoanDetails = (key, value) => {
    setLoanDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateExpenses = (key, value) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  const updatePrepayments = (type, key, value) => {
    setPrepayments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  };

  return (
    <EmiContext.Provider value={{
      loanDetails, updateLoanDetails,
      expenses, updateExpenses,
      prepayments, updatePrepayments,
      calculatedValues
    }}>
      {children}
    </EmiContext.Provider>
  );
};