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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditableIncomeExpenseItem from "../common/EditableIncomeExpenseItem";
import BasicInfoDisplay from "./BasicInfoDisplay";
import BasicInfoEdit from "./BasicInfoEdit";
import SliderInput from "../common/SliderInput";
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
} from "../../store/profileSlice";
import { selectCalculatedValues, selectCurrency } from "../../store/emiSlice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

const COLORS = ["#ff6b6b", "#4ecdc4", "#9c27b0", "#2ecc71"];

export default function PersonalProfileTab() {
  const dispatch = useDispatch();

  const incomes = useSelector(selectIncomes) || [];
  const expenses = useSelector(selectProfileExpenses) || [];
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;

  const { emi, schedule, taxesYearlyInRs, homeInsYearlyInRs } = useSelector(
    selectCalculatedValues,
  );
  const currency = useSelector(selectCurrency);

  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
  });
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "basic",
    frequency: "monthly",
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);

  const handleAddIncome = () => {
    if (newIncome.name && newIncome.amount) {
      dispatch(
        addIncome({
          id: Date.now(),
          name: newIncome.name,
          amount: Number(newIncome.amount),
          type: "monthly",
          frequency: newIncome.frequency,
        }),
      );
      setNewIncome({ name: "", amount: "", frequency: "monthly" });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      dispatch(
        addExpense({
          id: Date.now(),
          name: newExpense.name,
          amount: Number(newExpense.amount),
          type: "monthly",
          category: newExpense.category,
          frequency: newExpense.frequency,
        }),
      );
      setNewExpense({
        name: "",
        amount: "",
        category: "basic",
        frequency: "monthly",
      });
    }
  };

  const totalIncome = incomes.reduce((acc, curr) => {
    let monthlyAmount = curr.amount;
    if (curr.frequency === "yearly") monthlyAmount = curr.amount / 12;
    else if (curr.frequency === "quarterly") monthlyAmount = curr.amount / 3;
    return acc + monthlyAmount;
  }, 0);

  const totalProfileExpenses = expenses.reduce((acc, curr) => {
    let monthlyAmount = curr.amount;
    if (curr.frequency === "yearly") monthlyAmount = curr.amount / 12;
    else if (curr.frequency === "quarterly") monthlyAmount = curr.amount / 3;
    return acc + monthlyAmount;
  }, 0);

  const totalMonthlyPayment =
    schedule?.length > 0
      ? schedule[0].totalPayment +
        taxesYearlyInRs / 12 +
        homeInsYearlyInRs / 12 +
        schedule[0].maintenance
      : emi + taxesYearlyInRs / 12 + homeInsYearlyInRs / 12;

  const totalExpensesIncludingLoan = totalProfileExpenses + totalMonthlyPayment;
  const investableSurplus = totalIncome - totalExpensesIncludingLoan;
  const isBudgetExceeded = investableSurplus < 0;
  const budgetWarning = isBudgetExceeded
    ? `Your spending (${currency}${totalExpensesIncludingLoan.toLocaleString("en-IN", { maximumFractionDigits: 0 })}) exceeds income (${currency}${totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}) by ${currency}${Math.abs(investableSurplus).toLocaleString("en-IN", { maximumFractionDigits: 0 })}. Consider reducing expenses or increasing income.`
    : "";

  const donutData = [
    { name: "Expenses", value: totalProfileExpenses },
    { name: "Loan EMI & Taxes", value: totalMonthlyPayment },
    {
      name: "Savings/Surplus",
      value: investableSurplus > 0 ? investableSurplus : 0,
    },
  ];

  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const handleSaveBasicInfo = (newCurrentAge, newRetirementAge) => {
    dispatch(setCurrentAge(newCurrentAge));
    dispatch(setRetirementAge(newRetirementAge));
    setEditingBasicInfo(false);
  };

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
          {incomes &&
            incomes.map((inc) => (
              <EditableIncomeExpenseItem
                key={inc.id}
                item={inc}
                currency={currency}
                onUpdate={(updated) => dispatch(updateIncome(updated))}
                onDelete={(id) => dispatch(deleteIncome(id))}
                totalIncome={totalIncome}
                isIncome={true}
              />
            ))}
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <SliderInput
                  label="Amount"
                  value={Number(newIncome.amount) || 0}
                  onChange={(val) =>
                    setNewIncome({ ...newIncome, amount: val })
                  }
                  min={0}
                  max={10000000}
                  step={1000}
                  showInput={true}
                />
              </Grid>
              <Grid item xs={12}>
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
                <Button
                  variant="contained"
                  onClick={handleAddIncome}
                  fullWidth
                  sx={{
                    width: "auto",
                  }}
                >
                  Add
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
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Cash Flow (Monthly)
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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
          {expenses &&
            expenses.map((exp) => (
              <EditableIncomeExpenseItem
                key={exp.id}
                item={exp}
                currency={currency}
                onUpdate={(updated) => dispatch(updateExpense(updated))}
                onDelete={(id) => dispatch(deleteExpense(id))}
                isExpense={true}
                isBudgetExceeded={isBudgetExceeded}
                budgetWarning={budgetWarning}
                totalIncome={totalIncome}
                totalExpenses={totalProfileExpenses}
              />
            ))}
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
            Add New Expense
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              alignItems: "center",
              bgcolor: "#f3e5f5",
              p: 1.5,
              borderRadius: 1,
              borderLeft: "4px solid #9c27b0",
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Total Loan Payment (Monthly)
              </Typography>
              <Typography variant="caption" color="textSecondary">
                EMI + Taxes + Maintenance
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700 }}>
              {formatCurrency(totalMonthlyPayment.toFixed(0))}
            </Typography>
          </Box>

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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <SliderInput
                  label="Amount"
                  value={Number(newExpense.amount) || 0}
                  onChange={(val) =>
                    setNewExpense({ ...newExpense, amount: val })
                  }
                  min={0}
                  max={10000000}
                  step={1000}
                  showInput={true}
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
                <Button
                  variant="contained"
                  onClick={handleAddExpense}
                  fullWidth
                  sx={{
                    width: "auto",
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
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
              {formatCurrency(totalExpensesIncludingLoan.toFixed(0))}
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
    </Grid>
  );
}
