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
import websiteCities from '../../../mock/websitecities';

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
      minHeight: 'auto',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
    '& .MuiCheckbox-root': {
      transform: 'scale(0.8)',
      padding: '4px',
    },
  },
};

const WebsiteCitiesList = () => {
  const [search, setSearch] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(0);
  const [checkedCityId, setCheckedCityId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [formData, setFormData] = useState({
    name: '',
    masterCity: '',
    state: '',
    country: '',
    latitude: '',
    longitude: ''
  });

  const [data, setData] = useState(websiteCities);
  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredCities = data.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterQuery === '' ||
        (filterQuery === 'Metro' && c.masterCity.includes('Metro')) ||
        (filterQuery === 'South' && ['Tamil Nadu', 'Karnataka', 'Telangana'].includes(c.state)))
  );

  const sortedCities = [...filteredCities].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(sortedCities.length / rowsPerPage);
  const paginatedCities = sortedCities.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleCreateClick = () => {
    setFormData({
      name: '',
      masterCity: '',
      state: '',
      country: '',
      latitude: '',
      longitude: ''
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = () => {
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData(prev => [...prev, { id: newId, ...formData }]);
    setOpenDialog(false);
  };

  const handleCheckboxChange = (cityId) => {
    setCheckedCityId(cityId === checkedCityId ? null : cityId);
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Breadcrumbs excludePaths={['setup']} />

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
              MenuProps={smallerMenuProps}
            >
              <MenuItem value=""><em>All Cities</em></MenuItem>
              <MenuItem value="Metro">Metro Cities</MenuItem>
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
              XLSX.utils.book_append_sheet(wb, ws, 'Cities');
              XLSX.writeFile(wb, 'website_cities.xlsx');
            }}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            onClick={handleCreateClick}
            sx={{
              bgcolor: '#122E3E',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '4px 10px',
              textTransform: 'none',
            }}
          >
            + Create
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox" />
              {['name', 'masterCity', 'state', 'country'].map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: '#fff',
                    fontSize: 13,
                    '& .MuiTableSortLabel-root': { color: '#fff' },
                    '& .MuiTableSortLabel-root:hover': { color: '#fff' },
                    '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                  }}
                >
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {{
                      name: 'Website City Name',
                      masterCity: 'Master City',
                      state: 'State',
                      country: 'Country',
                    }[key]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCities.length > 0 ? (
              paginatedCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={checkedCityId === city.id}
                      onChange={() => handleCheckboxChange(city.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.masterCity}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.state}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{city.country}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
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
                   Create 
          <IconButton onClick={handleDialogClose} size="small">
            <CloseIcon />
          </IconButton>

        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Website City Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth />
          <TextField label="Master City" value={formData.masterCity} onChange={(e) => setFormData({ ...formData, masterCity: e.target.value })} fullWidth />
          <TextField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} fullWidth />
          <TextField label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} fullWidth />
          <TextField label="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} fullWidth />
          <TextField label="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} fullWidth />
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

export default WebsiteCitiesList;
