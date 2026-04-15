import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditableGoalItem from "../common/EditableGoalItem";
import GoalForm from "./GoalForm";
import {
  selectGoals,
  selectConsiderInflation,
  selectCurrentAge,
  selectRetirementAge,
  selectProfileExpenses,
  addGoal,
  updateGoal,
  deleteGoal,
  setConsiderInflation,
  // Removed specific investment plan actions as they are now part of goal update
  selectGeneralInflationRate,
  selectEducationInflationRate,
  selectCareerGrowthRate,
  selectCurrentSurplus,
  selectTotalMonthlyIncome,
  selectTotalMonthlyGoalContributions,
} from "../../store/profileSlice";
import { selectCurrency } from "../../store/emiSlice";
import { selectCalculatedValues } from "../../utils/emiCalculator";
import { useSelector, useDispatch } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import {
  calculateSIP,
  calculateStepUpSIP,
  calculateLumpsum,
} from "../../utils/financialCalculations";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      // timeout is in milliseconds (500ms = 0.5 seconds)
      timeout={500}
    />
  );
});

export default function FutureGoalsTab() {
  const dispatch = useDispatch();

  const goals = useSelector(selectGoals) || [];
  const considerInflation = useSelector(selectConsiderInflation) || false;
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const profileExpenses = useSelector(selectProfileExpenses) || [];
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0;
  const educationInflationRate = useSelector(selectEducationInflationRate) || 0;
  const careerGrowthRate = useSelector(selectCareerGrowthRate) || 0;
  const totalMonthlyIncome = useSelector(selectTotalMonthlyIncome) || 0;
  const totalMonthlyGoalContributions =
    useSelector(selectTotalMonthlyGoalContributions) || 0;
  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const currency = useSelector(selectCurrency);

  const currentSurplus = useSelector(selectCurrentSurplus) || 0;

  const [realValueToggle, setRealValueToggle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null); // Store the goal object being edited
  const [modalTitle, setModalTitle] = useState("Add New Goal"); // New state for modal title

  // State to hold the form data from GoalForm before saving
  const [currentGoalFormData, setCurrentGoalFormData] = useState(null);

  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const currentYear = new Date().getFullYear();

  // Helper function to calculate required investment for a single plan
  const calculateRequiredInvestment = useCallback(
    (
      targetAmount,
      yearsToGoal,
      investmentPlanType,
      expectedReturn,
      stepUpRate = 0,
    ) => {
      if (yearsToGoal <= 0) return targetAmount; // Or 0 if it's a lumpsum and target is now

      const annualReturnRate = expectedReturn / 100;

      if (investmentPlanType === "sip") {
        return calculateSIP(targetAmount, yearsToGoal, annualReturnRate);
      } else if (investmentPlanType === "step_up_sip") {
        return calculateStepUpSIP(
          targetAmount,
          yearsToGoal,
          annualReturnRate,
          stepUpRate / 100,
        );
      } else if (investmentPlanType === "lumpsum") {
        return 0; // Lumpsum doesn't have a monthly contribution
      }
      return 0;
    },
    [],
  );

  const handleGoalFormChange = useCallback((goalData) => {
    // This function is called by GoalForm whenever its internal state changes
    setCurrentGoalFormData(goalData);
  }, []);

  const handleModalSave = useCallback(() => {
    if (!currentGoalFormData) return;

    const goalToSave = {
      ...currentGoalFormData,
      category: currentGoalFormData.category || "general",
    };

    // Calculate monthly contribution for each investment plan
    const updatedInvestmentPlans = (goalToSave.investmentPlans || []).map(
      (plan) => {
        const yearsToGoal = goalToSave.targetYear - currentYear;
        const expectedReturn = 12; // TODO: Make this configurable or part of the plan

        let monthlyContribution = 0;
        if (plan.type !== "lumpsum") {
          monthlyContribution = calculateRequiredInvestment(
            goalToSave.targetAmount,
            yearsToGoal,
            plan.type,
            expectedReturn,
            plan.stepUpRate,
          );
        }
        return {
          ...plan,
          monthlyContribution: Math.round(monthlyContribution),
        };
      },
    );

    const finalGoal = {
      ...goalToSave,
      investmentPlans: updatedInvestmentPlans,
    };

    if (editingGoal && editingGoal.id) {
      dispatch(updateGoal({ ...finalGoal, id: editingGoal.id }));
    } else {
      dispatch(addGoal({ ...finalGoal, id: Date.now() }));
    }
    handleCloseModal();
  }, [
    dispatch,
    editingGoal,
    currentGoalFormData,
    currentYear,
    calculateRequiredInvestment,
  ]);

  const handleOpenModalForEdit = useCallback((goal) => {
    setEditingGoal(goal);
    setCurrentGoalFormData(goal); // Initialize form data with existing goal, including investmentPlans
    setModalTitle(`Edit ${goal.name}`);
    setOpenModal(true);
  }, []);

  const handleOpenModalForNew = useCallback(() => {
    setEditingGoal(null);
    setCurrentGoalFormData({
      // Default values for a new goal
      name: "",
      targetAmount: 0,
      targetYear: currentYear + 5, // Default to 5 years from now
      category: "general",
      investmentPlans: [], // GoalForm's useEffect will add a default plan
    });
    setModalTitle("Add New Goal");
    setOpenModal(true);
  }, [currentYear]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setEditingGoal(null);
    setCurrentGoalFormData(null);
    setModalTitle("Add New Goal");
  }, []);

  const applyRetirementGoal = useCallback(() => {
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement < 0) {
      alert(
        "Retirement age is in the past. Please adjust your retirement age.",
      );
      return;
    }

    const monthlyBasicExpenses = profileExpenses
      .filter((e) => e.category === "basic")
      .reduce((sum, e) => sum + e.amount, 0);
    let yearlyExpenses = monthlyBasicExpenses * 12;

    let targetAmount = Math.round(yearlyExpenses / 0.04);

    if (considerInflation && yearsToRetirement > 0) {
      targetAmount =
        targetAmount * Math.pow(1 + generalInflationRate, yearsToRetirement);
    }

    setEditingGoal(null); // Ensure it's treated as a new goal
    setCurrentGoalFormData({
      name: "Retirement",
      targetAmount: targetAmount,
      targetYear: currentYear + (yearsToRetirement > 0 ? yearsToRetirement : 1),
      category: "retirement",
      investmentPlans: [], // GoalForm's useEffect will add a default plan
    });
    setModalTitle("Add Retirement Goal"); // Set modal title
    setOpenModal(true);
  }, [
    retirementAge,
    currentAge,
    profileExpenses,
    considerInflation,
    generalInflationRate,
    currentYear,
  ]);

  const applyEducationGoal = useCallback(() => {
    const yearsToCollege = 18; // Assuming child is 0 and college starts at 18
    let targetAmount = 5000000;

    if (considerInflation && yearsToCollege > 0) {
      targetAmount =
        targetAmount * Math.pow(1 + educationInflationRate, yearsToCollege);
    }

    setEditingGoal(null); // Ensure it's treated as a new goal
    setCurrentGoalFormData({
      name: "Child's Higher Education",
      targetAmount: Math.round(targetAmount),
      targetYear: currentYear + (yearsToCollege > 0 ? yearsToCollege : 1),
      category: "education",
      investmentPlans: [], // GoalForm's useEffect will add a default plan
    });
    setModalTitle("Add Child's Higher Education Goal"); // Set modal title
    setOpenModal(true);
  }, [considerInflation, educationInflationRate, currentYear]);

  const applyEmergencyFundGoal = useCallback(() => {
    const totalMonthlyOutflow =
      profileExpenses.reduce((sum, e) => sum + e.amount, 0) +
      monthlyEmi +
      totalMonthlyGoalContributions;
    const targetAmount = Math.round(totalMonthlyOutflow * 6);

    const yearsToGoal = 1;

    setEditingGoal(null); // Ensure it's treated as a new goal
    setCurrentGoalFormData({
      name: "Emergency Fund",
      targetAmount: targetAmount,
      targetYear: currentYear + yearsToGoal,
      category: "safety",
      investmentPlans: [], // GoalForm's useEffect will add a default plan
    });
    setModalTitle("Add Emergency Fund Goal"); // Set modal title
    setOpenModal(true);
  }, [
    profileExpenses,
    monthlyEmi,
    totalMonthlyGoalContributions,
    currentYear, // generalInflationRate was not used here, removed
  ]);

  const wealthData = useMemo(() => {
    const maxGoalYear = goals.reduce(
      (max, g) => Math.max(max, g.targetYear),
      currentYear + 10,
    );
    const endYear = Math.max(
      maxGoalYear,
      currentYear + (retirementAge - currentAge),
      currentYear + 10,
    );

    let currentPrincipalInvested = 0;
    let currentMarketGains = 0;
    let currentBonusGains = 0;
    let currentTotalWealth = 0;

    const data = [];

    // Updated totalActiveGoalSips to sum contributions from all investment plans
    const totalActiveGoalSips = goals.reduce((acc, goal) => {
      return (
        acc +
        (goal.investmentPlans || []).reduce((planAcc, plan) => {
          // Only consider plans that are not lumpsum and have a monthly contribution
          if (plan.type !== "lumpsum" && plan.monthlyContribution > 0) {
            // Changed investmentType to type
            return planAcc + plan.monthlyContribution;
          }
          return planAcc;
        }, 0)
      );
    }, 0);

    let currentMonthlyIncome = totalMonthlyIncome;
    let currentMonthlyOutflowExcludingGoals =
      profileExpenses.reduce((acc, exp) => acc + exp.amount, 0) + monthlyEmi;

    for (let year = currentYear; year <= endYear; year++) {
      const yearsFromNow = year - currentYear;
      const annualInvestmentReturn = 0.08;
      const annualBonusReturn = 0.02;

      if (yearsFromNow > 0 && yearsFromNow % 1 === 0) {
        currentMonthlyIncome *= 1 + careerGrowthRate;
      }

      const annualInvestableSurplus =
        (currentMonthlyIncome -
          currentMonthlyOutflowExcludingGoals -
          totalActiveGoalSips) *
        12;

      if (yearsFromNow > 0) {
        currentMarketGains = currentTotalWealth * annualInvestmentReturn;

        const incomeIncreaseThisYear =
          currentMonthlyIncome * 12 -
          totalMonthlyIncome *
            Math.pow(1 + careerGrowthRate, yearsFromNow - 1) *
            12;
        currentBonusGains = incomeIncreaseThisYear * annualBonusReturn;

        currentPrincipalInvested = annualInvestableSurplus;

        currentTotalWealth =
          (currentTotalWealth + currentPrincipalInvested) *
          (1 + annualInvestmentReturn);
      } else {
        currentPrincipalInvested =
          (currentMonthlyIncome -
            currentMonthlyOutflowExcludingGoals -
            totalActiveGoalSips) *
          12;
        currentTotalWealth = currentPrincipalInvested;
      }

      let displayWealth = currentTotalWealth;
      let displayPrincipal = currentPrincipalInvested;
      let displayMarketGains = currentMarketGains;
      let displayBonusGains = currentBonusGains;

      if (realValueToggle && yearsFromNow > 0) {
        displayWealth =
          currentTotalWealth / Math.pow(1 + generalInflationRate, yearsFromNow);
        displayPrincipal =
          currentPrincipalInvested /
          Math.pow(1 + generalInflationRate, yearsFromNow);
        displayMarketGains =
          currentMarketGains / Math.pow(1 + generalInflationRate, yearsFromNow);
        displayBonusGains =
          currentBonusGains / Math.pow(1 + generalInflationRate, yearsFromNow);
      }

      const cumulativeLoanCost = monthlyEmi * Math.min(yearsFromNow * 12, 240);

      const totalGoalsThisYear = goals.reduce((sum, g) => {
        if (g.targetYear === year) {
          let target = g.targetAmount;
          if (considerInflation && g.category === "education") {
            target =
              target * Math.pow(1 + educationInflationRate, yearsFromNow);
          } else if (considerInflation) {
            target = target * Math.pow(1 + generalInflationRate, yearsFromNow);
          }
          return sum + target;
        }
        return sum;
      }, 0);

      data.push({
        year,
        "Principal Invested": Math.round(displayPrincipal),
        "Market Gains": Math.round(displayMarketGains),
        "Bonus Gains": Math.round(displayBonusGains),
        "Total Wealth": Math.round(displayWealth),
        "Loan Cost": Math.round(cumulativeLoanCost),
        "Goals Target":
          totalGoalsThisYear > 0 ? Math.round(totalGoalsThisYear) : null,
      });
    }
    return data;
  }, [
    goals,
    currentYear,
    retirementAge,
    totalMonthlyIncome,
    profileExpenses,
    monthlyEmi,
    careerGrowthRate,
    realValueToggle,
    considerInflation,
    generalInflationRate,
    educationInflationRate,
  ]);

  const breakEvenYear = useMemo(() => {
    const breakEvenPoint = wealthData.find(
      (d) => d["Total Wealth"] >= d["Goals Target"],
    );
    return breakEvenPoint ? breakEvenPoint.year : null;
  }, [wealthData]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {" "}
            {/* Removed alignItems="center" */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <TrendingUpIcon /> Smart Goal Templates
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button variant="outlined" onClick={applyRetirementGoal}>
                🎯 Retirement
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button variant="outlined" onClick={applyEducationGoal}>
                🎓 Child's Education
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button variant="outlined" onClick={applyEmergencyFundGoal}>
                🛟 Emergency Fund (6M)
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                onClick={handleOpenModalForNew}
                disabled={currentSurplus < 0}
              >
                New Goal
              </Button>
            </Grid>
          </Grid>

          {currentSurplus < 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Cannot add new goals. Your current surplus is negative.
            </Alert>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        {/* Your Goals Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Goals ({goals.length})
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={considerInflation}
                    onChange={(e) =>
                      dispatch(setConsiderInflation(e.target.checked))
                    }
                  />
                }
                label={
                  <Typography variant="caption">
                    Inflation ({generalInflationRate * 100}%)
                  </Typography>
                }
              />
            </Box>

            {goals && goals.length > 0 ? (
              goals.map((g) => (
                <EditableGoalItem
                  key={g.id}
                  goal={g}
                  currency={currency}
                  currentYear={currentYear}
                  considerInflation={considerInflation}
                  onEdit={handleOpenModalForEdit} // Pass the new handler
                  onDelete={(id) => dispatch(deleteGoal(id))}
                  // Removed onInvestmentChange prop
                  investmentAmount={(g.investmentPlans || []).reduce(
                    (sum, plan) => sum + (plan.monthlyContribution || 0),
                    0,
                  )}
                />
              ))
            ) : (
              <Paper
                sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}
              >
                <Typography variant="body2" color="textSecondary">
                  No goals yet. Create one or use a template!
                </Typography>
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Wealth Projection vs Goals
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={realValueToggle}
                      onChange={(e) => setRealValueToggle(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="caption">
                      Show Real Value (Inflation Adjusted)
                    </Typography>
                  }
                />
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={wealthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(val) => `${currency}${val / 100000}L`}
                  />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name === "Goals Target")
                        return [formatCurrency(value), "Goals Target"];
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Principal Invested"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="Market Gains"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="Bonus Gains"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                  <Line
                    type="monotone"
                    dataKey="Goals Target"
                    stroke="#ff7c7c"
                    strokeWidth={2}
                    dot={false}
                  />

                  {breakEvenYear ? (
                    <ReferenceLine
                      x={breakEvenYear}
                      stroke="green"
                      strokeDasharray="3 3"
                      label="Breakeven Point"
                    />
                  ) : null}
                </AreaChart>
              </ResponsiveContainer>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 2, display: "block" }}
              >
                * Projected wealth assumes annual investment return of 8%. Bonus
                gains from income increments are estimated.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Goal Distribution & Investments
              </Typography>
              {goals.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={goals.map((g) => ({
                      name: g.name.substring(0, 10),
                      amount: g.targetAmount,
                      inflated:
                        considerInflation && g.targetYear > currentYear
                          ? g.targetAmount *
                            Math.pow(
                              1 +
                                (g.category === "education"
                                  ? educationInflationRate
                                  : generalInflationRate),
                              g.targetYear - currentYear,
                            )
                          : g.targetAmount,
                      // monthlyContribution now sums all plans
                      monthlyContribution: (g.investmentPlans || []).reduce(
                        (sum, plan) => sum + (plan.monthlyContribution || 0),
                        0,
                      ),
                      year: g.targetYear,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(val) => `${currency}${val / 100000}L`}
                    />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        if (name === "amount")
                          return [formatCurrency(value), "Target Amount"];
                        if (name === "inflated")
                          return [formatCurrency(value), "Inflation-Adjusted"];
                        if (name === "monthlyContribution")
                          return [formatCurrency(value), "Monthly Investment"];
                        return [formatCurrency(value), name];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill={COLORS[0]}
                      name="Target Amount"
                    />
                    {considerInflation && (
                      <Bar
                        dataKey="inflated"
                        fill={COLORS[1]}
                        name="Inflation-Adjusted"
                      />
                    )}
                    {goals.some((g) =>
                      (g.investmentPlans || []).some(
                        (plan) => (plan.monthlyContribution || 0) > 0,
                      ),
                    ) && (
                      <Bar
                        dataKey="monthlyContribution"
                        fill={COLORS[2]}
                        name="Monthly Investment"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No goals added yet
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* GoalForm Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        slots={{
          transition: Transition,
        }}
        fullScreen
        sx={{
          marginTop: 10,
        }}
      >
        <DialogTitle>
          {modalTitle}{" "}
          <CloseIcon onClick={handleCloseModal} sx={{ float: "right" }} />
        </DialogTitle>

        <DialogContent dividers>
          {currentGoalFormData && ( // Only render GoalForm if there's data
            <GoalForm
              goal={currentGoalFormData} // Pass the current form data
              currentYear={currentYear}
              onSave={handleGoalFormChange} // GoalForm updates its internal state, then passes it up
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleModalSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
