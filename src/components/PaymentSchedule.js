import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Collapse,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEmiContext } from "../context/EmiContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
} from "recharts";
import "./PaymentSchedule.scss";

// Row Component for Burn Down Table to handle Collapsible Years
const BurnDownRow = ({ yearData }) => {
  const [open, setOpen] = useState(false);
  const { currency } = useEmiContext();

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
        <TableCell align="right">
          <strong>
            {currency}
            {Math.round(yearData.totalPrincipal)}
          </strong>
        </TableCell>
        <TableCell align="right">
          <strong>
            {currency}
            {Math.round(yearData.totalInterest)}
          </strong>
        </TableCell>
        <TableCell align="right">
          <strong>
            {currency}
            {Math.round(yearData.totalPrepayment)}
          </strong>
        </TableCell>
        <TableCell align="right">
          <strong>
            {currency}
            {Math.round(yearData.totalTaxesInsMaint)}
          </strong>
        </TableCell>
        <TableCell align="right">
          <strong>
            {currency}
            {Math.round(yearData.yearEndBalance)}
          </strong>
        </TableCell>
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
                    <TableRow
                      key={`burn-${monthRow.month}`}
                      className="schedule-row-inner"
                    >
                      <TableCell>{monthRow.month}</TableCell>
                      <TableCell>{monthRow.date}</TableCell>
                      <TableCell align="right">
                        {currency}
                        {Math.round(monthRow.principal)}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {Math.round(monthRow.interest)}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {Math.round(monthRow.prepayment)}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {Math.round(
                          monthRow.taxes +
                          monthRow.homeInsurance +
                          monthRow.maintenance
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {Math.round(monthRow.balance)}
                      </TableCell>
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
  const { calculatedValues, currency } = useEmiContext();
  const theme = useTheme();

  const schedule = calculatedValues.schedule;

  const getThemeColors = () => {
    if (theme.palette.mode === "dark") {
      return {
        principal: theme.palette.primary.light,
        interest: theme.palette.secondary.main,
        prepayment: theme.palette.error.light,
        taxes: theme.palette.warning.light,
        linePrincipal: theme.palette.primary.main,
        linePrepayment: theme.palette.error.main,
        lineInterest: theme.palette.secondary.dark,
        lineBalance: theme.palette.success.main,
        text: "#fff",
      };
    } else {
      return {
        principal: theme.palette.primary.main,
        interest: theme.palette.secondary.main,
        prepayment: "#f44336", // red
        taxes: "#ff9800", // orange
        linePrincipal: theme.palette.primary.dark,
        linePrepayment: "#d32f2f",
        lineInterest: theme.palette.secondary.dark,
        lineBalance: "#4caf50", // green
        text: "#000",
      };
    }
  };

  const colors = getThemeColors();

  // Aggregate data for the chart if there are too many items on the X-axis
  const chartData = useMemo(() => {
    if (schedule.length <= 36) {
      return schedule;
    }

    const yearlyData = {};
    schedule.forEach((row) => {
      const year = row.date.split(" ")[1]; // Extracting year from 'MMM YYYY'
      if (!yearlyData[year]) {
        yearlyData[year] = {
          date: year,
          principal: 0,
          interest: 0,
          prepayment: 0,
          taxes: 0,
          homeInsurance: 0,
          maintenance: 0,
          balance: row.balance, // Will update to reflect the year-end balance
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
      const year = row.date.split(" ")[1];
      if (!years[year]) {
        years[year] = {
          year: year,
          totalPrincipal: 0,
          totalInterest: 0,
          totalPrepayment: 0,
          totalTaxesInsMaint: 0,
          yearEndBalance: 0,
          months: [],
        };
      }
      years[year].totalPrincipal += row.principal;
      years[year].totalInterest += row.interest;
      years[year].totalPrepayment += row.prepayment;
      years[year].totalTaxesInsMaint +=
        row.taxes + row.homeInsurance + row.maintenance;
      years[year].yearEndBalance = row.balance;
      years[year].months.push(row);
    });
    return Object.values(years);
  }, [schedule]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Side: Burn Down Table */}
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            className="schedule-table-container"
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="schedule-header-cell-icon" />
                  <TableCell className="schedule-header-cell-primary">
                    Year
                  </TableCell>
                  <TableCell
                    align="right"
                    className="schedule-header-cell-principal"
                  >
                    Principal
                  </TableCell>
                  <TableCell
                    align="right"
                    className="schedule-header-cell-interest"
                  >
                    Interest Paid
                  </TableCell>
                  <TableCell
                    align="right"
                    className="schedule-header-cell-prepayment"
                  >
                    Prepayment
                  </TableCell>
                  <TableCell
                    align="right"
                    className="schedule-header-cell-taxes"
                  >
                    Taxes, Ins. & Maint.
                  </TableCell>
                  <TableCell
                    align="right"
                    className="schedule-header-cell-primary"
                  >
                    Remaining Balance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedSchedule.map((yearData) => (
                  <BurnDownRow
                    key={`year-${yearData.year}`}
                    yearData={yearData}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Side: Chart View */}
        <Grid item xs={12}>
          <Box className="schedule-chart-box">
            {schedule.length > 36 && (
              <Typography
                variant="caption"
                color="textSecondary"
                className="schedule-chart-caption"
              >
                Data has been aggregated yearly as the tenure is longer than 36
                months.
              </Typography>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis dataKey="date" stroke={colors.text} />
                <YAxis yAxisId="left" stroke={colors.text} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={colors.text}
                />
                <Tooltip
                  formatter={(value) =>
                    `${currency}${Math.round(value)}`
                  }
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend wrapperStyle={{ color: colors.text }} />
                <Bar
                  yAxisId="left"
                  dataKey="principal"
                  stackId="a"
                  fill={colors.principal}
                  name="Principal"
                />
                <Bar
                  yAxisId="left"
                  dataKey="interest"
                  stackId="a"
                  fill={colors.interest}
                  name="Interest"
                />
                <Bar
                  yAxisId="left"
                  dataKey="prepayment"
                  stackId="a"
                  fill={colors.prepayment}
                  name="Prepayment"
                />
                <Bar
                  yAxisId="left"
                  dataKey="taxes"
                  stackId="a"
                  fill={colors.taxes}
                  name="Taxes"
                />
                <Bar
                  yAxisId="left"
                  dataKey="homeInsurance"
                  stackId="a"
                  fill={colors.taxes}
                  name="Home Ins."
                />
                <Bar
                  yAxisId="left"
                  dataKey="maintenance"
                  stackId="a"
                  fill={colors.taxes}
                  name="Maint."
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="principal"
                  stroke={colors.linePrincipal}
                  name="Principal (Line)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="prepayment"
                  stroke={colors.linePrepayment}
                  name="Prepayment (Line)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="interest"
                  stroke={colors.lineInterest}
                  name="Interest (Line)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="balance"
                  stroke={colors.lineBalance}
                  name="Balance"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentSchedule;