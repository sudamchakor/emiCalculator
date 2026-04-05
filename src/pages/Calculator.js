import React from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';
import HomeLoanForm from '../components/HomeLoanForm';
import ExpensesForm from '../components/ExpensesForm';
import PrepaymentsForm from '../components/PrepaymentsForm';
import PieChartComponent from '../components/PieChartComponent';
import PaymentSchedule from '../components/PaymentSchedule';
import TotalMonthlyPayment from '../components/TotalMonthlyPayment';
import './Calculator.scss';

const Calculator = () => {
  return (
    <Box className="calculator-container">
      <Grid container spacing={3}>
        {/* Left Column: Inputs */}
        <Grid item xs={12} md={6}>
          <Box className="calculator-column">
            <HomeLoanForm />
            <ExpensesForm />
            <PrepaymentsForm />
          </Box>
        </Grid>

        {/* Right Column: Charts and Tables */}
        <Grid item xs={12} md={6}>
          <Box className="calculator-column">
            <TotalMonthlyPayment />

            <Paper elevation={3} className="calculator-paper">
              <Typography variant="h6" gutterBottom>Payment Breakdown</Typography>
              <PieChartComponent />
            </Paper>
          </Box>
        </Grid>

        {/* Full Width Row: Payment Schedule */}
        <Grid item xs={12}>
          <Paper elevation={3} className="calculator-paper">
            <Box className="calculator-schedule-header">
              <Typography variant="h6">Home Loan Payment Schedule</Typography>
            </Box>
            <PaymentSchedule />
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Calculator;
