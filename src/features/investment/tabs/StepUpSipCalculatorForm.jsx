import React, { useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";

const StepUpSipCalculatorForm = ({
  onCalculate,
  sharedState,
  onSharedStateChange,
}) => {
  const {
    monthlyContribution,
    stepUpPercentage,
    expectedReturnRate,
    timePeriod,
  } = sharedState;

  const calculateStepUpSip = useCallback(() => {
    let currentMonthlySIP = monthlyContribution;
    const i = expectedReturnRate / 100 / 12; // Monthly rate of return

    let totalInvestedAmount = 0;
    let finalCorpus = 0;
    let chartData = [];

    for (let year = 1; year <= timePeriod; year++) {
      // For this specific year, we invest currentMonthlySIP every month
      let yearlyInvested = currentMonthlySIP * 12;
      totalInvestedAmount += yearlyInvested;

      // The corpus from previous years grows by 1 year of interest
      finalCorpus = finalCorpus * Math.pow(1 + i, 12);

      // Add the maturity of this year's SIP
      let yearlySipMaturity =
        currentMonthlySIP * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
      finalCorpus += yearlySipMaturity;

      chartData.push({
        year: year,
        invested: Math.round(totalInvestedAmount),
        returns: Math.round(finalCorpus - totalInvestedAmount),
        total: Math.round(finalCorpus),
      });

      // Step up the SIP amount for next year
      currentMonthlySIP += currentMonthlySIP * (stepUpPercentage / 100);
    }

    const estimatedReturns = finalCorpus - totalInvestedAmount;

    onCalculate({
      investedAmount: Math.round(totalInvestedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(finalCorpus),
      monthlyContribution: monthlyContribution,
      chartData: chartData,
      totalWithdrawn: 0,
    });
  }, [
    monthlyContribution,
    stepUpPercentage,
    expectedReturnRate,
    timePeriod,
    onCalculate,
  ]);

  useEffect(() => {
    calculateStepUpSip();
  }, [calculateStepUpSip]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step-Up SIP Details
      </Typography>

      <Box sx={{ my: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom>Monthly Investment</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              value={monthlyContribution}
              onChange={(e) =>
                onSharedStateChange("monthlyContribution", Number(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={monthlyContribution}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("monthlyContribution", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom>Annual Step-Up</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              value={stepUpPercentage}
              onChange={(e) =>
                onSharedStateChange("stepUpPercentage", Number(e.target.value))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={stepUpPercentage}
          min={1}
          max={50}
          step={1}
          onChange={(e, val) => onSharedStateChange("stepUpPercentage", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom>Expected Return Rate (p.a)</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              value={expectedReturnRate}
              onChange={(e) =>
                onSharedStateChange("expectedReturnRate", Number(e.target.value))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={expectedReturnRate}
          min={1}
          max={30}
          step={0.1}
          onChange={(e, val) => onSharedStateChange("expectedReturnRate", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom>Time Period (Years)</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              value={timePeriod}
              onChange={(e) =>
                onSharedStateChange("timePeriod", Number(e.target.value))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">Yr</InputAdornment>,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={timePeriod}
          min={1}
          max={40}
          step={1}
          onChange={(e, val) => onSharedStateChange("timePeriod", val)}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default StepUpSipCalculatorForm;
