import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const InvestmentSummary = ({ plans, targetAmount }) => {
  const totalInvested = plans.reduce(
    (sum, plan) => sum + (plan.investedAmount || 0),
    0,
  );

  const totalReturns = plans.reduce(
    (sum, plan) => sum + (plan.estimatedReturns || 0),
    0,
  );

  const totalValue = plans.reduce(
    (sum, plan) => sum + (plan.totalValue || 0),
    0,
  );

  const maxTimePeriod = plans.reduce(
    (max, plan) => Math.max(max, plan.timePeriod || 0),
    0,
  );

  const isMismatch = totalValue !== (targetAmount || 0); // Ensure targetAmount is treated as a number

  const formatAmount = (amount) =>
    `₹${(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Card sx={{ mt: 2, border: isMismatch ? "2px solid red" : "none" }}>
      <CardContent sx={{ py: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
        >
          Investment Summary
        </Typography>
        {isMismatch && (
          <Typography
            color="error"
            variant="body2"
            gutterBottom
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Warning: The total projected value does not match the target amount.
          </Typography>
        )}
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              justifyContent: { xs: "space-between", sm: "center" },
              alignItems: { xs: "baseline", sm: "center" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                textAlign: { xs: "left", sm: "center" },
              }}
            >
              Invested
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }, // Reduced font size for xs
                textAlign: { xs: "right", sm: "center" },
              }}
            >
              {formatAmount(totalInvested)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              justifyContent: { xs: "space-between", sm: "center" },
              alignItems: { xs: "baseline", sm: "center" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                textAlign: { xs: "left", sm: "center" },
              }}
            >
              Returns
            </Typography>
            <Typography
              variant="h5"
              color="success.main"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }, // Reduced font size for xs
                textAlign: { xs: "right", sm: "center" },
              }}
            >
              {formatAmount(totalReturns)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              justifyContent: { xs: "space-between", sm: "center" },
              alignItems: { xs: "baseline", sm: "center" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                textAlign: { xs: "left", sm: "center" },
              }}
            >
              Total Value
            </Typography>
            <Typography
              variant="h5"
              color={isMismatch ? "error" : "primary.main"}
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }, // Reduced font size for xs
                textAlign: { xs: "right", sm: "center" },
              }}
            >
              {formatAmount(totalValue)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              justifyContent: { xs: "space-between", sm: "center" },
              alignItems: { xs: "baseline", sm: "center" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                textAlign: { xs: "left", sm: "center" },
              }}
            >
              Time Period
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }, // Reduced font size for xs
                textAlign: { xs: "right", sm: "center" },
              }}
            >
              {maxTimePeriod} years
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;
