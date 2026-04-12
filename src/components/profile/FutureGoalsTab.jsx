import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography, FormControlLabel, Switch, Button, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditableGoalItem from '../common/EditableGoalItem';
import GoalForm from './GoalForm';
import {
  selectGoals, selectGoalInvestments, selectConsiderInflation, selectCurrentAge, selectRetirementAge, selectProfileExpenses,
  addGoal, updateGoal, deleteGoal, setConsiderInflation, setGoalInvestment
} from '../../store/profileSlice';
import { selectCalculatedValues, selectCurrency } from '../../store/emiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function FutureGoalsTab() {
  const dispatch = useDispatch();

  const goals = useSelector(selectGoals) || [];
  const goalInvestments = useSelector(selectGoalInvestments) || {};
  const considerInflation = useSelector(selectConsiderInflation) || false;
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const expenses = useSelector(selectProfileExpenses) || [];
  const incomes = useSelector(state => state.profile?.incomes) || [];

  const { emi, schedule, taxesYearlyInRs, homeInsYearlyInRs, tenureInMonths } = useSelector(selectCalculatedValues);
  const currency = useSelector(selectCurrency);

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalProfileExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyPayment = schedule?.length > 0
    ? schedule[0].totalPayment + (taxesYearlyInRs / 12) + (homeInsYearlyInRs / 12) + schedule[0].maintenance
    : emi + (taxesYearlyInRs / 12) + (homeInsYearlyInRs / 12);

  const totalGoalInvestments = Object.values(goalInvestments).reduce((acc, curr) => {
    return acc + (curr?.monthlyInvestment || 0);
  }, 0);

  const totalExpensesIncludingLoan = totalProfileExpenses + totalMonthlyPayment + totalGoalInvestments;
  const investableSurplus = totalIncome - totalExpensesIncludingLoan;


  const formatCurrency = (val) => `${currency}${Number(val).toLocaleString('en-IN')}`;
  const currentYear = new Date().getFullYear();

  const applyRetirementGoal = () => {
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement < 0) {
      alert("Time travel not yet supported!");
      return;
    }

    const monthlyBasicExpenses = expenses.filter(e => e.category === 'basic').reduce((sum, e) => sum + e.amount, 0);
    let yearlyExpenses = monthlyBasicExpenses * 12;

    if (considerInflation) {
      yearlyExpenses = yearlyExpenses * Math.pow(1.06, yearsToRetirement);
    }

    const targetAmount = Math.round(yearlyExpenses / 0.04);

    dispatch(addGoal({
      id: Date.now(),
      name: "Retirement",
      targetAmount: targetAmount,
      targetYear: currentYear + yearsToRetirement
    }));
  };

  const applyEducationGoal = () => {
    const yearsToCollege = 15;
    let targetAmount = 2500000;

    if (considerInflation) {
      targetAmount = targetAmount * Math.pow(1.10, yearsToCollege);
    }

    dispatch(addGoal({
      id: Date.now(),
      name: "Child's Education",
      targetAmount: Math.round(targetAmount),
      targetYear: currentYear + yearsToCollege
    }));
  };

  const applyEmergencyFundGoal = () => {
    const totalMonthlyExp = expenses.reduce((sum, e) => sum + e.amount, 0) + (schedule?.length > 0 ? schedule[0].totalPayment : emi);

    dispatch(addGoal({
      id: Date.now(),
      name: "Emergency Fund",
      targetAmount: Math.round(totalMonthlyExp * 6),
      targetYear: currentYear + 1
    }));
  };

  // Wealth Projection Logic
  const wealthData = useMemo(() => {
    const maxGoalYear = goals.reduce((max, g) => Math.max(max, g.targetYear), currentYear + 10);
    const endYear = Math.max(maxGoalYear, currentYear + (tenureInMonths / 12));

    let currentWealth = 0;
    const yearlySurplus = investableSurplus * 12;
    const data = [];
    let totalGoalLine = 0;

    goals.forEach(g => {
      let amt = g.targetAmount;
      if(considerInflation && g.targetYear > currentYear) {
        amt = amt * Math.pow(1.06, g.targetYear - currentYear);
      }
      totalGoalLine += amt;
    });

    for (let year = currentYear; year <= endYear; year++) {
      const yearsFromNow = year - currentYear;

      if (yearsFromNow > 0) {
        currentWealth = (currentWealth + (yearlySurplus > 0 ? yearlySurplus : 0)) * 1.08;
      }

      const monthsPaid = Math.min(yearsFromNow * 12, tenureInMonths);
      const cumulativeLoanCost = monthsPaid * totalMonthlyPayment;

      const yearGoals = goals.filter(g => g.targetYear === year);
      const goalAmount = yearGoals.reduce((sum, g) => {
        let amt = g.targetAmount;
        if (considerInflation && g.targetYear > currentYear) {
          amt = amt * Math.pow(1.06, g.targetYear - currentYear);
        }
        return sum + amt;
      }, 0);

      data.push({
        year,
        Wealth: Math.round(currentWealth),
        LoanCost: Math.round(cumulativeLoanCost),
        Goal: goalAmount > 0 ? Math.round(goalAmount) : null,
        GoalName: yearGoals.map(g => g.name).join(', '),
        TotalGoals: Math.round(totalGoalLine)
      });
    }
    return data;
  }, [investableSurplus, tenureInMonths, totalMonthlyPayment, goals, considerInflation, currentYear]);

  const breakEvenYear = useMemo(() => {
    const breakEvenPoint = wealthData.find(d => d.Wealth >= d.TotalGoals);
    return breakEvenPoint ? breakEvenPoint.year : null;
  }, [wealthData]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon /> Smart Goal Templates
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Button variant="outlined" onClick={applyRetirementGoal} fullWidth>
              🎯 Retirement
            </Button>
            <Button variant="outlined" onClick={applyEducationGoal} fullWidth>
              🎓 Child's Education
            </Button>
            <Button variant="outlined" onClick={applyEmergencyFundGoal} fullWidth>
              🛟 Emergency Fund (6M)
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <GoalForm onAdd={(goal) => dispatch(addGoal(goal))} currentYear={currentYear} />

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Goals ({goals.length})</Typography>
            <FormControlLabel
              control={<Switch checked={considerInflation} onChange={(e) => dispatch(setConsiderInflation(e.target.checked))} />}
              label={<Typography variant="caption">Inflation (6%)</Typography>}
            />
          </Box>

          {goals && goals.length > 0 ? goals.map(g => (
            <EditableGoalItem
              key={g.id}
              goal={g}
              currency={currency}
              currentYear={currentYear}
              considerInflation={considerInflation}
              onUpdate={(updated) => dispatch(updateGoal(updated))}
              onDelete={(id) => dispatch(deleteGoal(id))}
              onInvestmentChange={(goalId, investmentData) => {
                dispatch(setGoalInvestment({ goalId, investmentData }));
              }}
              investmentAmount={goalInvestments[g.id]?.monthlyInvestment || 0}
            />
          )) : (
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2" color="textSecondary">
                No goals yet. Create one or use a template!
              </Typography>
            </Paper>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Wealth Projection vs Goals</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={wealthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(val) => `${currency}${val/100000}L`} />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if(name === 'Goal') return [formatCurrency(value), 'Goal Target'];
                      if(name === 'TotalGoals') return [formatCurrency(value), 'Total Goals Needed'];
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Wealth" stroke="#4caf50" strokeWidth={3} name="Projected Wealth" />
                  <Line type="monotone" dataKey="TotalGoals" stroke="#9c27b0" strokeWidth={2} strokeDasharray="5 5" name="Total Goals Needed" />
                  <Line type="monotone" dataKey="LoanCost" stroke="#f44336" strokeWidth={3} name="Cumulative Loan Cost" />
                  <Line type="scatter" dataKey="Goal" stroke="#ff9800" strokeWidth={0} dot={{ r: 6, fill: '#ff9800' }} name="Milestones" />

                  {breakEvenYear ? (
                    <ReferenceLine x={breakEvenYear} stroke="green" strokeDasharray="3 3" label="Breakeven Point" />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                * Projected wealth assumes current investable surplus is invested annually at 8% return.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Goal Distribution & Investments</Typography>
              {goals.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goals.map(g => ({
                    name: g.name.substring(0, 10),
                    amount: g.targetAmount,
                    inflated: considerInflation && g.targetYear > currentYear
                      ? g.targetAmount * Math.pow(1.06, g.targetYear - currentYear)
                      : g.targetAmount,
                    investment: goalInvestments[g.id]?.monthlyInvestment || 0,
                    year: g.targetYear
                  }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `${currency}${val/100000}L`} />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        if (name === 'amount') return [formatCurrency(value), 'Target Amount'];
                        if (name === 'inflated') return [formatCurrency(value), 'Inflation-Adjusted'];
                        if (name === 'investment') return [formatCurrency(value), 'Monthly Investment'];
                        return [formatCurrency(value), name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="amount" fill={COLORS[0]} name="Target Amount" />
                    {considerInflation && <Bar dataKey="inflated" fill={COLORS[1]} name="Inflation-Adjusted" />}
                    {Object.values(goalInvestments).some(g => (g?.monthlyInvestment || 0) > 0) &&
                      <Bar dataKey="investment" fill={COLORS[2]} name="Monthly Investment" />
                    }
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                  No goals added yet
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

