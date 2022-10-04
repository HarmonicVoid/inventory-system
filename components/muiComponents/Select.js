import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';

export default function Select(props) {
  const {
    name,
    value,
    onChange,
    options,
    label,
    error = null,
    ...others
  } = props;

  return (
    <FormControl sx={{ width: '100%' }} {...(error && { error: true })}>
      <InputLabel id="demo-simple-select-outlined-label-type">
        {label}
      </InputLabel>
      <MuiSelect
        labelId="demo-simple-select-outlined-label-type"
        value={value}
        onChange={onChange}
        name={name}
        label={label}
        {...others}
      >
        {options.map((item) => (
          <MenuItem key={item.id} value={item.title}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
