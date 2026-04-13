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
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import SliderInput from "./SliderInput";
// GoalForm is no longer rendered directly here, it's handled by the parent component (FutureGoalsTab) via a modal.

export const EditableGoalItem = ({
  goal,
  currency,
  currentYear,
  considerInflation,
  onEdit, // New prop to trigger modal in parent
  onDelete,
  onInvestmentChange,
  investmentAmount = 0,
}) => {
  const [investmentMode, setInvestmentMode] = useState(false);
  const [investmentData, setInvestmentData] = useState({
    monthlyInvestment: investmentAmount || 0,
    investmentType: goal.investmentType || "sip", // Use goal's investment type
    expectedReturn: 8, // percentage per annum
    stepUpRate: goal.stepUpRate || 0, // Use goal's step-up rate
  });

  const calculateInflatedAmount = () => {
    if (considerInflation && goal.targetYear > currentYear) {
      // Use educationInflationRate if category is 'education', else generalInflationRate
      const inflationRate = goal.category === 'education' ? 0.10 : 0.06; // Hardcoded for now, will use selector later
      return goal.targetAmount * Math.pow(1 + inflationRate, goal.targetYear - currentYear);
    }
    return goal.targetAmount;
  };

  const yearsToGoal = goal.targetYear - currentYear;
  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN")}`;

  const getGoalTypeColor = () => {
    const goalCategory = goal.category;
    if (goalCategory === "retirement") return "error";
    if (goalCategory === "education") return "success";
    if (goalCategory === "safety") return "warning"; // For emergency fund
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

          {considerInflation && yearsToGoal > 0 && (
            <Tooltip title={`Adjusted for ${goal.category === 'education' ? '10%' : '6%'} annual inflation`}>
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
            onClick={() => onEdit(goal)} // Call onEdit prop with the goal data
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

          <FormControl size="small" fullWidth sx={{ mb: 1.5 }}>
            <InputLabel>Investment Type</InputLabel>
            <Select
              value={investmentData.investmentType}
              label="Investment Type"
              onChange={(e) =>
                setInvestmentData({
                  ...investmentData,
                  investmentType: e.target.value,
                  stepUpRate: e.target.value === 'step_up_sip' ? investmentData.stepUpRate : 0, // Reset stepUpRate if not step-up
                })
              }
            >
              <MenuItem value="sip">Standard SIP</MenuItem>
              <MenuItem value="lumpsum">Lumpsum Investment</MenuItem>
              <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
            </Select>
          </FormControl>

          {investmentData.investmentType === "sip" && (
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
          )}

          {investmentData.investmentType === "lumpsum" && (
            <TextField
              fullWidth
              label="Lumpsum Amount"
              type="number"
              size="small"
              value={investmentData.monthlyInvestment} // Reusing monthlyInvestment for lumpsum amount
              onChange={(e) =>
                setInvestmentData({
                  ...investmentData,
                  monthlyInvestment: Number(e.target.value),
                })
              }
              sx={{ mb: 1.5 }}
            />
          )}

          {investmentData.investmentType === "step_up_sip" && (
            <>
              <TextField
                fullWidth
                label="Initial Monthly Investment"
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
              <SliderInput
                label="Annual Step-Up Rate (%)"
                value={Number(investmentData.stepUpRate) || 0}
                onChange={(val) => setInvestmentData({...investmentData, stepUpRate: val})}
                min={0}
                max={20}
                step={0.5}
                showInput={true}
                unit="%"
              />
            </>
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
            sx={{ mt: 1.5 }}
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
            💰 Active Investment: {formatCurrency(investmentAmount)}/month ({goal.investmentType === 'step_up_sip' ? `Step-Up SIP @ ${goal.stepUpRate}%` : goal.investmentType.toUpperCase()})
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
    </Paper>
  );
};

export default EditableGoalItem;
