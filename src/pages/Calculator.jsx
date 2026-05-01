import React from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Container,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Payments as PaymentsIcon,
  PieChart as PieChartIcon,
  TableChart as TableIcon,
  BarChart as BarIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectCalculatedValues } from "../features/emiCalculator/utils/emiCalculator";

import HomeLoanForm from "../features/emiCalculator/components/HomeLoanForm";
import PrepaymentsForm from "../features/emiCalculator/components/PrepaymentsForm";
import PaymentScheduleTable from "../features/emiCalculator/components/PaymentScheduleTable";
import TotalMonthlyPayment from "../features/emiCalculator/components/TotalMonthlyPayment";
import PieChartComponent from "../components/charts/PieChartComponent";
import BarChartComponent from "../components/charts/BarChartComponent";

const SectionHeader = ({ icon, title, color }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
    <Box
      sx={{
        display: "flex",
        p: 1,
        borderRadius: 2,
        bgcolor: alpha(color || "#1976d2", 0.1),
        color: color || "primary.main",
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
      {title}
    </Typography>
  </Stack>
);

const StyledPaper = ({ children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid #f0f0f0",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      bgcolor: "background.paper",
      ...sx,
    }}
  >
    {children}
  </Paper>
);

const Calculator = () => {
  const theme = useTheme();
  const calculatedValues = useSelector(selectCalculatedValues);
  const schedule = calculatedValues.schedule || [];
  const startMonthYear = schedule.length > 0 ? schedule[0].date : "";
  const endMonthYear =
    schedule.length > 0 ? schedule[schedule.length - 1].date : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, #ffffff 100%)`,
        pt: { xs: 4, md: 6 },
        pb: 12,
      }}
    >
      <Container maxWidth={"xl"}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "#1a1a1a", mb: 1 }}
          >
            Home Loan{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              EMI Calculator
            </Box>
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <StyledPaper>
              <SectionHeader
                title="Loan Details & Parameters"
                icon={<HomeIcon />}
              />
              <HomeLoanForm />
            </StyledPaper>
          </Grid>

          <Grid item xs={12}>
            <StyledPaper>
              <SectionHeader
                title="Prepayment Plan"
                icon={<PaymentsIcon />}
                color="#2e7d32"
              />
              <PrepaymentsForm />
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={8}>
            <StyledPaper sx={{ height: "100%" }}>
              <SectionHeader
                title="Payment Breakdown"
                icon={<PieChartIcon />}
                color="#0288d1"
              />
              <Box sx={{ height: 400 }}>
                <PieChartComponent />
              </Box>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledPaper>
              <SectionHeader
                title="Monthly Commitment"
                icon={<TableIcon />}
                color="#7b1fa2"
              />
              <TotalMonthlyPayment />
            </StyledPaper>
          </Grid>

          <Grid item xs={12}>
            <StyledPaper>
              <SectionHeader
                title="Loan Progression"
                icon={<BarIcon />}
                color="#ed6c02"
              />
              <Box sx={{ height: 450 }}>
                <BarChartComponent />
              </Box>
            </StyledPaper>
          </Grid>

          <Grid item xs={12}>
            <StyledPaper sx={{ p: 0, overflow: "hidden" }}>
              <Box sx={{ p: 3, pb: 0 }}>
                <SectionHeader
                  title={`Amortization Schedule (${startMonthYear} - ${endMonthYear})`}
                  icon={<TableIcon />}
                  color="#444"
                />
              </Box>
              <PaymentScheduleTable />
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Calculator;
