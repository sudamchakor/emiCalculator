import { createSlice, createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  loanDetails: {
    homeValue: 5000000,
    marginAmount: 1000000,
    marginUnit: "Rs", // 'Rs' or '%'
    loanInsurance: 0,
    interestRate: 8.5,
    loanTenure: 20,
    tenureUnit: "years", // 'years' or 'months'
    loanFees: 10000,
    feesUnit: "Rs", // 'Rs' or '%'
    startDate: new Date().toISOString(), // Store as ISO string
  },
  prepayments: {
    monthly: { amount: 0, startDate: new Date().toISOString() },
    yearly: { amount: 0, startDate: new Date().toISOString() },
    quarterly: { amount: 0, startDate: new Date().toISOString() },
    oneTime: { amount: 0, date: new Date().toISOString() },
  },
  expenses: {
    oneTimeExpenses: 0,
    oneTimeUnit: "Rs", // 'Rs' or '%'
    propertyTaxes: 0,
    taxesUnit: "Rs", // 'Rs' or '%'
    homeInsurance: 0,
    homeInsUnit: "Rs", // 'Rs' or '%'
    maintenance: 0, // monthly Rs
  },
  currency: "₹",
  themeMode: "light",
  autoSave: true,
};

const emiSlice = createSlice({
  name: "emi",
  initialState,
  reducers: {
    updateLoanDetails: (state, action) => {
      const { key, value } = action.payload;
      state.loanDetails[key] = value;
    },
    updateExpenses: (state, action) => {
      const { key, value } = action.payload;
      state.expenses[key] = value;
    },
    updatePrepayments: (state, action) => {
      const { type, key, value } = action.payload;
      state.prepayments[type][key] = value;
    },
    changeLoanUnit: (state, action) => {
      const { unitField, amountField, newUnit } = action.payload;
      const oldUnit = state.loanDetails[unitField];
      if (oldUnit === newUnit) return;

      if (unitField === "tenureUnit") {
        const currentTenure = state.loanDetails.loanTenure;
        let newTenure = currentTenure;

        if (newUnit === "months" && oldUnit === "years") {
          newTenure = Math.round(currentTenure * 12);
        } else if (newUnit === "years" && oldUnit === "months") {
          newTenure = parseFloat((currentTenure / 12).toFixed(2));
        }

        state.loanDetails[unitField] = newUnit;
        state.loanDetails[amountField] = newTenure;
      } else {
        let currentAmount = state.loanDetails[amountField] || 0;
        let baseValue = state.loanDetails.homeValue;

        if (unitField === "feesUnit") {
          const marginInRs =
            state.loanDetails.marginUnit === "%"
              ? (state.loanDetails.homeValue * state.loanDetails.marginAmount) /
                100
              : state.loanDetails.marginAmount;
          baseValue =
            state.loanDetails.homeValue +
            state.loanDetails.loanInsurance -
            marginInRs;
        }

        let newAmount = currentAmount;
        if (newUnit === "%") {
          newAmount = baseValue ? (currentAmount / baseValue) * 100 : 0;
        } else {
          newAmount = (currentAmount * baseValue) / 100;
        }

        state.loanDetails[unitField] = newUnit;
        state.loanDetails[amountField] = Number(newAmount.toFixed(2));
      }
    },
    changeExpenseUnit: (state, action) => {
      const { unitField, amountField, newUnit } = action.payload;
      const oldUnit = state.expenses[unitField];
      if (oldUnit === newUnit) return;

      let currentAmount = state.expenses[amountField] || 0;
      let baseValue = state.loanDetails.homeValue;

      let newAmount = currentAmount;
      if (newUnit === "%") {
        newAmount = baseValue ? (currentAmount / baseValue) * 100 : 0.0;
      } else {
        newAmount = (currentAmount * baseValue) / 100;
      }

      state.expenses[unitField] = newUnit;
      state.expenses[amountField] = Number(newAmount.toFixed(2));
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setAutoSave: (state, action) => {
      state.autoSave = action.payload;
    },
  },
});

export const {
  updateLoanDetails,
  updateExpenses,
  updatePrepayments,
  changeLoanUnit,
  changeExpenseUnit,
  setCurrency,
  setThemeMode,
  setAutoSave,
} = emiSlice.actions;

export const selectLoanDetails = (state) => state.emi.loanDetails;
export const selectExpenses = (state) => state.emi.expenses;
export const selectPrepayments = (state) => state.emi.prepayments;
export const selectCurrency = (state) => state.emi.currency;
export const selectThemeMode = (state) => state.emi.themeMode;
export const selectAutoSave = (state) => state.emi.autoSave;

export const selectCalculatedValues = createSelector(
  [selectLoanDetails, selectExpenses, selectPrepayments],
  (loanDetails, expenses, prepayments) => {
    const marginInRs =
      loanDetails.marginUnit === "%"
        ? (loanDetails.homeValue * loanDetails.marginAmount) / 100
        : loanDetails.marginAmount;
    const loanAmount =
      loanDetails.homeValue + loanDetails.loanInsurance - marginInRs;
    const feesInRs =
      loanDetails.feesUnit === "%"
        ? (loanAmount * loanDetails.loanFees) / 100
        : loanDetails.loanFees;
    const tenureInMonths =
      loanDetails.tenureUnit === "years"
        ? loanDetails.loanTenure * 12
        : loanDetails.loanTenure;

    const oneTimeInRs =
      expenses.oneTimeUnit === "%"
        ? (loanDetails.homeValue * expenses.oneTimeExpenses) / 100
        : expenses.oneTimeExpenses;
    const taxesYearlyInRs =
      expenses.taxesUnit === "%"
        ? (loanDetails.homeValue * expenses.propertyTaxes) / 100
        : expenses.propertyTaxes;
    const homeInsYearlyInRs =
      expenses.homeInsUnit === "%"
        ? (loanDetails.homeValue * expenses.homeInsurance) / 100
        : expenses.homeInsurance;

    const monthlyInterestRate = loanDetails.interestRate / 12 / 100;

    let emi = 0;
    if (monthlyInterestRate > 0 && tenureInMonths > 0 && loanAmount > 0) {
      emi =
        (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    } else if (tenureInMonths > 0) {
      emi = loanAmount / tenureInMonths;
    }

     let balance = loanAmount;
     let totalInterest = 0;
     let totalPrincipal = 0;
     let totalPrepayments = 0;
     let totalPayments = 0;
     const schedule = [];

     const startDate = dayjs(loanDetails.startDate);

     const getMonthDate = (start, addMonths) => {
       return start.add(addMonths, 'month');
     };

     for (let i = 1; i <= tenureInMonths && balance > 0; i++) {
       const currentDate = getMonthDate(startDate, i - 1);
       let interestForMonth = balance * monthlyInterestRate;
       let prepayForMonth = 0;

       const monthlyStart = dayjs(prepayments.monthly.startDate);
       if (
         prepayments.monthly.amount > 0 &&
         !currentDate.isBefore(monthlyStart, 'month')
       ) {
         prepayForMonth += prepayments.monthly.amount;
       }

       const yearlyStart = dayjs(prepayments.yearly.startDate);
       if (
         prepayments.yearly.amount > 0 &&
         !currentDate.isBefore(yearlyStart, 'month')
       ) {
         if (currentDate.month() === yearlyStart.month()) {
           prepayForMonth += prepayments.yearly.amount;
         }
       }

       const quarterlyStart = dayjs(prepayments.quarterly.startDate);
       if (
         prepayments.quarterly.amount > 0 &&
         !currentDate.isBefore(quarterlyStart, 'month')
       ) {
         const monthsDiff = currentDate.diff(quarterlyStart, 'month');
         if (monthsDiff >= 0 && monthsDiff % 3 === 0) {
           prepayForMonth += prepayments.quarterly.amount;
         }
       }

       const oneTimeDate = dayjs(prepayments.oneTime.date);
       if (
         prepayments.oneTime.amount > 0 &&
         currentDate.isSame(oneTimeDate, 'month')
       ) {
         prepayForMonth += prepayments.oneTime.amount;
       }

      let principalForMonth = emi - interestForMonth;

      if (balance < principalForMonth + prepayForMonth) {
        if (balance < principalForMonth) {
          principalForMonth = balance;
          prepayForMonth = 0;
        } else {
          prepayForMonth = balance - principalForMonth;
        }
      }

      balance -= principalForMonth + prepayForMonth;
      if (balance < 0) balance = 0;

      totalInterest += interestForMonth;
      totalPrincipal += principalForMonth;
      totalPrepayments += prepayForMonth;

      const monthlyPayment =
        principalForMonth + interestForMonth + prepayForMonth;
      totalPayments += monthlyPayment;

      const paidPercent =
        loanAmount > 0 ? ((loanAmount - balance) / loanAmount) * 100 : 0;

       schedule.push({
         month: i,
         date: currentDate.format("MMM YYYY"),
         principal: Math.round(principalForMonth),
         interest: Math.round(interestForMonth),
         prepayment: Math.round(prepayForMonth),
         balance: Math.round(balance),
         totalPayment: Math.round(monthlyPayment),
         taxes: Math.round(taxesYearlyInRs / 12),
         homeInsurance: Math.round(homeInsYearlyInRs / 12),
         maintenance: Math.round(expenses.maintenance),
         paidPercent: paidPercent.toFixed(2),
       });
    }

    totalPayments +=
      marginInRs +
      feesInRs +
      oneTimeInRs +
      totalPrincipal +
      totalPrepayments +
      totalInterest +
      (taxesYearlyInRs + homeInsYearlyInRs) * (schedule.length / 12) +
      expenses.maintenance * schedule.length;

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
      totalPayments,
    };
  }
);

export default emiSlice.reducer;
