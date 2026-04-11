import React from "react";
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
    padding: 0 16px;
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

export const AmountInput = ({ label, value, onChange, currency, disabled }) => {
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
      InputProps={{
        startAdornment:
          !isPercentage && currency ? (
            <InputAdornment position="start">{currency}</InputAdornment>
          ) : null,
        endAdornment: isPercentage ? (
          <InputAdornment position="end">%</InputAdornment>
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
}) => (
  <InputGroup>
    <TextField
      sx={{
        flex: 1,
        "& .MuiOutlinedInput-root": {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
      fullWidth
      label={label}
      type="number"
      value={value || ""}
      onChange={onAmountChange}
      onFocus={(e) => e.target.select()}
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
            px: 1.5,
            // State-based coloring
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
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
      value={dayjsValue}
      onChange={handleChange}
      slotProps={{ textField: { fullWidth: true } }}
    />
  );
};
