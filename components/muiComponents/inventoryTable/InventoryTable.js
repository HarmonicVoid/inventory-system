import React, { useState } from 'react';
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  TableStyled,
} from './inventoryStyles';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Counter from '../Counter';
import ConfirmDialog from '../ConfirmDialog';
import Notifications from '../Notification';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import CircularProgress from '@mui/material/CircularProgress';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { db } from '../../../config/firebase';

const headCells = [
  { id: 'id', label: 'Part' },
  {
    id: 'stock',
    label: 'Stock',
  },
  {
    id: 'reserved',
    label: 'Reserved',
  },

  {
    id: 'availableToUse',
    label: 'Available',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];

function InventoryTable({ model }) {
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [partsData, setPartsData] = useState([]);

  React.useEffect(() => {
    return onSnapshot(
      query(collection(db, 'iPhone Models', model[0], 'Parts')),
      (snapshot) => {
        setPartsData(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      }
    );
  }, [model]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const [records, setRecords] = useState(partsData);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == '') return items;
        else
          return items.filter((x) =>
            x.partName.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    setNotify({
      isOpen: true,
      message: 'Deleted ' + id + ' successfully',
      type: 'error',
    });
  };

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(
      filterFn.fn(partsData),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  if (partsData.length == 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress thickness={3} size="70px" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '80%' }}>
      <Card
        elevation={5}
        sx={{
          height: '100%',
          borderRadius: 0,
          padding: 1,
        }}
      >
        <Card
          elevation={3}
          sx={{
            display: 'flex',
            backgroundColor: '#3D3D3D',
            justifyContent: 'space-between',
            padding: '10px',
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              fontSize: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 1000,
              color: 'white',
            }}
          >
            <Typography variant="h6">{model[1]}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Parts..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearch}
              />
            </Search>
          </Box>
        </Card>
        <TableContainer sx={{ marginTop: 1, height: '100%' }}>
          <TableStyled sx={{ padding: 1 }}>
            <TableHead
              sx={{
                '&.MuiTableHead-root': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  height: '60px',
                },
              }}
            >
              <TableRow>
                <TableCell
                  sortDirection={orderBy === headCells[0].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {headCells[0].disableSorting ? (
                      headCells[0].label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCells[0].id}
                        direction={orderBy === headCells[0].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[0].id);
                        }}
                      >
                        {headCells[0].label}
                      </TableSortLabel>
                    )}
                  </Box>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === headCells[1].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                    }}
                  >
                    {headCells[1].disableSorting ? (
                      headCells[1].label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCells[1].id}
                        direction={orderBy === headCells[1].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[1].id);
                        }}
                      >
                        {headCells[1].label}
                      </TableSortLabel>
                    )}
                  </Box>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === headCells[2].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                    }}
                  >
                    {headCells[2].disableSorting ? (
                      headCells[2].label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCells[2].id}
                        direction={orderBy === headCells[2].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[2].id);
                        }}
                      >
                        {headCells[2].label}
                      </TableSortLabel>
                    )}
                  </Box>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === headCells[3].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                    }}
                  >
                    {headCells[3].disableSorting ? (
                      headCells[3].label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCells[3].id}
                        direction={orderBy === headCells[3].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[3].id);
                        }}
                      >
                        {headCells[3].label}
                      </TableSortLabel>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    sx={{
                      fontSize: '1.1rem',
                      width: '35%',
                      backgroundColor: '#263237',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.partName}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '1.1rem',
                      width: '15%',
                      backgroundColor: '#59656A',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.stock}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: '1.1rem',
                      width: '25%',
                      backgroundColor: '#7780AC',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    <Counter
                      modelId={model[0]}
                      partId={item.id}
                      partData={item}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: '1.1rem',
                      width: '15%',
                      backgroundColor: '#59656A',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.available}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableStyled>
        </TableContainer>

        <TablePagination
          component="div"
          page={page}
          rowsPerPageOptions={pages}
          rowsPerPage={rowsPerPage}
          count={partsData.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Notifications notify={notify} setNotify={setNotify} />
    </Box>
  );
}

// const MainPostTopicComponent = React.memo(InventoryTable);
export default InventoryTable;

{
  /* <TextInput
              sx={{
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'green',
                },
                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: 'red',
                  },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: 'purple',
                  },
                '& .MuiOutlinedInput-input': {
                  color: 'green',
                },
                '&:hover .MuiOutlinedInput-input': {
                  color: 'red',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input':
                  {
                    color: 'purple',
                  },
                '& .MuiInputLabel-outlined': {
                  color: 'green',
                },
                '&:hover .MuiInputLabel-outlined': {
                  color: 'red',
                },
                '& .MuiInputLabel-outlined.Mui-focused': {
                  color: 'purple',
                },
                width: '100%',
              }}
              label="Search Parts"
              onChange={handleSearch}
            /> */
}
