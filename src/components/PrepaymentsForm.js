import React, { useState } from 'react';
import { TextField, InputAdornment, Box, Paper, Typography, Grid, Collapse, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEmiContext } from '../context/EmiContext';
import './PrepaymentsForm.scss';

const PrepaymentsForm = () => {
  const { prepayments, updatePrepayments } = useEmiContext();
  const [open, setOpen] = useState(false);

  const handleAmountChange = (type, event) => {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) value = 0;
    updatePrepayments(type, 'amount', value);
  };

  const handleDateChange = (type, newValue) => {
    updatePrepayments(type, type === 'oneTime' ? 'date' : 'startDate', newValue);
  };

  return (
    <Paper elevation={3} className="prepayments-paper">
      <Box className="prepayments-header" onClick={() => setOpen(!open)}>
        <Typography variant="h6">Partial Prepayments</Typography>
        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={2} className="prepayments-grid">
          {/* Monthly Prepayment */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Monthly Payment</Typography>
            <Box className="prepayments-input-group">
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={prepayments.monthly.amount || ''}
                onChange={(e) => handleAmountChange('monthly', e)}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
              <DatePicker
                label="Starting from"
                views={['year', 'month']}
                value={prepayments.monthly.startDate}
                onChange={(newValue) => handleDateChange('monthly', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Grid>

          {/* Yearly Prepayment */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Yearly Payment</Typography>
            <Box className="prepayments-input-group">
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={prepayments.yearly.amount || ''}
                onChange={(e) => handleAmountChange('yearly', e)}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
              <DatePicker
                label="Starting from"
                views={['year', 'month']}
                value={prepayments.yearly.startDate}
                onChange={(newValue) => handleDateChange('yearly', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Grid>

          {/* Quarterly Prepayment */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Quarterly Payment</Typography>
            <Box className="prepayments-input-group">
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={prepayments.quarterly.amount || ''}
                onChange={(e) => handleAmountChange('quarterly', e)}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
              <DatePicker
                label="Starting from"
                views={['year', 'month']}
                value={prepayments.quarterly.startDate}
                onChange={(newValue) => handleDateChange('quarterly', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Grid>

          {/* One-Time Prepayment */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>One-time Payment</Typography>
            <Box className="prepayments-input-group">
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={prepayments.oneTime.amount || ''}
                onChange={(e) => handleAmountChange('oneTime', e)}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
              <DatePicker
                label="In the month of"
                views={['year', 'month']}
                value={prepayments.oneTime.date}
                onChange={(newValue) => handleDateChange('oneTime', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default PrepaymentsForm;
