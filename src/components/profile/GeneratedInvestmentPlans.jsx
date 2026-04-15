import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const GeneratedInvestmentPlans = ({
  generatedInvestmentPlans,
  totalInvestedAmount,
  totalEstimatedReturns,
  totalCurrentValue,
  totalTimePeriod,
  overallROI,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Investment Scenarios
      </Typography>

      {generatedInvestmentPlans.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                Total Invested:{" "}
                <strong>
                  ₹
                  {totalInvestedAmount.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                Total Est. Returns:{" "}
                <strong>
                  ₹
                  {totalEstimatedReturns.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1" color="primary">
                Total Value:{" "}
                <strong>
                  ₹
                  {totalCurrentValue.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                Time Period: <strong>{totalTimePeriod} years</strong>
              </Typography>
            </Grid>
            {overallROI !== null && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body1">
                  Overall ROI: <strong>{overallROI.toFixed(2)}%</strong>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>
      )}

      <Grid container spacing={2}>
        {generatedInvestmentPlans.map((plan) => (
          <Grid item xs={12} sm={6} key={plan.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  {plan.name}
                </Typography>
                {/* Display the full summary string */}
                {plan.fullSummary && (
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                    {plan.fullSummary}
                  </Typography>
                )}
                {plan.isSafe && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                    (Considered Safe)
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GeneratedInvestmentPlans;
