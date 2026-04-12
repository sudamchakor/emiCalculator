import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import SliderInput from "../common/SliderInput";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function BasicInfoEdit({
  currentAge,
  retirementAge,
  onSave,
  onCancel,
}) {
  const [tempAge, setTempAge] = useState({
    current: currentAge,
    retirement: retirementAge,
  });

  const handleSave = () => {
    if (tempAge.retirement <= tempAge.current) {
      alert(
        "Time travel not yet supported! Retirement age must be greater than current age.",
      );
      return;
    }
    onSave(tempAge.current, tempAge.retirement);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Edit Basic Info
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SliderInput
          label="Current Age"
          value={tempAge.current}
          onChange={(val) => setTempAge({ ...tempAge, current: val })}
          min={18}
          max={100}
          step={1}
          showInput={true}
        />

        <SliderInput
          label="Target Retirement Age"
          value={tempAge.retirement}
          onChange={(val) => setTempAge({ ...tempAge, retirement: val })}
          min={tempAge.current + 1}
          max={100}
          step={1}
          warningThreshold={60}
          warningText="In India, the standard retirement age is 60. Working beyond this may impact retirement planning. However, you can adjust this based on your personal circumstances."
          tooltipText="Set your target retirement age. Standard in India is 60."
          showInput={true}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Years to Retirement
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 1 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {tempAge.retirement - tempAge.current} years
            </Typography>
          </Paper>
        </Box>

        <Box
          sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
          <Button size="small" onClick={onCancel} startIcon={<CloseIcon />}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
