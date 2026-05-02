import React, { useState, useMemo, useEffect } from "react";
import {
  Box, Stack, Typography, useTheme, alpha, Grid, Button, Slide, Paper,
  Select, MenuItem, FormControl, Switch,  Divider
} from "@mui/material";
import {
  PaletteOutlined as PaletteIcon,
  SaveOutlined as SaveIcon,
  SettingsSuggestOutlined as AdvancedIcon,
  CloudDoneOutlined as SyncIcon,
  PaymentsOutlined as CurrencyIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import {
  setThemeMode, setDesignSystem, setVisualStyle, setCurrency, setAutoSave
} from "../store/emiSlice";

import { themePresets } from "../theme/ThemeConfig";
import ThemeSelector from "../components/common/ThemeSelector";
import PageHeader from "../components/common/PageHeader";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const saved = useSelector(state => state.emi);
  const [draft, setDraft] = useState({ ...saved });
  const [openToast, setOpenToast] = useState(false);

  useEffect(() => { setDraft({ ...saved }); }, [saved]);

  const currentPreset = useMemo(() => {
    const found = Object.entries(themePresets).find(([_, p]) =>
        p.arch === draft.designSystem && p.style === draft.visualStyle
    );
    return found ? found[0] : "custom";
  }, [draft.designSystem, draft.visualStyle]);

  const handlePresetChange = (presetKey) => {
    if (presetKey === "custom") return;
    const preset = themePresets[presetKey];
    setDraft({ ...draft, designSystem: preset.arch, visualStyle: preset.style });
  };

  const isDirty = draft.themeMode !== saved.themeMode ||
      draft.designSystem !== saved.designSystem ||
      draft.visualStyle !== saved.visualStyle ||
      draft.currency !== saved.currency ||
      draft.autoSave !== saved.autoSave;

  const handleSave = () => {
    dispatch(setThemeMode(draft.themeMode));
    dispatch(setDesignSystem(draft.designSystem));
    dispatch(setVisualStyle(draft.visualStyle));
    dispatch(setCurrency(draft.currency));
    dispatch(setAutoSave(draft.autoSave));
    setOpenToast(true);
  };

  return (
      <Box sx={{ width: "100%", p: { xs: 2, md: 4 }, pb: 15, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          <PageHeader title="Appearance" subtitle="Customize your dashboard aesthetics." icon={PaletteIcon} />

          <Stack spacing={5}>
            <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 6, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>Visual Style Gallery</Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Select value={currentPreset} onChange={(e) => handlePresetChange(e.target.value)} sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
                  {Object.entries(themePresets).map(([key, p]) => (
                      <MenuItem key={key} value={key}>{p.name} — {p.desc}</MenuItem>
                  ))}
                  <MenuItem value="custom">Manual Configuration (Advanced)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Brand Identity</Typography>
              <ThemeSelector selectedTheme={draft.themeMode} onThemeChange={(v) => setDraft({...draft, themeMode: v})} />
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}><AdvancedIcon color="primary" /> Fine-Tune Style</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>App Personality</Typography>
                  <Stack direction="row" spacing={1}>
                    {['material', 'apple', 'fluent'].map((arch) => (
                        <Button key={arch} onClick={() => setDraft({...draft, designSystem: arch})} variant={draft.designSystem === arch ? "contained" : "outlined"} sx={{ flex: 1, borderRadius: 2 }}>{arch}</Button>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>Surface Vibe</Typography>
                  <Stack direction="row" spacing={1}>
                    {['flat', 'minimalist', 'glass', 'neumorphic'].map((style) => (
                        <Button key={style} onClick={() => setDraft({...draft, visualStyle: style})} variant={draft.visualStyle === style ? "contained" : "outlined"} sx={{ flex: 1, borderRadius: 2 }}>{style}</Button>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>Functional Settings</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}><CurrencyIcon sx={{ fontSize: '1rem' }} /> PREFERRED CURRENCY</Typography>
                    <Select value={draft.currency} onChange={(e) => setDraft({...draft, currency: e.target.value})} fullWidth size="small" sx={{ borderRadius: 2 }}>
                      <MenuItem value="₹">Indian Rupee (₹)</MenuItem>
                      <MenuItem value="$">US Dollar ($)</MenuItem>
                      <MenuItem value="€">Euro (€)</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}><SyncIcon fontSize="small" /> AUTOSAVE</Typography>
                    <Switch checked={draft.autoSave} onChange={(e) => setDraft({...draft, autoSave: e.target.checked})} />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>

          <Slide direction="up" in={isDirty}>
            <Paper elevation={24} sx={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%) !important', p: 1.5, borderRadius: 100, bgcolor: 'text.primary', color: 'background.paper', display: 'flex', alignItems: 'center', gap: 4, px: 3, zIndex: 2000 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, ml: 1 }}>Unsaved style changes</Typography>
              <Stack direction="row" spacing={1}>
                <Button onClick={() => setDraft({ ...saved })} sx={{ color: alpha(theme.palette.common.white, 0.6), fontWeight: 700 }}>Undo</Button>
                <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 100, px: 4, fontWeight: 800 }}>Save Changes</Button>
              </Stack>
            </Paper>
          </Slide>
        </Box>
      </Box>
  );
}