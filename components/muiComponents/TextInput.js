import { TextField } from '@mui/material';
import React from 'react';

export default function TextInput(props) {
  const { name, label, value, onChange, error = null, ...other } = props;

  return (
    <TextField
      variant="outlined"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
