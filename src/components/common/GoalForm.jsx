import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SliderInput from "./SliderInput";

export const GoalForm = ({
  goal,
  currentYear,
  onSave,
  onCancel,
}) => {
  const [editedGoal, setEditedGoal] = useState(goal);

  useEffect(() => {
    setEditedGoal(goal);
  }, [goal]);

  const handleSave = () => {
    if (editedGoal.name && editedGoal.targetAmount > 0) {
      onSave({
        ...editedGoal,
        targetAmount: Number(editedGoal.targetAmount),
        targetYear: Number(editedGoal.targetYear),
        investmentType: editedGoal.investmentType,
        stepUpRate: editedGoal.investmentType === 'step_up_sip' ? Number(editedGoal.stepUpRate) : 0,
      });
    }
  };

  return (
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
      <FormControl size="small" fullWidth>
        <InputLabel>Investment Type</InputLabel>
        <Select
          value={editedGoal.investmentType || 'sip'}
          label="Investment Type"
          onChange={(e) => setEditedGoal({...editedGoal, investmentType: e.target.value})}
        >
          <MenuItem value="sip">Standard SIP</MenuItem>
          <MenuItem value="lumpsum">Lumpsum</MenuItem>
          <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
        </Select>
      </FormControl>

      {editedGoal.investmentType === 'step_up_sip' && (
        <SliderInput
          label="Annual Step-Up Rate (%)"
          value={Number(editedGoal.stepUpRate) || 0}
          onChange={(val) => setEditedGoal({...editedGoal, stepUpRate: val})}
          min={0}
          max={20}
          step={0.5}
          showInput={true}
          unit="%"
        />
      )}

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
          onClick={onCancel}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default GoalForm;
