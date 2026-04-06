import React from "react";
import { Paper, Typography, Box, Grid, Divider } from "@mui/material";
import { useEmiContext } from "../context/EmiContext";
import "./TotalMonthlyPayment.scss";

const TotalMonthlyPayment = () => {
  const { calculatedValues, expenses, currency } = useEmiContext();

  const emi = calculatedValues.emi || 0;
  const monthlyTaxes = (calculatedValues.taxesYearlyInRs || 0) / 12;
  const monthlyInsurance = (calculatedValues.homeInsYearlyInRs || 0) / 12;
  const monthlyMaintenance = expenses.maintenance || 0;

  const totalMonthlyPayment =
    emi + monthlyTaxes + monthlyInsurance + monthlyMaintenance;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Total Monthly Payment Calculation
      </Typography>
      <Box className="total-monthly-box">
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="body1">Monthly EMI</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {emi.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Property Taxes (Monthly)</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyTaxes.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Home Insurance (Monthly)</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyInsurance.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Maintenance (Monthly)</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyMaintenance.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Divider className="total-monthly-divider" />

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6">Total Monthly Payment</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="right" color="primary">
              {currency}
              {totalMonthlyPayment.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TotalMonthlyPayment;
