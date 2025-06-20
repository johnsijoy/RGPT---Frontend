import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Paper, TableSortLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Chip,
  MenuItem
} from '@mui/material';

const Organisation = () => {
  const [search, setSearch] = useState("");
  const [organisations, setOrganisations] = useState([
    { name: "Tech Orbit", type: "Corporate", industry: "IT", description: "Software company", createdBy: "Admin", status: "Active" },
    { name: "Green Earth NGO", type: "NGO", industry: "Environment", description: "Climate advocacy", createdBy: "User1", status: "Active" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active'
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = [...organisations].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      const updated = [...organisations];
      updated[editingIndex] = formData;
      setOrganisations(updated);
    } else {
      setOrganisations([...organisations, formData]);
    }
    setShowForm(false);
    setFormData({ name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active' });
    setIsEditMode(false);
    setEditingIndex(null);
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const updated = organisations.filter((_, idx) => idx !== selectedIndex);
      setOrganisations(updated);
      setSelectedIndex(null);
    }
  };

  const handleEdit = () => {
    if (selectedIndex !== null) {
      setFormData(organisations[selectedIndex]);
      setIsEditMode(true);
      setEditingIndex(selectedIndex);
      setShowForm(true);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>Organisations</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button size="small" variant="outlined" onClick={handleEdit}>Edit</Button>
        <Button size="small" variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
        <Button size="small" variant="contained" sx={{ bgcolor: '#134ca7' }} onClick={() => { setShowForm(true); setIsEditMode(false); setFormData({ name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active' }); }}>Create</Button>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}>
            <TableRow>
              {['name', 'type', 'industry', 'description', 'createdBy', 'status'].map(col => (
                <TableCell key={col} sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                    sx={{ color: '#fff !important', '& .MuiTableSortLabel-icon': { color: '#fff !important' } }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? filtered.map((item, idx) => (
              <TableRow
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                sx={{ backgroundColor: selectedIndex === idx ? '#d0ebff' : 'white', cursor: 'pointer' }}
              >
                <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{item.type}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{item.industry}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{item.createdBy}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      backgroundColor: item.status === 'Active' ? '#d4edda' : '#f8d7da',
                      color: item.status === 'Active' ? '#155724' : '#721c24',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f5faff', fontWeight: 600 }}>{isEditMode ? 'Edit Organisation' : 'Create Organisation'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {['name', 'type', 'industry', 'description', 'createdBy'].map(field => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
              fullWidth size="small"
            />
          ))}
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            fullWidth size="small"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="small" variant="contained" sx={{ bgcolor: '#134ca7' }} onClick={handleAddOrUpdate}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Organisation;
