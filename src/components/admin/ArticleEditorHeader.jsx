import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Fullscreen,
  FullscreenExit,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArticleEditorHeader = ({
  id,
  stats,
  viewMode,
  setViewMode,
  isFullScreen,
  setIsFullScreen,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 3,
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isFullScreen && (
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h4" fontWeight="bold">
            {id ? 'Edit Article' : 'Create Article'}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: isFullScreen ? 0 : 6 }}
        >
          {stats.words} words | {stats.readTime} min read
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center">
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => val && setViewMode(val)}
          size="small"
          color="primary"
        >
          <ToggleButton value="edit">
            <Edit sx={{ mr: 1, fontSize: 18 }} /> Edit
          </ToggleButton>
          <ToggleButton value="preview">
            <Visibility sx={{ mr: 1, fontSize: 18 }} /> Preview
          </ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}>
          <IconButton
            onClick={() => setIsFullScreen(!isFullScreen)}
            color="inherit"
          >
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default ArticleEditorHeader;
