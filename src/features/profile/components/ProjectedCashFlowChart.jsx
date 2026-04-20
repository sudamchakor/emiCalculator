import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  ComposedChart,
  Area, // Import Area
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../../store/emiSlice";
import dayjs from "dayjs";

const currentYear = new Date().getFullYear();

export default function ProjectedCashFlowChart({
  currentAge,
  retirementAge,
  careerGrowthRate,
  careerGrowthType,
  monthlyEmi,
  emiState,
  individualGoalInvestments,
  goals,
  expenses, // Pass expenses for projection calculation
  incomes, // Accept incomes as a prop
}) {
  const theme = useTheme();
  const currency = useSelector(selectCurrency);

  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // --- Income & Expense Projection Calculation ---
  const projectionYears = retirementAge > currentAge ? retirementAge - currentAge : 0;
  const endProjectionYear = currentYear + projectionYears;

  let loanTenureMonths = 0;
  let emiStartYear = currentYear;
  let emiStartMonth = new Date().getMonth();

  if (emiState?.loanDetails) {
    loanTenureMonths = emiState.loanDetails.tenureUnit === 'years' ? Number(emiState.loanDetails.loanTenure) * 12 : Number(emiState.loanDetails.loanTenure);
    const startDate = dayjs(emiState.loanDetails.startDate);
    if (startDate.isValid()) {
      emiStartYear = startDate.year();
      emiStartMonth = startDate.month();
    }
  } else if (emiState && emiState.tenure) {
    loanTenureMonths = emiState.tenureType === 'years' ? Number(emiState.tenure) * 12 : Number(emiState.tenure);
  }

  const absoluteStartMonth = emiStartYear * 12 + emiStartMonth;
  const absoluteEndMonth = absoluteStartMonth + loanTenureMonths;

  const projectionData = [];
  if (projectionYears > 0) {
    for (let year = currentYear; year <= endProjectionYear; year++) {
      const yearsFromNow = year - currentYear;

      // Use the incomes prop directly
      let annualIncome = 0;
      let hasActiveIncome = false;

      incomes.forEach((inc) => { // Use incomes prop directly
        const start = inc.startYear || currentYear;
        const end = inc.endYear || currentYear + 10;
        if (year >= start && year <= end) {
          hasActiveIncome = true;
          let yearlyAmount = Number(inc.amount) || 0;

          if (inc.frequency === 'monthly') yearlyAmount *= 12;
          else if (inc.frequency === 'quarterly') yearlyAmount *= 4;

          const activeYears = year - Math.max(start, currentYear);
          if (activeYears > 0) {
            if (careerGrowthType === 'percentage') {
                yearlyAmount *= Math.pow(1 + careerGrowthRate, activeYears);
            }
          }
          annualIncome += yearlyAmount;
        }
      });

      if (careerGrowthType === 'fixed' && hasActiveIncome) {
         const activeYears = year - currentYear;
         if (activeYears > 0) {
            annualIncome += careerGrowthRate * activeYears;
         }
      }

      let annualExpense = 0;

      expenses.forEach((exp) => {
        const start = exp.startYear || currentYear;
        const end = exp.endYear || currentYear + 10;
        if (year >= start && year <= end) {
          let yearlyAmount = Number(exp.amount) || 0;
          if (exp.frequency === 'monthly') yearlyAmount *= 12;
          else if (exp.frequency === 'quarterly') yearlyAmount *= 4;
          annualExpense += yearlyAmount;
        }
      });

      let activeEmiMonths = 0;
      if (loanTenureMonths > 0) {
        for (let m = 0; m < 12; m++) {
          const absoluteCurrentMonth = year * 12 + m;
          if (absoluteCurrentMonth >= absoluteStartMonth && absoluteCurrentMonth < absoluteEndMonth) {
            activeEmiMonths++;
          }
        }
      }
      annualExpense += (monthlyEmi || 0) * activeEmiMonths;

      individualGoalInvestments.forEach((inv) => {
        if (inv.type === 'one-time-yearly') {
          // For one-time yearly investments, only add if the current projection year matches the investment's target year
          if (year === inv.year) { // inv.year is the goal.targetYear
            annualExpense += Number(inv.amount) || 0;
          }
        } else {
          // For recurring investments (SIPs, etc.)
          const start = inv.startYear || currentYear;
          // Use goalTargetYear for end if available, otherwise default
          const end = inv.endYear || (inv.goalTargetYear ? inv.goalTargetYear : currentYear + 10);

          if (year >= start && year <= end) {
            let yearlyAmount = Number(inv.amount) || 0;

            if (inv.frequency === 'monthly') yearlyAmount *= 12;
            else if (inv.frequency === 'quarterly') yearlyAmount *= 4;

            if (inv.type === 'step_up_sip' || inv.investmentType === 'step_up_sip') {
              const stepUpRate = inv.stepUpRate ? (inv.stepUpRate / 100) : 0;
              const activeYears = year - start;
              if (activeYears > 0) {
                yearlyAmount *= Math.pow(1 + stepUpRate, activeYears);
              }
            }
            annualExpense += yearlyAmount;
          }
        }
      });

      projectionData.push({
        year: year,
        Income: Math.round(annualIncome),
        Expenses: Math.round(annualExpense),
        Surplus: Math.round(annualIncome - annualExpense),
      });
    }
  }

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" align="center" gutterBottom>
        Projected Annual Income vs. Expenses Until Retirement
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={projectionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(val) => formatCurrency(val)} />
          <RechartsTooltip formatter={(value, name) => [formatCurrency(value), name]} />
          <Legend />
          <Area type="monotone" dataKey="Income" name="Annual Income" fill={theme.palette.success.light} stroke={theme.palette.success.main} />
          <Area type="monotone" dataKey="Expenses" name="Annual Expenses" fill={theme.palette.error.light} stroke={theme.palette.error.main} />
          <Line type="monotone" dataKey="Surplus" name="Surplus" stroke={theme.palette.primary.main} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}
