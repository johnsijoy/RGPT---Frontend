import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, Paper, TextField, Checkbox, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, MenuItem, Select, InputAdornment
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as XLSX from 'xlsx';

import mockCities from '../../mock/cities';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const Cities = () => {
  const [cities, setCities] = useState(mockCities);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', state: '', country: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;

  const getCityKey = (city) => `${city.name}-${city.state}-${city.country}`;

  const uniqueFilterValues = Array.from(
    new Set(mockCities.flatMap(c => [c.name, c.state, c.country]))
  );

  const filtered = cities.filter(c => {
    const searchText = search.toLowerCase();
    if (!filterKey) {
      return (
        c.name.toLowerCase().includes(searchText) ||
        c.state.toLowerCase().includes(searchText) ||
        c.country.toLowerCase().includes(searchText)
      );
    } else {
      return (
        c.name === filterKey || c.state === filterKey || c.country === filterKey
      );
    }
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = String(a[sortConfig.key]).toLowerCase();
    const valB = String(b[sortConfig.key]).toLowerCase();
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(c => getCityKey(c)) : []);
  };

  const handleSelectOne = (city) => {
    const key = getCityKey(city);
    setSelectedIds(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleOpenForm = (type) => {
    if (type === 'edit') {
      if (selectedIds.length !== 1) return alert('Select exactly one row to modify');
      const sel = cities.find(c => getCityKey(c) === selectedIds[0]);
      setFormData(sel);
    } else {
      setFormData({ name: '', state: '', country: '' });
    }
    setOpen(true);
  };

  const handleDeleteBatch = () => {
    setCities(prev => prev.filter(c => !selectedIds.includes(getCityKey(c))));
    setSelectedIds([]);
    setDeleteConfirmOpen(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.state || !formData.country) {
      return alert('Please fill all fields');
    }
    const key = getCityKey(formData);
    const exists = cities.find(c => getCityKey(c) === key);
    if (exists) {
      setCities(prev => prev.map(c => getCityKey(c) === key ? formData : c));
    } else {
      setCities(prev => [...prev, formData]);
    }
    setSelectedIds([]);
    setFormData({ name: '', state: '', country: '' });
    setOpen(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cities');
    XLSX.writeFile(wb, 'Cities_List.xlsx');
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => setPage(1), [search, filterKey]);

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Cities</Typography>

        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value)}
          size="small"
          displayEmpty
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All Fields</MenuItem>
          {uniqueFilterValues.map(val => (
            <MenuItem key={val} value={val}>{val}</MenuItem>
          ))}
        </Select>

        <IconButton size="small" sx={{ color: 'green' }} title="Export to Excel" onClick={exportToExcel}>
          <DescriptionIcon fontSize="medium" />
        </IconButton>

        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm('create')}
        >
          Create
        </Button>
      </Box>

      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="contained"
          size="small"
          disabled={selectedIds.length !== 1}
          onClick={() => handleOpenForm('edit')}
          sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
        >
          Modify
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={selectedIds.length === 0}
          onClick={() => setDeleteConfirmOpen(true)}
          sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
        >
          Delete
        </Button>
      </Stack>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                  <Checkbox
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginated.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {['name', 'state', 'country'].map(col => (
                  <TableCell
                    key={col}
                    onClick={() => handleSort(col)}
                    sx={{ color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    {col}
                    {sortConfig.key === col && (
                      sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(city => {
                const key = getCityKey(city);
                return (
                  <TableRow key={key} hover selected={selectedIds.includes(key)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(key)}
                        onChange={() => handleSelectOne(city)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.state}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.country}</TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    No record found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(sorted.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedIds.length === 1 ? 'Modify City' : 'Create City'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField label="Name" fullWidth margin="dense" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="State" fullWidth margin="dense" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
          <TextField label="Country" fullWidth margin="dense" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontSize: '0.75rem' }} onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ fontSize: '0.75rem', bgcolor: '#122E3E' }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedIds.length} city{selectedIds.length > 1 ? 'ies' : ''}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#122E3E' }} onClick={handleDeleteBatch}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;
