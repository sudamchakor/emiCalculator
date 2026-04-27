import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Tooltip,
  Collapse,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditableIncomeExpenseItem from "../../../components/common/EditableIncomeExpenseItem";
import ReadOnlyItem from "../../../components/common/ReadOnlyItem";
import IncomeExpenseForm from "../../../components/common/IncomeExpenseForm";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";
import SliderInput from "../../../components/common/SliderInput";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIncomes,
  addIncome,
  deleteIncome,
  updateIncome,
  selectTotalMonthlyIncome,
  selectCareerGrowthRate,
  setCareerGrowthRate,
  selectProfileExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  selectTotalMonthlyExpenses,
  selectTotalMonthlyGoalContributions,
  selectIndividualGoalInvestmentContributions,
  selectGoals,
  selectCurrentSurplus,
  selectGeneralInflationRate,
  setGeneralInflationRate,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";

export default function FinancialSection({
  isIncome,
  onEditGoal,
  isModal,
  onCloseModal,
  isSmallScreen,
}) {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  // Income specific selectors
  const incomes = useSelector(selectIncomes) || [];
  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);

  // Expense specific selectors
  const expenses = useSelector(selectProfileExpenses) || [];
  const totalProfileExpenses = useSelector(selectTotalMonthlyExpenses);
  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const individualGoalInvestments = useSelector(
    selectIndividualGoalInvestmentContributions,
  );
  const goals = useSelector(selectGoals) || [];
  const investableSurplus = useSelector(selectCurrentSurplus);
  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const generalInflationRate = useSelector(selectGeneralInflationRate);

  const items = isIncome ? incomes : expenses;
  const totalAmount = isIncome
    ? totalIncome
    : totalProfileExpenses + (monthlyEmi || 0) + totalMonthlyGoalContributions;

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingInitialData, setEditingInitialData] = useState({});
  const [expandedGoals, setExpandedGoals] = useState({});
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingInitialData({});
  };

  const handleAddOrUpdate = (formData) => {
    const action = editingItemId
      ? isIncome
        ? updateIncome
        : updateExpense
      : isIncome
        ? addIncome
        : addExpense;
    const payload = editingItemId
      ? { ...formData, id: editingItemId }
      : { ...formData, id: Date.now() };
    dispatch(action(payload));
    handleCancelEdit();
    if (isModal && onCloseModal) onCloseModal();
  };

  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const isBudgetExceeded = !isIncome && investableSurplus < 0;
  const budgetWarning = isBudgetExceeded
    ? `Your spending (${formatCurrency(totalAmount)}) exceeds income (${formatCurrency(totalIncome)}) by ${formatCurrency(Math.abs(investableSurplus))}. Consider reducing expenses or increasing income.`
    : "";

  const sectionTitle = isIncome ? "Income Details" : "Expenses Details";
  const formTitle = editingItemId
    ? `Edit ${isIncome ? "Income" : "Expense"}`
    : `Add New ${isIncome ? "Income" : "Expense"}`;
  const totalLabel = isIncome
    ? "Total Monthly Income"
    : "Total Monthly Expenses";

  if (isIncome) {
    const careerGrowthRate =
      typeof careerGrowthRaw === "object"
        ? careerGrowthRaw.value
        : careerGrowthRaw || 0;
    const careerGrowthType =
      typeof careerGrowthRaw === "object"
        ? careerGrowthRaw.type
        : "percentage";

    return (
      <Paper
        sx={{
          p: isModal ? 4 : 3,
          height: "100%",
          overflowY: "auto",
          maxHeight: isModal ? "auto" : "85vh", // Allow scrolling for the entire section
          ...(isModal && {
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
          }),
        }}
      >
        {!isModal && (
          <>
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
              {sectionTitle}
              <InfoIcon fontSize="small" sx={{ opacity: 0.6 }} />
            </Typography>
            <Box sx={{ pr: 1 }}>
              {items.map((item) => (
                <EditableIncomeExpenseItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onUpdate={(updatedItem) =>
                    dispatch(updateIncome(updatedItem))
                  }
                  onDelete={(id) => dispatch(deleteIncome(id))}
                  isIncome={true}
                  totalIncome={totalIncome}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {(!isSmallScreen || isModal) && (
          <>
            <Box
              onClick={() => setIsIncomeFormOpen(!isIncomeFormOpen)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                mb: isIncomeFormOpen ? 2 : 0,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formTitle}
              </Typography>
              <IconButton size="small" disableRipple sx={{ p: 0 }}>
                {isIncomeFormOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={isIncomeFormOpen}>
              <Box sx={{ pb: 1 }}>
                <IncomeExpenseForm
                  initialData={editingInitialData}
                  isExpense={false}
                  onSave={(data) => {
                    handleAddOrUpdate(data);
                    setIsIncomeFormOpen(false);
                  }}
                  onCancel={
                    editingItemId || isModal
                      ? handleCancelEdit
                      : () => setIsIncomeFormOpen(false)
                  }
                  submitLabel={editingItemId ? "Update" : "Add"}
                  isInline={false}
                />
              </Box>
            </Collapse>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {!isModal && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {totalLabel}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "success.main" }}
              >
                {formatCurrency(totalAmount.toFixed(0))}
              </Typography>
            </Box>
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
              value={
                careerGrowthType === "percentage"
                  ? (careerGrowthRate * 100).toFixed(2)
                  : careerGrowthRate
              }
              onAmountChange={(e) => {
                const val = Number(e.target.value);
                dispatch(
                  setCareerGrowthRate({
                    type: careerGrowthType,
                    value:
                      careerGrowthType === "percentage" ? val / 100 : val,
                  }),
                );
              }}
              unitValue={careerGrowthType === "percentage" ? "%" : currency}
              onUnitChange={(e) => {
                const newUnit = e.target.value;
                const newType = newUnit === "%" ? "percentage" : "fixed";
                dispatch(
                  setCareerGrowthRate({
                    type: newType,
                    value: newType === "percentage" ? 0.1 : 50000,
                  }),
                );
              }}
              unitOptions={[
                { value: "%", label: "%" },
                { value: currency, label: currency },
              ]}
            />
          </>
        )}
      </Paper>
    );
  }

  // --- EXPENSE SECTION ---
  const toggleGoalExpanded = (goalId) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const handleHomeLoanEmiClick = () => {
    alert(
      "Navigating to Home Loan EMI edit mode (requires further implementation)",
    );
  };

  const handleReadOnlyDelete = (id) => {
    alert(
      `Deletion of item with ID ${id} is not directly supported from this view.`,
    );
  };

  const groupedGoalInvestments = individualGoalInvestments.reduce(
    (acc, inv) => {
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
    },
    {},
  );

  return (
    <Grid container spacing={3}>
      {!isModal && (
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
              {sectionTitle}
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
                <ReadOnlyItem
                  item={{
                    id: "home-loan-emi",
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
                  onConfirmDelete={handleReadOnlyDelete}
                  deletionImpactMessage="Deleting Home Loan EMI will remove it from your expenses and cash flow calculations. To adjust the EMI, please use the EMI Calculator tab."
                  isReadOnly={true}
                  onClick={handleHomeLoanEmiClick}
                />
              )}
              {individualGoalInvestments.length > 0 && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Goal Investments
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {Object.values(groupedGoalInvestments).map((group) => {
                      const groupMonthlyTotal = group.investments.reduce(
                        (sum, inv) => {
                          let monthly = inv.amount || 0;
                          if (inv.frequency === "yearly") monthly /= 12;
                          else if (inv.frequency === "quarterly") monthly /= 3;
                          return sum + monthly;
                        },
                        0,
                      );
                      const isExpanded = expandedGoals[group.goalId];

                      return (
                        <Grid item xs={12} key={group.goalId}>
                          <Box
                            sx={{
                              mb: 0,
                              p: 1.5,
                              bgcolor: "rgba(0,0,0,0.02)",
                              borderRadius: 2,
                            }}
                          >
                            <Grid
                              container
                              spacing={1}
                              alignItems="center"
                              onClick={() => toggleGoalExpanded(group.goalId)}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { opacity: 0.8 },
                              }}
                            >
                              <Grid item xs={12} sm={8}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.secondary",
                                  }}
                                >
                                  {group.goalName} ({group.investments.length}{" "}
                                  {group.investments.length === 1
                                    ? "plan"
                                    : "plans"}
                                  )
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={3}
                                sx={{ textAlign: { xs: "left", sm: "right" } }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.secondary",
                                  }}
                                >
                                  {formatCurrency(groupMonthlyTotal)} / mo
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={1}
                                sx={{ textAlign: { xs: "left", sm: "right" } }}
                              >
                                <IconButton
                                  size="small"
                                  disableRipple
                                  sx={{ p: 0 }}
                                >
                                  {isExpanded ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                </IconButton>
                              </Grid>
                            </Grid>
                            <Collapse in={isExpanded}>
                              <Box sx={{ mt: 1.5 }}>
                                {group.investments.map((investment) => (
                                  <ReadOnlyItem
                                    key={investment.id}
                                    item={investment}
                                    currency={currency}
                                    isExpense={true}
                                    totalIncome={totalIncome}
                                    expenseRatio={
                                      totalIncome > 0
                                        ? (investment.amount / totalIncome) *
                                          100
                                        : 0
                                    }
                                    getExpenseColor={() => "default"}
                                    formatCurrency={formatCurrency}
                                    onConfirmDelete={handleReadOnlyDelete}
                                    deletionImpactMessage={`To stop this investment, please edit or delete the associated goal in the Future Goals tab.`}
                                    isReadOnly={true}
                                    onClick={() =>
                                      onEditGoal(investment.goalId)
                                    }
                                  />
                                ))}
                              </Box>
                            </Collapse>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
              {items.map((item) => (
                <EditableIncomeExpenseItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onUpdate={(updatedItem) =>
                    dispatch(updateExpense(updatedItem))
                  }
                  onDelete={(id) => dispatch(deleteExpense(id))}
                  isExpense={true}
                  isBudgetExceeded={isBudgetExceeded}
                  budgetWarning={budgetWarning}
                  totalIncome={totalIncome}
                />
              ))}
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
                {totalLabel}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: isBudgetExceeded ? "error.main" : "text.primary",
                  fontSize: isBudgetExceeded ? "1.2rem" : "1rem",
                }}
              >
                {formatCurrency(totalAmount.toFixed(0))}
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
              Expense Inflation (Year-on-Year)
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SliderInput
                label="Expected Annual Inflation Rate (%)"
                value={(generalInflationRate * 100).toFixed(1)}
                onChange={(val) => {
                  dispatch(setGeneralInflationRate(val / 100));
                }}
                min={0}
                max={20}
                step={0.1}
                isInline={false}
              />
            </Box>
          </Paper>
        </Grid>
      )}
      {(!isSmallScreen || isModal) && (
        <Grid item xs={12} md={isModal ? 12 : 6}>
          <Paper
            sx={{
              p: isModal ? 4 : 3,
              height: "100%",
              ...(isModal && {
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 2,
              }),
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {formTitle}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mb: 2, display: "block" }}
            >
              To add an "initial funding" source, simply use this form to add a
              new income stream with a descriptive name (e.g., "Starting
              Capital") and its monthly amount.
            </Typography>
            <IncomeExpenseForm
              initialData={editingInitialData}
              isExpense={true}
              onSave={handleAddOrUpdate}
              onCancel={
                editingItemId || isModal ? handleCancelEdit : undefined
              }
              submitLabel={editingItemId ? "Update" : "Add"}
              isInline={false}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
