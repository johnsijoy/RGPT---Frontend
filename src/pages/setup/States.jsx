import React, {useEffect, useState} from 'react';
import {
  Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Checkbox, TextField, Select, MenuItem,
  TableSortLabel
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentPageIds = paginated.map(row => row.id);
      setSelectedIds(currentPageIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleOpenForm = (type) => {
    if (type === 'edit') {
      if (selectedIds.length !== 1) {
        setDialogMessage('Please select exactly one row to modify.');
        setMessageDialogOpen(true);
        return;
      }
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
      setDialogMessage('Please fill required fields: State ID and Name.');
      setMessageDialogOpen(true);
      return;
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
      filtered.map(({ id, stateId, ...rest }) => rest)
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

      <Typography variant="h6" sx={{ flexGrow: 1 }}>States</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', my: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            disabled={selectedIds.length !== 1}
            onClick={() => handleOpenForm('edit')}
            sx={{
              fontSize: '0.75rem',
              textTransform: 'none',
              color: selectedIds.length === 1 ? '#fff' : '#666',
              bgcolor: selectedIds.length === 1 ? '#122E3E' : '#ccc',
              '&:hover': { bgcolor: selectedIds.length === 1 ? '#0F3B56' : '#ccc' }
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
              fontSize: '0.75rem',
              textTransform: 'none',
              color: selectedIds.length === 0 ? '#666' : '#fff',
              bgcolor: selectedIds.length === 0 ? '#ccc' : '#122E3E',
              '&:hover': { bgcolor: selectedIds.length === 0 ? '#ccc' : '#0F3B56' }
            }}
          >
            Delete
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 160, '& input': { fontSize: '0.75rem' } }}
          />
          <Select
            size="small"
            value={combinedFilter}
            onChange={(e) => setCombinedFilter(e.target.value)}
            displayEmpty
            sx={{ width: 160, fontSize: '0.75rem' }}
            MenuProps={{ PaperProps: { sx: { fontSize: '0.75rem' } } }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
            
            {uniqueStates.map(state => (
              <MenuItem key={state} value={state} sx={{ fontSize: '0.75rem' }}>{state}</MenuItem>
            ))}

            {uniqueCountries.map(country => (
              <MenuItem key={country} value={country} sx={{ fontSize: '0.75rem' }}>{country}</MenuItem>
            ))}
          </Select>

          <IconButton size="small" sx={{ color: 'green' }} title="Export to Excel" onClick={exportToExcel}>
            <DescriptionIcon />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm('create')}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#122E3E' }}>
              <TableRow sx={{ '&:hover': { backgroundColor: '#122E3E' } }}>
                <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                  <Checkbox
                    checked={paginated.length > 0 && paginated.every(row => selectedIds.includes(row.id))}
                    indeterminate={paginated.some(row => selectedIds.includes(row.id)) && !paginated.every(row => selectedIds.includes(row.id))}
                    onChange={handleSelectAll}
                    sx={{ color: '#fff' }}
                  />
                </TableCell>
                {['stateId', 'name', 'description', 'country'].map((key) => (
                  <TableCell
                    key={key}
                    sx={{ color: '#fff !important', fontSize: '0.8rem' }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === key}
                      direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(key)}
                      sx={{
                        color: '#fff !important',
                        '&:hover': { color: '#fff !important' },
                        '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                      }}
                    >
                      <b>{key.charAt(0).toUpperCase() + key.slice(1)}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  selected={selectedIds.includes(s.id)}
                  sx={{ '&:hover': { backgroundColor: '#fff' } }}
                >
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
                  <TableCell colSpan={5} align="center" sx={{ fontSize: '0.75rem' }}>
                    No record found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(sorted.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>


      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {formData.id ? 'Modify State' : 'Create State'}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <TextField label="State ID" fullWidth margin="dense" value={formData.stateId} onChange={e => setFormData({ ...formData, stateId: e.target.value })} />
          <TextField label="Name" fullWidth margin="dense" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <TextField label="Country" fullWidth margin="dense" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
        </DialogContent>
        <DialogActions>
          
          <Button variant="contained" sx={{ fontSize: '0.75rem', bgcolor: '#122E3E', '&:hover': { bgcolor: '#0F3B56' } }} onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Delete
          <IconButton size="small" onClick={() => setDeleteConfirmOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Are you sure you want to delete selected state{selectedIds.length > 1 ? 's' : ''}?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteBatch} variant="contained" size="small" sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', textTransform: 'none', '&:hover': { bgcolor: '#0e1e2a' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog (replaces alert) */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Message
          <IconButton size="small" onClick={() => setMessageDialogOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          {dialogMessage}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setMessageDialogOpen(false)} variant="contained" size="small"
            sx={{
              bgcolor: '#122E3E',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '4px 12px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#0e1e2a' }
            }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default States;