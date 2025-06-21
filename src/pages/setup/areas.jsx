import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button,
  InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';
import areas from '../../mock/areas';
import Pagination from '../../components/common/Pagination';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  return (
    <Typography
      variant="body2"
      sx={{ fontSize: '0.75rem', mb: 2, cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      Home / <span style={{ color: '#000' }}>Areas</span>
    </Typography>
  );
};

const Areas = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    country: ''
  });
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const rowsPerPage = 25;

  const handleCreate = () => {
    const newEntry = { ...formData };
    areas.push(newEntry); // Modify mock directly
    setFormData({ name: '', city: '', state: '', country: '' });
    setOpen(false);
  };

  const handleDownload = () => {
    const csv = [
      ['Area Name', 'City', 'State', 'Country'],
      ...areas.map(({ name, city, state, country }) => [name, city, state, country])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'areas.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  let filtered = areas.filter(area =>
    area.name.toLowerCase().includes(query.toLowerCase()) ||
    area.city.toLowerCase().includes(query.toLowerCase()) ||
    area.state.toLowerCase().includes(query.toLowerCase()) ||
    area.country.toLowerCase().includes(query.toLowerCase())
  );

  if (sortConfig.key) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase() || '';
      const bVal = b[sortConfig.key]?.toLowerCase() || '';
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  const paginatedData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h6">Areas</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 160, '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '28px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <IconButton
            size="small"
            sx={{ color: 'green' }}
            title="Export to Excel"
            onClick={handleDownload}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem', padding: '4px 10px' }}
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#122E3E' }}>
              <TableRow>
                {['name', 'city', 'state', 'country'].map((key) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key)}
                    sx={{ color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <b>
                      {{
                        name: 'Area Name',
                        city: 'City',
                        state: 'State',
                        country: 'Country'
                      }[key]}
                    </b>
                    {sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((area, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{area.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{area.city}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{area.state}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{area.country}</TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ fontSize: '0.75rem', py: 6 }}>
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Area</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Area Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Areas;
