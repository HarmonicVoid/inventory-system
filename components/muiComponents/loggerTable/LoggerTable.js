import React, { useEffect, useState } from 'react';
import {
  HeaderStyledTableRow,
  Search,
  SearchIconWrapper,
  StyledInputBase,
  StyledTableCell,
  StyledTableRow,
  StyledTableSortLabel,
  TableStyled,
} from './loggerStyle.js';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { TableHead, Typography } from '@mui/material';

const headCells = [
  {
    id: 'deliveryNumber',
    label: 'Delivery Number',
  },
  {
    id: 'partNumber',
    label: 'Part Number',
  },

  {
    id: 'user',
    label: 'User',
  },
  { id: 'timestamp', label: 'Date & Time' },
  {
    id: 'serialNumber',
    label: 'Serial Number',
  },
];

export default function MyTable({ data }) {
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [partsData, setPartsData] = useState([]);

  useEffect(() => {
    return setPartsData(data);
  }, [data]);

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
            x.deliveryNumber.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
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
      f;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(filterFn.fn(partsData), getComparator(order, orderBy));
  };

  return (
    <Box sx={{ width: '100%', height: '80%' }}>
      <Card
        elevation={5}
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search delivery..."
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearch}
            />
          </Search>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Typography
              sx={{ color: 'white', marginRight: 4, fontWeight: 'bold' }}
            >
              Total: {partsData.length}
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card
        elevation={5}
        sx={{
          height: '100%',
          backgroundColor: '#041316',
        }}
      >
        <TableContainer sx={{ height: '600px' }}>
          <TableStyled>
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
              <HeaderStyledTableRow>
                <StyledTableCell
                  sortDirection={orderBy === headCells[0].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    {headCells[0].disableSorting ? (
                      headCells[0].label
                    ) : (
                      <StyledTableSortLabel
                        active={orderBy === headCells[0].id}
                        direction={orderBy === headCells[0].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[0].id);
                        }}
                      >
                        {headCells[0].label}
                      </StyledTableSortLabel>
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  sortDirection={orderBy === headCells[1].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    {headCells[1].disableSorting ? (
                      headCells[1].label
                    ) : (
                      <StyledTableSortLabel
                        active={orderBy === headCells[1].id}
                        direction={orderBy === headCells[1].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[1].id);
                        }}
                      >
                        {headCells[1].label}
                      </StyledTableSortLabel>
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  sortDirection={orderBy === headCells[4].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    {headCells[4].disableSorting ? (
                      headCells[4].label
                    ) : (
                      <StyledTableSortLabel
                        active={orderBy === headCells[4].id}
                        direction={orderBy === headCells[4].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[4].id);
                        }}
                      >
                        {headCells[4].label}
                      </StyledTableSortLabel>
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  sortDirection={orderBy === headCells[2].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    {headCells[2].disableSorting ? (
                      headCells[2].label
                    ) : (
                      <StyledTableSortLabel
                        active={orderBy === headCells[2].id}
                        direction={orderBy === headCells[2].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[2].id);
                        }}
                      >
                        {headCells[2].label}
                      </StyledTableSortLabel>
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  sortDirection={orderBy === headCells[3].id ? order : false}
                >
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {headCells[3].disableSorting ? (
                      headCells[3].label
                    ) : (
                      <StyledTableSortLabel
                        active={orderBy === headCells[3].id}
                        direction={orderBy === headCells[3].id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCells[3].id);
                        }}
                      >
                        {headCells[3].label}
                      </StyledTableSortLabel>
                    )}
                  </Box>
                </StyledTableCell>
              </HeaderStyledTableRow>
            </TableHead>

            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell
                    sx={{
                      fontSize: '1.4rem',
                    }}
                    align="center"
                  >
                    <Box>{item.deliveryNumber}</Box>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      fontSize: '1.4rem',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.partNumber}
                  </StyledTableCell>

                  <StyledTableCell
                    sx={{
                      fontSize: '1.4rem',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.serialNumber}
                  </StyledTableCell>

                  <StyledTableCell
                    sx={{
                      fontSize: '1.4rem',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    {item.removedBy}
                  </StyledTableCell>

                  <StyledTableCell
                    sx={{
                      fontSize: '1.4rem',
                      padding: '2px',
                    }}
                    align="center"
                  >
                    <Box>
                      {new Date(
                        item.timestamp.seconds * 1000
                      ).toLocaleDateString('en-US')}
                    </Box>
                    <Box>
                      {item.timestamp.toDate().toLocaleTimeString('en-US')}
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </TableStyled>
        </TableContainer>
      </Card>
    </Box>
  );
}
