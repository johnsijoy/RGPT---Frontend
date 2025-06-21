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
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Pagination from '../../../components/common/Pagination';
import websiteStates from '../../../mock/websitestates';

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

const smallerMenuProps = {
  sx: {
    '& .MuiMenuItem-root': {
      fontSize: '0.75rem',
      minHeight: '28px',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
    '& .MuiCheckbox-root': {
      transform: 'scale(0.8)',
      padding: '4px',
    },
  },
};

const WebsiteStatesList = () => {
  const [checkedStateId, setCheckedStateId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({ name: '', country: '' });
  const [data, setData] = useState(websiteStates);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = data.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(search.toLowerCase());
    const regionMatch =
      filterQuery === '' ||
      (filterQuery === 'South' && ['Tamil Nadu', 'Karnataka', 'Telangana', 'Kerala', 'Andhra Pradesh'].includes(item.name)) ||
      (filterQuery === 'North' && ['Delhi', 'Punjab', 'Uttar Pradesh', 'Haryana'].includes(item.name)) ||
      (filterQuery === 'West' && ['Maharashtra', 'Rajasthan', 'Gujarat'].includes(item.name));
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
    setFormData({ name: '', country: '' });
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({ name: '', country: '' });
  };

  const handleDialogSubmit = () => {
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData(prev => [...prev, { id: newId, ...formData }]);
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Breadcrumbs />
      
          {/* Filters & Actions */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>Website Cities</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: '160px', ...smallerInputSx }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: '1.1rem' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 160, ...smallerInputSx }}>
                    <InputLabel>Select a Query</InputLabel>
                    <Select
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      label="Select a Query"
                      MenuProps={smallerMenuProps}>
                       
                       <MenuItem value=""><em>All States</em></MenuItem>
                       <MenuItem value="South">South India</MenuItem>
                       <MenuItem value="North">North India</MenuItem>
                       <MenuItem value="West">West India</MenuItem>
                    </Select>
                  </FormControl>

          <IconButton
            size="small"
            sx={{ color: 'green' }}
            title="Export to Excel"
            onClick={() => {
              const exportData = data.map(({ id, ...rest }) => rest);
              const ws = XLSX.utils.json_to_sheet(exportData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'States');
              XLSX.writeFile(wb, 'website_states.xlsx');
            }}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            onClick={() => handleDialogOpen('create')}
            sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            + Create
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: '#fff', fontSize: 13 }}>
                <TableSortLabel
                  active={sortConfig.key === 'name'}
                  direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{
                    color: '#fff',
                    '&:hover': { color: '#fff' },
                    '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                  }}
                >
                  Website State Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', fontSize: 13 }}>
                <TableSortLabel
                  active={sortConfig.key === 'country'}
                  direction={sortConfig.key === 'country' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('country')}
                  sx={{
                    color: '#fff',
                    '&:hover': { color: '#fff' },
                    '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                  }}
                >
                  Country
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((state) => (
                <TableRow key={state.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={checkedStateId === state.id}
                      onChange={() => setCheckedStateId(state.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{state.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{state.country}</TableCell>
                </TableRow>
              ))
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

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create State
          <IconButton onClick={handleDialogClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Website State Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Country"
            variant="outlined"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: 'red' }}>CANCEL</Button>
          <Button variant="contained" sx={{ bgcolor: '#122E3E', color: '#fff' }} onClick={handleDialogSubmit}>
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebsiteStatesList;
