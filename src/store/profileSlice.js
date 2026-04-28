import { createSlice, createSelector } from "@reduxjs/toolkit";

const currentYear = new Date().getFullYear();

const initialState = {
  currentAge: 30,
  retirementAge: 60,
  considerInflation: false,
  generalInflationRate: 0.06, // 6% general inflation
  educationInflationRate: 0.1, // 10% education inflation
  careerGrowthRate: 0.05, // 5% annual career growth
  expectedReturnRate: 0.12, // 12% expected return on investments
  stepUpPercentage: 0.05, // 5% annual step-up in investments
  totalDebt: 0,
  incomes: [{ id: 1, name: "Salary", amount: 100000, frequency: "monthly" }],
  expenses: [
    {
      id: 1,
      name: "Basic Needs",
      amount: 30000,
      type: "monthly",
      category: "basic",
      frequency: "monthly",
    },
    {
      id: 2,
      name: "Discretionary",
      amount: 20000,
      type: "monthly",
      category: "discretionary",
      frequency: "monthly",
    },
  ],
  goals: [
    {
      id: 1,
      name: "Retirement",
      targetAmount: 20000000,
      targetYear: currentYear + 30,
      category: "retirement",
      investmentPlans: [],
    },
  ],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentAge: (state, action) => {
      state.currentAge = action.payload;
    },
    setRetirementAge: (state, action) => {
      state.retirementAge = action.payload;
    },
    setConsiderInflation: (state, action) => {
      state.considerInflation = action.payload;
    },
    setGeneralInflationRate: (state, action) => {
      state.generalInflationRate = action.payload;
    },
    setEducationInflationRate: (state, action) => {
      state.educationInflationRate = action.payload;
    },
    setCareerGrowthRate: (state, action) => {
      state.careerGrowthRate = action.payload;
    },
    setExpectedReturnRate: (state, action) => {
      state.expectedReturnRate = action.payload;
    },
    setStepUpPercentage: (state, action) => {
      state.stepUpPercentage = action.payload;
    },
    setTotalDebt: (state, action) => {
      state.totalDebt = action.payload;
    },
    addIncome: (state, action) => {
      state.incomes.push({
        ...action.payload,
        id:
          state.incomes.length > 0
            ? Math.max(...state.incomes.map((i) => i.id)) + 1
            : 1,
      });
    },
    updateIncome: (state, action) => {
      const index = state.incomes.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.incomes[index] = action.payload;
    },
    deleteIncome: (state, action) => {
      state.incomes = state.incomes.filter((i) => i.id !== action.payload);
    },
    addExpense: (state, action) => {
      state.expenses.push({
        ...action.payload,
        id:
          state.expenses.length > 0
            ? Math.max(...state.expenses.map((e) => e.id)) + 1
            : 1,
      });
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.expenses[index] = action.payload;
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    addGoal: (state, action) => {
      state.goals.push({
        ...action.payload,
        id:
          state.goals.length > 0
            ? Math.max(...state.goals.map((g) => g.id)) + 1
            : 1,
        investmentPlans: action.payload.investmentPlans || [],
      });
    },
    updateGoal: (state, action) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) state.goals[index] = action.payload;
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
    },
    addTemplateGoal: (state, action) => {
      const { type, monthlyExpenses } = action.payload;
      let newGoal = {};
      const nextId =
        state.goals.length > 0
          ? Math.max(...state.goals.map((g) => g.id)) + 1
          : 1;

      switch (type) {
        case "emergencyFund":
          newGoal = {
            id: nextId,
            name: "Emergency Fund",
            targetAmount: monthlyExpenses * 6,
            targetYear: currentYear + 1,
            investmentPlans: [],
            category: "safety",
          };
          break;
        case "childEducation":
          newGoal = {
            id: nextId,
            name: "Child's Higher Education",
            targetAmount: 5000000,
            targetYear: currentYear + 18,
            investmentPlans: [],
            category: "education",
          };
          break;
        case "retirement":
          newGoal = {
            id: nextId,
            name: "Retirement",
            targetAmount: 20000000,
            targetYear:
              state.currentAge + (state.retirementAge - state.currentAge),
            investmentPlans: [],
            category: "retirement",
          };
          break;
        default:
          return;
      }
      state.goals.push(newGoal);
    },
    resetProfile: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentAge,
  setRetirementAge,
  setConsiderInflation,
  setGeneralInflationRate,
  setEducationInflationRate,
  setCareerGrowthRate,
  setExpectedReturnRate,
  setStepUpPercentage,
  setTotalDebt,
  addIncome,
  updateIncome,
  deleteIncome,
  addExpense,
  updateExpense,
  deleteExpense,
  addGoal,
  updateGoal,
  deleteGoal,
  addTemplateGoal,
  resetProfile,
} = profileSlice.actions;

// Basic Selectors
export const selectCurrentAge = (state) => state.profile.currentAge;
export const selectRetirementAge = (state) => state.profile.retirementAge;
export const selectConsiderInflation = (state) =>
  state.profile.considerInflation;
export const selectGeneralInflationRate = (state) =>
  state.profile.generalInflationRate;
export const selectEducationInflationRate = (state) =>
  state.profile.educationInflationRate;
export const selectCareerGrowthRate = (state) => state.profile.careerGrowthRate;
export const selectExpectedReturnRate = (state) =>
  state.profile.expectedReturnRate;
export const selectStepUpPercentage = (state) => state.profile.stepUpPercentage;
export const selectTotalDebt = (state) => state.profile.totalDebt;
export const selectIncomes = (state) => state.profile.incomes;
export const selectProfileExpenses = (state) => state.profile.expenses;
export const selectGoals = (state) => state.profile.goals;

// Derived Selectors
export const selectTotalMonthlyIncome = createSelector(
  [selectIncomes],
  (incomes) => {
    const currentYear = new Date().getFullYear();
    return incomes.reduce((total, income) => {
      if (
        (typeof income.startYear === "number" &&
          currentYear < income.startYear) ||
        (typeof income.endYear === "number" && currentYear > income.endYear)
      ) {
        return total;
      }
      let monthlyAmount = income.amount || 0;
      if (income.frequency === "quarterly") {
        monthlyAmount /= 3;
      } else if (income.frequency === "yearly") {
        monthlyAmount /= 12;
      }
      return total + monthlyAmount;
    }, 0);
  },
);

export const selectTotalMonthlyExpenses = createSelector(
  [selectProfileExpenses],
  (expenses) =>
    expenses.reduce((total, expense) => {
      let monthlyAmount = expense.amount || 0;
      if (expense.frequency === "quarterly") {
        monthlyAmount /= 3;
      } else if (expense.frequency === "yearly") {
        monthlyAmount /= 12;
      }
      return total + monthlyAmount;
    }, 0),
);

export const selectIndividualGoalInvestmentContributions = createSelector(
  [selectGoals],
  (goals) => {
    const contributions = [];
    goals.forEach((goal) => {
      (goal.investmentPlans || []).forEach((plan, index) => {
        const uniqueKey = plan.id || index;
        if (
          (plan.type === "sip" || plan.type === "stepUpSip") &&
          plan.monthlyContribution > 0
        ) {
          let planTypeName =
            plan.type === "sip"
              ? "SIP"
              : `Step-up SIP (${plan.stepUpRate || 0}%)`;
          contributions.push({
            id: `goal-${goal.id}-plan-${uniqueKey}`,
            name: `${goal.name} (${planTypeName})`,
            amount: plan.monthlyContribution,
            type: "monthly",
            category: "investment",
            frequency: "monthly",
            goalId: goal.id,
            goalTargetYear: goal.targetYear,
            startYear: plan.startYear || currentYear,
            endYear: plan.endYear || goal.targetYear,
          });
        } else if (
          (plan.type === "lumpsum" || plan.type === "fd") &&
          plan.investedAmount > 0
        ) {
          const planTypeName =
            plan.type === "lumpsum" ? "Lumpsum" : "Fixed Deposit";
          contributions.push({
            id: `goal-${goal.id}-plan-${uniqueKey}`,
            name: `${goal.name} (${planTypeName})`,
            amount: plan.investedAmount,
            type: "one-time-yearly",
            category: "investment",
            frequency: "yearly",
            goalId: goal.id,
            year: plan.startYear || currentYear,
            goalTargetYear: goal.targetYear,
            startYear: plan.startYear || currentYear,
            endYear: plan.endYear || goal.targetYear,
          });
        }
      });
    });
    return contributions;
  },
);

export const selectTotalMonthlyGoalContributions = createSelector(
  [selectIndividualGoalInvestmentContributions],
  (contributions) =>
    contributions.reduce((total, contribution) => {
      let monthlyAmount = contribution.amount || 0;
      if (contribution.frequency === "yearly") {
        monthlyAmount /= 12;
      } else if (contribution.frequency === "quarterly") {
        monthlyAmount /= 3;
      }
      return total + monthlyAmount;
    }, 0),
);

export const selectGoalsWithMonthlyContributions = createSelector(
  [selectGoals],
  (goals) =>
    goals.map((goal) => ({
      id: goal.id,
      name: goal.name,
      monthlyContribution: (goal.investmentPlans || []).reduce(
        (total, plan) => total + (plan.monthlyContribution || 0),
        0,
      ),
    })),
);

export const selectCurrentSurplus = createSelector(
  [
    selectTotalMonthlyIncome,
    selectTotalMonthlyExpenses,
    selectTotalMonthlyGoalContributions,
  ],
  (totalIncome, totalExpenses, totalGoalContributions) =>
    totalIncome - totalExpenses - totalGoalContributions,
);

export const selectTotalOutflow = createSelector(
  [selectTotalMonthlyExpenses, selectTotalMonthlyGoalContributions],
  (totalExpenses, totalGoalContributions) =>
    totalExpenses + totalGoalContributions,
);

export const selectIsTotalOutflowExceedingIncome = createSelector(
  [selectTotalMonthlyIncome, selectTotalOutflow],
  (totalIncome, totalOutflow) => totalOutflow > totalIncome,
);

export const selectDebtFreeCountdown = createSelector(
  [selectTotalDebt, selectCurrentSurplus],
  (totalDebt, currentSurplus) => {
    if (totalDebt <= 0) return "Debt-Free!";
    if (currentSurplus <= 0) return "Cannot pay off debt with current surplus.";
    const monthsToPayOff = totalDebt / currentSurplus;
    const years = Math.floor(monthsToPayOff / 12);
    const months = Math.round(monthsToPayOff % 12);
    return years > 0
      ? `${years} years and ${months} months`
      : `${months} months`;
  },
);

export const selectProjectedMonthlyIncome = createSelector(
  [
    selectTotalMonthlyIncome,
    selectCareerGrowthRate,
    selectCurrentAge,
    selectRetirementAge,
  ],
  (totalMonthlyIncome, careerGrowthRate, currentAge, retirementAge) => {
    const projectedIncomes = [];
    let currentIncome = totalMonthlyIncome;
    for (let age = currentAge; age <= retirementAge; age++) {
      projectedIncomes.push({ age, income: currentIncome });
      currentIncome *= 1 + careerGrowthRate;
    }
    return projectedIncomes;
  },
);

export const selectInflationAdjustedValue = createSelector(
  [
    (state, value) => value,
    (state, value, years) => years,
    selectGeneralInflationRate,
    selectConsiderInflation,
  ],
  (value, years, generalInflationRate, considerInflation) => {
    if (!considerInflation || years <= 0) return value;
    return value / Math.pow(1 + generalInflationRate, years);
  },
);

export const selectNeedsExpenses = createSelector(
  [selectProfileExpenses],
  (expenses) =>
    expenses
      .filter((e) => e.category === "basic")
      .reduce((total, expense) => {
        let monthlyAmount = expense.amount || 0;
        if (expense.frequency === "quarterly") monthlyAmount /= 3;
        else if (expense.frequency === "yearly") monthlyAmount /= 12;
        return total + monthlyAmount;
      }, 0),
);

export const selectWantsExpenses = createSelector(
  [selectProfileExpenses],
  (expenses) =>
    expenses
      .filter((e) => e.category === "discretionary")
      .reduce((total, expense) => {
        let monthlyAmount = expense.amount || 0;
        if (expense.frequency === "quarterly") monthlyAmount /= 3;
        else if (expense.frequency === "yearly") monthlyAmount /= 12;
        return total + monthlyAmount;
      }, 0),
);

export const selectFutureWealthContributions =
  selectTotalMonthlyGoalContributions;

// Wealth Projection Engine
export const selectWealthProjection = createSelector(
  [
    selectCurrentAge,
    selectRetirementAge,
    selectIncomes,
    selectProfileExpenses,
    selectIndividualGoalInvestmentContributions,
    selectExpectedReturnRate,
    selectStepUpPercentage,
    selectCareerGrowthRate,
    selectGeneralInflationRate,
  ],
  (
    currentAge,
    retirementAge,
    incomes,
    expenses,
    goalInvestments,
    expectedReturnRate,
    stepUpPercentage,
    careerGrowthRate,
    generalInflationRate,
  ) => {
    const projection = [];
    let totalWealth = 0;
    let totalInvested = 0;
    let committedSurplusInvestment = 0;

    for (let age = currentAge; age <= retirementAge; age++) {
      const year = currentYear + (age - currentAge);
      const isFirstYear = age === currentAge;
      const yearsElapsed = age - currentAge;

      const currentAnnualIncome = incomes.reduce((total, income) => {
        if (
          (typeof income.startYear === "number" && year < income.startYear) ||
          (typeof income.endYear === "number" && year > income.endYear)
        ) {
          return total;
        }
        const currentYearAmount =
          income.amount * Math.pow(1 + (careerGrowthRate || 0), yearsElapsed) ||
          income.amount;
        let annualAmount = 0;
        if (income.frequency === "monthly")
          annualAmount = currentYearAmount * 12;
        else if (income.frequency === "quarterly")
          annualAmount = currentYearAmount * 4;
        else if (income.frequency === "yearly")
          annualAmount = currentYearAmount;
        return total + annualAmount;
      }, 0);

      const currentAnnualExpenses = expenses.reduce((total, expense) => {
        const currentYearAmount =
          expense.amount *
          Math.pow(1 + (generalInflationRate || 0), yearsElapsed);
        let annualAmount = 0;
        if (expense.frequency === "monthly")
          annualAmount = currentYearAmount * 12;
        else if (expense.frequency === "quarterly")
          annualAmount = currentYearAmount * 4;
        else if (expense.frequency === "yearly")
          annualAmount = currentYearAmount;
        return total + annualAmount;
      }, 0);

      const annualGoalInvestment = goalInvestments.reduce((total, inv) => {
        if (
          inv.frequency === "monthly" &&
          year >= inv.startYear &&
          year < inv.endYear
        ) {
          return total + inv.amount * 12;
        }
        if (inv.frequency === "yearly" && year === inv.year) {
          return total + inv.amount;
        }
        return total;
      }, 0);

      const currentSurplus =
        currentAnnualIncome - currentAnnualExpenses - annualGoalInvestment;

      if (isFirstYear) {
        committedSurplusInvestment = currentSurplus > 0 ? currentSurplus : 0;
      } else {
        committedSurplusInvestment *= 1 + (stepUpPercentage || 0);
      }

      const annualInvestment =
        annualGoalInvestment + committedSurplusInvestment;

      totalWealth *= 1 + (expectedReturnRate || 0);
      totalWealth += annualInvestment;
      totalInvested += annualInvestment;

      const inflationAdjustedWealth =
        totalWealth / Math.pow(1 + generalInflationRate, age - currentAge + 1);

      projection.push({
        age,
        year,
        annualIncome: currentAnnualIncome,
        annualExpenses: currentAnnualExpenses,
        annualInvestment,
        totalInvested,
        totalWealth,
        inflationAdjustedWealth,
      });
    }
    return projection;
  },
);

export const selectFinancialIndependenceYear = createSelector(
  [selectWealthProjection],
  (projection) => {
    const withdrawalRate = 0.04;
    const fiPoint = projection.find((p) => {
      const passiveIncome = p.totalWealth * withdrawalRate;
      return passiveIncome >= p.annualExpenses;
    });

    return fiPoint ? { age: fiPoint.age, year: fiPoint.year } : null;
  },
);

export default profileSlice.reducer;
