import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

const CommentForm = ({
  guestName,
  setGuestName,
  newComment,
  setNewComment,
  handlePostComment,
  isSubmitting,
  submitStatus,
  replyTo,
  setReplyTo,
  commentSectionRef,
}) => {
  return (
    <Box
      sx={{
        mb: 6,
        p: 3,
        bgcolor: '#f9f9f9',
        borderRadius: 4,
        border: '1px solid #eee',
      }}
    >
      {submitStatus === 'success' && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2, fontWeight: 700 }}
        >
          Comment submitted successfully! It will appear once approved by the
          moderator.
        </Alert>
      )}
      {submitStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fill in all mandatory fields before submitting.
        </Alert>
      )}

      <Stack spacing={2}>
        {replyTo && (
          <Chip
            label={`Replying to ${replyTo.userName}`}
            onDelete={() => setReplyTo(null)}
            sx={{
              alignSelf: 'flex-start',
              bgcolor: '#fff3e0',
              color: '#e65100',
              fontWeight: 700,
            }}
          />
        )}
        <TextField
          required
          fullWidth
          label="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          disabled={isSubmitting}
          sx={{ bgcolor: '#fff' }}
        />
        <TextField
          required
          fullWidth
          multiline
          rows={3}
          label="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          sx={{ bgcolor: '#fff' }}
        />
        <Button
          variant="contained"
          onClick={handlePostComment}
          disabled={isSubmitting || !newComment.trim() || !guestName.trim()}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{
            bgcolor: '#111',
            color: '#fff',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            width: 'fit-content',
            '&:hover': { bgcolor: '#333' },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CommentForm;
