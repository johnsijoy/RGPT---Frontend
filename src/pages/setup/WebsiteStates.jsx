import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputAdornment, InputLabel, IconButton, TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import websiteStates from '../../mock/websitestates';

const smallerInputSx = {'& .MuiInputBase-root': {fontSize: '0.75rem',minHeight: '28px',paddingTop: '4px',paddingBottom: '4px',
    '& .MuiOutlinedInput-input': {padding: '4px 8px',},
    '& .MuiSelect-select': { paddingTop: '4px !important',paddingBottom: '4px !important',minHeight: 'auto !important',lineHeight: '1.2 !important',
    },
  },
  '& .MuiInputLabel-root': {fontSize: '0.75rem',top: -8,left: '0px','&.MuiInputLabel-shrink': {
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

const WebsiteStates = () => {
  const [checkedStateIds, setCheckedStateIds] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({ name: '', country: '' });
  const [data, setData] = useState(websiteStates);
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = data.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const regionMatch =
      statusFilter === '' ||
      (statusFilter === 'South' && ['Tamil Nadu', 'Karnataka', 'Telangana', 'Kerala', 'Andhra Pradesh'].includes(item.name)) ||
      (statusFilter === 'North' && ['Delhi', 'Punjab', 'Uttar Pradesh', 'Haryana'].includes(item.name)) ||
      (statusFilter === 'West' && ['Maharashtra', 'Rajasthan', 'Gujarat'].includes(item.name));
    return nameMatch && regionMatch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key].toLowerCase();
    const bVal = b[sortConfig.key].toLowerCase();
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleDialogOpen = (type) => {
    if (type === 'edit') {
      const selected = data.find((item) => item.id === checkedStateIds[0]);
      if (selected) {
        setFormData({ name: selected.name, country: selected.country, id: selected.id });
      }
    } else {
      setFormData({ name: '', country: '' });
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({ name: '', country: '' });
    setCheckedStateIds([]);
  };

  const handleDelete = () => {
    setData(prev => prev.filter(state => !checkedStateIds.includes(state.id)));
    setCheckedStateIds([]);
    setOpenDeleteDialog(false);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData((prev) =>
        prev.map((item) =>
          item.id === formData.id ? { ...item, name: formData.name, country: formData.country } : item
        )
      );
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData(prev => [...prev, { id: newId, ...formData }]);
    }
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3, width: '100%', backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Website States</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleDialogOpen('edit')}
              disabled={checkedStateIds.length !== 1}
              sx={{
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '2px 9px',
                textTransform: 'none',
                '&.Mui-disabled': { bgcolor: '#e0e0e0',padding: '2px 9px', color: '#888' }
              }}
            >
              Modify
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenDeleteDialog(true)}
              disabled={checkedStateIds.length === 0}
              sx={{
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '2px 9px',
                textTransform: 'none',
                '&.Mui-disabled': { bgcolor: '#e0e0e0', padding: '2px 9px',color: '#888' }
              }}
            >
              Delete
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 160, fontSize: '0.75rem', ...smallerInputSx }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
              <InputLabel>Select a Query</InputLabel>
              <Select
                value={statusFilter}
                label="Select a Query"
                sx={{ fontSize: '0.75rem' }}
                onChange={(e) => setStatusFilter(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': {
                        fontSize: '0.75em'
                      }
                    }
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75em' }}>All States</MenuItem>
                <MenuItem value="South" sx={{ fontSize: '0.75em' }}>South India</MenuItem>
                <MenuItem value="North" sx={{ fontSize: '0.75em' }}>North India</MenuItem>
                <MenuItem value="West" sx={{ fontSize: '0.75em' }}>West India</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              size="small"
              sx={{ color: 'green' }}
              title="Export to Excel"
              onClick={() => {
                const headers = [["Website State Name", "Country"]];
                const rows = data.map(state => [state.name, state.country]);
                const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'States');
                XLSX.writeFile(workbook, 'website_states.xlsx');
              }}
            >
              <DescriptionIcon fontSize="medium" />
            </IconButton>

            <Button
              variant="contained"
              size="small"
              onClick={() => handleDialogOpen('create')}
              sx={{
                bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '4px 10px',
                textTransform: 'none'
              }}
            >
              + Create
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
                  checked={paginatedData.length > 0 && paginatedData.every((item) => checkedStateIds.includes(item.id))}
                  indeterminate={checkedStateIds.length > 0 && checkedStateIds.length < paginatedData.length}
                  onChange={(e) => {
                    const currentPageIds = paginatedData.map((item) => item.id);
                    if (e.target.checked) {
                      setCheckedStateIds((prev) => [...new Set([...prev, ...currentPageIds])]);
                    } else {
                      setCheckedStateIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
                    }
                  }}
                />
              </TableCell>
              {["name", "country"].map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: '#fff', fontSize: 13,
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
                    {{ name: 'Website State Name', country: 'Country' }[key]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((state) => {
                const isChecked = checkedStateIds.includes(state.id);
                return (
                  <TableRow key={state.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={() => {
                          setCheckedStateIds((prev) =>
                            isChecked
                              ? prev.filter((id) => id !== state.id)
                              : [...prev, state.id]
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{state.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{state.country}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
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
            <span>{dialogType === 'edit' ? 'Edit State' : 'Create State'}</span>
            <IconButton onClick={handleDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Website State Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{
              fontSize: '0.75rem',
              '& .MuiInputBase-input': { fontSize: '0.75rem' },
              '& .MuiInputLabel-root': { fontSize: '0.75rem' }
            }}
          />
          <TextField
            label="Country"
            fullWidth
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            sx={{fontSize: '0.75rem','& .MuiInputBase-input': { fontSize: '0.75rem' },'& .MuiInputLabel-root': { fontSize: '0.75rem' }}} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', padding: '3px 9px', color: '#fff' }} onClick={handleDialogSubmit}>
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
          Are you sure you want to delete selected state?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            sx={{bgcolor: '#122E3E',color: '#fff',fontSize: '0.75rem',padding: '4px 12px',textTransform: 'none','&:hover': { bgcolor: '#0e1e2a' }}}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebsiteStates;
