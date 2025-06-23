import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button,
  InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, Checkbox, Stack
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
  const [formData, setFormData] = useState({ name: '', city: '', state: '', country: '' });
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const rowsPerPage = 25;

  const handleCreateOrUpdate = () => {
    if (editIndex !== null) {
      areas[editIndex] = { ...formData };
    } else {
      areas.push({ ...formData });
    }
    setFormData({ name: '', city: '', state: '', country: '' });
    setOpen(false);
    setEditIndex(null);
    setSelectedRows([]);
  };

  const handleModify = () => {
    if (selectedRows.length === 1) {
      const idx = selectedRows[0];
      setFormData(areas[idx]);
      setEditIndex(idx);
      setOpen(true);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    selectedRows.sort((a, b) => b - a).forEach((idx) => areas.splice(idx, 1));
    setSelectedRows([]);
    setDeleteConfirmOpen(false);
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

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = (checked) => {
    const allIndexes = paginatedData.map((_, idx) => (page - 1) * rowsPerPage + idx);
    setSelectedRows(checked ? allIndexes : []);
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

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUpwardIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle' }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle' }} />
    );
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 1, fontSize: '1rem' }}>
        Areas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleModify} disabled={selectedRows.length !== 1} sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}>
            Modify
          </Button>
          <Button variant="contained" size="small" onClick={handleDelete} disabled={selectedRows.length === 0} sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}>
            Delete
          </Button>
          <Button variant="contained" size="small" disabled sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}>
            Audit Trail
          </Button>
          <Button variant="contained" size="small" disabled sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}>
            Batch Update
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { height: 28 }, input: { fontSize: '0.75rem', padding: '4px 8px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '1rem' }} />
                </InputAdornment>
              )
            }}
          />

          <IconButton size="small" onClick={handleDownload} sx={{ height: 28, width: 36, color: 'green' }}>
            <DescriptionIcon sx={{ fontSize: '1.4rem' }} />
          </IconButton>

          <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem', height: 28, px: 1.5 }} onClick={() => { setFormData({ name: '', city: '', state: '', country: '' }); setEditIndex(null); setOpen(true); }}>
            Create
          </Button>
        </Stack>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={paginatedData.every((_, i) =>
                      selectedRows.includes((page - 1) * rowsPerPage + i)
                    )}
                    indeterminate={
                      selectedRows.some((i) =>
                        paginatedData.some((_, idx) => i === (page - 1) * rowsPerPage + idx)
                      ) && !paginatedData.every((_, i) =>
                        selectedRows.includes((page - 1) * rowsPerPage + i)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: '#fff', padding: 0 }}
                  />
                </TableCell>
                {['name', 'city', 'state', 'country'].map((col) => (
                  <TableCell
                    key={col}
                    onClick={() => handleSort(col)}
                    sx={{ cursor: 'pointer', color: '#fff', fontSize: '0.8rem' }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)} {renderSortIcon(col)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No records found.</TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, i) => {
                  const idx = (page - 1) * rowsPerPage + i;
                  return (
                    <TableRow key={idx} selected={selectedRows.includes(idx)} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(idx)}
                          onChange={() => handleSelectRow(idx)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.city}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.state}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.country}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={(p) => setPage(p)}
            size="small"
          />
        </Box>
      </Paper>

      {/* Create/Modify Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#122E3E' }}>
          {editIndex !== null ? 'Modify Area' : 'Create Area'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon sx={{ fontSize: '1.1rem', color: '#122E3E' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3 }}>
          <TextField
            label="Area Name"
            fullWidth margin="dense"
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="City"
            fullWidth margin="dense"
            size="small"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <TextField
            label="State"
            fullWidth margin="dense"
            size="small"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
          <TextField
            label="Country"
            fullWidth margin="dense"
            size="small"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleCreateOrUpdate}
            sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}
          >
            Save
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#122E3E' }}>
          Confirm Deletion
          <IconButton size="small" onClick={() => setDeleteConfirmOpen(false)}>
            <CloseIcon sx={{ fontSize: '1.1rem', color: '#122E3E' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete {selectedRows.length} record(s)?
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={confirmDelete}
            sx={{ fontSize: '0.75rem', height: 28, bgcolor: '#122E3E', color: '#fff' }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Areas;
