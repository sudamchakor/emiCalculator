import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const PasswordUpdateModal = ({
  passwordModalOpen,
  setPasswordModalOpen,
  hasPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  handlePasswordSubmit,
  passwordChangeLoading,
  passwordChangeError,
}) => {
  return (
    <Dialog
      open={passwordModalOpen}
      onClose={() => setPasswordModalOpen(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Update Security</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {hasPassword && (
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          )}
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            error={!!passwordChangeError}
            helperText={passwordChangeError}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setPasswordModalOpen(false)} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePasswordSubmit}
          disabled={passwordChangeLoading}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordUpdateModal;
