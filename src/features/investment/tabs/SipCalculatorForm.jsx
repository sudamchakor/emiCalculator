import React, { useEffect, useCallback } from "react"; // Added useCallback
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";
// Removed: import { calculateSIP } from "../../../utils/financialCalculations"; // Import the utility function

const SipCalculatorForm = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { monthlyContribution, expectedReturnRate, timePeriod } = sharedState;

  // Wrapped calculateSip in useCallback to stabilize its reference
  const calculateSip = useCallback(() => {
    const P = monthlyContribution;
    const years = timePeriod;
    const annualRate = expectedReturnRate / 100;

    const n = years * 12; // Total number of months
    const i = annualRate / 12; // Monthly rate of return

    let totalValue = 0;
    if (i > 0) {
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      totalValue = P * n; // Simple sum if rate is 0
    }

    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    // Generate data for chart
    let chartData = [];
    let currentInvested = 0;
    // Removed: let currentTotalValue = 0; // This variable was assigned but never used

    for (let year = 1; year <= years; year++) {
      currentInvested = P * year * 12; // Total invested up to this year
      const months = year * 12;
      let yearlyTotalValue = 0;
      if (i > 0) {
        yearlyTotalValue = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      } else {
        yearlyTotalValue = P * months;
      }

      chartData.push({
        year: year,
        invested: Math.round(currentInvested),
        returns: Math.round(yearlyTotalValue - currentInvested),
        total: Math.round(yearlyTotalValue)
      });
    }

    onCalculate({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      monthlyContribution: monthlyContribution,
      chartData: chartData
    });
  }, [monthlyContribution, expectedReturnRate, timePeriod, onCalculate]); // Added onCalculate to dependencies

  useEffect(() => {
    calculateSip();
  }, [calculateSip]); // Added calculateSip to dependencies

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        SIP Details
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
              onChange={(e) => onSharedStateChange("monthlyContribution", Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              placeholder="Enter monthly investment"
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
            <Typography gutterBottom>Expected Return Rate (p.a)</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              value={expectedReturnRate}
              onChange={(e) => onSharedStateChange("expectedReturnRate", Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              placeholder="Enter return rate"
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
              onChange={(e) => onSharedStateChange("timePeriod", Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">Yr</InputAdornment>,
              }}
              placeholder="Enter time period"
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

export default SipCalculatorForm;
