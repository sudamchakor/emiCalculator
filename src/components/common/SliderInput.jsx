import React from 'react';
import {
  Box,
  Slider,
  TextField,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const SliderInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  warningThreshold = null,
  warningText = '',
  tooltipText = '',
  showInput = true,
  color = 'primary',
}) => {
  const numValue = Number(value) || 0;
  const isWarning = warningThreshold !== null && numValue > warningThreshold;
  const sliderColor = isWarning ? 'error' : color;

  const handleInputChange = (e) => {
    const val = e.target.value;
    // Strip leading zeros if more than 1 char (e.g. 05 -> 5)
    let sanitizedVal = val.replace(/^0+(?=\d)/, '');
    
    let newVal = sanitizedVal === '' ? '' : Number(sanitizedVal);
    
    // Prevent going above max realistically possible
    if (newVal !== '' && newVal > max) {
      newVal = max;
    }
    
    onChange(newVal);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText}>
              <InfoIcon
                fontSize="small"
                sx={{
                  color: isWarning ? 'error.main' : 'info.main',
                  cursor: 'help',
                  opacity: 0.7,
                }}
              />
            </Tooltip>
          )}
        </Box>
        {showInput && (
          <TextField
            type="number"
            value={value}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            size="small"
            inputProps={{ 
              min, 
              max, 
              step,
              style: { 
                MozAppearance: 'textfield',
              } 
            }}
            sx={{ 
              flexGrow: 1,
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                display: 'none',
              },
            }}
            error={isWarning}
          />
        )}
      </Box>

      <Slider
        value={numValue}
        onChange={(e, newValue) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        marks={marks}
        valueLabelDisplay="auto"
        color={sliderColor}
        sx={{
          '& .MuiSlider-track': {
            backgroundColor: isWarning ? 'error.main' : undefined,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: isWarning ? 'error.main' : undefined,
          },
        }}
      />

      {isWarning && warningText && (
        <Paper
          sx={{
            mt: 1.5,
            p: 1.5,
            backgroundColor: '#ffebee',
            borderLeft: '4px solid #f44336',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: '#c62828' }}>
            {warningText}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SliderInput;
