import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Paper, TableSortLabel, MenuItem, Select, FormControl, InputLabel, Checkbox, IconButton
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Cities</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <Button variant="outlined" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
          <Button variant="contained" onClick={() => setOpen(true)}>Create City</Button>
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
              {['cityName', 'state', 'country'].map(col => (
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
            {filtered.map((city) => (
              <TableRow key={city.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(city.id)}
                    onChange={() => handleCheckboxChange(city.id)}
                  />
                </TableCell>
                <TableCell>{city.cityName}</TableCell>
                <TableCell>{city.state}</TableCell>
                <TableCell>{city.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? 'Edit City' : 'Create City'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="City Name" value={formData.cityName} onChange={e => setFormData({ ...formData, cityName: e.target.value })} fullWidth size="medium" />
          <TextField label="State" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} fullWidth size="medium" />
          <TextField label="Country" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} fullWidth size="medium" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;
