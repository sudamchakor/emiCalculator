import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Typography, IconButton, Collapse, Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEmiContext } from '../context/EmiContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, ComposedChart } from 'recharts';
import './PaymentSchedule.scss';

// PieChartComponent colors to reuse
const COLORS = ['#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50', '#FFEB3B'];
const COLOR_PRINCIPAL = COLORS[2];
const COLOR_PREPAYMENT = COLORS[3];
const COLOR_INTEREST = COLORS[4];
const COLOR_TAXES_INS_MAINT = COLORS[5];

// Darker colors for lines
const LINE_PRINCIPAL = '#6a1b9a'; // darker version of #9C27B0
const LINE_PREPAYMENT = '#303f9f'; // darker version of #3F51B5
const LINE_INTEREST = '#0097a7'; // darker version of #00BCD4

// Row Component for Burn Down Table to handle Collapsible Years
const BurnDownRow = ({ yearData }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow className="schedule-row-main">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <strong>{yearData.year}</strong>
        </TableCell>
        <TableCell align="right"><strong>{yearData.totalPrincipal.toFixed(2)}</strong></TableCell>
        <TableCell align="right"><strong>{yearData.totalInterest.toFixed(2)}</strong></TableCell>
        <TableCell align="right"><strong>{yearData.totalPrepayment.toFixed(2)}</strong></TableCell>
        <TableCell align="right"><strong>{yearData.totalTaxesInsMaint.toFixed(2)}</strong></TableCell>
        <TableCell align="right"><strong>{yearData.yearEndBalance.toFixed(2)}</strong></TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="schedule-cell-collapse" colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="schedule-box-collapse">
              <Table size="small" aria-label="months">
                <TableHead>
                  <TableRow className="schedule-row-header-inner">
                    <TableCell>Month</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Principal</TableCell>
                    <TableCell align="right">Interest Paid</TableCell>
                    <TableCell align="right">Prepayment</TableCell>
                    <TableCell align="right">Taxes, Ins. & Maint.</TableCell>
                    <TableCell align="right">Remaining Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearData.months.map((monthRow) => (
                    <TableRow key={`burn-${monthRow.month}`} className="schedule-row-inner">
                      <TableCell>{monthRow.month}</TableCell>
                      <TableCell>{monthRow.date}</TableCell>
                      <TableCell align="right">{monthRow.principal.toFixed(2)}</TableCell>
                      <TableCell align="right">{monthRow.interest.toFixed(2)}</TableCell>
                      <TableCell align="right">{monthRow.prepayment.toFixed(2)}</TableCell>
                      <TableCell align="right">{(monthRow.taxes + monthRow.homeInsurance + monthRow.maintenance).toFixed(2)}</TableCell>
                      <TableCell align="right">{monthRow.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const PaymentSchedule = () => {
  const { calculatedValues } = useEmiContext();

  const schedule = calculatedValues.schedule;
  const startMonthYear = schedule.length > 0 ? schedule[0].date : '';
  const endMonthYear = schedule.length > 0 ? schedule[schedule.length - 1].date : '';

  // Aggregate data for the chart if there are too many items on the X-axis
  const chartData = useMemo(() => {
    if (schedule.length <= 36) {
      return schedule;
    }

    const yearlyData = {};
    schedule.forEach((row) => {
      const year = row.date.split(' ')[1]; // Extracting year from 'MMM YYYY'
      if (!yearlyData[year]) {
        yearlyData[year] = {
          date: year,
          principal: 0,
          interest: 0,
          prepayment: 0,
          taxes: 0,
          homeInsurance: 0,
          maintenance: 0,
          balance: row.balance // Will update to reflect the year-end balance
        };
      }
      yearlyData[year].principal += row.principal;
      yearlyData[year].interest += row.interest;
      yearlyData[year].prepayment += row.prepayment;
      yearlyData[year].taxes += row.taxes;
      yearlyData[year].homeInsurance += row.homeInsurance;
      yearlyData[year].maintenance += row.maintenance;
      yearlyData[year].balance = row.balance; // End of the year balance
    });

    return Object.values(yearlyData);
  }, [schedule]);

  // Group schedule by year for Burn Down table
  const groupedSchedule = useMemo(() => {
    const years = {};
    schedule.forEach((row) => {
      const year = row.date.split(' ')[1];
      if (!years[year]) {
        years[year] = {
          year: year,
          totalPrincipal: 0,
          totalInterest: 0,
          totalPrepayment: 0,
          totalTaxesInsMaint: 0,
          yearEndBalance: 0,
          months: []
        };
      }
      years[year].totalPrincipal += row.principal;
      years[year].totalInterest += row.interest;
      years[year].totalPrepayment += row.prepayment;
      years[year].totalTaxesInsMaint += (row.taxes + row.homeInsurance + row.maintenance);
      years[year].yearEndBalance = row.balance;
      years[year].months.push(row);
    });
    return Object.values(years);
  }, [schedule]);

  return (
    <Box>
      <Typography variant="h6" className="schedule-title">
        ({startMonthYear} - {endMonthYear})
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Burn Down Table */}
        <Grid item xs={12} lg={6}>
          <TableContainer component={Paper} className="schedule-table-container">
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="schedule-header-cell-icon" />
                  <TableCell className="schedule-header-cell-primary">Year</TableCell>
                  <TableCell align="right" className="schedule-header-cell-principal">Principal</TableCell>
                  <TableCell align="right" className="schedule-header-cell-interest">Interest Paid</TableCell>
                  <TableCell align="right" className="schedule-header-cell-prepayment">Prepayment</TableCell>
                  <TableCell align="right" className="schedule-header-cell-taxes">Taxes, Ins. & Maint.</TableCell>
                  <TableCell align="right" className="schedule-header-cell-primary">Remaining Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedSchedule.map((yearData) => (
                  <BurnDownRow key={`year-${yearData.year}`} yearData={yearData} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Side: Chart View */}
        <Grid item xs={12} lg={6}>
          <Box className="schedule-chart-box">
            {schedule.length > 36 && (
              <Typography variant="caption" color="textSecondary" className="schedule-chart-caption">
                Data has been aggregated yearly as the tenure is longer than 36 months.
              </Typography>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Legend />
                <Bar yAxisId="left" dataKey="principal" stackId="a" fill={COLOR_PRINCIPAL} name="Principal" />
                <Bar yAxisId="left" dataKey="interest" stackId="a" fill={COLOR_INTEREST} name="Interest" />
                <Bar yAxisId="left" dataKey="prepayment" stackId="a" fill={COLOR_PREPAYMENT} name="Prepayment" />
                <Bar yAxisId="left" dataKey="taxes" stackId="a" fill={COLOR_TAXES_INS_MAINT} name="Taxes" />
                <Bar yAxisId="left" dataKey="homeInsurance" stackId="a" fill={COLOR_TAXES_INS_MAINT} name="Home Ins." />
                <Bar yAxisId="left" dataKey="maintenance" stackId="a" fill={COLOR_TAXES_INS_MAINT} name="Maint." />
                <Line yAxisId="left" type="monotone" dataKey="principal" stroke={LINE_PRINCIPAL} name="Principal (Line)" dot={false} strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="prepayment" stroke={LINE_PREPAYMENT} name="Prepayment (Line)" dot={false} strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="interest" stroke={LINE_INTEREST} name="Interest (Line)" dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#ff7300" name="Balance" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentSchedule;
