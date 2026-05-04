import React from 'react';
import { Paper, Typography, Stack, Button, IconButton } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

const ArticleSpeechPlayer = ({ isSpeaking, isPaused, toggleSpeech }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        p: 2,
        mb: 4,
        borderRadius: 4,
        bgcolor: '#f8fdfc',
        gap: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{ flexGrow: 1, fontWeight: 700, color: '#004d40' }}
      >
        {isSpeaking ? '🔊 AI is reading...' : 'Listen to this article'}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          onClick={toggleSpeech}
          startIcon={
            isSpeaking && !isPaused ? (
              <PauseRoundedIcon />
            ) : (
              <PlayArrowRoundedIcon />
            )
          }
          sx={{ borderRadius: 3, bgcolor: '#004d40' }}
        >
          {isSpeaking && !isPaused ? 'Pause' : 'Play'}
        </Button>
        {isSpeaking && (
          <IconButton
            onClick={() => {
              window.speechSynthesis.cancel();
              toggleSpeech(); // Call toggleSpeech to reset state
            }}
            color="error"
          >
            <StopRoundedIcon />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
};

export default ArticleSpeechPlayer;
