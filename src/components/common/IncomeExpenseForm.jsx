import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SliderInput from "./SliderInput";

const currentYear = new Date().getFullYear();

export default function IncomeExpenseForm({
  initialData,
  isExpense = false,
  onSave,
  onCancel,
  submitLabel = "Save",
}) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    startYear: currentYear,
    endYear: currentYear + 10,
    category: "basic",
    ...initialData,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.amount > 0) {
      onSave({ ...formData, amount: Number(formData.amount) });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
        width: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={isExpense ? "Expense Name" : "Source"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Grid>

        {isExpense ? (
          <Grid item xs={12}>
            <SliderInput
              label="Amount"
              value={Number(formData.amount) || 0}
              onChange={(val) => setFormData({ ...formData, amount: val })}
              min={0}
              max={Math.max(1000000, Number(formData.amount) * 2 || 1000000)}
              step={500}
              showInput={true}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={formData.frequency || "monthly"}
                label="Frequency"
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {isExpense ? (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || "basic"}
                  label="Category"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <MenuItem value="basic">Basic Need</MenuItem>
                  <MenuItem value="discretionary">Discretionary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency || "monthly"}
                  label="Frequency"
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : (
          <Grid item xs={12} sm={12}>
            <SliderInput
              label="Amount"
              value={Number(formData.amount) || 0}
              onChange={(val) => setFormData({ ...formData, amount: val })}
              min={0}
              max={Math.max(10000000, Number(formData.amount) * 2 || 10000000)}
              step={1000}
              showInput={true}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Start Year"
            views={["year", "month"]}
            openTo="month"
            open={startYearOpen}
            onOpen={() => setStartYearOpen(true)}
            onClose={() => setStartYearOpen(false)}
            value={dayjs(`${Number(formData.startYear) || currentYear}-01-01`)}
            onChange={(newValue) =>
              setFormData({
                ...formData,
                startYear: newValue ? newValue.year() : currentYear,
              })
            }
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                onClick: () => setStartYearOpen(true),
              },
            }}
            minDate={dayjs(`${currentYear - 50}-01-01`)}
            maxDate={dayjs(`${currentYear + 50}-12-31`)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="End Year"
            views={["year", "month"]}
            openTo="month"
            open={endYearOpen}
            onOpen={() => setEndYearOpen(true)}
            onClose={() => setEndYearOpen(false)}
            value={dayjs(
              `${Number(formData.endYear) || currentYear + 10}-01-01`,
            )}
            onChange={(newValue) =>
              setFormData({
                ...formData,
                endYear: newValue ? newValue.year() : currentYear + 10,
              })
            }
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                onClick: () => setEndYearOpen(true),
              },
            }}
            minDate={dayjs(
              `${Number(formData.startYear) || currentYear}-01-01`,
            )}
            maxDate={dayjs(`${currentYear + 50}-12-31`)}
          />
        </Grid>
      </Grid>
      <DialogActions>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button variant="contained" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Box>
  );
}