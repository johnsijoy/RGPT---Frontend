import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Button, Checkbox, TextField, InputAdornment, IconButton,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, TableSortLabel, TableContainer
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import mockVirtualNumbers from '../../mock/virtualnumbers';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '28px',
    paddingTop: '4px',
    paddingBottom: '4px',
    '& .MuiOutlinedInput-input': {
      padding: '4px 8px',
    },
    '& .MuiSelect-select': {
      paddingTop: '4px !important',
      paddingBottom: '4px !important',
      minHeight: 'auto !important',
      lineHeight: '1.2 !important',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: -14,
    left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0,
      transform: 'translate(14px, -7px) scale(0.75) !important',
      transformOrigin: 'top left',
    },
  },
  '& .MuiSelect-icon': {
    fontSize: '1.2rem',
    top: 'calc(50% - 0.6em)',
    right: '8px',
  },
};
const VirtualNumber = () => {
  const [dataList, setDataList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryFilter, setQueryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: '', virtualNumber: '', provider: '' });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 25;

  useEffect(() => {
    setDataList(mockVirtualNumbers);
  }, []);

  const filteredData = useMemo(() => {
    let data = [...dataList];
    if (queryFilter !== 'All') {
      data = data.filter(item => item.provider === queryFilter);
    }
    if (searchTerm) {
      data = data.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return data.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [dataList, queryFilter, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredData.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const handleSave = () => {
    if (editingId !== null) {
      setDataList(dataList.map(item => item.id === editingId ? formData : item));
    } else {
      setDataList([...dataList, formData]);
    }
    setOpen(false);
    setEditingId(null);
    setFormData({ id: '', virtualNumber: '', provider: '' });
  };

  const handleDelete = () => {
    setDataList(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setShowDeleteDialog(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
      <Breadcrumbs />
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 2 }}>
        Virtual Numbers
      </Typography>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            disabled={selectedIds.length !== 1}
            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
            onClick={() => {
              const selected = dataList.find(item => item.id === selectedIds[0]);
              if (selected) {
                setFormData(selected);
                setEditingId(selected.id);
                setOpen(true);
              }
            }}
          >
            Modify
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{ fontSize: '0.75rem', textTransform: 'none', color: 'gray', borderColor: 'gray' }}
          >
            Batch Update
          </Button>
<Button
  variant="contained"
  size="small"
  disabled={selectedIds.length === 0}
  onClick={() => setShowDeleteDialog(true)}
  sx={{
    textTransform: 'none',
    fontSize: '0.75rem',
    bgcolor: '#122E3E', // same as Modify
    '&:hover': {
      bgcolor: '#0F2533', // slightly darker on hover
    },
    '&:disabled': {
      bgcolor: '#e0e0e0',
      color: '#9e9e9e',
    },
  }}
>
  Delete
</Button>

        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 160, ...smallerInputSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140, ...smallerInputSx }}>
            <InputLabel sx={{ fontSize: '0.75rem' }}>Select a Query</InputLabel>
            <Select
              value={queryFilter}
              label="Select a Query"
              onChange={(e) => setQueryFilter(e.target.value)}
            >
              <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
              <MenuItem value="Airtel" sx={{ fontSize: '0.75rem' }}>Airtel</MenuItem>
              <MenuItem value="Jio" sx={{ fontSize: '0.75rem' }}>Jio</MenuItem>
              <MenuItem value="BSNL" sx={{ fontSize: '0.75rem' }}>BSNL</MenuItem>
              <MenuItem value="Vodafone Idea" sx={{ fontSize: '0.75rem' }}>Vodafone Idea</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            size="small"
            sx={{ color: 'green' }}
            title="Export to Excel"
            onClick={() => {
              const exportData = dataList.map(({ id, ...rest }) => ({
                'Virtual Number': rest.virtualNumber,
                'Provider': rest.provider
              }));
              const worksheet = XLSX.utils.json_to_sheet(exportData);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'VirtualNumbers');
              XLSX.writeFile(workbook, 'virtual_numbers.xlsx');
            }}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({ id: '', virtualNumber: '', provider: '' });
              setEditingId(null);
              setOpen(true);
            }}
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Create
          </Button>
        </Box>
      </Box>
      {/* Table */}
<TableContainer component={Paper}>
  <Table size="small">
    <TableHead sx={{ backgroundColor: '#122E3E' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedIds.length === filteredData.length}
            onChange={handleSelectAll}
          />
        </TableCell>
        <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}>
          <TableSortLabel
            active={sortConfig.key === 'id'}
            direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('id')}
            sx={{
              color: '#fff !important',
              '& .MuiTableSortLabel-icon': {
                color: '#fff !important',
              },
            }}
          >
            Id
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}>
          <TableSortLabel
            active={sortConfig.key === 'virtualNumber'}
            direction={sortConfig.key === 'virtualNumber' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('virtualNumber')}
            sx={{
              color: '#fff !important',
              '& .MuiTableSortLabel-icon': {
                color: '#fff !important',
              },
            }}
          >
            Virtual Number
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}>
          <TableSortLabel
            active={sortConfig.key === 'provider'}
            direction={sortConfig.key === 'provider' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('provider')}
            sx={{
              color: '#fff !important',
              '& .MuiTableSortLabel-icon': {
                color: '#fff !important',
              },
            }}
          >
            Provider
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} align="center" sx={{ fontSize: '0.8rem' }}>
            No records found
          </TableCell>
        </TableRow>
      ) : (
        filteredData
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((item) => (
            <TableRow key={item.id} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item.id}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item.virtualNumber}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item.provider}</TableCell>
            </TableRow>
          ))
      )}
    </TableBody>
  </Table>
</TableContainer>

<Box mt={2}>
  <Pagination
    count={Math.ceil(filteredData.length / itemsPerPage)}
    page={page}
    onChange={setPage}
    size="small"
  />
</Box>

{/* Modify Dialog */}
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {editingId !== null ? 'Edit Virtual Number' : 'Create Virtual Number'}
    <IconButton onClick={() => setOpen(false)} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
   
<TextField
  label="ID"
  value={formData.id}
  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
  fullWidth
  size="small"
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
  sx={{ mt: 1 }}
/>
<TextField
  label="Virtual Number"
  value={formData.virtualNumber}
  onChange={(e) => setFormData({ ...formData, virtualNumber: e.target.value })}
  fullWidth
  size="small"
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
  sx={{ mt: 1 }}
/>

   
    <FormControl size="small" fullWidth sx={{ mt: 1 }}>
  <InputLabel sx={{ fontSize: '0.75rem' }}>Select a Query</InputLabel>
  <Select
    value={formData.provider}
    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
    label="Select a Query"
    sx={{ fontSize: '0.75rem' }}
    MenuProps={{ PaperProps: { sx: { fontSize: '0.75rem' } } }}
  >
    <MenuItem value="Airtel" sx={{ fontSize: '0.75rem' }}>Airtel</MenuItem>
    <MenuItem value="Jio" sx={{ fontSize: '0.75rem' }}>Jio</MenuItem>
    <MenuItem value="BSNL" sx={{ fontSize: '0.75rem' }}>BSNL</MenuItem>
    <MenuItem value="Vodafone Idea" sx={{ fontSize: '0.75rem' }}>Vodafone Idea</MenuItem>
  </Select>
</FormControl>

  </DialogContent>
  <DialogActions sx={{ pr: 3, pb: 2 }}>
    <Button
      size="small"
      variant="contained"
      onClick={handleSave}
      sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#122E3E' }}
    >
      {editingId !== null ? 'Update' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>

{/* Delete Dialog */}
<Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="xs" fullWidth>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Confirm Delete
    <IconButton onClick={() => setShowDeleteDialog(false)} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ fontSize: '0.85rem' }}>
      Are you sure you want to delete the selected {selectedIds.length} {selectedIds.length > 1 ? 'records' : 'record'}?
    </Typography>
  </DialogContent>
<DialogActions sx={{ pr: 3, pb: 2 }}>
  <Button
    size="small"
    variant="contained"
    onClick={handleDelete}
    sx={{
      textTransform: 'none',
      fontSize: '0.75rem',
      bgcolor: '#122E3E', // same as Modify
      '&:hover': {
        bgcolor: '#0F2533', // consistent hover
      },
    }}
  >
    Delete
  </Button>
</DialogActions>
</Dialog>

    </Box>
  );
};
export default VirtualNumber;

