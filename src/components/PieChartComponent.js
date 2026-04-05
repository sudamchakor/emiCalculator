import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmiContext } from '../context/EmiContext';
import { Box, Typography, Grid, Divider } from '@mui/material';
import './PieChartComponent.scss';

// Vibrant colors for the pie chart
const COLORS = ['#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50', '#FFEB3B'];

const PieChartComponent = () => {
  const { calculatedValues, expenses } = useEmiContext();

  const data = [
    { name: 'Down Payment', value: calculatedValues.marginInRs },
    { name: 'Fees & One-time', value: calculatedValues.feesInRs + calculatedValues.oneTimeInRs },
    { name: 'Principal', value: calculatedValues.totalPrincipal },
    { name: 'Prepayments', value: calculatedValues.totalPrepayments },
    { name: 'Interest', value: calculatedValues.totalInterest },
    { name: 'Taxes', value: calculatedValues.taxesYearlyInRs * (calculatedValues.schedule.length / 12) },
    { name: 'Insurance & Maint.', value: (calculatedValues.homeInsYearlyInRs * (calculatedValues.schedule.length / 12)) + (expenses.maintenance * calculatedValues.schedule.length) },
  ].filter(item => item.value > 0);

  const downPaymentFees = calculatedValues.marginInRs + calculatedValues.feesInRs + calculatedValues.oneTimeInRs;
  const principal = calculatedValues.totalPrincipal;
  const prepayments = calculatedValues.totalPrepayments;
  const interest = calculatedValues.totalInterest;
  const taxesInsMaint = (calculatedValues.taxesYearlyInRs * (calculatedValues.schedule.length / 12)) + (calculatedValues.homeInsYearlyInRs * (calculatedValues.schedule.length / 12)) + (expenses.maintenance * calculatedValues.schedule.length);

  return (
    <Grid container spacing={3} alignItems="center">
      {/* Left side: Pie Chart */}
      <Grid item xs={12} md={6}>
        <Box className="pie-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Grid>

      {/* Right side: Payment Details */}
      <Grid item xs={12} md={6}>
        <Box className="pie-chart-details">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="body1" className="pie-chart-legend-text" style={{ color: COLORS[0] }}>Down Payment, Fees & One-time</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="right">₹{downPaymentFees.toFixed(2)}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1" className="pie-chart-legend-text" style={{ color: COLORS[2] }}>Principal</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="right">₹{principal.toFixed(2)}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1" className="pie-chart-legend-text" style={{ color: COLORS[3] }}>Prepayments</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="right">₹{prepayments.toFixed(2)}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1" className="pie-chart-legend-text" style={{ color: COLORS[4] }}>Interest</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="right">₹{interest.toFixed(2)}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1" className="pie-chart-legend-text" style={{ color: COLORS[5] }}>Taxes, Insurance & Maint.</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="right">₹{taxesInsMaint.toFixed(2)}</Typography>
            </Grid>
          </Grid>

          <Divider className="pie-chart-divider" />

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h6">Total of all Payments</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="right">₹{calculatedValues.totalPayments.toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PieChartComponent;
