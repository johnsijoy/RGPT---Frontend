import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Stack,
  InputAdornment,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';

import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import { slabRateMockData } from '../../mock/slabrate';
import * as XLSX from 'xlsx';
const darkBlue = '#122E3E';
const grayDisabled = '#B0B0B0';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '28px',
    paddingTop: '4px',
    paddingBottom: '4px',
    '& .MuiOutlinedInput-input': {
      padding: '4px 8px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: -8,
    left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0,
      transform: 'translate(14px, -7px) scale(0.75) !important',
      transformOrigin: 'top left',
    },
  },
};

function SlabRateForm({ initialData = {}, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    type: '',
    slabStart: '',
    slabEnd: '',
    percent: '',
    amount: '',
    from: '',
    to: '',
    project: '',
    formula: '',
  });

  React.useEffect(() => {
    setFormData({
      type: initialData.type || '',
      slabStart: initialData.slabStart || '',
      slabEnd: initialData.slabEnd || '',
      percent: initialData.percent || '',
      amount: initialData.amount || '',
      from: initialData.from || '',
      to: initialData.to || '',
      project: initialData.project || '',
      formula: initialData.formula || '',
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <IconButton
        onClick={onCancel}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'grey.600',
        }}
        aria-label="close form"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" gutterBottom>
        {initialData && initialData.id ? 'Edit Slab Rate' : 'Create Slab Rate'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel required>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={handleChange('type')}
              required
              size="small"
            >
              <MenuItem value="Percentage">Percentage</MenuItem>
              <MenuItem value="Amount">Amount</MenuItem>
              <MenuItem value="Flat">Flat</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Slab Start Value"
            size="small"
            fullWidth
            value={formData.slabStart}
            onChange={handleChange('slabStart')}
            type="number"
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Slab End Value"
            size="small"
            fullWidth
            value={formData.slabEnd}
            onChange={handleChange('slabEnd')}
            type="number"
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Slab Percent"
            size="small"
            fullWidth
            value={formData.percent}
            onChange={handleChange('percent')}
            type="number"
            sx={smallerInputSx}
          />

          <TextField
            label="Slab Amount"
            size="small"
            fullWidth
            value={formData.amount}
            onChange={handleChange('amount')}
            type="number"
            sx={smallerInputSx}
          />

          <TextField
            label="Applicable From"
            size="small"
            fullWidth
            value={formData.from}
            onChange={handleChange('from')}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Applicable To"
            size="small"
            fullWidth
            value={formData.to}
            onChange={handleChange('to')}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            sx={smallerInputSx}
          />

          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel required>Projects Applicable</InputLabel>
            <Select
              value={formData.project}
              label="Projects Applicable"
              onChange={handleChange('project')}
              required
              size="small"
            >
              <MenuItem value="All Projects">All Projects</MenuItem>
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Formula"
            size="small"
            fullWidth
            value={formData.formula}
            onChange={handleChange('formula')}
            sx={smallerInputSx}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
  variant="contained"
  type="submit"
  size="small"
  sx={{
    textTransform: 'none',
    backgroundColor: '#162F40',
    '&:hover': { backgroundColor: '#121f2a' },
    fontSize: '0.75rem',
    minWidth: 70,
    height: 28,
    padding: '4px 10px',
  }}
>
  Save
</Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default function Slabrate() {
  const [dataList, setDataList] = useState(slabRateMockData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'type', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const pageSize = 25;

  const filteredData = useMemo(() => {
    return dataList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [dataList, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key] ?? '';
      const valB = b[sortConfig.key] ?? '';

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, page]);

  const isModifyEnabled = selectedIds.length === 1;
  const isDeleteEnabled = selectedIds.length > 0;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const pageIds = paginatedData.map((item) => item.id);
      setSelectedIds(pageIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCreate = () => {
    setEditData(null);
    setShowForm(true);
    setSelectedIds([]);
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) return;
    const selected = dataList.find((item) => item.id === selectedIds[0]);
    if (selected) {
      setEditData(selected);
      setShowForm(true);
    }
  };

  const openDeleteDialog = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const confirmDelete = () => {
    setDataList((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setShowDeleteDialog(false);
  };

  const handleBatchUpdate = () => {
    // Placeholder batch update logic
    alert(`Batch update for ${selectedIds.length} selected items`);
  };

  const handleSubmit = (formData) => {
    if (editData && editData.id) {
      setDataList((prev) =>
        prev.map((item) => (item.id === editData.id ? { ...item, ...formData } : item))
      );
    } else {
      const newId = dataList.length ? Math.max(...dataList.map((d) => d.id)) + 1 : 1;
      setDataList((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowForm(false);
    setSelectedIds([]);
  };

  const handleExport = () => {
    const headersMap = {
      type: 'Type',
      slabStart: 'Slab Start',
      slabEnd: 'Slab End',
      percent: 'Percent',
      amount: 'Amount',
      from: 'Applicable From',
      to: 'Applicable To',
      project: 'Projects Applicable',
      formula: 'Formula',
    };

    const worksheetData = filteredData.map((item) => {
      const row = {};
      Object.keys(headersMap).forEach((key) => {
        row[headersMap[key]] = item[key] ?? '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SlabRates');
    XLSX.writeFile(workbook, 'slab_rates.xlsx');
  };

  // Common button styles with conditional colors
  const getButtonSx = (enabled) => ({
    fontSize: '0.75rem',
    textTransform: 'none',
    padding: '4px 10px',
    backgroundColor: enabled ? '#162F40' : '#D8BFF7 !important',
    color: enabled ? '#fff' : '#162F40 !important',
    pointerEvents: 'auto',
    '&:hover': {
      backgroundColor: enabled ? '#121f2a' : '#D8BFF7 !important',
    },
    '&.Mui-disabled': {
      backgroundColor: '#D8BFF7 !important',
      color: '#162F40 !important',
      opacity: 1,
    },
  });

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box mb={2}>
        <Breadcrumbs items={[{ label: 'Setup', path: '/setup' }, { label: 'Slab Rates' }]} />
      </Box>

      <Typography variant="h6" sx={{ flexGrow: 1, mb: 2 }}>
        Slab Rates
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleEdit}
            disabled={!isModifyEnabled}
            variant="contained"
            size="small"
             sx={{
      fontSize: '0.75rem',
      textTransform: 'none',
      padding: '4px 10px',
      backgroundColor: isModifyEnabled ? darkBlue : grayDisabled,
      color: '#fff',
      '&:hover': {
        backgroundColor: isModifyEnabled ? '#0f1e2d' : grayDisabled,
      },
    }}

          >
            Modify
          </Button>
          <Button
            onClick={openDeleteDialog}
            disabled={!isDeleteEnabled}
            variant="contained"
            size="small"
            sx={{
      fontSize: '0.75rem',
      textTransform: 'none',
      padding: '4px 10px',
      backgroundColor: isDeleteEnabled ? darkBlue : grayDisabled,
      color: '#fff',
      '&:hover': {
        backgroundColor: isDeleteEnabled ? '#0f1e2d' : grayDisabled,
      },
    }}
          >
            Delete
          </Button>
          <Button
            onClick={handleBatchUpdate}
            disabled={true}
            variant="contained"
            size="small"
           sx={{
      fontSize: '0.75rem',
      textTransform: 'none',
      padding: '4px 10px',
      backgroundColor: isDeleteEnabled ? darkBlue : grayDisabled,
      color: '#fff',
      '&:hover': {
        backgroundColor: isDeleteEnabled ? '#0f1e2d' : grayDisabled,
      },
    }}
          >
            Batch Update
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              width: 130,
              '& .MuiInputBase-root': {
                height: 30,
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input': {
                padding: '0px 6px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton size="small" onClick={handleExport} title="Export to Excel" sx={{ color: 'green' }}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            onClick={handleCreate}
            size="small"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#162F40',
              fontSize: '0.75rem',
              padding: '4px 10px',
              textTransform: 'none',
              minWidth: 'fit-content',
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#162F40' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
                  <Checkbox
                    size="small"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    inputProps={{
                      'aria-label': 'select all slab rates',
                    }}
                  />
                </TableCell>
                {[
                  'type',
                  'slabStart',
                  'slabEnd',
                  'percent',
                  'amount',
                  'from',
                  'to',
                  'project',
                  'formula',
                ].map((key) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key)}
                    sx={{ color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}{' '}
                    {sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUpwardIcon fontSize="inherit" sx={{ color: '#fff' }} />
                      ) : (
                        <ArrowDownwardIcon fontSize="inherit" sx={{ color: '#fff' }} />
                      )
                    ) : (
                      <ArrowDownwardIcon fontSize="inherit" sx={{ color: '#fff', opacity: 0.3 }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedIds.includes(item.id)}
                    onClick={() => handleCheckbox(item.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckbox(item.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.type}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.slabStart}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.slabEnd}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.percent}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.amount}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.from}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.to}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.project}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.formula}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                    No Slab Rates Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Pagination count={pageCount} page={page} onChange={setPage} size="small" />
      </Box>

      {/* Form Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogContent dividers>
          <SlabRateForm
            initialData={editData || {}}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ m: 0, p: 2, position: 'relative',borderBottom: 'none' }}>
          <Typography variant="h6">Confirm Delete</Typography>
          <IconButton
            aria-label="close"
            onClick={closeDeleteDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#162F40',
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
        sx={{ borderTop: 'none' }}
        >

        
        
          <Typography fontSize="0.875rem">
            Are you sure you want to delete {selectedIds.length} selected slab rate
            {selectedIds.length > 1 ? 's' : ''}?
          </Typography>
          </DialogContent>
        
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={confirmDelete}
            size="small"
            variant="contained"
            sx={{
              backgroundColor: '#162F40',
              fontSize: '0.75rem',
              '&:hover': { backgroundColor: '#121f2a' },
              minWidth: 80,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
