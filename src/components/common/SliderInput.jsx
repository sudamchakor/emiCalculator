import React, { useState, useEffect } from "react";
import {
  Box,
  Slider,
  TextField,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export const SliderInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  warningThreshold = null,
  warningText = "",
  tooltipText = "",
  showInput = true,
  color = "primary",
}) => {
  // Internal state for the slider's value during drag or text input
  const [internalValue, setInternalValue] = useState(Number(value) || 0);

  // Synchronize internal state with external value prop
  // This ensures that if the parent component updates the 'value' prop,
  // our internal state also reflects that change.
  useEffect(() => {
    setInternalValue(Number(value) || 0);
  }, [value]);

  const numValue = Number(value) || 0; // Use the external value for warning calculation
  const isWarning = warningThreshold !== null && numValue > warningThreshold;
  const sliderColor = isWarning ? "error" : color;

  const handleInputChange = (e) => {
    const val = e.target.value;
    let sanitizedVal = val.replace(/^0+(?=\d)/, "");
    let newVal = sanitizedVal === "" ? "" : Number(sanitizedVal);

    if (newVal !== "" && newVal > max) {
      newVal = max;
    }
    // Update internal state immediately for TextField visual feedback
    setInternalValue(newVal);
    // Also call external onChange immediately for TextField changes
    onChange(newVal);
  };

  const handleSliderChange = (e, newValue) => {
    // Update internal state immediately during slider drag for smooth visual feedback
    setInternalValue(newValue);
  };

  const handleSliderChangeCommitted = (e, newValue) => {
    // Only call external onChange when slider drag is committed
    // This prevents frequent re-renders of the parent during drag
    onChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", paddingX: 2 }}> {/* Added paddingX to the main Box */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
          >
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText}>
              <InfoIcon
                fontSize="small"
                sx={{
                  color: isWarning ? "error.main" : "info.main",
                  cursor: "help",
                  opacity: 0.7,
                }}
              />
            </Tooltip>
          )}
        </Box>
        {showInput && (
          <TextField
            type="number"
            value={internalValue} // Use internal state for TextField
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            size="small"
            inputProps={{
              min,
              max,
              step,
              style: {
                MozAppearance: "textfield",
                textAlign: "right",
              },
            }}
            sx={{
              marginLeft: "auto",
              minWidth: 50,
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  display: "none",
                },
            }}
            error={isWarning}
          />
        )}
      </Box>

      <Slider
        value={internalValue} // Use internal state for Slider
        onChange={handleSliderChange} // Update internal state during drag
        onChangeCommitted={handleSliderChangeCommitted} // Update external state on commit
        min={min}
        max={max}
        step={step}
        marks={marks}
        valueLabelDisplay="auto"
        color={sliderColor}
        sx={{
          // Removed paddingX from here as it's now on the parent Box
          "& .MuiSlider-track": {
            backgroundColor: isWarning ? "error.main" : undefined,
          },
          "& .MuiSlider-thumb": {
            backgroundColor: isWarning ? "error.main" : undefined,
          },
        }}
      />

      {isWarning && warningText && (
        <Paper
          sx={{
            mt: 1.5,
            p: 1.5,
            backgroundColor: "#ffebee",
            borderLeft: "4px solid #f44336",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#c62828" }}>
            {warningText}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SliderInput;
