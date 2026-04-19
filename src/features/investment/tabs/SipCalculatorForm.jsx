import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";
import { calculateSIP } from "../../../utils/financialCalculations"; // Import the utility function

const SipCalculatorForm = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { monthlyInvestment, expectedReturnRate, timePeriod } = sharedState;

  useEffect(() => {
    calculateSip();
  }, [monthlyInvestment, expectedReturnRate, timePeriod]);

  const calculateSip = () => {
    const P = monthlyInvestment;
    const years = timePeriod;
    const annualRate = expectedReturnRate / 100;

    // Calculate total future value using the utility function
    // Note: calculateSIP returns the *monthly contribution needed* for a target.
    // Here, we have the monthly contribution and need the *future value*.
    // So we need to reverse the formula or use a future value of SIP formula.
    // Let's implement FV of SIP here directly for consistency with the chart data generation.

    const n = years * 12; // Total number of months
    const i = annualRate / 12; // Monthly rate of return

    let totalValue = 0;
    if (i > 0) {
      // FV = P * ({[1 + i]^n - 1} / i) * (1 + i) - SIP at beginning of period
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      totalValue = P * n; // Simple sum if rate is 0
    }

    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    // Generate data for chart
    let chartData = [];
    let currentInvested = 0;
    let currentTotalValue = 0;

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
      chartData: chartData
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        SIP Details
      </Typography>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Monthly Investment</Typography>
          <TextField
            size="small"
            value={monthlyInvestment}
            onChange={(e) => onSharedStateChange("monthlyInvestment", Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            placeholder="Enter monthly investment"
            sx={{ width: 120 }}
          />
        </Grid>
        <Slider
          value={monthlyInvestment}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("monthlyInvestment", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Expected Return Rate (p.a)</Typography>
          <TextField
            size="small"
            value={expectedReturnRate}
            onChange={(e) => onSharedStateChange("expectedReturnRate", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            placeholder="Enter return rate"
            sx={{ width: 100 }}
          />
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Time Period (Years)</Typography>
          <TextField
            size="small"
            value={timePeriod}
            onChange={(e) => onSharedStateChange("timePeriod", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">Yr</InputAdornment>,
            }}
            placeholder="Enter time period"
            sx={{ width: 100 }}
          />
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
