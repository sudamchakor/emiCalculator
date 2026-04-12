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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import SliderInput from "./SliderInput";

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

  const handleSave = () => {
    if (editedItem.name && editedItem.amount > 0) {
      onUpdate({
        ...editedItem,
        amount: Number(editedItem.amount),
      });
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
    <Paper
      sx={{
        p: 2,
        mb: 1.5,
        border: isBudgetExceeded ? "2px solid #f44336" : "1px solid #e0e0e0",
        backgroundColor: isBudgetExceeded ? "#ffebee" : "background.paper",
        borderRadius: 1.5,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {isEditing ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            fullWidth
            label="Name"
            size="small"
            value={editedItem.name}
            onChange={(e) =>
              setEditedItem({ ...editedItem, name: e.target.value })
            }
          />
          <SliderInput
            label="Amount"
            value={Number(editedItem.amount)}
            onChange={(val) => setEditedItem({ ...editedItem, amount: val })}
            min={0}
            max={Math.max(10000000, Number(editedItem.amount) * 2)}
            step={1000}
            showInput={true}
          />
          {isExpense && editedItem.category && (
            <Select
              fullWidth
              label="Category"
              size="small"
              value={editedItem.category}
              onChange={(e) =>
                setEditedItem({ ...editedItem, category: e.target.value })
              }
            >
              <MenuItem value="basic">Basic Need</MenuItem>
              <MenuItem value="discretionary">Discretionary</MenuItem>
            </Select>
          )}
          {(isExpense || isIncome) && editedItem.frequency && (
            <Select
              fullWidth
              size="small"
              value={editedItem.frequency || "monthly"}
              onChange={(e) =>
                setEditedItem({ ...editedItem, frequency: e.target.value })
              }
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <IconButton size="small" onClick={handleSave} color="success">
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCancel} color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              {isExpense && totalIncome > 0 && (
                <Typography variant="caption" color="textSecondary">
                  {expenseRatio.toFixed(1)}% of income
                </Typography>
              )}
              {isExpense && item.category && (
                <Chip
                  label={item.category === "basic" ? "Basic" : "Discretionary"}
                  size="small"
                  variant="outlined"
                />
              )}
              {(isExpense || isIncome) && item.frequency && (
                <Chip
                  label={
                    item.frequency.charAt(0).toUpperCase() +
                    item.frequency.slice(1)
                  }
                  size="small"
                  variant="filled"
                  color="info"
                />
              )}

              {isBudgetExceeded && (
                <Tooltip title={budgetWarning}>
                  <WarningIcon
                    fontSize="small"
                    sx={{ color: "error.main", cursor: "help" }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: isExpense ? getExpenseColor() : "success.main",
                fontWeight: 600,
              }}
            >
              {formatCurrency(item.amount)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(item.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default EditableIncomeExpenseItem;
