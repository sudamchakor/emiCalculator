import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Divider } from '@mui/material';
import SliderInput from '../common/SliderInput';

export default function GoalForm({ onAdd, currentYear }) {
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetYear: currentYear + 5
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetYear) {
      onAdd({
        id: Date.now(),
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        targetYear: Number(newGoal.targetYear)
      });
      setNewGoal({ name: '', targetAmount: '', targetYear: currentYear + 5 });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Add Custom Goal</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          size="small"
          label="Goal Name"
          value={newGoal.name}
          onChange={e => setNewGoal({...newGoal, name: e.target.value})}
          fullWidth
          placeholder="e.g., Car Purchase, Vacation, etc."
        />

        <SliderInput
          label="Target Amount"
          value={Number(newGoal.targetAmount) || 0}
          onChange={(val) => setNewGoal({...newGoal, targetAmount: val})}
          min={0}
          max={50000000}
          step={100000}
          showInput={true}
        />

        <SliderInput
          label="Timeline (Target Year)"
          value={Number(newGoal.targetYear) || currentYear + 5}
          onChange={(val) => setNewGoal({...newGoal, targetYear: val})}
          min={currentYear}
          max={currentYear + 50}
          step={1}
          showInput={true}
        />

        <Divider sx={{ my: 1 }} />

        <Button
          variant="contained"
          size="large"
          onClick={handleAddGoal}
          sx={{ mt: 1 }}
        >
          Add Goal
        </Button>
      </Box>
    </Paper>
  );
}

