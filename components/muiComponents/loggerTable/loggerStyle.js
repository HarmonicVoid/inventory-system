import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';

export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: '#a2c4c9',
  '&:hover': {
    color: 'white',
  },
  '&.Mui-active': {
    color: '#f3f3f3 ',
  },
}));

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

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#263238',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 'none',
  },

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: '#0062cc',
    boxShadow: 'none',
    color: 'white',
  },
}));

export const HeaderStyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#303030',
  },
  '&.MuiTableRow-root': {
    borderColor: 'red',
    border: 'true',
  },
}));

export const TableStyled = styled(
  Table,
  {}
)({
  backgroundColor: '#1C1C1C',
});

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
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
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));
