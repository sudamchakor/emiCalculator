import React from 'react';
import { TextField, InputAdornment, Box, Paper, Typography, Grid, MenuItem, Select, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEmiContext } from '../context/EmiContext';
import './HomeLoanForm.css';

const HomeLoanForm = () => {
  const { loanDetails, updateLoanDetails, calculatedValues } = useEmiContext();

  const handleUnitChange = (field, event) => {
    updateLoanDetails(field, event.target.value);
  };

  const handleChange = (field, event) => {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) value = 0;
    updateLoanDetails(field, value);
  };

  return (
    <Paper elevation={3} className="home-loan-paper">
      <Typography variant="h6" gutterBottom>Home Loan Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Home Value (HV)"
            type="number"
            value={loanDetails.homeValue || ''}
            onChange={(e) => handleChange('homeValue', e)}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className="home-loan-input-group">
            <TextField
              sx={{ flex: 1 }}
              fullWidth
              label="Margin / Down Payment"
              type="number"
              value={loanDetails.marginAmount || ''}
              onChange={(e) => handleChange('marginAmount', e)}
            />
            <FormControl className="home-loan-form-control">
              <Select
                value={loanDetails.marginUnit}
                onChange={(e) => handleUnitChange('marginUnit', e)}
              >
                <MenuItem value="Rs">₹</MenuItem>
                <MenuItem value="%">%</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Typography variant="caption" color="textSecondary">
            Value in Rs: {calculatedValues.marginInRs.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Loan Insurance (LI)"
            type="number"
            value={loanDetails.loanInsurance || ''}
            onChange={(e) => handleChange('loanInsurance', e)}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label="Loan Amount"
            value={calculatedValues.loanAmount.toFixed(2)}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Interest Rate"
            type="number"
            value={loanDetails.interestRate || ''}
            onChange={(e) => handleChange('interestRate', e)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className="home-loan-input-group">
            <TextField
              sx={{ flex: 1 }}
              fullWidth
              label="Loan Tenure"
              type="number"
              value={loanDetails.loanTenure || ''}
              onChange={(e) => handleChange('loanTenure', e)}
            />
            <FormControl className="home-loan-form-control">
              <Select
                value={loanDetails.tenureUnit}
                onChange={(e) => handleUnitChange('tenureUnit', e)}
              >
                <MenuItem value="years">Y</MenuItem>
                <MenuItem value="months">M</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className="home-loan-input-group">
            <TextField
              sx={{ flex: 1 }}
              fullWidth
              label="Loan Fees & Charges"
              type="number"
              value={loanDetails.loanFees || ''}
              onChange={(e) => handleChange('loanFees', e)}
            />
            <FormControl className="home-loan-form-control">
              <Select
                value={loanDetails.feesUnit}
                onChange={(e) => handleUnitChange('feesUnit', e)}
              >
                <MenuItem value="Rs">₹</MenuItem>
                <MenuItem value="%">%</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Start Month & Year"
            views={['year', 'month']}
            value={loanDetails.startDate}
            onChange={(newValue) => updateLoanDetails('startDate', newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomeLoanForm;
