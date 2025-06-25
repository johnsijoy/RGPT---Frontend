import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputAdornment, InputLabel, IconButton, TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import { slabRateMockData } from '../../mock/slabrate';

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
    top: -8,
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

const SlabRate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: '', slabStart: '', slabEnd: '', percent: '', amount: '', 
    from: '', to: '', project: '', formula: ''
  });
  const [data, setData] = useState(slabRateMockData);
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = data.filter(item => {
    const searchMatch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const typeMatch = typeFilter === '' || item.type === typeFilter;
    return searchMatch && typeMatch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleDialogOpen = (type) => {
    if (type === 'edit') {
      const selected = data.find((item) => item.id === checkedIds[0]);
      if (selected) setFormData(selected);
    } else {
      setFormData({
        type: '', slabStart: '', slabEnd: '', percent: '', amount: '', 
        from: '', to: '', project: '', formula: ''
      });
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCheckedIds([]);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData((prev) =>
        prev.map((item) => (item.id === formData.id ? { ...formData } : item))
      );
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData(prev => [...prev, { id: newId, ...formData }]);
    }
    handleDialogClose();
  };

  const handleDelete = () => {
    setData(prev => prev.filter(item => !checkedIds.includes(item.id)));
    setCheckedIds([]);
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ p: 3, width: '100%', backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs excludePaths={['setup']} />

      {/* Heading */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Slab Rates</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          {/* Modify / Delete */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleDialogOpen('edit')}
              disabled={checkedIds.length !== 1}
              sx={{
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',
                padding: '4px 10px', textTransform: 'none',
                '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
              }}
            >
              Modify
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenDeleteDialog(true)}
              disabled={checkedIds.length === 0}
              sx={{
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',
                padding: '4px 10px', textTransform: 'none',
                '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
              }}
            >
              Delete
            </Button>
          </Box>

          {/* Search, Filter, Export, Create */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 160, ...smallerInputSx }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: { '& .MuiMenuItem-root': { fontSize: '0.75em' } }
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75em' }}><em>All Types</em></MenuItem>
                <MenuItem value="Percentage" sx={{ fontSize: '0.75em' }}>Percentage</MenuItem>
                <MenuItem value="Amount" sx={{ fontSize: '0.75em' }}>Amount</MenuItem>
                <MenuItem value="Flat" sx={{ fontSize: '0.75em' }}>Flat</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton
              size="small"
              sx={{ color: 'green' }}
              title="Export to Excel"
              onClick={() => {
                const headers = [["Type", "Slab Start", "Slab End", "Percent", "Amount", "From", "To", "Project", "Formula"]];
                const rows = data.map(item => [
                  item.type, item.slabStart, item.slabEnd, item.percent, 
                  item.amount, item.from, item.to, item.project, item.formula
                ]);
                const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'SlabRates');
                XLSX.writeFile(workbook, 'slab_rates.xlsx');
              }}
            >
              <DescriptionIcon fontSize="medium" />
            </IconButton>
            
            <Button
              variant="contained"
              size="small"
              onClick={() => handleDialogOpen('create')}
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',
                padding: '4px 10px', textTransform: 'none'
              }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  sx={{ color: '#fff' }}
                  checked={paginatedData.length > 0 && paginatedData.every(item => checkedIds.includes(item.id))}
                  indeterminate={checkedIds.length > 0 && checkedIds.length < paginatedData.length}
                  onChange={(e) => {
                    const pageIds = paginatedData.map(item => item.id);
                    if (e.target.checked) {
                      setCheckedIds(prev => [...new Set([...prev, ...pageIds])]);
                    } else {
                      setCheckedIds(prev => prev.filter(id => !pageIds.includes(id)));
                    }
                  }}
                />
              </TableCell>
              {["type", "slabStart", "slabEnd", "percent", "amount", "from", "to", "project", "formula"].map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: '#fff',
                    fontSize: 13,
                    '& .MuiTableSortLabel-root': { color: '#fff' },
                    '& .MuiTableSortLabel-root:hover': { color: '#fff' },
                    '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                  }}
                >
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {{
                      type: 'Type',
                      slabStart: 'Slab Start',
                      slabEnd: 'Slab End',
                      percent: 'Percent',
                      amount: 'Amount',
                      from: 'From',
                      to: 'To',
                      project: 'Project',
                      formula: 'Formula'
                    }[key]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={() =>
                          setCheckedIds((prev) => isChecked ? prev.filter(id => id !== item.id) : [...prev, item.id])
                        }
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 2 }}>
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 2 }}>
        <Pagination count={totalPages} page={page + 1} onChange={(p) => setPage(p - 1)} />
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <span>{dialogType === 'edit' ? 'Edit Slab Rate' : 'Create Slab Rate'}</span>
            <IconButton onClick={handleDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="Percentage">Percentage</MenuItem>
              <MenuItem value="Amount">Amount</MenuItem>
              <MenuItem value="Flat">Flat</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Slab Start"
            fullWidth
            value={formData.slabStart}
            onChange={(e) => setFormData({ ...formData, slabStart: e.target.value })}
            sx={smallerInputSx}
          />
          
          <TextField
            label="Slab End"
            fullWidth
            value={formData.slabEnd}
            onChange={(e) => setFormData({ ...formData, slabEnd: e.target.value })}
            sx={smallerInputSx}
          />
          
          <TextField
            label="Percent"
            fullWidth
            value={formData.percent}
            onChange={(e) => setFormData({ ...formData, percent: e.target.value })}
            sx={smallerInputSx}
          />
          
          <TextField
            label="Amount"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            sx={smallerInputSx}
          />
          
          <TextField
            label="From"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            sx={smallerInputSx}
          />
          
          <TextField
            label="To"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            sx={smallerInputSx}
          />
          
          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel>Project</InputLabel>
            <Select
              value={formData.project}
              label="Project"
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              <MenuItem value="All Projects">All Projects</MenuItem>
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Formula"
            fullWidth
            value={formData.formula}
            onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
            sx={smallerInputSx}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#122E3E',
              fontSize: '0.75rem', 
              padding: '3px 9px', 
              color: '#fff' 
            }} 
            onClick={handleDialogSubmit}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600 }}>
          Confirm Delete
          <IconButton onClick={() => setOpenDeleteDialog(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
          Are you sure you want to delete selected slab rate{checkedIds.length > 1 ? 's' : ''}?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#122E3E',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '4px 12px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#0e1e2a' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlabRate;