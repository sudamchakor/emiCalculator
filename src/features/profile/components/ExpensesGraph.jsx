import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectProfileExpenses,
  selectIncomes,
  selectConsiderInflation,
  selectGeneralInflationRate,
  selectEducationInflationRate,
  selectCurrentAge,
  selectRetirementAge,
  selectCareerGrowthRate,
  selectTotalMonthlyIncome,
} from '../../../store/profileSlice';
import { selectCurrency } from '../../../store/emiSlice';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const L8 = new Date().getFullYear(); // Current year

const incomeColors = ['#82ca9d', '#8884d8', '#8dd1e1', '#a4de6c', '#d0ed57', '#42a5f5', '#66bb6a'];
const expenseColors = ['#ff7c7c', '#fa8072', '#ffc658', '#ef5350', '#d32f2f', '#ff9800', '#f44336'];

const ExpensesGraph = () => {
  const expenses = useSelector(selectProfileExpenses);
  const incomes = useSelector(selectIncomes);
  const considerInflation = useSelector(selectConsiderInflation);
  const generalInflationRate = useSelector(selectGeneralInflationRate);
  const educationInflationRate = useSelector(selectEducationInflationRate);
  const currentAge = useSelector(selectCurrentAge);
  const retirementAge = useSelector(selectRetirementAge);
  const currency = useSelector(selectCurrency);
  const careerGrowthRate = useSelector(selectCareerGrowthRate);
  const totalMonthlyIncome = useSelector(selectTotalMonthlyIncome);

  const [visibleLines, setVisibleLines] = useState({});

  const projectedData = React.useMemo(() => {
    const data = [];
    const endYear = L8 + (retirementAge - currentAge);
    const careerGrowthType = typeof careerGrowthRate === 'object' ? careerGrowthRate.type : 'percentage';
    const careerGrowthValue = typeof careerGrowthRate === 'object' ? careerGrowthRate.value : careerGrowthRate || 0;

    for (let year = L8; year <= endYear; year++) {
      const yearData = { year };
      
      // Initialize keys to 0 for correct stacking behavior
      incomes.forEach(inc => {
        yearData[`${inc.name} (Grown)`] = 0;
        yearData[`${inc.name} (Base)`] = 0;
      });
      expenses.forEach(exp => {
        yearData[`${exp.name} (Base)`] = 0;
        yearData[`${exp.name} (Inflated)`] = 0;
      });

      let totalAnnualIncome = 0;
      let totalGrownAnnualIncome = 0;
      let totalAnnualExpense = 0;
      let totalInflatedAnnualExpense = 0;

      // --- Process Incomes ---
      incomes.forEach((income) => {
        const startYear = income.startYear || L8;
        const incomeEndYear = income.endYear || endYear;

        if (year >= startYear && year <= incomeEndYear) {
          let annualAmount = Number(income.amount) || 0;
          if (income.frequency === 'monthly') annualAmount *= 12;
          if (income.frequency === 'quarterly') annualAmount *= 4;

          const incomeBaseKey = `${income.name} (Base)`;
          yearData[incomeBaseKey] += annualAmount;

          let grownAmount = annualAmount;
          const yearsPassed = year - startYear;
          if (yearsPassed > 0) {
            if (careerGrowthType === 'percentage') {
              grownAmount *= Math.pow(1 + careerGrowthValue, yearsPassed);
            } else { 
              grownAmount += careerGrowthValue * yearsPassed;
            }
          }
          const incomeGrownKey = `${income.name} (Grown)`;
          yearData[incomeGrownKey] += grownAmount;

          totalAnnualIncome += annualAmount;
          totalGrownAnnualIncome += grownAmount;
        }
      });

      yearData['Total Income (Base)'] = totalAnnualIncome;
      yearData['Total Income (Grown)'] = totalGrownAnnualIncome;

      // --- Process Expenses ---
      expenses.forEach((expense) => {
        const startYear = expense.startYear || L8;
        const expenseEndYear = expense.endYear || endYear;

        if (year >= startYear && year <= expenseEndYear) {
          let monthlyAmount = Number(expense.amount) || 0;
          if (expense.frequency === 'quarterly') monthlyAmount /= 3;
          if (expense.frequency === 'yearly') monthlyAmount /= 12;
          const annualAmount = monthlyAmount * 12;

          const baseKey = `${expense.name} (Base)`;
          yearData[baseKey] += annualAmount;
          totalAnnualExpense += annualAmount;

          if (considerInflation) {
            const inflationRate = expense.category === 'education' ? educationInflationRate : generalInflationRate;
            const yearsPassed = year - startYear;
            const inflatedAmount = annualAmount * Math.pow(1 + inflationRate, yearsPassed);
            const inflatedKey = `${expense.name} (Inflated)`;
            yearData[inflatedKey] += inflatedAmount;
            totalInflatedAnnualExpense += inflatedAmount;
          }
        }
      });
      
      yearData['Total Expenses (Base)'] = totalAnnualExpense;
      if (considerInflation) {
        yearData['Total Expenses (Inflated)'] = totalInflatedAnnualExpense;
      }

      const totalIncomeToUse = totalGrownAnnualIncome;
      const totalExpenseToUse = considerInflation ? totalInflatedAnnualExpense : totalAnnualExpense;
      yearData['Total Surplus'] = totalIncomeToUse - totalExpenseToUse;

      data.push(yearData);
    }
    return data;
  }, [
    expenses,
    incomes,
    considerInflation,
    generalInflationRate,
    educationInflationRate,
    currentAge,
    retirementAge,
    careerGrowthRate,
    totalMonthlyIncome,
  ]);

  const incomeKeys = React.useMemo(() => {
    return Array.from(new Set(incomes.map(inc => `${inc.name} (Grown)`)));
  }, [incomes]);

  const expenseKeys = React.useMemo(() => {
    return Array.from(new Set(expenses.map(exp => considerInflation ? `${exp.name} (Inflated)` : `${exp.name} (Base)`)));
  }, [expenses, considerInflation]);

  const chartKeys = React.useMemo(() => {
    return [...incomeKeys, ...expenseKeys, 'Total Surplus'];
  }, [incomeKeys, expenseKeys]);

  useEffect(() => {
    const initialVisibility = {};
    chartKeys.forEach(key => {
      initialVisibility[key] = true;
    });
    setVisibleLines(initialVisibility);
  }, [chartKeys]);

  const handleLegendClick = (data) => {
    const { dataKey } = data;
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: prev[dataKey] === undefined ? false : !prev[dataKey],
    }));
  };

  const renderLegendText = (value) => {
    const isVisible = visibleLines[value] !== false;
    const style = {
      color: isVisible ? '#333' : '#AAA',
      cursor: 'pointer',
      textDecoration: isVisible ? 'none' : 'line-through',
    };
    return <span style={style}>{value}</span>;
  };

  const formatCurrencyValue = (value) =>
    `${currency}${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Calculate sums for the tooltip based on currently hovered values
      const totalIncome = payload
        .filter(entry => incomeKeys.includes(entry.dataKey))
        .reduce((sum, entry) => sum + entry.value, 0);
        
      const totalExpense = payload
        .filter(entry => expenseKeys.includes(entry.dataKey))
        .reduce((sum, entry) => sum + entry.value, 0);

      return (
        <Paper sx={{ p: 1.5, bgcolor: 'background.paper', border: '1px solid #ccc', borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Year: {label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={`item-${index}`} variant="body2" sx={{ color: entry.color, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 'bold' }}>{formatCurrencyValue(entry.value)}</span>
            </Typography>
          ))}
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
             {incomeKeys.length > 0 && (
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, color: '#2e7d32' }}>
                  <span>Total Inflow:</span>
                  <span style={{ fontWeight: 'bold' }}>{formatCurrencyValue(totalIncome)}</span>
                </Typography>
             )}
             {expenseKeys.length > 0 && (
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, color: '#d32f2f' }}>
                  <span>Total Outflow:</span>
                  <span style={{ fontWeight: 'bold' }}>{formatCurrencyValue(totalExpense)}</span>
                </Typography>
             )}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Projected Annual Cash Flow
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={projectedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatCurrencyValue} />
          <Tooltip content={<CustomTooltip />} />
          <Legend onClick={handleLegendClick} formatter={renderLegendText} verticalAlign="bottom" />
          
          {incomeKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stackId="income"
              fill={incomeColors[index % incomeColors.length]}
              stroke={incomeColors[index % incomeColors.length]}
              hide={visibleLines[key] === false}
            />
          ))}

          {expenseKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stackId="expense"
              fill={expenseColors[index % expenseColors.length]}
              stroke={expenseColors[index % expenseColors.length]}
              hide={visibleLines[key] === false}
            />
          ))}

          <Line
            type="monotone"
            dataKey="Total Surplus"
            name="Total Surplus"
            stroke="#000000"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8 }}
            hide={visibleLines['Total Surplus'] === false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpensesGraph;
