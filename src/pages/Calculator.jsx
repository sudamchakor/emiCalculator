import React from "react";
import { Grid, Box, Paper, Typography, CircularProgress } from "@mui/material";
import HomeLoanForm from "../components/calculators/homeLoan/HomeLoanForm";
import PrepaymentsForm from "../components/PrepaymentsForm";
import PaymentScheduleTable from "../components/PaymentScheduleTable";
import TotalMonthlyPayment from "../components/TotalMonthlyPayment";
import "./Calculator.scss";
import { useEmiContext } from "../context/EmiContext";
import PieChartComponent from "../components/charts/PieChartComponent";
import BarChartComponent from "../components/charts/BarChartComponent";
import styled from "styled-components";

const LoadingOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 10;
  border-radius: 4px;
`;

const SectionContainer = styled(Box)`
  position: relative;
`;

const Calculator = () => {
  const { calculatedValues, isCalculating } = useEmiContext();

  const schedule = calculatedValues.schedule;
  const startMonthYear = schedule.length > 0 ? schedule[0].date : "";
  const endMonthYear =
    schedule.length > 0 ? schedule[schedule.length - 1].date : "";

  return (
    <Box className="calculator-container">
      <Grid container spacing={3}>
        {/* Full Width Row: Inputs (Home Loan + Expenses) */}
        <Grid item xs={12}>
          <SectionContainer>
            {isCalculating && (
              <LoadingOverlay>
                <CircularProgress size={40} aria-label="Loading home loan calculations" />
              </LoadingOverlay>
            )}
            <HomeLoanForm />
          </SectionContainer>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} className="calculator-paper">
            <PrepaymentsForm />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} sx={{ display: "flex" }}>
              <Grid item xs={12} sx={{ width: "100%", position: "relative" }}>
                {isCalculating && (
                  <LoadingOverlay style={{ borderRadius: "4px" }}>
                    <CircularProgress size={40} aria-label="Loading pie chart" />
                  </LoadingOverlay>
                )}
                <Paper elevation={3} className="calculator-paper">
                  <PieChartComponent />
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
              <SectionContainer sx={{ width: "100%" }}>
                {isCalculating && (
                  <LoadingOverlay>
                    <CircularProgress size={40} aria-label="Loading monthly payment" />
                  </LoadingOverlay>
                )}
                <Paper elevation={3} className="calculator-paper">
                  <TotalMonthlyPayment />
                </Paper>
              </SectionContainer>
            </Grid>
          </Grid>
        </Grid>

        <Grid item spacing={3} xs={12}>
          <SectionContainer>
            {isCalculating && (
              <LoadingOverlay>
                <CircularProgress size={40} aria-label="Loading bar chart" />
              </LoadingOverlay>
            )}
            <Paper elevation={3} className="calculator-paper">
              <BarChartComponent />
            </Paper>
          </SectionContainer>
        </Grid>

        {/* Full Width Row: Payment Schedule */}
        <Grid item xs={12}>
          <SectionContainer>
            {isCalculating && (
              <LoadingOverlay>
                <CircularProgress size={40} aria-label="Loading payment schedule" />
              </LoadingOverlay>
            )}
            <Paper elevation={3} className="calculator-paper">
              <Box className="calculator-schedule-header">
                <Typography variant="h6">
                  Home Loan Payment Schedule ({startMonthYear} - {endMonthYear})
                </Typography>
              </Box>
              <PaymentScheduleTable />
            </Paper>
          </SectionContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calculator;
