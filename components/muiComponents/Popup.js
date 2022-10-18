import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import ActionButton from './ActionButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props;
  return (
    <Dialog open={openPopup}>
      <DialogTitle>
        <div style={{ display: 'flex' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            {title}
          </Typography>
          <ActionButton
            onClick={() => {
              setOpenPopup(false);
            }}
            color="primary"
          >
            <CloseIcon sx={{ color: 'black' }} />
          </ActionButton>
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
