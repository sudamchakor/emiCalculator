import React from "react";
import { Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCalculatedValues } from "../utils/emiCalculator";
import { selectCurrency, selectExpenses } from "../../../store/emiSlice";
import { formatCurrency } from "../../../utils/formatting";

const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1, // Reduced padding for high density
      px: 1.5,
      borderRadius: 1.5,
      "&:nth-of-type(odd)": { bgcolor: "rgba(0,0,0,0.02)" },
      "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
    }}
  >
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem" }}
    >
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={{ fontWeight: 800, color: "text.primary", fontSize: "0.9rem" }}
    >
      {value}
    </Typography>
  </Box>
);

const TotalMonthlyPayment = () => {
  const theme = useTheme();
  const calculatedValues = useSelector(selectCalculatedValues);
  const currency = useSelector(selectCurrency);
  const expenses = useSelector(selectExpenses);

  const emi = Math.round(calculatedValues.emi || 0);
  const monthlyTaxes = Math.round((calculatedValues.taxesYearlyInRs || 0) / 12);
  const monthlyInsurance = Math.round(
    (calculatedValues.homeInsYearlyInRs || 0) / 12,
  );
  const monthlyMaintenance = Math.round(expenses.maintenance || 0);
  const tenureInMonths = calculatedValues.tenureInMonths || 1;
  const averageMonthlyPrepayment =
    Math.round((calculatedValues.totalPrepayments || 0) / tenureInMonths) || 0;
  const totalMonthlyPayment =
    emi +
    monthlyTaxes +
    monthlyInsurance +
    monthlyMaintenance +
    averageMonthlyPrepayment;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            mb: 1,
            px: 1,
            fontWeight: 800,
            color: "text.disabled",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          Ongoing Expenses
        </Typography>
        <Stack spacing={0.25}>
          <DetailRow
            label="Monthly EMI"
            value={formatCurrency(emi, currency)}
          />
          <DetailRow
            label="Property Taxes"
            value={formatCurrency(monthlyTaxes, currency)}
          />
          <DetailRow
            label="Home Insurance"
            value={formatCurrency(monthlyInsurance, currency)}
          />
          <DetailRow
            label="Maintenance"
            value={formatCurrency(monthlyMaintenance, currency)}
          />
          <DetailRow
            label="Avg. Prepayment"
            value={formatCurrency(averageMonthlyPrepayment, currency)}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 2, // Reduced margin
          p: 2, // Reduced padding
          borderRadius: 3,
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "primary.contrastText",
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            opacity: 0.8,
            display: "block",
            mb: 0.5,
            fontSize: "0.65rem",
          }}
        >
          Total Monthly Outflow
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
          {formatCurrency(totalMonthlyPayment, currency)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TotalMonthlyPayment;
