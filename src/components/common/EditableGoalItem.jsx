import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Chip,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import SliderInput from "./SliderInput";

export const EditableGoalItem = ({
  goal,
  currency,
  currentYear,
  considerInflation,
  onUpdate,
  onDelete,
  onInvestmentChange,
  investmentAmount = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(goal);
  const [investmentMode, setInvestmentMode] = useState(false);
  const [investmentData, setInvestmentData] = useState({
    monthlyInvestment: investmentAmount || 0,
    investmentType: "sip", // 'lumpsum' or 'sip'
    expectedReturn: 8, // percentage per annum
  });

  const handleSave = () => {
    if (editedGoal.name && editedGoal.targetAmount > 0) {
      onUpdate({
        ...editedGoal,
        targetAmount: Number(editedGoal.targetAmount),
        targetYear: Number(editedGoal.targetYear),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedGoal(goal);
    setIsEditing(false);
  };

  const calculateInflatedAmount = () => {
    if (considerInflation && goal.targetYear > currentYear) {
      return goal.targetAmount * Math.pow(1.06, goal.targetYear - currentYear);
    }
    return goal.targetAmount;
  };

  const yearsToGoal = goal.targetYear - currentYear;
  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN")}`;

  const getGoalTypeColor = () => {
    const goalName = goal.name.toLowerCase();
    if (goalName.includes("retirement")) return "error";
    if (goalName.includes("education")) return "success";
    if (goalName.includes("emergency")) return "warning";
    return "info";
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {isEditing ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            fullWidth
            label="Goal Name"
            size="small"
            value={editedGoal.name}
            onChange={(e) =>
              setEditedGoal({ ...editedGoal, name: e.target.value })
            }
          />
          <SliderInput
            label="Target Amount"
            value={Number(editedGoal.targetAmount)}
            onChange={(val) =>
              setEditedGoal({ ...editedGoal, targetAmount: val })
            }
            min={0}
            max={100000000}
            step={100000}
            showInput={true}
          />
          <SliderInput
            label="Target Year"
            value={Number(editedGoal.targetYear)}
            onChange={(val) =>
              setEditedGoal({ ...editedGoal, targetYear: val })
            }
            min={currentYear}
            max={currentYear + 50}
            step={1}
            showInput={true}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={handleCancel}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {goal.name}
                </Typography>
                <Chip
                  label={`${yearsToGoal} years`}
                  size="small"
                  color={getGoalTypeColor()}
                  variant="filled"
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 600, mb: 0.5 }}
              >
                Target: {formatCurrency(goal.targetAmount)}
              </Typography>

              {considerInflation && goal.targetYear > currentYear && (
                <Tooltip title={`Adjusted for 6% annual inflation`}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "warning.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <InfoIcon fontSize="small" />
                    Inflation-adjusted:{" "}
                    {formatCurrency(Math.round(calculateInflatedAmount()))}
                  </Typography>
                </Tooltip>
              )}
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
                onClick={() => onDelete(goal.id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {investmentMode && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1.5,
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Investment Plan
              </Typography>

              <Select
                fullWidth
                size="small"
                value={investmentData.investmentType}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    investmentType: e.target.value,
                  })
                }
                sx={{ mb: 1.5 }}
              >
                <MenuItem value="sip">
                  SIP (Systematic Investment Plan)
                </MenuItem>
                <MenuItem value="lumpsum">Lumpsum Investment</MenuItem>
              </Select>

              {investmentData.investmentType === "sip" ? (
                <TextField
                  fullWidth
                  label="Monthly Investment"
                  type="number"
                  size="small"
                  value={investmentData.monthlyInvestment}
                  onChange={(e) =>
                    setInvestmentData({
                      ...investmentData,
                      monthlyInvestment: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2">/ month</Typography>
                    ),
                  }}
                  sx={{ mb: 1.5 }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Lumpsum Amount"
                  type="number"
                  size="small"
                  value={investmentData.monthlyInvestment}
                  onChange={(e) =>
                    setInvestmentData({
                      ...investmentData,
                      monthlyInvestment: Number(e.target.value),
                    })
                  }
                  sx={{ mb: 1.5 }}
                />
              )}

              <TextField
                fullWidth
                label="Expected Annual Return (%)"
                type="number"
                size="small"
                value={investmentData.expectedReturn}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    expectedReturn: Number(e.target.value),
                  })
                }
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="small"
                onClick={() => {
                  onInvestmentChange(goal.id, investmentData);
                  setInvestmentMode(false);
                }}
                sx={{ mt: 1.5 }}
              >
                Save Investment Plan
              </Button>
            </Paper>
          )}

          {investmentAmount > 0 && !investmentMode && (
            <Box
              sx={{
                p: 1.5,
                backgroundColor: "#e8f5e9",
                borderRadius: 1,
                borderLeft: "4px solid #4caf50",
                mb: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#1b5e20", fontWeight: 600 }}
              >
                💰 Active Investment: {formatCurrency(investmentAmount)}/month
              </Typography>
            </Box>
          )}

          {!investmentMode && (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => setInvestmentMode(true)}
            >
              {investmentAmount > 0
                ? "Update Investment Plan"
                : "Create Investment Plan"}
            </Button>
          )}
        </>
      )}
    </Paper>
  );
};

export default EditableGoalItem;
