import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, Checkbox, TextField, Select, MenuItem
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as XLSX from 'xlsx';

import mockStates from '../../mock/states';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const States = () => {
  const [states, setStates] = useState(
    mockStates.map((s, index) => ({ ...s, id: index + 1 }))
  );
  const [search, setSearch] = useState('');
  const [combinedFilter, setCombinedFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [formData, setFormData] = useState({
    id: null,
    stateId: '',
    name: '',
    description: '',
    country: ''
  });

  const rowsPerPage = 25;

  const uniqueStates = [...new Set(states.map(s => s.name))];
  const uniqueCountries = [...new Set(states.map(s => s.country))];

const filtered = states.filter(s =>
  Object.values(s).some(val =>
    String(val).toLowerCase().includes(search.toLowerCase())
  ) &&
  (combinedFilter
    ? s.name === combinedFilter || s.country === combinedFilter
    : true)
);


  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = String(a[sortConfig.key]).toLowerCase();
    const valB = String(b[sortConfig.key]).toLowerCase();
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenForm = (type) => {
    if (type === 'edit') {
      if (selectedIds.length !== 1) return alert('Select exactly one row to modify');
      const selected = states.find(s => s.id === selectedIds[0]);
      setFormData(selected);
    } else {
      setFormData({
        id: null,
        stateId: '',
        name: '',
        description: '',
        country: ''
      });
    }
    setOpen(true);
  };

  const handleDeleteBatch = () => {
    setStates(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setDeleteConfirmOpen(false);
  };

  const handleSave = () => {
    if (!formData.stateId || !formData.name) {
      return alert('Please fill required fields (State ID, Name)');
    }

    if (formData.id) {
      setStates(prev => prev.map(s => (s.id === formData.id ? formData : s)));
    } else {
      setStates(prev => [...prev, { ...formData, id: Date.now() }]);
    }

    setSelectedIds([]);
    setOpen(false);
  };

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(
    filtered.map(({ id, stateId, ...rest }) => rest) // ⛔ omit both "id" and "stateId"
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'States');
  XLSX.writeFile(wb, 'States_List.xlsx');
};



  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => setPage(1), [search, combinedFilter]);

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6">States</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 160 }}
          />

          <Select
            size="small"
            value={combinedFilter}
            onChange={(e) => setCombinedFilter(e.target.value)}
            displayEmpty
            sx={{ minWidth: 200, fontSize: '0.75rem' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem disabled><b>States</b></MenuItem>
            {uniqueStates.map(state => (
              <MenuItem key={state} value={state}>{state}</MenuItem>
            ))}
            <MenuItem disabled><b>Countries</b></MenuItem>
            {uniqueCountries.map(country => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }}
            onClick={() => handleOpenForm('create')}
          >
            Create
          </Button>
          <IconButton size="small" sx={{ color: 'green' }} title="Export to Excel" onClick={exportToExcel}>
            <DescriptionIcon />
          </IconButton>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="contained"
          size="small"
          disabled={selectedIds.length !== 1}
          onClick={() => handleOpenForm('edit')}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            bgcolor: selectedIds.length === 1 ? '#122E3E' : '#ccc',
            color: selectedIds.length === 1 ? '#fff' : '#666',
            '&:hover': {
              bgcolor: selectedIds.length === 1 ? '#0F3B56' : '#ccc',
              cursor: selectedIds.length === 1 ? 'pointer' : 'default'
            }
          }}
        >
          Modify
        </Button>

        <Button
          variant="contained"
          size="small"
          disabled={selectedIds.length === 0}
          onClick={() => setDeleteConfirmOpen(true)}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            bgcolor: selectedIds.length === 0 ? '#ccc' : '#122E3E',
            color: selectedIds.length === 0 ? '#666' : '#fff',
            '&:hover': {
              bgcolor: selectedIds.length === 0 ? '#ccc' : '#0F3B56',
              cursor: selectedIds.length === 0 ? 'default' : 'pointer'
            }
          }}
        >
          Delete
        </Button>
      </Stack>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox" />
                {['stateId', 'name', 'description', 'country'].map((key) => (
                  <TableCell
                    key={key}
                    sx={{ color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortConfig.key === key &&
                      (sortConfig.direction === 'asc'
                        ? <ArrowDropUpIcon fontSize="small" />
                        : <ArrowDropDownIcon fontSize="small" />)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((s) => (
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
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    No states found.
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
          {formData.id ? 'Modify State' : 'Create State'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField label="State ID" fullWidth margin="dense" value={formData.stateId} onChange={e => setFormData({ ...formData, stateId: e.target.value })} />
          <TextField label="Name" fullWidth margin="dense" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <TextField label="Country" fullWidth margin="dense" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontSize: '0.75rem' }} onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ fontSize: '0.75rem', bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedIds.length} state{selectedIds.length > 1 ? 's' : ''}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBatch} variant="contained" sx={{ bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default States;
