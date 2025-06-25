import React, { useState } from 'react';
import {
  Box, Typography, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TableSortLabel from '@mui/material/TableSortLabel';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as XLSX from 'xlsx';
import setupKeyValues from '../../mock/setupkeyvalues';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const floatingInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', minHeight: '28px', paddingTop: '4px', paddingBottom: '4px',
    '& .MuiOutlinedInput-input': { padding: '4px 8px' },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem', top: -8, left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0, transform: 'translate(14px, -7px) scale(0.75) !important', transformOrigin: 'top left',
    },
  }
};

const SetupKeyValues = () => {
  const [data, setData] = useState(setupKeyValues.map((d, i) => ({ id: i + 1, ...d })));
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [formData, setFormData] = useState({ key: '', value: '' });
  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = data.filter((row) =>
    (row.key.toLowerCase().includes(search.toLowerCase()) ||
      row.value.toLowerCase().includes(search.toLowerCase())) &&
    (filterKey === '' || row.key === filterKey)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleDialogOpen = (type) => {
    if (type === 'edit') {
      const selected = data.find((d) => d.id === checkedIds[0]);
      if (selected) setFormData({ key: selected.key, value: selected.value, id: selected.id });
    } else {
      setFormData({ key: '', value: '' });
    }
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData((prev) =>
        prev.map((d) => (d.id === formData.id ? { ...d, key: formData.key, value: formData.value } : d))
      );
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
    setCheckedIds([]);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((d) => !checkedIds.includes(d.id)));
    setCheckedIds([]);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="Setup Key Values" />
      <Typography variant="h6" sx={{ mb: 2 }}>Setup Key Values</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2, gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={() => handleDialogOpen('edit')} disabled={checkedIds.length !== 1}
            sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '3px 9px', textTransform: 'none', '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' } }}>Modify</Button>
          <Button variant="contained" size="small" onClick={() => setOpenDeleteDialog(true)} disabled={checkedIds.length === 0}
            sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '3px 9px', textTransform: 'none', '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' } }}>Delete</Button>
          <Button variant="contained" size="small" disabled sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', padding: '3px 9px', textTransform: 'none' }}>Batch Update</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField variant="outlined" size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 160, ...floatingInputSx }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />

          <Autocomplete
            size="small"
            options={[]}
            freeSolo
            value={filterKey || ''}
            onInputChange={(e, value) => setFilterKey(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select A Query"
                variant="outlined"
                size="small"
                sx={{ minWidth: 180, ...floatingInputSx }}
                InputProps={{ ...params.InputProps, endAdornment: null }}
              />
            )}
            sx={{ minWidth: 180 }}
          />

          <IconButton size="small" sx={{ color: 'green' }} title="Export to Excel" onClick={() => {
            const rows = data.map(d => [d.key, d.value]);
            const sheet = XLSX.utils.aoa_to_sheet([['Key', 'Value'], ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, sheet, 'SetupKeyValues');
            XLSX.writeFile(wb, 'SetupKeyValues.xlsx');
          }}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <IconButton size="small" sx={{ color: '#122E3E' }} title="Configure Columns">
            <ViewColumnIcon fontSize="medium" />
          </IconButton>

          <IconButton size="small" sx={{ color: '#122E3E' }} title="Import Data">
            <FileUploadIcon fontSize="medium" />
          </IconButton>

          <Button variant="contained" size="small" onClick={() => handleDialogOpen('create')} sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}>+ Create</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={paginated.length > 0 && paginated.every(row => checkedIds.includes(row.id))}
                  indeterminate={checkedIds.length > 0 && checkedIds.length < paginated.length}
                  onChange={(e) => {
                    const ids = paginated.map(row => row.id);
                    setCheckedIds(e.target.checked ? [...new Set([...checkedIds, ...ids])] : checkedIds.filter(id => !ids.includes(id)));
                  }}
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              {['key', 'value'].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color: '#fff', fontSize: 13,
                    '& .MuiTableSortLabel-root': { color: '#fff' },
                    '& .MuiTableSortLabel-root:hover': { color: '#fff' },
                    '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                  }}
                >
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length > 0 ? paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={checkedIds.includes(row.id)}
                    onChange={() =>
                      setCheckedIds((prev) =>
                        prev.includes(row.id)
                          ? prev.filter((id) => id !== row.id)
                          : [...prev, row.id]
                      )
                    }
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.key}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.value}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ fontSize: '0.75rem' }}>
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Pagination count={totalPages} page={page + 1} onChange={(p) => setPage(p - 1)} />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'edit' ? 'Edit Key Value' : 'Create Key Value'}
            <IconButton size="small" onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {['key', 'value'].map((field, index) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              size="small"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              sx={{ ...floatingInputSx, ...(index === 0 && { mt: 2 }) }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogSubmit}
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', padding: '3px 9px', color: '#fff' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600 }}>
          Confirm Delete
          <IconButton onClick={() => setOpenDeleteDialog(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Are you sure you want to delete the selected record{checkedIds.length > 1 ? 's' : ''}?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { handleDelete(); setOpenDeleteDialog(false); }}
            variant="contained"
            sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SetupKeyValues;
