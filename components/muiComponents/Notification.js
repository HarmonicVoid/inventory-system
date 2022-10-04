import { Alert, Snackbar } from '@mui/material';
import React from 'react';

export default function Notifications(props) {
  const { notify, setNotify } = props;

  const handleClose = (event, reason) => {
    setNotify({
      ...notify,
      isOpen: false,
    });
  };
  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}
