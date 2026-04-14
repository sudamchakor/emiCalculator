import React, { useEffect } from "react";
import { Box, Typography, MenuItem, TextField } from "@mui/material";
import { calculateFD } from "../../../utils/investmentCalculations";
import SliderInput from "../../common/SliderInput";

const FdCalculatorForm = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { principalAmount, interestRate, timePeriod, compoundingFrequency } = sharedState || {};

  useEffect(() => {
    handleCalculate();
  }, [principalAmount, interestRate, timePeriod, compoundingFrequency]);

  const handleCalculate = () => {
    if (principalAmount > 0 && interestRate > 0 && timePeriod > 0) {
      try {
        const result = calculateFD(principalAmount, interestRate, timePeriod, compoundingFrequency);
        if (typeof onCalculate === "function") {
          onCalculate({
            investedAmount: principalAmount,
            estimatedReturns: result.totalValue - principalAmount,
            totalValue: result.totalValue,
            chartData: result.chartData,
          });
        }
      } catch (error) {
        console.error("Error calculating FD:", error);
      }
    } else {
      if (typeof onCalculate === "function") {
        onCalculate({
          investedAmount: 0,
          estimatedReturns: 0,
          totalValue: 0,
          chartData: [],
        });
      }
    }
  };

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6" gutterBottom>
        Fixed Deposit Calculator
      </Typography>

      <SliderInput
        label="Principal Amount"
        value={principalAmount}
        onChange={(val) => onSharedStateChange("principalAmount", val)}
        min={0}
        max={10000000}
        step={5000}
        showInput={true}
      />

      <SliderInput
        label="Interest Rate (%)"
        value={interestRate}
        onChange={(val) => onSharedStateChange("interestRate", val)}
        min={0}
        max={15}
        step={0.1}
        showInput={true}
      />

      <SliderInput
        label="Time Period (Years)"
        value={timePeriod}
        onChange={(val) => onSharedStateChange("timePeriod", val)}
        min={0}
        max={30}
        step={1}
        showInput={true}
      />

      <Box sx={{ px: 2 }}>
        <TextField
          select
          label="Compounding Frequency"
          name="compoundingFrequency"
          fullWidth
          size="small"
          value={compoundingFrequency}
          onChange={(e) => onSharedStateChange("compoundingFrequency", e.target.value)}
        >
          <MenuItem value="annually">Annually</MenuItem>
          <MenuItem value="half-annually">Half-Annually</MenuItem>
          <MenuItem value="quarterly">Quarterly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
};

export default FdCalculatorForm;
