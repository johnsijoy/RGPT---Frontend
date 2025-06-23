import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, Paper, TextField, Checkbox, Button, IconButton, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack
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
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: '', state: '', country: '', status: ''
  });

  const rowsPerPage = 25;

  const filtered = cities.filter(c =>
    Object.values(c).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(c => c.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenForm = (type) => {
    if (type === 'edit' && selectedIds.length !== 1) {
      return alert('Select exactly one row to edit');
    }
    if (type === 'edit') {
      const sel = cities.find(c => c.id === selectedIds[0]);
      setFormData(sel);
    }
    if (type === 'create') {
      setFormData({ id: null, name: '', state: '', country: '', status: '' });
    }
    setOpen(true);
  };

  const handleDeleteBatch = () => {
    if (selectedIds.length === 0) {
      return alert('Select at least one row to delete');
    }
    if (window.confirm(`Delete ${selectedIds.length} record(s)?`)) {
      setCities(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.state) {
      return alert('Fill required fields (Name, State)');
    }
    if (formData.id) {
      setCities(prev => prev.map(c => (c.id === formData.id ? formData : c)));
    } else {
      setCities(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setSelectedIds([]);
    setFormData({ id: null, name: '', state: '', country: '', status: '' });
    setOpen(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cities');
    XLSX.writeFile(wb, 'Cities_List.xlsx');
  };

  useEffect(() => setPage(1), [search]);

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Cities</Typography>

        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            minWidth: 180,
            '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '28px' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'inherit' }} />
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          size="small"
          sx={{ color: 'green' }}
          title="Export to Excel"
          onClick={exportToExcel}
        >
          <DescriptionIcon fontSize="medium" />
        </IconButton>

        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#122E3E',
            textTransform: 'none',
            fontSize: '0.75rem',
            padding: '4px 10px',
            '&:hover': { bgcolor: '#0F3B56' },
          }}
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm('create')}
        >
          Create
        </Button>
      </Box>

      {/* Actions bar */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="outlined"
          size="small"
          disabled={selectedIds.length !== 1}
          onClick={() => handleOpenForm('edit')}
        >
          Modify
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteBatch}
        >
          Delete
        </Button>
      </Stack>

      {/* Table */}
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
                {['name', 'state', 'country', 'status'].map(col => (
                  <TableCell
                    key={col}
                    sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(city => (
                <TableRow
                  key={city.id}
                  hover
                  selected={selectedIds.includes(city.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(city.id)}
                      onChange={() => handleSelectOne(city.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.state}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.country}</TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.75rem',
                      color: city.status === 'Active' ? 'green' : 'red',
                    }}
                  >
                    {city.status}
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    No cities found.
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

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {formData.id ? 'Modify City' : 'Create City'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="State"
            fullWidth
            margin="dense"
            value={formData.state}
            onChange={e => setFormData({ ...formData, state: e.target.value })}
          />
          <TextField
            label="Country"
            fullWidth
            margin="dense"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
          />
          <TextField
            label="Status"
            fullWidth
            margin="dense"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontSize: '0.75rem' }} onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ fontSize: '0.75rem', bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;
