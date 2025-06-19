import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Paper, TableSortLabel, MenuItem, Select, FormControl, InputLabel, Checkbox, IconButton
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';

const mockStates = [
  { id: 1, stateId: 'S001', name: 'Maharashtra', description: 'Western state in India', country: 'India', status: 'Active' },
  { id: 2, stateId: 'S002', name: 'California', description: 'West coast state in USA', country: 'USA', status: 'Inactive' },
  { id: 3, stateId: 'S003', name: 'Karnataka', description: 'Southern state in India', country: 'India', status: 'Active' }
];

const States = () => {
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState(mockStates);
  const [formData, setFormData] = useState({ stateId: '', name: '', description: '', country: '', status: 'Active' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'stateId', direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedStates = [...states].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedStates.filter(state =>
    Object.values(state).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    ) && (statusFilter === 'All' || state.status === statusFilter)
  );

  const handleSubmit = () => {
    if (formData.id) {
      setStates(prev => prev.map(s => s.id === formData.id ? formData : s));
      setSelectedIds(prev => prev.filter(id => id !== formData.id));
    } else {
      setStates([...states, { id: Date.now(), ...formData }]);
    }
    setFormData({ stateId: '', name: '', description: '', country: '', status: 'Active' });
    setOpen(false);
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) return alert('Select one row to edit');
    const state = states.find(s => s.id === selectedIds[0]);
    if (state) {
      setFormData(state);
      setOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return alert('Select at least one row to delete');
    const updated = states.filter(s => !selectedIds.includes(s.id));
    setStates(updated);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'States');
    XLSX.writeFile(wb, 'States_List.xlsx');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>States</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
          <Button variant="contained" onClick={() => setOpen(true)}>Create State</Button>
          <IconButton onClick={exportToExcel} color="primary">
            <DescriptionIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f8ff' }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {['stateId', 'name', 'description', 'country', 'status'].map(col => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((state) => (
              <TableRow key={state.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(state.id)}
                    onChange={() => handleCheckboxChange(state.id)}
                  />
                </TableCell>
                <TableCell>{state.stateId}</TableCell>
                <TableCell>{state.name}</TableCell>
                <TableCell>{state.description}</TableCell>
                <TableCell>{state.country}</TableCell>
                <TableCell>{state.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? 'Edit State' : 'Create State'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="State ID" value={formData.stateId} onChange={e => setFormData({ ...formData, stateId: e.target.value })} fullWidth size="medium" />
          <TextField label="State Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} fullWidth size="medium" />
          <TextField label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} fullWidth size="medium" />
          <TextField label="Country" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} fullWidth size="medium" />
          <FormControl fullWidth size="medium">
            <InputLabel>Status</InputLabel>
            <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} label="Status">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default States;