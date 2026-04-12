import { createSlice } from "@reduxjs/toolkit";

const currentYear = new Date().getFullYear();

const initialState = {
  currentAge: 30,
  retirementAge: 60,
  considerInflation: false,
  incomes: [
    { id: 1, name: "Salary", amount: 100000, type: 'monthly' },
  ],
  expenses: [
    { id: 1, name: "Basic Needs", amount: 30000, type: 'monthly', category: 'basic', frequency: 'monthly' },
    { id: 2, name: "Discretionary", amount: 20000, type: 'monthly', category: 'discretionary', frequency: 'monthly' },
  ],
  goals: [
    { id: 1, name: "Retirement", targetAmount: 20000000, targetYear: currentYear + 30, investmentAmount: 0, investmentType: 'sip' },
  ],
  goalInvestments: {
    // goalId: { monthlyInvestment: amount, investmentType: 'sip'|'lumpsum', expectedReturn: 8 }
  }
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentAge: (state, action) => { state.currentAge = action.payload; },
    setRetirementAge: (state, action) => { state.retirementAge = action.payload; },
    setConsiderInflation: (state, action) => { state.considerInflation = action.payload; },
    addIncome: (state, action) => { state.incomes.push(action.payload); },
    updateIncome: (state, action) => { 
        const index = state.incomes.findIndex(i => i.id === action.payload.id);
        if(index !== -1) state.incomes[index] = action.payload;
    },
    deleteIncome: (state, action) => { state.incomes = state.incomes.filter(i => i.id !== action.payload); },
    addExpense: (state, action) => { state.expenses.push(action.payload); },
    updateExpense: (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if(index !== -1) state.expenses[index] = action.payload;
    },
    deleteExpense: (state, action) => { state.expenses = state.expenses.filter(e => e.id !== action.payload); },
    addGoal: (state, action) => { state.goals.push(action.payload); },
    updateGoal: (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if(index !== -1) state.goals[index] = action.payload;
    },
    deleteGoal: (state, action) => { state.goals = state.goals.filter(g => g.id !== action.payload); },
    setGoalInvestment: (state, action) => {
        const { goalId, investmentData } = action.payload;
        state.goalInvestments[goalId] = investmentData;
    },
    deleteGoalInvestment: (state, action) => {
        delete state.goalInvestments[action.payload];
    },
    resetProfile: (state) => {
        return initialState;
    }
  }
});

export const { 
    setCurrentAge, setRetirementAge, setConsiderInflation, 
    addIncome, updateIncome, deleteIncome, 
    addExpense, updateExpense, deleteExpense, 
    addGoal, updateGoal, deleteGoal, 
    setGoalInvestment, deleteGoalInvestment,
    resetProfile
} = profileSlice.actions;

export const selectCurrentAge = state => state.profile.currentAge;
export const selectRetirementAge = state => state.profile.retirementAge;
export const selectConsiderInflation = state => state.profile.considerInflation;
export const selectIncomes = state => state.profile.incomes;
export const selectProfileExpenses = state => state.profile.expenses;
export const selectGoals = state => state.profile.goals;
export const selectGoalInvestments = state => state.profile.goalInvestments || {};

export default profileSlice.reducer;
