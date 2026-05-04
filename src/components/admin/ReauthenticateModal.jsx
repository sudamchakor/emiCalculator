import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const ReauthenticateModal = ({
  reauthenticateOpen,
  setReauthenticateOpen,
  reauthPassword,
  setReauthPassword,
  handleReauthenticate,
  reauthError,
}) => {
  return (
    <Dialog
      open={reauthenticateOpen}
      onClose={() => setReauthenticateOpen(false)}
    >
      <DialogTitle>Verify Identity</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          For security, enter your password to proceed with deletion.
        </DialogContentText>
        <TextField
          autoFocus
          label="Password"
          type="password"
          fullWidth
          value={reauthPassword}
          onChange={(e) => setReauthPassword(e.target.value)}
          error={!!reauthError}
          helperText={reauthError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReauthenticate} variant="contained">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReauthenticateModal;
