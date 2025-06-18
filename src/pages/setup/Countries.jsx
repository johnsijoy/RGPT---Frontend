import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
  TablePagination,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';

import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const countriesData = [
  {
    id: '47730966742691691',
    name: 'Dubai, UAE',
    code: 'UAE',
    description: 'Middle Eastern Country',
  },
  {
    id: '452841597447000171',
    name: 'India',
    code: 'IN',
    description: 'South Asian Country',
  },
  {
    id: '23489472378937842',
    name: 'United States',
    code: 'US',
    description: 'North American Country',
  },
  {
    id: '91823478972348912',
    name: 'Canada',
    code: 'CA',
    description: 'Country in North America',
  },
  {
    id: '91238912389128391',
    name: 'Germany',
    code: 'DE',
    description: 'European Country',
  },
  {
    id: '21389472389472389',
    name: 'Singapore',
    code: 'SG',
    description: 'Island Country in Southeast Asia',
  },
  {
    id: '48374982374982374',
    name: 'Australia',
    code: 'AU',
    description: 'Country in Oceania',
  },
];

export default function Countries() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [selectedRows, setSelectedRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectAll = (event) => {
    setSelectedRows(event.target.checked ? filteredData.map((row) => row.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredData = countriesData.filter(
    (row) =>
      (!query || row.code === query || row.name.includes(query)) &&
      (!search ||
        row.id.includes(search) ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportExcel = () => {
    const exportData = filteredData.map((row) => ({
      ID: row.id,
      Name: row.name,
      Code: row.code,
      Description: row.description || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Countries');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(blob, 'Countries.xlsx');
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Filter Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-label">Filter by Country</InputLabel>
          <Select
            labelId="filter-label"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            label="Filter by Country"
          >
            <MenuItem value="UAE">UAE</MenuItem>
            <MenuItem value="IN">India</MenuItem>
            <MenuItem value="US">United States</MenuItem>
            <MenuItem value="CA">Canada</MenuItem>
            <MenuItem value="DE">Germany</MenuItem>
            <MenuItem value="SG">Singapore</MenuItem>
            <MenuItem value="AU">Australia</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleExportExcel}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Table */}
      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={
                    selectedRows.length === filteredData.length && filteredData.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Countries ID <FilterListIcon fontSize="small" sx={{ color: 'black' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Country Name <FilterListIcon fontSize="small" sx={{ color: 'black' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Country Code <FilterListIcon fontSize="small" sx={{ color: 'black' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Country Description <FilterListIcon fontSize="small" sx={{ color: 'black' }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                <TableCell sx={{ color: 'black' }}>{row.id}</TableCell>
                <TableCell sx={{ color: 'black' }}>{row.name}</TableCell>
                <TableCell sx={{ color: 'black' }}>{row.code}</TableCell>
                <TableCell sx={{ color: 'black' }}>{row.description || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{ borderTop: '1px solid #eee' }}
        />
      </Paper>
    </Box>
  );
}
