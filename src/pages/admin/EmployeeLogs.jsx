import React, { useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl,
  InputAdornment, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Button
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import TableSortLabel from '@mui/material/TableSortLabel';
import * as XLSX from 'xlsx';

import employeeLogs from '../../mock/EmployeeLogs';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', minHeight: '28px',
    '& .MuiOutlinedInput-input': { padding: '4px 8px' },
    '& .MuiSelect-select': {
      paddingTop: '4px !important', paddingBottom: '4px !important',
      minHeight: 'auto !important', lineHeight: '1.2 !important'
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -7px) scale(0.75) !important'
    },
  },
  '& .MuiSelect-icon': { fontSize: '1.2rem' },
};

const EmployeeLogs = () => {
  const [search, setSearch] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = employeeLogs.filter((row) =>
    (row.user.toLowerCase().includes(search.toLowerCase()) || row.ip.includes(search)) &&
    (filterUser === '' || row.user === filterUser) &&
    (filterEvent === '' || row.event === filterEvent)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="Employee Logs" />
      <Typography variant="h6" sx={{ mb: 2 }}>Employee Logs</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        {/* Left Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
            onClick={() => {
              setSearch('');
              setFilterUser('');
              setFilterEvent('');
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Save
          </Button>
        </Box>

        {/* Right Filters and Export */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by user or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 180, ...smallerInputSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160, ...smallerInputSx }}>
            <InputLabel>User</InputLabel>
            <Select
              value={filterUser}
              label="User"
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <MenuItem value="" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>All</MenuItem>
              {[...new Set(employeeLogs.map((item) => item.user))].map((user) => (
                <MenuItem key={user} value={user} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>{user}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160, ...smallerInputSx }}>
            <InputLabel>Event</InputLabel>
            <Select
              value={filterEvent}
              label="Event"
              onChange={(e) => setFilterEvent(e.target.value)}
            >
              <MenuItem value="" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>All</MenuItem>
              {[...new Set(employeeLogs.map((item) => item.event))].map((event) => (
                <MenuItem key={event} value={event} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>{event}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            size="small"
            sx={{ color: 'green' }}
            title="Export to Excel"
            onClick={() => {
              const rows = employeeLogs.map(d => [d.user, d.event, d.dateTime, d.source, d.ip, d.affected]);
              const sheet = XLSX.utils.aoa_to_sheet([
                ['User', 'Event', 'Date Time', 'Source', 'IP', 'Affected'],
                ...rows
              ]);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, sheet, 'EmployeeLogs');
              XLSX.writeFile(wb, 'EmployeeLogs.xlsx');
            }}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              {['user', 'event', 'dateTime', 'source', 'ip', 'affected'].map((key) => (
                <TableCell key={key} sx={{ color: '#fff !important', fontSize: 13 }}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(key)}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { opacity: 0, color: '#fff !important' },
                      '&:hover .MuiTableSortLabel-icon': { opacity: 1, color: '#fff !important' }
                    }}
                  >
                    {key === 'dateTime' ? 'Event Date Time' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.user}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.event}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.dateTime}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.source}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.ip}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.affected}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem' }}>
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Pagination count={totalPages} page={page + 1} onChange={(p) => setPage(p - 1)} />
      </Box>
    </Box>
  );
};

export default EmployeeLogs;
