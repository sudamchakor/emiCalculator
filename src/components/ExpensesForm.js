import React, { useState } from 'react';
import { TextField, InputAdornment, Box, Paper, Typography, Grid, MenuItem, Select, FormControl, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEmiContext } from '../context/EmiContext';
import './ExpensesForm.css';

const ExpensesForm = () => {
  const { expenses, updateExpenses } = useEmiContext();
  const [open, setOpen] = useState(true);

  const handleUnitChange = (field, event) => {
    updateExpenses(field, event.target.value);
  };

  const handleChange = (field, event) => {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) value = 0;
    updateExpenses(field, value);
  };

  return (
    <Paper elevation={3} className="expenses-paper">
      <Box className="expenses-header" onClick={() => setOpen(!open)}>
        <Typography variant="h6">Homeowner Expenses</Typography>
        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={2} className="expenses-grid">
          <Grid item xs={12} sm={6}>
            <Box className="expenses-input-group">
              <TextField
                sx={{ flex: 1 }}
                fullWidth
                label="One-time Expenses"
                type="number"
                value={expenses.oneTimeExpenses || ''}
                onChange={(e) => handleChange('oneTimeExpenses', e)}
              />
              <FormControl className="expenses-form-control">
                <Select
                  value={expenses.oneTimeUnit}
                  onChange={(e) => handleUnitChange('oneTimeUnit', e)}
                >
                  <MenuItem value="Rs">₹</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box className="expenses-input-group">
              <TextField
                sx={{ flex: 1 }}
                fullWidth
                label="Property Taxes / year"
                type="number"
                value={expenses.propertyTaxes || ''}
                onChange={(e) => handleChange('propertyTaxes', e)}
              />
              <FormControl className="expenses-form-control">
                <Select
                  value={expenses.taxesUnit}
                  onChange={(e) => handleUnitChange('taxesUnit', e)}
                >
                  <MenuItem value="Rs">₹</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box className="expenses-input-group">
              <TextField
                sx={{ flex: 1 }}
                fullWidth
                label="Home Insurance / year"
                type="number"
                value={expenses.homeInsurance || ''}
                onChange={(e) => handleChange('homeInsurance', e)}
              />
              <FormControl className="expenses-form-control">
                <Select
                  value={expenses.homeInsUnit}
                  onChange={(e) => handleUnitChange('homeInsUnit', e)}
                >
                  <MenuItem value="Rs">₹</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maintenance Expenses / month"
              type="number"
              value={expenses.maintenance || ''}
              onChange={(e) => handleChange('maintenance', e)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default ExpensesForm;
