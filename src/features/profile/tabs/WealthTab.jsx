import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfileExpenses,
  selectTotalMonthlyGoalContributions,
  selectCurrentSurplus,
  selectCareerGrowthRate,
  selectGeneralInflationRate,
  setCareerGrowthRate,
  setGeneralInflationRate,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import CashFlowDonutChart from "../components/CashFlowDonutChart";
import WealthProjectionEngine from "../components/WealthProjectionEngine";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";
import SliderInput from "../../../components/common/SliderInput";

export default function WealthTab() {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const expenses = useSelector(selectProfileExpenses) || [];
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate =
    typeof careerGrowthRaw === "object"
      ? careerGrowthRaw.value
      : careerGrowthRaw || 0;
  const careerGrowthType =
    typeof careerGrowthRaw === "object" ? careerGrowthRaw.type : "percentage";
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0.06;

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);

  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const investableSurplus = useSelector(selectCurrentSurplus);

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

  return (
    <Grid container spacing={3}>
      {/* Career Growth and Expense Inflation Row */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
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
                  value: careerGrowthType === "percentage" ? val / 100 : val,
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
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
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

      {/* Wealth Projection Engine */}
      <Grid item xs={12}>
        <WealthProjectionEngine />
      </Grid>

      {/* Donut Chart */}
      <Grid item xs={12} md={6}>
        <Box sx={{ width: "100%", minHeight: 300 }}>
          <CashFlowDonutChart donutData={donutData} />
        </Box>
      </Grid>
    </Grid>
  );
}
