import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Checkbox, Button,
  InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, Stack
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Pagination from '../../components/common/Pagination';

import mockLocalities from '../../mock/localities';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  return (
    <Typography
      variant="body2"
      sx={{ fontSize: '0.75rem', mb: 2, cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      Home / <span style={{ color: '#000' }}>Localities</span>
    </Typography>
  );
};

const Localities = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', area: '' });
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const rowsPerPage = 25;

  useEffect(() => {
    setRecords(mockLocalities);
  }, []);

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.description.toLowerCase().includes(query.toLowerCase()) ||
    r.area.toLowerCase().includes(query.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key].toLowerCase();
    const bVal = b[sortConfig.key].toLowerCase();
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUpwardIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle' }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle' }} />
    );
  };

  const handleCreateOrUpdate = () => {
    const updatedRecords = [...records];
    if (editIndex !== null) {
      updatedRecords[editIndex] = { ...formData };
    } else {
      updatedRecords.push({ ...formData });
    }
    setRecords(updatedRecords);
    setFormData({ name: '', description: '', area: '' });
    setOpen(false);
    setEditIndex(null);
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = (checked) => {
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;
    const indexes = sortedRecords.slice(start, end).map((_, i) => start + i);
    setSelectedRows(checked ? indexes : selectedRows.filter(i => !indexes.includes(i)));
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setRecords((prev) => prev.filter((_, i) => !selectedRows.includes(i)));
    setSelectedRows([]);
    setDeleteConfirmOpen(false);
  };

  const handleModify = () => {
    if (selectedRows.length === 1) {
      const idx = selectedRows[0];
      setFormData(records[idx]);
      setEditIndex(idx);
      setOpen(true);
    }
  };

  const handleExport = () => {
    const data = records.map((row) => ({
      'Locality Name': row.name,
      'Description': row.description,
      'Area': row.area
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Localities');
    XLSX.writeFile(wb, 'Localities.xlsx');
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 1, fontSize: '1rem' }}>
        Localities
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

          <IconButton size="small" onClick={handleExport} sx={{ height: 28, width: 36, color: 'green' }}>
            <DescriptionIcon sx={{ fontSize: '1.4rem' }} />
          </IconButton>

          <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem', height: 28, px: 1.5 }} onClick={() => { setFormData({ name: '', description: '', area: '' }); setEditIndex(null); setOpen(true); }}>
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
                {['name', 'description', 'area'].map((col) => (
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
                  <TableCell colSpan={4} align="center">No records found.</TableCell>
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
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.description}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.area}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(sortedRecords.length / rowsPerPage)}
            page={page}
            onChange={(p) => setPage(p)}
            size="small"
          />
        </Box>
      </Paper>

      {/* Create/Modify Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#122E3E' }}>
          {editIndex !== null ? 'Modify Locality' : 'Create Locality'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon sx={{ fontSize: '1.1rem', color: '#122E3E' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3 }}>
          <TextField
            label="Locality Name"
            fullWidth margin="dense"
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth margin="dense"
            size="small"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Area"
            fullWidth margin="dense"
            size="small"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
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

export default Localities;