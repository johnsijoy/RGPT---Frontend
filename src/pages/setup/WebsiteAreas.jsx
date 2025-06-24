import React, { useState, useMemo, useEffect } from 'react';
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
import { websiteAreasMockData } from '../../mock/websiteareas';
import * as XLSX from 'xlsx';
const darkBlue = '#122E3E';
const grayDisabled = '#B0B0B0';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '28px',
    paddingTop: '4px',
    paddingBottom: '4px',
    display: 'flex',
    alignItems: 'center', // Vertically centers the text
  },
  '& .MuiOutlinedInput-input': {
    padding: '4px 8px',
    fontSize: '0.75rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: '50%',
    left: 8,
    transform: 'translateY(-50%)',
    transition: 'all 0.2s ease',
    '&.MuiInputLabel-shrink': {
      top: 0,
      left: 0,
      transform: 'translate(14px, -7px) scale(0.75) !important',
      transformOrigin: 'top left',
    },
  },
};

function WebsiteAreasForm({ initialData = {}, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    masterArea: '',
    name: '',
    city: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    setFormData({
      masterArea: initialData.masterArea || '',
      name: initialData.name || '',
      city: initialData.city || '',
      latitude: initialData.latitude || '',
      longitude: initialData.longitude || '',
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* X close button top-right */}
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#162F40',
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" gutterBottom>
        {initialData && initialData.name ? 'Modify Website Area' : 'Create Website Area'}
      </Typography>
      <form onSubmit={handleSubmitForm}>
        <Stack spacing={2}>
          <TextField
            label="Master Area"
            size="small"
            fullWidth
            value={formData.masterArea}
            onChange={handleChange('masterArea')}
            required
            sx={smallerInputSx}
          />
          <TextField
            label="Website Area Name"
            size="small"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            required
            sx={smallerInputSx}
          />
          <TextField
            label="City"
            size="small"
            fullWidth
            value={formData.city}
            onChange={handleChange('city')}
            required
            sx={smallerInputSx}
          />
          <TextField
            label="Latitude"
            size="small"
            fullWidth
            value={formData.latitude}
            onChange={handleChange('latitude')}
            sx={smallerInputSx}
          />
          <TextField
            label="Longitude"
            size="small"
            fullWidth
            value={formData.longitude}
            onChange={handleChange('longitude')}
            sx={smallerInputSx}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              size="small"
              sx={{
                textTransform: 'none',
                backgroundColor: '#162F40',
                '&:hover': { backgroundColor: '#121f2a' },
                fontSize: '0.75rem',
                minWidth: 60,
                height: 25,
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

export default function WebsiteAreas() {
  const [dataList, setDataList] = useState(websiteAreasMockData);
  const [selectedIds, setSelectedIds] = useState([]); // array of selected ids
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'masterArea', direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredData = useMemo(() => {
    let filtered = dataList;

    if (statusFilter) {
      filtered = filtered.filter((item) =>
        item.masterArea.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [dataList, statusFilter, searchTerm]);

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

  // Toggle selection for a single item
  const handleCheckbox = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle selection for all items on the current page
  const handleSelectAll = (checked) => {
    if (checked) {
      const pageIds = paginatedData.map((item) => item.id);
      setSelectedIds(pageIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Modify enabled only when exactly 1 selected
  // Delete enabled when >=1 selected
  const isModifyEnabled = selectedIds.length === 1;
  const isDeleteEnabled = selectedIds.length > 0;

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

  const handleCancel = () => {
    setShowForm(false);
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
    // Map keys to column headers exactly as shown in table header
    const headersMap = {
      masterArea: 'Master Area',
      name: 'Website Area Name',
      city: 'City',
      latitude: 'Latitude',
      longitude: 'Longitude',
    };

    // Map filtered data to new objects with correct headers as keys
    const worksheetData = filteredData.map((item) => {
      const row = {};
      Object.keys(headersMap).forEach((key) => {
        row[headersMap[key]] = item[key] ?? '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WebsiteAreas');
    XLSX.writeFile(workbook, 'website_areas.xlsx');
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box mb={2}>
        <Breadcrumbs items={[{ label: 'Setup', path: '/setup' }, { label: 'Website Areas' }]} />
      </Box>

      <Typography variant="h6" sx={{ flexGrow: 1, mb: 2 }}>
        Website Areas
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

          <FormControl
            size="small"
            sx={{
              minWidth: 130,
              '& .MuiInputBase-root': {
                height: 30,
                fontSize: '0.75rem',
              },
              '& .MuiSelect-select': {
                paddingTop: '6px',
                paddingBottom: '6px',
              },
            }}
          >
            <InputLabel sx={{ fontSize: '0.70rem' }}>Select a Query</InputLabel>
            <Select
  value={statusFilter}
  label="Select a Query"
  onChange={(e) => setStatusFilter(e.target.value)}
  MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200,
        // Only reduce font size and height of dropdown items here:
        '& .MuiMenuItem-root': {
          fontSize: '0.65rem',  // smaller font for options
          minHeight: 28,        // smaller height for options
          paddingTop: '4px',
          paddingBottom: '4px',
        },
      },
    },
  }}
>
  <MenuItem value="">
    <em>All</em>
  </MenuItem>
  <MenuItem value="Zone A">Zone A</MenuItem>
  <MenuItem value="Zone B">Zone B</MenuItem>
  <MenuItem value="Zone C">Zone C</MenuItem>
</Select>

          </FormControl>

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
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < paginatedData.length
                    }
                    checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    inputProps={{
                      'aria-label': 'select all website areas',
                    }}
                  />
                </TableCell>
                {['masterArea', 'name', 'city', 'latitude', 'longitude'].map((key) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key)}
                    sx={{ color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    {key === 'name' ? 'Website Area Name' : key.charAt(0).toUpperCase() + key.slice(1)}{' '}
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
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.masterArea}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.city}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.latitude}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.longitude}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                    No Website Areas Found
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
      <Dialog open={showForm} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogContent dividers>
          <WebsiteAreasForm initialData={editData || {}} onCancel={handleCancel} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
          <Typography
      variant="h6"
    
    >
      Confirm Delete
    </Typography>
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
        sx={{ borderTop: 'none'}}
        >
          <Typography fontSize="0.875rem">
            Are you sure you want to delete {selectedIds.length} selected website area
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
              minWidth: 60,
                height: 25,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
