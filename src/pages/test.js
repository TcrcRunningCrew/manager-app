import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";

// 예제 데이터
function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0),
  createData("Ice cream sandwich", 237, 9.0),
  // 추가 데이터...
];

function BasicTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // 페이지네이션 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // 검색 쿼리 핸들러
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 데이터 필터링
  const filteredRows = rows.filter((row) => {
    return row.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <TextField
        label='Search'
        variant='outlined'
        fullWidth
        margin='normal'
        onChange={handleSearchChange}
      />
      <TableContainer
        component={Paper}
        className='bg-gray-800 shadow-md rounded-lg overflow-hidden'
      >
        <Table className='min-w-full divide-y divide-gray-700'>
          <TableHead className='bg-blue-100'>
            <TableRow>
              <TableRow>
                <TableCell className='text-sm font-medium text-white px-6 py-4 text-left'>
                  Dessert
                </TableCell>
                <TableCell className='text-sm font-medium text-white px-6 py-4 text-right'>
                  Calories
                </TableCell>
                <TableCell className='text-sm font-medium text-white px-6 py-4 text-right'>
                  Fat&nbsp;(g)
                </TableCell>
              </TableRow>
            </TableRow>
          </TableHead>
          <TableBody className='bg-gray-800 divide-y divide-gray-700'>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.name} className='hover:bg-gray-300'>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell
                    align='right'
                    className='text-sm text-white px-6 py-4 whitespace-nowrap text-right'
                  >
                    {row.calories}
                  </TableCell>
                  <TableCell
                    align='right'
                    className='text-sm text-white px-6 py-4 whitespace-nowrap text-right'
                  >
                    {row.fat}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]} // 5를 옵션에 추가
        />
      </TableContainer>
    </>
  );
}

export default BasicTable;
