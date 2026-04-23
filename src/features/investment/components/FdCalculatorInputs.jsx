import React from "react";
import { Box, Typography, MenuItem, TextField, Grid } from "@mui/material";
import SliderInput from "../../../components/common/SliderInput";

const FdCalculatorInputs = ({
  principalAmount,
  interestRate,
  timePeriod,
  compoundingFrequency,
  onSharedStateChange,
}) => {
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
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom>Compounding Frequency</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FdCalculatorInputs;
