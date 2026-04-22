import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EditableIncomeExpenseItem from "../../../components/common/EditableIncomeExpenseItem";
import SliderInput from "../../../components/common/SliderInput";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIncomes,
  addIncome,
  deleteIncome,
  updateIncome,
  selectTotalMonthlyIncome,
  selectCareerGrowthRate,
  setCareerGrowthRate,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";

const currentYear = new Date().getFullYear();

export default function IncomeSection({ isModal, onCloseModal, isSmallScreen }) {
  const dispatch = useDispatch();

  const incomes = useSelector(selectIncomes) || [];
  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const currency = useSelector(selectCurrency);

  const careerGrowthRate = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.value : (careerGrowthRaw || 0);
  const careerGrowthType = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.type : 'percentage';

  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    startYear: currentYear,
    endYear: currentYear + 10,
  });
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [incomeStartYearOpen, setIncomeStartYearOpen] = useState(false);
  const [incomeEndYearOpen, setIncomeEndYearOpen] = useState(false);

  const handleEditIncome = (income) => {
    setEditingIncomeId(income.id);
    setNewIncome({
      ...income,
      amount: String(income.amount),
      frequency: income.frequency || "monthly",
      startYear: income.startYear || currentYear,
      endYear: income.endYear || currentYear + 10,
    });
  };

  const handleCancelEditIncome = () => {
    setEditingIncomeId(null);
    setNewIncome({
      name: "",
      amount: "",
      frequency: "monthly",
      startYear: currentYear,
      endYear: currentYear + 10,
    });
  };

  const handleAddOrUpdateIncome = () => {
    if (newIncome.name && newIncome.amount) {
      const payload = {
        ...newIncome,
        amount: Number(newIncome.amount),
      };
      if (editingIncomeId) {
        dispatch(updateIncome({ ...payload, id: editingIncomeId }));
      } else {
        dispatch(addIncome({ ...payload, id: Date.now() }));
      }
      handleCancelEditIncome();
      if (isModal) {
        onCloseModal();
      }
    }
  };

  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Paper
      sx={{
        p: isModal ? 4 : 3, // Apply padding from modalStyle when in modal
        height: "100%",
        ...(isModal && { // Apply modal-specific styles when in modal
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
        }),
      }}
    >
      {!isModal && ( // Show Income Details, list, total, and career growth only if not in modal
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Income Details
            <InfoIcon fontSize="small" sx={{ opacity: 0.6 }} />
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
            {incomes &&
              incomes.map((inc) => (
                <EditableIncomeExpenseItem
                  key={inc.id}
                  item={inc}
                  currency={currency}
                  onEdit={() => handleEditIncome(inc)}
                  onUpdate={(updatedInc) => dispatch(updateIncome(updatedInc))}
                  onDelete={(id) => dispatch(deleteIncome(id))}
                  totalIncome={totalIncome}
                  isIncome={true}
                />
              ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {(!isSmallScreen || isModal) && ( // Show form if not small screen (inline) OR if in modal (small screen)
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {editingIncomeId ? "Edit Income" : "Add New Income"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Source"
                  value={newIncome.name}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput
                  label="Amount"
                  value={Number(newIncome.amount) || 0}
                  onChange={(val) => setNewIncome({ ...newIncome, amount: val })}
                  min={0}
                  max={10000000}
                  step={1000}
                  showInput={true}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={newIncome.frequency}
                    label="Frequency"
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, frequency: e.target.value })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Start Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={incomeStartYearOpen}
                  onOpen={() => setIncomeStartYearOpen(true)}
                  onClose={() => setIncomeStartYearOpen(false)}
                  value={dayjs(`${newIncome.startYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewIncome({ ...newIncome, startYear: newValue ? newValue.year() : currentYear })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setIncomeStartYearOpen(true) } }}
                  minDate={dayjs(`${currentYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="End Year"
                  views={['year', 'month']}
                  openTo="month"
                  open={incomeEndYearOpen}
                  onOpen={() => setIncomeEndYearOpen(true)}
                  onClose={() => setIncomeEndYearOpen(false)}
                  value={dayjs(`${newIncome.endYear}-01-01`)}
                  onChange={(newValue) =>
                    setNewIncome({ ...newIncome, endYear: newValue ? newValue.year() : currentYear + 10 })
                  }
                  slotProps={{ textField: { size: 'small', fullWidth: true, onClick: () => setIncomeEndYearOpen(true) } }}
                  minDate={dayjs(`${newIncome.startYear}-01-01`)}
                  maxDate={dayjs(`${currentYear + 50}-12-31`)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: "flex-end",
                }}
              >
                {editingIncomeId && (
                  <Button onClick={handleCancelEditIncome}>Cancel</Button>
                )}
                {isModal && (
                  <Button onClick={onCloseModal}>Cancel</Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleAddOrUpdateIncome}
                >
                  {editingIncomeId ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {!isModal && ( // Show total income and career growth only if not in modal
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "success.main" }}
          >
            Total Monthly Income: {formatCurrency(totalIncome)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Career Growth (Year-on-Year)
          </Typography>
          <AmountWithUnitInput
            label="Expected Annual Salary Hike"
            value={careerGrowthType === 'percentage' ? (careerGrowthRate * 100).toFixed(2) : careerGrowthRate}
            onAmountChange={(e) => {
              const val = Number(e.target.value);
              dispatch(setCareerGrowthRate({
                type: careerGrowthType,
                value: careerGrowthType === 'percentage' ? val / 100 : val
              }));
            }}
            unitValue={careerGrowthType === 'percentage' ? '%' : currency}
            onUnitChange={(e) => {
              const newUnit = e.target.value;
              const newType = newUnit === '%' ? 'percentage' : 'fixed';
              dispatch(setCareerGrowthRate({
                type: newType,
                value: newType === 'percentage' ? 0.1 : 50000
              }));
            }}
            unitOptions={[
              { value: '%', label: '%' },
              { value: currency, label: currency }
            ]}
          />
        </>
      )}
    </Paper>
  );
}
