import React, { useState } from "react";
import styled from "styled-components";
import {
  TextField,
  InputAdornment,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export const InputGroup = styled(Box)`
  display: flex;
  align-items: stretch;
`;

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;

  .MuiToggleButtonGroup-grouped {
    border-radius: 0;
    margin: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.23);
    padding: 0 8px;
    height: 100%;

    &:first-of-type {
      border-left: 1px solid rgba(0, 0, 0, 0.23);
    }

    &:last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

export const AmountInput = ({ label, value, onChange, currency, disabled, placeholder }) => {
  const isPercentage = currency === "%";
  return (
    <TextField
      fullWidth
      disabled={disabled}
      label={label}
      type="number"
      value={value || ""}
      onChange={onChange}
      onFocus={(e) => e.target.select()}
      placeholder={placeholder}
      inputProps={{
        "aria-label": label,
        min: "0",
        step: "0.01",
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0, 0, 0, 0.4)",
          },
          "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: "primary.main",
          },
        },
        "& .MuiInputBase-input": {
          // Improve contrast for better readability
          color: "text.primary",
        },
        "& .MuiInputLabel-root": {
          color: "text.secondary",
          "&.Mui-focused": {
            color: "primary.main",
          },
        },
      }}
      InputProps={{
        startAdornment:
          !isPercentage && currency ? (
            <InputAdornment position="start" sx={{ fontWeight: 600 }}>{currency}</InputAdornment>
          ) : null,
        endAdornment: isPercentage ? (
          <InputAdornment position="end" sx={{ fontWeight: 600 }}>%</InputAdornment>
        ) : null,
      }}
    />
  );
};

export const AmountWithUnitInput = ({
  label,
  value,
  onAmountChange,
  unitValue,
  onUnitChange,
  unitOptions,
  placeholder,
}) => (
  <InputGroup>
    <TextField
      sx={{
        flex: 1,
        minWidth: 0,
        "& .MuiOutlinedInput-root": {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0, 0, 0, 0.4)",
          },
          "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: "primary.main",
          },
        },
        "& .MuiInputBase-input": {
          color: "text.primary",
        },
        "& .MuiInputLabel-root": {
          color: "text.secondary",
          "&.Mui-focused": {
            color: "primary.main",
          },
        },
      }}
      fullWidth
      label={label}
      type="number"
      value={value || ""}
      onChange={onAmountChange}
      onFocus={(e) => e.target.select()}
      placeholder={placeholder}
      inputProps={{
        "aria-label": label,
        min: "0",
        step: "0.01",
      }}
    />
    <StyledToggleButtonGroup
      value={unitValue}
      exclusive
      onChange={(e, newUnit) => {
        if (newUnit !== null) {
          onUnitChange({ target: { value: newUnit } });
        }
      }}
      aria-label="unit selection"
    >
      {unitOptions.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          sx={{
            px: 1,
            minWidth: "auto",
            fontWeight: 600,
            whiteSpace: "nowrap",
            // State-based coloring with better contrast
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              "&:hover": { bgcolor: "primary.dark" },
            },
            "color": "text.primary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </StyledToggleButtonGroup>
  </InputGroup>
);

export const DatePickerInput = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  // Convert ISO string to Dayjs object if needed
  const dayjsValue = value ? (typeof value === 'string' ? dayjs(value) : value) : null;

  const handleChange = (newValue) => {
    if (newValue) {
      // Convert Dayjs object to ISO string before passing to parent
      onChange(newValue.toISOString());
    } else {
      onChange(null);
    }
  };

  return (
    <DatePicker
      label={label}
      views={["year", "month"]}
      openTo="month"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={dayjsValue}
      onChange={handleChange}
      slotProps={{
        textField: {
          fullWidth: true,
          onClick: () => setOpen(true),
          inputProps: {
            "aria-label": label,
          },
          sx: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 0, 0, 0.4)",
              },
              "&.Mui-focused fieldset": {
                borderWidth: 2,
                borderColor: "primary.main",
              },
            },
            "& .MuiInputBase-input": {
              color: "text.primary",
              cursor: "pointer",
            },
            "& .MuiInputLabel-root": {
              color: "text.secondary",
              "&.Mui-focused": {
                color: "primary.main",
              },
            },
          },
        },
      }}
    />
  );
};
