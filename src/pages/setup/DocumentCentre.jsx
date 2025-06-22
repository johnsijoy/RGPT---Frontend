import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Checkbox, Button,
  InputAdornment, Select, MenuItem, IconButton, Stack, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

import * as XLSX from 'xlsx';

import mockDocuments from '../../mock/DocumentCentre';
import Pagination from '../../components/common/Pagination';

const Breadcrumbs = () => (
  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 2 }}>
    Home / Document Centre
  </Typography>
);

const DocumentCentre = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    assignedTo: [],
    teams: [],
  });

  const rowsPerPage = 25;
  const categories = [...new Set(documents.map(doc => doc.category))];

  const filtered = documents.filter(doc => {
    const matchesSearch = Object.values(doc).some(val =>
      typeof val === 'string'
        ? val.toLowerCase().includes(search.toLowerCase())
        : Array.isArray(val) &&
          val.join(', ').toLowerCase().includes(search.toLowerCase())
    );
    const matchesCategory = category ? doc.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(doc => doc.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const data = filtered.map(doc => ({
      Name: doc.name,
      Category: doc.category,
      Description: doc.description,
      'Assigned To': doc.assignedTo.join(', '),
      Teams: doc.teams.join(', ')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Documents');
    XLSX.writeFile(wb, 'DocumentCentre.xlsx');
  };

  const handleBatchUpdate = () => {
    if (selectedIds.length === 0) {
      alert('Select at least one record for batch update');
      return;
    }

    setDocuments(prevDocs =>
      prevDocs.map(doc =>
        selectedIds.includes(doc.id)
          ? { ...doc, category: 'Updated Category' }
          : doc
      )
    );

    alert(`Batch update applied to ${selectedIds.length} document(s)`);
    setSelectedIds([]);
  };

  const handleDialogSave = () => {
    if (dialogType === 'create') {
      const newId = documents.length > 0
        ? Math.max(...documents.map(d => d.id)) + 1
        : 1;
      setDocuments([...documents, { ...formData, id: newId }]);
    } else if (dialogType === 'modify') {
      setDocuments(docs =>
        docs.map(d =>
          d.id === formData.id ? { ...formData } : d
        )
      );
    }

    setOpenDialog(false);
    setFormData({
      name: '',
      category: '',
      description: '',
      assignedTo: [],
      teams: [],
    });
    setSelectedIds([]);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Document Centre</Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 160, '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '28px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          displayEmpty
          sx={{ minWidth: 160, fontSize: '0.75rem' }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>

        <Tooltip title="Export to Excel">
          <IconButton size="small" sx={{ color: 'green' }} onClick={handleExport}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem', padding: '4px 10px' }}
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({
              name: '',
              category: '',
              description: '',
              assignedTo: [],
              teams: [],
            });
            setDialogType('create');
            setOpenDialog(true);
          }}
        >
          Create
        </Button>
      </Box>

      {/* Modify/Delete/BatchUpdate */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="outlined"
          size="small"
          disabled={selectedIds.length !== 1}
          onClick={() => {
            const selected = documents.find(doc => doc.id === selectedIds[0]);
            setFormData({ ...selected });
            setDialogType('modify');
            setOpenDialog(true);
          }}
        >
          Modify
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={selectedIds.length === 0}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete selected document(s)?')) {
              setDocuments(prev => prev.filter(doc => !selectedIds.includes(doc.id)));
              setSelectedIds([]);
            }
          }}
        >
          Delete
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={handleBatchUpdate}
          disabled={selectedIds.length === 0}
        >
          Batch Update
        </Button>
      </Stack>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                  <Checkbox
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginated.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Name</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Category</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Description</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Assigned To</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Teams</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(doc => (
                <TableRow key={doc.id} hover selected={selectedIds.includes(doc.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => handleSelectOne(doc.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.category}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.assignedTo.join(', ')}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.teams.join(', ')}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No records found.</TableCell>
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

      {/* Dialog for Create & Modify */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialogType === 'create' ? 'Create Document' : 'Modify Document'}
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Category"
            fullWidth
            margin="dense"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Assigned To (comma separated)"
            fullWidth
            margin="dense"
            value={formData.assignedTo.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value.split(',').map(s => s.trim()) })
            }
          />
          <TextField
            label="Teams (comma separated)"
            fullWidth
            margin="dense"
            value={formData.teams.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, teams: e.target.value.split(',').map(s => s.trim()) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCentre;
