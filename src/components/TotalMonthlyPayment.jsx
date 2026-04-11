import React from "react";
import { Paper, Typography, Box, Grid, Divider, Skeleton } from "@mui/material";
import { useEmiContext } from "../context/EmiContext";
import { useTheme } from "@mui/material/styles";
import "./TotalMonthlyPayment.scss";

const TotalMonthlyPayment = () => {
  const { calculatedValues, expenses, currency, isCalculating, prepayments } = useEmiContext();
  const theme = useTheme();

  const emi = Math.round(calculatedValues.emi) || 0;
  const monthlyTaxes = Math.round((calculatedValues.taxesYearlyInRs || 0) / 12);
  const monthlyInsurance = Math.round(
    (calculatedValues.homeInsYearlyInRs || 0) / 12,
  );
  const monthlyMaintenance = Math.round(expenses.maintenance) || 0;

  // Calculate average monthly prepayment
  const tenureInMonths = calculatedValues.tenureInMonths || 1;
  const averageMonthlyPrepayment = Math.round(calculatedValues.totalPrepayments / tenureInMonths) || 0;

  const totalMonthlyPayment =
    emi + monthlyTaxes + monthlyInsurance + monthlyMaintenance + averageMonthlyPrepayment;

  if (isCalculating) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Total Monthly Payment Calculation
        </Typography>
        <Box className="total-monthly-box">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="60%" />
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ borderStyle: "dotted", width: '100%' }} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="60%" />
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ borderStyle: "dotted", width: '100%' }} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="60%" />
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ borderStyle: "dotted", width: '100%' }} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="60%" />
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ borderStyle: "dotted", width: '100%' }} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="60%" />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, width: '100%' }} />
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Skeleton variant="text" width="70%" height={30} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="50%" height={30} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

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
              {emi}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Property Taxes</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyTaxes}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Home Insurance</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyInsurance}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Maintenance</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {monthlyMaintenance}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Prepayments</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {averageMonthlyPrepayment}
            </Typography>
          </Grid>
        </Grid>

        <Divider className="total-monthly-divider" sx={{ my: 2, width: '100%' }} />

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6">Total Monthly Payment</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="right" color="primary">
              {currency}
              {totalMonthlyPayment}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TotalMonthlyPayment;
