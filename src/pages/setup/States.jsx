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

import mockStates from '../../mock/states';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const States = () => {
  const [states, setStates] = useState(mockStates);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null, stateId: '', name: '', description: '', country: '', status: ''
  });

  const rowsPerPage = 25;

  const categories = Array.from(new Set(states.map(s => s.country)));
  const statusOptions = Array.from(new Set(states.map(s => s.status)));

  const filtered = states.filter(s =>
    Object.values(s).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(s => s.id) : []);
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
      const sel = states.find(s => s.id === selectedIds[0]);
      setFormData(sel);
    }
    setOpen(true);
  };

  const handleDeleteBatch = () => {
    if (selectedIds.length === 0) {
      return alert('Select at least one row to delete');
    }
    if (window.confirm(`Delete ${selectedIds.length} record(s)?`)) {
      setStates(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    }
  };

  const handleSave = () => {
    if (!formData.stateId || !formData.name) {
      return alert('Fill required fields (State ID, Name)');
    }
    if (formData.id) {
      setStates(prev => prev.map(s => (s.id === formData.id ? formData : s)));
    } else {
      setStates(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setSelectedIds([]);
    setFormData({ id: null, stateId: '', name: '', description: '', country: '', status: '' });
    setOpen(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'States');
    XLSX.writeFile(wb, 'States_List.xlsx');
  };

  useEffect(() => setPage(1), [search]);

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>States</Typography>


        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 160, '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '28px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />

        <IconButton size="small" sx={{ color: 'green' }} title="Export to Excel" onClick={exportToExcel}>
          <DescriptionIcon fontSize="medium" />
        </IconButton>

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
                {['stateId', 'name', 'description', 'country', 'status'].map(col => (
                  <TableCell key={col} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(s => (
                <TableRow key={s.id} hover selected={selectedIds.includes(s.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(s.id)}
                      onChange={() => handleSelectOne(s.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{s.stateId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{s.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{s.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{s.country}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{s.status}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {formData.id ? 'Modify State' : 'Create State'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="State ID"
            fullWidth margin="dense"
            value={formData.stateId}
            onChange={e => setFormData({ ...formData, stateId: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth margin="dense"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth margin="dense"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Country"
            fullWidth margin="dense"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
          />
          <TextField
            label="Status"
            fullWidth margin="dense"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default States;
