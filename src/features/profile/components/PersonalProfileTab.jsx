import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Collapse,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EditableIncomeExpenseItem from "../../../components/common/EditableIncomeExpenseItem";
import BasicInfoDisplay from "./BasicInfoDisplay";
import BasicInfoEdit from "./BasicInfoEdit";
import SliderInput from "../../../components/common/SliderInput";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIncomes,
  selectProfileExpenses,
  selectCurrentAge,
  selectRetirementAge,
  addIncome,
  deleteIncome,
  updateIncome,
  addExpense,
  deleteExpense,
  updateExpense,
  setCurrentAge,
  setRetirementAge,
  selectTotalMonthlyIncome,
  selectTotalMonthlyExpenses,
  selectCurrentSurplus,
  selectCareerGrowthRate,
  setCareerGrowthRate,
  selectTotalMonthlyGoalContributions,
  selectIndividualGoalInvestmentContributions, // Import the new selector
  selectGoals,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import ExpenseReadOnlyItem from "../../../components/common/ExpenseReadOnlyItem";
 
const PIE_CHART_COLORS = ["#ff6b6b", "#4ecdc4", "#9c27b0", "#2ecc71", "#f1c40f"];

const currentYear = new Date().getFullYear();

export default function PersonalProfileTab({ onEditGoal }) {
  const dispatch = useDispatch();

  const incomes = useSelector(selectIncomes) || [];
  const expenses = useSelector(selectProfileExpenses) || [];
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.value : (careerGrowthRaw || 0);
  const careerGrowthType = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.type : 'percentage';

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const emiState = useSelector((state) => state.emi || state.emiCalculator || {});
  const currency = useSelector(selectCurrency);

  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const totalProfileExpenses = useSelector(selectTotalMonthlyExpenses);
  const totalMonthlyGoalContributions = useSelector(selectTotalMonthlyGoalContributions);
  const individualGoalInvestments = useSelector(selectIndividualGoalInvestmentContributions);
  const investableSurplus = useSelector(selectCurrentSurplus);
  const goals = useSelector(selectGoals) || [];

  const totalMonthlyPayment = monthlyEmi;

  // Include goal contributions in total expenses for budget calculation
  const totalExpensesIncludingLoanAndGoals = totalProfileExpenses + (monthlyEmi || 0) + totalMonthlyGoalContributions;

  const isBudgetExceeded = investableSurplus < 0;
  const budgetWarning = isBudgetExceeded
    ? `Your spending (${currency}${totalExpensesIncludingLoanAndGoals.toLocaleString("en-IN", { maximumFractionDigits: 0 })}) exceeds income (${currency}${totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}) by ${currency}${Math.abs(investableSurplus).toLocaleString("en-IN", { maximumFractionDigits: 0 })}. Consider reducing expenses or increasing income.`
    : "";

  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    startYear: currentYear,
    endYear: currentYear + 10,
  });
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "basic",
    frequency: "monthly",
    startYear: currentYear,
    endYear: currentYear + 10,
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [incomeStartYearOpen, setIncomeStartYearOpen] = useState(false);
  const [incomeEndYearOpen, setIncomeEndYearOpen] = useState(false);
  const [expenseStartYearOpen, setExpenseStartYearOpen] = useState(false);
  const [expenseEndYearOpen, setExpenseEndYearOpen] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState({});

  const toggleGoalExpanded = (goalId) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const handleEditIncome = (income) => {
    setEditingIncomeId(income.id);
    setNewIncome({
      ...income,
      amount: String(income.amount),
      frequency: income.frequency || "monthly",
      startYear: income.startYear || currentYear,
      endYear: income.endYear || currentYear + 10,
    });
  };

  const handleCancelEditIncome = () => {
    setEditingIncomeId(null);
    setNewIncome({
      name: "",
      amount: "",
      frequency: "monthly",
      startYear: currentYear,
      endYear: currentYear + 10,
    });
  };

  const handleAddOrUpdateIncome = () => {
    if (newIncome.name && newIncome.amount) {
      const payload = {
        ...newIncome,
        amount: Number(newIncome.amount),
      };
      if (editingIncomeId) {
        dispatch(updateIncome({ ...payload, id: editingIncomeId }));
      } else {
        dispatch(addIncome({ ...payload, id: Date.now() }));
      }
      handleCancelEditIncome();
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setNewExpense({
      ...expense,
      amount: String(expense.amount),
      category: expense.category || "basic",
      frequency: expense.frequency || "monthly",
      startYear: expense.startYear || currentYear,
      endYear: expense.endYear || currentYear + 10,
    });
  };

  const handleCancelEditExpense = () => {
    setEditingExpenseId(null);
    setNewExpense({
      name: "",
      amount: "",
      category: "basic",
      frequency: "monthly",
      startYear: currentYear,
      endYear: currentYear + 10,
    });
  };

  const handleAddOrUpdateExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const payload = {
        ...newExpense,
        amount: Number(newExpense.amount),
      };
      if (editingExpenseId) {
        dispatch(updateExpense({ ...payload, id: editingExpenseId }));
      } else {
        dispatch(addExpense({ ...payload, id: Date.now() }));
      }
      handleCancelEditExpense();
    }
  };

  const handleSaveBasicInfo = (newCurrentAge, newRetirementAge) => {
    dispatch(setCurrentAge(newCurrentAge));
    dispatch(setRetirementAge(newRetirementAge));
    setEditingBasicInfo(false);
  };

  const theme = useTheme(); // Initialize useTheme hook

  // Define color mapping functions using theme palette
  const getPieCategoryColor = (categoryName) => {
    switch (categoryName) {
      case "Needs":
        return theme.palette.error.main;
      case "Wants":
        return theme.palette.warning.main;
      case "Loan EMIs":
        return theme.palette.info.main;
      case "Future Wealth (Goals)":
        return theme.palette.success.main;
      case "Surplus":
        return theme.palette.primary.light; // A lighter version of the primary color for surplus
      default:
        return theme.palette.grey[500]; // Fallback color
    }
  };

  const INCOME_BAR_COLOR = theme.palette.success.main; // Green for income
  const STACKED_EXPENSE_BAR_COLORS_MAP = {
    "Needs": theme.palette.error.main,
    "Wants": theme.palette.warning.main,
    "Loan EMIs": theme.palette.info.main,
    "Future Wealth (Goals)": theme.palette.success.light, // Slightly different green for goals
  };
  const needsValue = expenses
    .filter((e) => e.category === "basic")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const wantsValue = expenses
    .filter((e) => e.category === "discretionary")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const donutData = [
    {
      name: "Needs",
      value: needsValue,
    },
    {
      name: "Wants",
      value: wantsValue,
    },
    { name: "Loan EMIs", value: monthlyEmi || 0 },
    {
      name: "Future Wealth (Goals)",
      value: totalMonthlyGoalContributions,
    },
    {
      name: "Surplus",
      value: investableSurplus > 0 ? investableSurplus : 0,
    },
  ].filter((item) => item.value > 0);

  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`; // Ensure val is treated as number

  // Handler for clicking on Home Loan EMI
  const handleHomeLoanEmiClick = () => {
    alert("Navigating to Home Loan EMI edit mode (requires further implementation)");
    // In a real application, you would navigate to the EMI calculator or a specific edit section
  };

  // Dummy delete handler for read-only items that don't have direct deletion here
  const handleReadOnlyDelete = (id) => {
    alert(`Deletion of item with ID ${id} is not directly supported from this view.`);
    // This would typically be handled by the component that manages the source of this read-only item
  };

  // --- Income & Expense Projection Calculation ---
  const projectionYears = retirementAge > currentAge ? retirementAge - currentAge : 0;
  const endProjectionYear = currentYear + projectionYears;

  let loanTenureMonths = 0; 
  if (emiState && emiState.tenure) {
    loanTenureMonths = emiState.tenureType === 'years' ? Number(emiState.tenure) * 12 : Number(emiState.tenure);
  }

  const projectionData = [];
  if (projectionYears > 0) {
    for (let year = currentYear; year <= endProjectionYear; year++) {
      const yearsFromNow = year - currentYear;

      // Calculate monthly income for this year
      let monthIncome = 0;
      incomes.forEach((inc) => {
        const start = inc.startYear || currentYear;
        const end = inc.endYear || currentYear + 10;
        if (year >= start && year <= end) {
          let monthlyAmount = inc.amount;
          if (inc.frequency === 'yearly') monthlyAmount /= 12;
          else if (inc.frequency === 'quarterly') monthlyAmount /= 3;

          const activeYears = year - Math.max(start, currentYear);
          if (activeYears > 0) {
            if (careerGrowthType === 'percentage') {
                monthlyAmount *= Math.pow(1 + careerGrowthRate, activeYears);
            } else {
                monthlyAmount += (careerGrowthRate / 12) * activeYears;
            }
          }
          monthIncome += monthlyAmount;
        }
      });

      // Calculate monthly expenses for this year
      let monthExpense = 0;

      // 1. Regular Expenses
      expenses.forEach((exp) => {
        const start = exp.startYear || currentYear;
        const end = exp.endYear || currentYear + 10;
        if (year >= start && year <= end) {
          let monthlyAmount = exp.amount;
          if (exp.frequency === 'yearly') monthlyAmount /= 12;
          else if (exp.frequency === 'quarterly') monthlyAmount /= 3;
          monthExpense += monthlyAmount;
        }
      });

      // 2. Home Loan EMI
      let activeEmiMonths = 0;
      for (let m = 0; m < 12; m++) {
        const monthIndex = (year - currentYear) * 12 + m;
        if (monthIndex < loanTenureMonths) {
          activeEmiMonths++;
        }
      }
      monthExpense += (monthlyEmi || 0) * (activeEmiMonths / 12);

      // 3. Goal Contributions
      individualGoalInvestments.forEach((inv) => {
        const start = inv.startYear || currentYear;
        const planDuration = inv.timePeriod || (inv.targetYear ? inv.targetYear - start : 10);
        const end = inv.endYear || (start + Math.max(planDuration, 0));

        if (year >= start && year <= end) {
          let monthlyAmount = inv.amount;

          if (inv.type === 'step_up_sip' || inv.investmentType === 'step_up_sip') {
             const stepUpRate = inv.stepUpRate ? (inv.stepUpRate / 100) : 0;
             const activeYears = year - start;
             if (activeYears > 0) {
                 monthlyAmount *= Math.pow(1 + stepUpRate, activeYears);
             }
          }

          if (inv.frequency === 'yearly') monthlyAmount /= 12;
          else if (inv.frequency === 'quarterly') monthlyAmount /= 3;
          monthExpense += monthlyAmount;
        }
      });

      projectionData.push({
        year: year,
        Income: Math.round(monthIncome),
        Expenses: Math.round(monthExpense),
      });
    }
  }

  const groupedGoalInvestments = individualGoalInvestments.reduce((acc, inv) => {
    const goal = goals.find((g) => g.id === inv.goalId);
    const goalName = goal ? goal.name : "Other Goal";
    if (!acc[inv.goalId]) {
      acc[inv.goalId] = {
        goalId: inv.goalId,
        goalName: goalName,
        investments: [],
      };
    }
    acc[inv.goalId].investments.push(inv);
    return acc;
  }, {});

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {editingBasicInfo ? (
          <BasicInfoEdit
            currentAge={currentAge}
            retirementAge={retirementAge}
            onSave={handleSaveBasicInfo}
            onCancel={() => setEditingBasicInfo(false)}
          />
        ) : (
          <BasicInfoDisplay
            currentAge={currentAge}
            retirementAge={retirementAge}
            onEdit={() => setEditingBasicInfo(true)}
          />
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Income Details
            <InfoIcon fontSize="small" sx={{ opacity: 0.6 }} />
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
            {incomes &&
              incomes.map((inc) => (
                <EditableIncomeExpenseItem
                  key={inc.id}
                  item={inc}
                  currency={currency}
                  onEdit={() => handleEditIncome(inc)}
                  onUpdate={(updatedInc) => dispatch(updateIncome(updatedInc))}
                  onDelete={(id) => dispatch(deleteIncome(id))}
                  totalIncome={totalIncome}
                  isIncome={true}
                />
              ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {editingIncomeId ? "Edit Income" : "Add New Income"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Source"
                  value={newIncome.name}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput
                  label="Amount"
                  value={Number(newIncome.amount) || 0}
                  onChange={(val) => setNewIncome({ ...newIncome, amount: val })}
                  min={0}
                  max={10000000}
                  step={1000}
                  showInput={true}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={newIncome.frequency}
                    label="Frequency"
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, frequency: e.target.value })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Start Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={incomeStartYearOpen}
                  onOpen={() => setIncomeStartYearOpen(true)}
                  onClose={() => setIncomeStartYearOpen(false)}
                  value={dayjs(`${newIncome.startYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewIncome({ ...newIncome, startYear: newValue ? newValue.year() : currentYear })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setIncomeStartYearOpen(true) } }}
                  minDate={dayjs(`${currentYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="End Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={incomeEndYearOpen}
                  onOpen={() => setIncomeEndYearOpen(true)}
                  onClose={() => setIncomeEndYearOpen(false)}
                  value={dayjs(`${newIncome.endYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewIncome({ ...newIncome, endYear: newValue ? newValue.year() : currentYear + 10 })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setIncomeEndYearOpen(true) } }}
                  minDate={dayjs(`${newIncome.startYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: "flex-end",
                }}
              >
                {editingIncomeId && (
                  <Button onClick={handleCancelEditIncome}>Cancel</Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleAddOrUpdateIncome}
                >
                  {editingIncomeId ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "success.main" }}
          >
            Total Monthly Income: {formatCurrency(totalIncome)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Career Growth (Year-on-Year)
          </Typography>
          <AmountWithUnitInput
            label="Expected Annual Salary Hike"
            value={careerGrowthType === 'percentage' ? (careerGrowthRate * 100).toFixed(2) : careerGrowthRate}
            onAmountChange={(e) => {
              const val = Number(e.target.value);
              dispatch(setCareerGrowthRate({
                type: careerGrowthType,
                value: careerGrowthType === 'percentage' ? val / 100 : val
              }));
            }}
            unitValue={careerGrowthType === 'percentage' ? '%' : currency}
            onUnitChange={(e) => {
              const newUnit = e.target.value;
              const newType = newUnit === '%' ? 'percentage' : 'fixed';
              dispatch(setCareerGrowthRate({
                type: newType,
                value: newType === 'percentage' ? 0.1 : 50000
              }));
            }}
            unitOptions={[
              { value: '%', label: '%' },
              { value: currency, label: currency }
            ]}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Monthly Cash Flow Breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Expenses Details
            {isBudgetExceeded && (
              <Tooltip title={budgetWarning}>
                <InfoIcon
                  fontSize="small"
                  sx={{ color: "error.main", cursor: "help" }}
                />
              </Tooltip>
            )}
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
            {monthlyEmi > 0 && (
              <ExpenseReadOnlyItem
                item={{
                  id: "home-loan-emi", // Unique ID for this item
                  name: "Home Loan EMI",
                  amount: monthlyEmi,
                  frequency: "monthly",
                }}
                currency={currency}
                isExpense={true}
                totalIncome={totalIncome}
                expenseRatio={(monthlyEmi / totalIncome) * 100}
                getExpenseColor={() => {
                  const ratio = (monthlyEmi / totalIncome) * 100;
                  if (ratio > 40) return "error.main";
                  if (ratio > 30) return "warning.main";
                  return "success.main";
                }}
                formatCurrency={formatCurrency}
                onConfirmDelete={handleReadOnlyDelete} // Use the dummy handler for now
                deletionImpactMessage="Deleting Home Loan EMI will remove it from your expenses and cash flow calculations. To adjust the EMI, please use the EMI Calculator tab."
                isReadOnly={true}
                onClick={handleHomeLoanEmiClick} // Make it clickable
              />
            )}
            {/* Render individual goal investment contributions */}
            {individualGoalInvestments.length > 0 && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Goal Investments
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {Object.values(groupedGoalInvestments).map((group) => {
                      const groupMonthlyTotal = group.investments.reduce((sum, inv) => {
                        let monthly = inv.amount || 0;
                        if (inv.frequency === 'yearly') monthly /= 12;
                        else if (inv.frequency === 'quarterly') monthly /= 3;
                        return sum + monthly;
                      }, 0);
                      const isExpanded = expandedGoals[group.goalId];

                      return (
                        <Box key={group.goalId} sx={{ mb: 2, p: 1.5, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                          <Box
                            onClick={() => toggleGoalExpanded(group.goalId)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              "&:hover": { opacity: 0.8 },
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.secondary", flexGrow: 1 }}>
                              {group.goalName} ({group.investments.length} {group.investments.length === 1 ? 'plan' : 'plans'})
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1, color: "text.secondary" }}>
                              {formatCurrency(groupMonthlyTotal)} / mo
                            </Typography>
                            <IconButton size="small" disableRipple sx={{ p: 0 }}>
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 1.5 }}>
                              {group.investments.map((investment) => {
                          const expenseRatio =
                            investment.frequency === "yearly" && totalIncome > 0
                              ? (investment.amount / (totalIncome * 12)) * 100
                              : totalIncome > 0
                              ? (investment.amount / totalIncome) * 100
                              : 0;
                          return (
                            <ExpenseReadOnlyItem
                              key={investment.id}
                              item={investment}
                              currency={currency}
                              isExpense={true}
                              totalIncome={totalIncome}
                              expenseRatio={expenseRatio}
                              getExpenseColor={() => {
                                const ratio = expenseRatio;
                                if (ratio > 40) return "error.main";
                                if (ratio > 30) return "warning.main";
                                return "success.main";
                              }}
                              formatCurrency={formatCurrency}
                              onConfirmDelete={handleReadOnlyDelete}
                              deletionImpactMessage={`To stop this investment, please edit or delete the associated goal in the Future Goals tab.`}
                              isReadOnly={true}
                              onClick={() => onEditGoal(investment.goalId)}
                            />
                          );
                        })}
                            </Box>
                          </Collapse>
                      </Box>
                      );
                    })}
                  </Box>
              </Box>
            )}

            {expenses &&
              expenses.map((exp) => {
                return (
                  <EditableIncomeExpenseItem
                    key={exp.id}
                    item={exp}
                    currency={currency}
                    onEdit={() => handleEditExpense(exp)}
                    onUpdate={(updatedExp) => dispatch(updateExpense(updatedExp))}
                    onDelete={(id) => dispatch(deleteExpense(id))}
                    isExpense={true}
                    isBudgetExceeded={isBudgetExceeded}
                    budgetWarning={budgetWarning}
                    totalIncome={totalIncome}
                    totalExpenses={totalProfileExpenses}
                  />
                );
              })}
          </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Total Monthly Expenses
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: isBudgetExceeded ? "error.main" : "text.primary",
            fontSize: isBudgetExceeded ? "1.2rem" : "1rem",
          }}
        >
          {formatCurrency(totalExpensesIncludingLoanAndGoals.toFixed(0))}
        </Typography>
      </Box>
      {isBudgetExceeded && (
        <Paper
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: "#ffebee",
            borderLeft: "4px solid #f44336",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#c62828", fontWeight: 600 }}
          >
            ⚠️ {budgetWarning}
          </Typography>
        </Paper>
      )}
    </Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {editingExpenseId ? "Edit Expense" : "Add New Expense"}
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
        To add an "initial funding" source, simply use this form to add a new income stream with a descriptive name (e.g., "Starting Capital") and its monthly amount.
      </Typography>
      <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Expense Name"
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput
                  label="Amount"
                  value={Number(newExpense.amount) || 0}
                  onChange={(val) =>
                    setNewExpense({ ...newExpense, amount: val })
                  }
                  min={0}
                  max={1000000}
                  step={500}
                  showInput={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newExpense.category}
                    label="Category"
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                  >
                    <MenuItem value="basic">Basic Need</MenuItem>
                    <MenuItem value="discretionary">Discretionary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={newExpense.frequency}
                    label="Frequency"
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        frequency: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={expenseStartYearOpen}
                  onOpen={() => setExpenseStartYearOpen(true)}
                  onClose={() => setExpenseStartYearOpen(false)}
                  value={dayjs(`${newExpense.startYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewExpense({ ...newExpense, startYear: newValue ? newValue.year() : currentYear })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setExpenseStartYearOpen(true) } }}
                  minDate={dayjs(`${currentYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={expenseEndYearOpen}
                  onOpen={() => setExpenseEndYearOpen(true)}
                  onClose={() => setExpenseEndYearOpen(false)}
                  value={dayjs(`${newExpense.endYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewExpense({ ...newExpense, endYear: newValue ? newValue.year() : currentYear + 10 })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setExpenseEndYearOpen(true) } }}
                  minDate={dayjs(`${newExpense.startYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}
              >
                {editingExpenseId && (
                  <Button onClick={handleCancelEditExpense}>Cancel</Button>
                )}
                <Button variant="contained" onClick={handleAddOrUpdateExpense}>
                  {editingExpenseId ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Projected Monthly Income vs. Expenses Until Retirement
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={projectionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(val) => formatCurrency(val)} />
              <RechartsTooltip formatter={(value, name) => [formatCurrency(value), name]} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Income" 
                name="Projected Income" 
                stroke={theme.palette.success.main} 
                fill={theme.palette.success.main}
                fillOpacity={0.3}
                strokeWidth={2} 
                dot={false} 
              />
              <Area 
                type="monotone" 
                dataKey="Expenses" 
                name="Projected Expenses" 
                stroke={theme.palette.error.main} 
                fill={theme.palette.error.main}
                fillOpacity={0.3}
                strokeWidth={2} 
                dot={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
