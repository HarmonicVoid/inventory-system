import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select as MuiSelect,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Select(props) {
  const {
    menuProps,
    value,
    onChange,
    options,
    label,
    multipleSelector,
    error = null,
    ...others
  } = props;

  return (
    <FormControl sx={{ width: '100%' }} {...(error && { error: true })}>
      <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      <MuiSelect
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={menuProps}
        {...others}
      >
        {options.map((name) => (
          <MenuItem key={name.id} value={name.title}>
            <Checkbox checked={value.indexOf(name.title) > -1} />
            <ListItemText primary={name.title} />
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
