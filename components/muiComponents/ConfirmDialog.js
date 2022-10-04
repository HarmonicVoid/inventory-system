import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import React from 'react';
import Button from '@mui/material/Button';

// const DialogStyled = styled(
//   Dialog,
//   {}
// )({
//   '& .MuiDialog-paper': { position: 'absolute', top: '20px' },
// });

// const useStyles = makeStyles({
//   dialog: {
//     '& .MuiDialog-paper': { position: 'absolute', top: '20px' },
//   },
//   dialogContent: {
//     textAlign: 'center',
//   },
//   DialogActions: {
//     '& .MuiDialogActions-root': { alignItems: 'center' },
//   },
// });

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;

  return (
    <Dialog open={confirmDialog.isOpen}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }}>DELETE PART</Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{confirmDialog.title}</Typography>
        <Typography variant="h6">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button
          text="Yes"
          sx={{
            backgroundColor: '#B71C1C',
            '&:hover': {
              backgroundColor: '#F44336',
            },
          }}
          onClick={confirmDialog.onConfirm}
        />
        <Button
          text="Cancel"
          color="primary"
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      </DialogActions>
    </Dialog>
  );
}
