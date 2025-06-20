import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Paper, TableSortLabel, Checkbox, IconButton,
  Breadcrumbs, Link
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import * as XLSX from 'xlsx';

const mockCities = [
  { id: 1, cityName: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { id: 2, cityName: 'San Francisco', state: 'California', country: 'USA' },
  { id: 3, cityName: 'Bangalore', state: 'Karnataka', country: 'India' }
];

const Cities = () => {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState(mockCities);
  const [formData, setFormData] = useState({ cityName: '', state: '', country: '' });
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'cityName', direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCities = [...cities].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedCities.filter(city =>
    Object.values(city).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSubmit = () => {
    if (formData.id) {
      setCities(prev => prev.map(c => c.id === formData.id ? formData : c));
      setSelectedIds(prev => prev.filter(id => id !== formData.id));
    } else {
      setCities([...cities, { id: Date.now(), ...formData }]);
    }
    setFormData({ cityName: '', state: '', country: '' });
    setOpen(false);
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) return alert('Select one row to edit');
    const city = cities.find(c => c.id === selectedIds[0]);
    if (city) {
      setFormData(city);
      setOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return alert('Select at least one row to delete');
    const updated = cities.filter(c => !selectedIds.includes(c.id));
    setCities(updated);
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
    XLSX.utils.book_append_sheet(wb, ws, 'Cities');
    XLSX.writeFile(wb, 'Cities_List.xlsx');
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1, fontSize: '0.7rem' }}
      >
        <Link
          component="a"
          href="/"
          underline="hover"
          sx={{ color: 'text.secondary', fontSize: '0.7rem', '&:hover': { color: '#162F40' } }}
        >
          Home
        </Link>
        <Typography color="#162F40" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>Cities</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ maxWidth: '200px' }}
        />
        <Button size="small" variant="outlined" onClick={handleEdit}>Edit</Button>
        <Button size="small" variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
        <Button size="small" variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#162F40' }}>Create City</Button>
        <IconButton onClick={exportToExcel} color="primary" size="small">
          <DescriptionIcon fontSize="small" />
        </IconButton>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: '#fff' }}></TableCell>
              {['cityName', 'state', 'country'].map(col => (
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
            {filtered.length > 0 ? filtered.map(city => (
              <TableRow key={city.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(city.id)}
                    onChange={() => handleCheckboxChange(city.id)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{city.cityName}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{city.state}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{city.country}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? 'Edit City' : 'Create City'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="City Name"
            value={formData.cityName}
            onChange={e => setFormData({ ...formData, cityName: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="State"
            value={formData.state}
            onChange={e => setFormData({ ...formData, state: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Country"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;
