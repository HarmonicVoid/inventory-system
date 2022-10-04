import Button from '@mui/material/Button';
import React from 'react';

export default function ActionButton(props) {
  const { children, onClick } = props;

  return (
    <Button
      sx={{
        '&:hover': {
          backgroundColor: '#B0BEC5',
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
