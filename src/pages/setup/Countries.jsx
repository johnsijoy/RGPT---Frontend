import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button,
  InputAdornment, Select, MenuItem, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TableSortLabel
} from '@mui/material';

import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import * as XLSX from 'xlsx';
import countriesData from '../../mock/Countries';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const Countries = () => {
  const [countries, setCountries] = useState(countriesData);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const sortedCountries = [...countries].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedCountries.filter(country => {
    const matchSearch =
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()) ||
      country.description?.toLowerCase().includes(search.toLowerCase());

    const matchQuery = query ? country.code === query : true;
    return matchSearch && matchQuery;
  });

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportExcel = () => {
    const exportData = filtered.map(row => ({
      Name: row.name,
      Code: row.code,
      Description: row.description || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Countries');
    XLSX.writeFile(wb, 'Countries.xlsx');
  };

  const handleCreate = () => {
    const newId = countries.length ? Math.max(...countries.map(c => c.id)) + 1 : 1;
    const newCountry = { id: newId, ...formData };
    setCountries(prev => [...prev, newCountry]);
    setFormData({ name: '', code: '', description: '' });
    setOpenDialog(false);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Countries</Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 160,
            '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '28px' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <Select
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          displayEmpty
          sx={{
            minWidth: 160,
            fontSize: '0.75rem',
            '& .MuiSelect-select': { fontSize: '0.75rem' }
          }}
          MenuProps={{
            PaperProps: { sx: { fontSize: '0.75rem' } }
          }}
        >
          <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Countries</MenuItem>
          {countries.map(c => (
            <MenuItem key={c.code} value={c.code} sx={{ fontSize: '0.75rem' }}>{c.name}</MenuItem>
          ))}
        </Select>

        <Tooltip title="Export to Excel">
          <IconButton size="small" sx={{ color: 'green' }} onClick={handleExportExcel}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#122E3E',
            textTransform: 'none',
            fontSize: '0.75rem',
            padding: '4px 10px'
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create
        </Button>
      </Box>

      {/* Table Section */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#122E3E' }}>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.key} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    <TableSortLabel
                      active={sortConfig.key === col.key}
                      direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': { opacity: 0, color: '#fff' },
                        '&:hover .MuiTableSortLabel-icon': { opacity: 1 }
                      }}
                    >
                      <b>{col.label}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(row => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.code}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.description || '-'}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ fontSize: '0.75rem' }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle
          sx={{
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Create Country
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {['name', 'code', 'description'].map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              margin="dense"
              size="small"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.75rem' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' }
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontSize: '0.75rem' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Countries;
