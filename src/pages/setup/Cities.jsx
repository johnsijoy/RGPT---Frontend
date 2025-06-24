import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, Paper, TextField, Checkbox, Button, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Select,
  InputAdornment, TableSortLabel, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  const [validationDialog, setValidationDialog] = useState(false);
  const [modifyDialog, setModifyDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', state: '', country: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;
  const getCityKey = (city) => `${city.name}-${city.state}-${city.country}`;
  const uniqueFilterValues = Array.from(
    new Set(mockCities.flatMap(c => [c.name, c.state, c.country]))
  );

  const filtered = cities.filter(c => {
    const searchText = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(searchText)
      || c.state.toLowerCase().includes(searchText)
      || c.country.toLowerCase().includes(searchText);
    const matchFilter = filterKey === '' ||
      c.name === filterKey || c.state === filterKey || c.country === filterKey;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key].toLowerCase();
    const bVal = b[sortConfig.key].toLowerCase();
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(getCityKey) : []);
  };

  const handleSelectOne = (city) => {
    const key = getCityKey(city);
    setSelectedIds(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleOpenForm = (type) => {
    if (type === 'edit') {
      if (selectedIds.length !== 1) {
        setModifyDialog(true);
        return;
      }
      const sel = cities.find(c => getCityKey(c) === selectedIds[0]);
      setFormData(sel);
    } else {
      setFormData({ name: '', state: '', country: '' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.state || !formData.country) {
      setValidationDialog(true);
      return;
    }
    const key = getCityKey(formData);
    setCities(prev => {
      const exists = prev.find(c => getCityKey(c) === key);
      if (exists) return prev.map(c => getCityKey(c) === key ? formData : c);
      return [...prev, formData];
    });
    setSelectedIds([]);
    setFormData({ name: '', state: '', country: '' });
    setOpen(false);
  };

  const handleDeleteBatch = () => {
    setCities(prev => prev.filter(c => !selectedIds.includes(getCityKey(c))));
    setSelectedIds([]);
    setDeleteConfirmOpen(false);
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
      <Typography variant="h6" sx={{ mb: 1 }}>Cities</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained" size="small"
            disabled={selectedIds.length !== 1}
            onClick={() => handleOpenForm('edit')}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
          >
            Modify
          </Button>
          <Button
            variant="contained" size="small"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteConfirmOpen(true)}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
          >
            Delete
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 160, '& input': { fontSize: '0.75rem' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <Select
            size="small" value={filterKey}
            onChange={e => setFilterKey(e.target.value)}
            displayEmpty
            sx={{ width: 160, fontSize: '0.75rem' }}
            MenuProps={{ PaperProps: { sx: { fontSize: '0.75rem' } } }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Fields</MenuItem>
            {uniqueFilterValues.map(val => (
              <MenuItem key={val} value={val} sx={{ fontSize: '0.75rem' }}>{val}</MenuItem>
            ))}
          </Select>
          <IconButton size="small" sx={{ color: 'green' }} onClick={exportToExcel} title="Export to Excel">
            <DescriptionIcon fontSize="medium" />
          </IconButton>
          <Button
            variant="contained" size="small" startIcon={<AddIcon />}
            onClick={() => handleOpenForm('create')}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
          >
            Create
          </Button>
        </Stack>
      </Box>

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
                    sx={{ color: '#fff' }}
                  />
                </TableCell>
                {['name', 'state', 'country'].map(col => (
                  <TableCell key={col} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    <TableSortLabel
                      active={sortConfig.key === col}
                      direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col)}
                      sx={{ color: '#fff !important', '& .MuiTableSortLabel-icon': { color: '#fff !important' } }}
                    >
                      <b>{col.charAt(0).toUpperCase() + col.slice(1)}</b>
                    </TableSortLabel>
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
      </Paper>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(sorted.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>


      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedIds.length === 1 ? 'Modify City' : 'Create City'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="State" fullWidth margin="dense" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
          <TextField label="Country" fullWidth margin="dense" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
        </DialogContent>
        <DialogActions>
          
          <Button variant="contained" sx={{ fontSize: '0.75rem', bgcolor: '#122E3E' }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Delete
          <IconButton size="small" onClick={() => setDeleteConfirmOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Are you sure you want to delete {selectedIds.length} city{selectedIds.length > 1 ? 'ies' : ''}?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteBatch} variant="contained" size="small"
            sx={{
              bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',
              padding: '4px 12px', textTransform: 'none',
              '&:hover': { bgcolor: '#0e1e2a' }
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Validation Error Dialog */}
      <Dialog open={validationDialog} onClose={() => setValidationDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Missing Fields
          <IconButton size="small" onClick={() => setValidationDialog(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Please fill all required fields (Name, State, Country).
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialog(false)} size="small"
            sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modify Error Dialog */}
      <Dialog open={modifyDialog} onClose={() => setModifyDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Cannot Modify
          <IconButton size="small" onClick={() => setModifyDialog(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Please select exactly one row to modify.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModifyDialog(false)} size="small"
            sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;