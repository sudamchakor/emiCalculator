import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  Stack,
  Divider,
  useMediaQuery,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEmiContext } from "../context/EmiContext";

const Settings = () => {
  const {
    currency,
    setCurrency,
    themeMode,
    setThemeMode,
    autoSave,
    setAutoSave,
    saveSettingsToLocal,
    saveTrigger,
  } = useEmiContext();

  const [useSystemDefault, setUseSystemDefault] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Component for the little color dot
  const ColorDot = ({ color }) => (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: color,
        mr: 1,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    />
  );

  useEffect(() => {
    if (useSystemDefault) setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [useSystemDefault, prefersDarkMode, setThemeMode]);

  useEffect(() => {
    if (autoSave) saveSettingsToLocal({ currency, themeMode, autoSave });
  }, [currency, themeMode, autoSave]);

  useEffect(() => {
    if (saveTrigger > 0) setOpenToast(true);
  }, [saveTrigger]);

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="700" gutterBottom>
            Settings
          </Typography>

          <Stack spacing={4} sx={{ mt: 3 }}>
            {/* Theme Section - Single Line */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  THEME SELECTION
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={useSystemDefault}
                      onChange={(e) => setUseSystemDefault(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2">System Default</Typography>
                  }
                />
              </Stack>

              <ToggleButtonGroup
                fullWidth
                value={themeMode}
                exclusive
                onChange={(e, next) => next && setThemeMode(next)}
                disabled={useSystemDefault}
                size="small"
                color="primary"
              >
                <ToggleButton value="light">
                  <ColorDot color="#fff" /> Light
                </ToggleButton>
                <ToggleButton value="dark">
                  <ColorDot color="#121212" /> Dark
                </ToggleButton>
                <ToggleButton value="blue">
                  <ColorDot color="#1976d2" /> Blue
                </ToggleButton>
                <ToggleButton value="green">
                  <ColorDot color="#2e7d32" /> Green
                </ToggleButton>
                <ToggleButton value="yellow">
                  <ColorDot color="#fbc02d" /> Yellow
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Currency - Full Width */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                CURRENCY
              </Typography>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Preferred Currency</InputLabel>
                <Select
                  value={currency}
                  label="Preferred Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="INR">INR - Indian Rupee (₹)</MenuItem>
                  <MenuItem value="USD">USD - US Dollar ($)</MenuItem>
                  <MenuItem value="EUR">EUR - Euro (€)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider />

            {/* Autosave Toggle */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Autosave
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Always syncs with local storage
                </Typography>
              </Box>
              <Switch
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={openToast}
        autoHideDuration={1500}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Settings Updated
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
