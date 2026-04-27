import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SliderInput from "./SliderInput";
import ExpnseReadOnlyItem from "./ExpenseReadOnlyItem";

export const EditableIncomeExpenseItem = ({
  item,
  currency,
  onUpdate,
  onDelete,
  isExpense = false,
  isIncome = false,
  isBudgetExceeded = false,
  budgetWarning = "",
  totalIncome = 0,
  totalExpenses = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSave = () => {
    if (editedItem.name && editedItem.amount > 0) {
      if (onUpdate) {
        onUpdate({
          ...editedItem,
          amount: Number(editedItem.amount),
        });
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN")}`;

  const expenseRatio = totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0;
  const getExpenseColor = () => {
    if (expenseRatio > 40) return "error.main";
    if (expenseRatio > 30) return "warning.main";
    return "success.main";
  };

  return (
    <>
      {isEditing ? (
        <Paper
          sx={{
            p: 2,
            mb: 1.5,
            border: isBudgetExceeded
              ? "2px solid #f44336"
              : "1px solid #e0e0e0",
            backgroundColor: isBudgetExceeded ? "#ffebee" : "background.paper",
            borderRadius: 1.5,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                size="small"
                value={editedItem.name}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <SliderInput
                label="Amount"
                value={Number(editedItem.amount)}
                onChange={(val) =>
                  setEditedItem({ ...editedItem, amount: val })
                }
                min={0}
                max={Math.max(10000000, Number(editedItem.amount) * 2)}
                step={1000}
                showInput={true}
              />
            </Grid>
            {isExpense && (
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={editedItem.category || "basic"}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, category: e.target.value })
                    }
                  >
                    <MenuItem value="basic">Basic Need</MenuItem>
                    <MenuItem value="discretionary">Discretionary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            {(isExpense || isIncome) && (
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    label="Frequency"
                    value={editedItem.frequency || "monthly"}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        frequency: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
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
                value={dayjs(
                  `${Number(editedItem.startYear) || currentYear}-01-01`,
                )}
                onChange={(newValue) =>
                  setEditedItem({
                    ...editedItem,
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
                  `${Number(editedItem.endYear) || currentYear + 10}-01-01`,
                )}
                onChange={(newValue) =>
                  setEditedItem({
                    ...editedItem,
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
                  `${Number(editedItem.startYear) || currentYear}-01-01`,
                )}
                maxDate={dayjs(`${currentYear + 50}-12-31`)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton size="small" onClick={handleSave} color="success">
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleCancel} color="inherit">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <ExpnseReadOnlyItem
          item={editedItem}
          currency={currency}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onConfirmDelete={onDelete}
          deletionImpactMessage={`This will permanently remove the ${isExpense ? "expense" : "income"} from your cash flow calculations.`}
          isExpense={isExpense}
          isIncome={isIncome}
          isBudgetExceeded={isBudgetExceeded}
          budgetWarning={budgetWarning}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          expenseRatio={expenseRatio}
          getExpenseColor={getExpenseColor}
          formatCurrency={formatCurrency}
          key={item.id}
        />
      )}
    </>
  );
};

export default EditableIncomeExpenseItem;
