import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SliderInput from "../common/SliderInput"; // Adjusted import path for SliderInput

export const GoalForm = ({
  goal, // Renamed from initialData for clarity when editing
  currentYear,
  onSave,
}) => {
  const [editedGoal, setEditedGoal] = useState(goal);

  useEffect(() => {
    setEditedGoal(goal);
  }, [goal]);

  // This useEffect ensures that when the goal prop changes (e.g., when opening modal for a different goal),
  // the form's internal state is updated.
  useEffect(() => {
    setEditedGoal(goal);
  }, [goal]);

  // This useEffect calls onSave whenever editedGoal changes,
  // effectively lifting the state up to the parent (FutureGoalsTab)
  // so the parent can access the latest form data for its modal save button.
  useEffect(() => {
    onSave(editedGoal);
  }, [editedGoal, onSave]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        paddingX: 1,
        overflowX: "hidden",
      }}
    >
      <TextField
        fullWidth
        label="Goal Name"
        size="small"
        value={editedGoal.name}
        onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
      />
      <SliderInput
        label="Target Amount"
        value={Number(editedGoal.targetAmount)}
        onChange={(val) => setEditedGoal({ ...editedGoal, targetAmount: val })}
        min={0}
        max={100000000}
        step={100000}
        showInput={true}
      />
      <SliderInput
        label="Target Year"
        value={Number(editedGoal.targetYear)}
        onChange={(val) => setEditedGoal({ ...editedGoal, targetYear: val })}
        min={currentYear}
        max={currentYear + 50}
        step={1}
        showInput={true}
      />
      <FormControl size="small" fullWidth>
        <InputLabel>Investment Type</InputLabel>
        <Select
          value={editedGoal.investmentType || "sip"}
          label="Investment Type"
          onChange={(e) =>
            setEditedGoal({ ...editedGoal, investmentType: e.target.value })
          }
        >
          <MenuItem value="sip">Standard SIP</MenuItem>
          <MenuItem value="lumpsum">Lumpsum</MenuItem>
          <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
        </Select>
      </FormControl>

      {editedGoal.investmentType === "step_up_sip" && (
        <SliderInput
          label="Annual Step-Up Rate (%)"
          value={Number(editedGoal.stepUpRate) || 0}
          onChange={(val) => setEditedGoal({ ...editedGoal, stepUpRate: val })}
          min={0}
          max={20}
          step={0.5}
          showInput={true}
          unit="%"
        />
      )}
    </Box>
  );
};

export default GoalForm;
