import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  alpha,
  useTheme,
  Stack,
  Switch,
} from '@mui/material';
import { AccountBalance as FdIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCurrency } from '../../../store/emiSlice';
import { calculateFd } from '../../profile/components/investmentCalculations';
import InvestmentSlider, {
  investmentLabelStyle,
} from '../../../components/common/InvestmentSlider';

const FdCalculatorForm = ({
  onCalculate,
  sharedState,
  onSharedStateChange,
}) => {
  const theme = useTheme();
  // Wire up the global currency setting
  const currency = useSelector(selectCurrency) || '₹';

  // Provide fallbacks in case the plan is newly created
  const {
    principalAmount = 100000,
    interestRate = 7,
    timePeriod = 5,
    compoundingFrequency = 'annually',
    depositType = 'single',
    recurringFrequency = 'monthly',
    monthlyInvestment: rawMonthlyInvestment,
    monthlyContribution,
  } = sharedState || {};

  const monthlyInvestment =
    Number(rawMonthlyInvestment) || Number(monthlyContribution) || 5000;

  const calculateFdResults = useCallback(() => {
    const P = principalAmount || 0;
    const M = monthlyInvestment || 0;
    const t = timePeriod || 0;

    const result = calculateFd(
      P,
      interestRate || 0,
      t,
      compoundingFrequency,
      recurringFrequency,
      M,
      depositType,
    );

    const chartData = [];
    const totalMonths = t * 12;

    if (depositType === 'single') {
      if (P > 0 && t > 0) {
        for (let year = 1; year <= t; year++) {
          const yearlyValue = P * Math.pow(1 + (interestRate || 0) / 100 / (compoundingFrequency === 'quarterly' ? 4 : compoundingFrequency === 'half-yearly' ? 2 : compoundingFrequency === 'monthly' ? 12 : 1), (compoundingFrequency === 'quarterly' ? 4 : compoundingFrequency === 'half-yearly' ? 2 : compoundingFrequency === 'monthly' ? 12 : 1) * year);
          chartData.push({
            year,
            invested: Math.round(P),
            returns: Math.round(yearlyValue - P),
            total: Math.round(yearlyValue),
          });
        }
      }
    } else if (M > 0 && t > 0 && (interestRate || 0) > 0) {
      const monthlyRate = (interestRate || 0) / 100 / 12;
      const periodsPerYear =
        recurringFrequency === 'monthly'
          ? 12
          : recurringFrequency === 'quarterly'
          ? 4
          : recurringFrequency === 'half-yearly'
          ? 2
          : recurringFrequency === 'yearly'
          ? 1
          : 12;
      const monthsPerContribution = 12 / periodsPerYear;

      for (let year = 1; year <= t; year++) {
        const yearEndMonth = year * 12;
        let yearValue = 0;
        let investedThisYear = 0;

        for (let contribution = 1; contribution <= year * periodsPerYear; contribution += 1) {
          const contributionMonth = contribution * monthsPerContribution;
          const monthsRemaining = yearEndMonth - contributionMonth;
          if (monthsRemaining >= 0) {
            yearValue += M * Math.pow(1 + monthlyRate, monthsRemaining);
            investedThisYear += M;
          }
        }

        chartData.push({
          year,
          invested: Math.round(investedThisYear),
          returns: Math.round(yearValue - investedThisYear),
          total: Math.round(yearValue),
        });
      }
    } else {
      for (let year = 1; year <= t; year++) {
        const yearlyInvested = M * year * 12;
        chartData.push({
          year,
          invested: Math.round(yearlyInvested),
          returns: 0,
          total: Math.round(yearlyInvested),
        });
      }
    }

    if (typeof onCalculate === 'function') {
      onCalculate({
        investedAmount: result.investedAmount,
        estimatedReturns: result.estimatedReturns,
        totalValue: result.totalValue,
        chartData,
      });
    }
  }, [
    principalAmount,
    interestRate,
    timePeriod,
    compoundingFrequency,
    recurringFrequency,
    depositType,
    monthlyInvestment,
    onCalculate,
  ]);

  useEffect(() => {
    calculateFdResults();
  }, [calculateFdResults]);

  return (
    <Box sx={{ mt: 1 }}>
      {/* Internal Subsection Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <FdIcon
          sx={{
            fontSize: '1rem',
            color: theme.palette.primary.main,
            opacity: 0.8,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: 'text.primary',
            textTransform: 'uppercase',
          }}
        >
          Fixed Deposit Parameters
        </Typography>
      </Stack>

      {/* Deposit Type Toggle */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography sx={investmentLabelStyle}>Deposit Type</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Single</Typography>
              <Switch
                checked={depositType === 'recurring'}
                onChange={(e) =>
                  onSharedStateChange(
                    'depositType',
                    e.target.checked ? 'recurring' : 'single'
                  )
                }
              />
              <Typography>Recurring</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {depositType === 'single' ? (
        <InvestmentSlider
          label="Principal Amount"
          value={principalAmount}
          min={10000}
          max={5000000}
          step={5000}
          onChange={(val) => onSharedStateChange('principalAmount', val)}
          color="primary"
          adornment={currency}
          adornmentPosition="start"
        />
      ) : (
        <InvestmentSlider
          label={
            recurringFrequency === 'monthly'
              ? 'Monthly Investment'
              : recurringFrequency === 'quarterly'
              ? 'Quarterly Investment'
              : recurringFrequency === 'half-yearly'
              ? '6-Month Investment'
              : 'Yearly Investment'
          }
          value={monthlyInvestment}
          min={500}
          max={100000}
          step={500}
          onChange={(val) => onSharedStateChange('monthlyContribution', val)}
          color="primary"
          adornment={currency}
          adornmentPosition="start"
        />
      )}

      <InvestmentSlider
        label="Interest Rate (p.a)"
        value={interestRate}
        min={1}
        max={15}
        step={0.1}
        onChange={(val) => onSharedStateChange('interestRate', val)}
        color="success"
        adornment="%"
        adornmentPosition="end"
      />

      <InvestmentSlider
        label="Duration (Years)"
        value={timePeriod}
        min={1}
        max={20}
        step={1}
        onChange={(val) => onSharedStateChange('timePeriod', val)}
        color="info"
        adornment="Yr"
        adornmentPosition="end"
      />

      {/* 4. Compounding Frequency (Dropdown Well) */}
      {depositType === 'recurring' && (
        <Box sx={{ mb: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <Typography sx={investmentLabelStyle}>Frequency</Typography>
            </Grid>
            <Grid item xs={6}>
              <Select
                variant="standard"
                value={recurringFrequency}
                onChange={(e) =>
                  onSharedStateChange('recurringFrequency', e.target.value)
                }
                disableUnderline
                sx={{
                  width: '100%',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  color: theme.palette.secondary.main,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  '& .MuiSelect-select': { paddingRight: '24px !important' },
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="half-yearly">6 Months</MenuItem>
                <MenuItem value="yearly">1 Year</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default FdCalculatorForm;