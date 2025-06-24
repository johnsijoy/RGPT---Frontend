import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Checkbox, Button,
  InputAdornment, Select, MenuItem, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TableSortLabel
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

import * as XLSX from 'xlsx';

import mockDocuments from '../../mock/DocumentCentre';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const DocumentCentre = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    assignedTo: [],
    teams: [],
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;
  const categories = [...new Set(documents.map(doc => doc.category))];

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const sorted = [...documents].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const aVal = a[key]?.toString().toLowerCase() || '';
    const bVal = b[key]?.toString().toLowerCase() || '';
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter(doc => {
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
    setFormData({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    setSelectedIds([]);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />
      <Typography variant="h6" sx={{ flexGrow: 1 }}>Document Centre</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', my: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
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
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
            disabled={selectedIds.length === 0}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
            disabled
          >
            Batch Update
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 160, '& input': { fontSize: '0.75rem' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
            displayEmpty
            sx={{ width: 160, fontSize: '0.75rem' }}
            MenuProps={{ PaperProps: { sx: { fontSize: '0.75rem' } } }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: '0.75rem' }}>{cat}</MenuItem>
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
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({ name: '', category: '', description: '', assignedTo: [], teams: [] });
              setDialogType('create');
              setOpenDialog(true);
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

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
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'description', label: 'Description' },
                  { key: 'assignedTo', label: 'Assigned To' },
                  { key: 'teams', label: 'Teams' }
                ].map(col => (
                  <TableCell key={col.key} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    <TableSortLabel
                      active={sortConfig.key === col.key}
                      direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                      }}
                    >
                      <b>{col.label}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
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
                  <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem' }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>


      {/* Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle sx={{ fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialogType === 'create' ? 'Create Document' : 'Modify Document'}
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent  sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {['name', 'category', 'description'].map(field => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              size="small"
              margin="dense"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '16.5px 14px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' }
              }}
            />
          ))}
          <TextField
            label="Assigned To (comma separated)"
            fullWidth
            size="small"
            margin="dense"
            value={formData.assignedTo.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value.split(',').map(s => s.trim()) })
            }
            sx={{
              '& .MuiInputBase-input': { fontSize: '0.75rem' , padding: '16.5px 14px'},
              '& .MuiInputLabel-root': { fontSize: '0.75rem' }
            }}
          />
          <TextField
            label="Teams (comma separated)"
            fullWidth
            size="small"
            margin="dense"
            value={formData.teams.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, teams: e.target.value.split(',').map(s => s.trim()) })
            }
            sx={{
              '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '16.5px 14px' },
              '& .MuiInputLabel-root': { fontSize: '0.75rem' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" sx={{ bgcolor: '#122E3E' }} onClick={handleDialogSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600 }}>
          Confirm Delete
          <IconButton onClick={() => setShowDeleteDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <Typography sx={{fontSize: '0.875rem', mt: 1}}>
            Are you sure you want to delete the selected document(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" sx={{ bgcolor: '#122E3E',color: '#fff',fontSize: '0.75rem',padding: '4px 12px',textTransform: 'none','&:hover': { bgcolor: '#0e1e2a' }  }} onClick={() => {
            setDocuments(prev => prev.filter(doc => !selectedIds.includes(doc.id)));
            setSelectedIds([]);
            setShowDeleteDialog(false);
          }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCentre;