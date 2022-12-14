import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const TableStyled = styled(
  Table,
  {}
)({
  borderCollapse: 'separate',
  borderSpacing: '0px 5px ',
  backgroundColor: '#353535',
});

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {},
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: 'white',
  },
  '&.MuiTableCell-root': {
    borderColor: '#424242    ',
  },
}));

export const CreateButton = styled(
  Button,
  {}
)({
  padding: '10px 24px',
  borderRadius: 5,
  backgroundColor: '#00695c',
  color: 'WHITE',
  position: 'absolute',
  right: '10px',

  '&:hover': {
    backgroundColor: '#003d33',
  },
  '&:active': {
    backgroundColor: '#003d33',
  },
});

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 5,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#CFD8DC',
  '& .MuiInputBase-input': {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));
