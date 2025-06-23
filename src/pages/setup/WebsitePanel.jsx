import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Button, Checkbox, TextField, InputAdornment, IconButton,
  TableSortLabel, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, DialogContentText
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import mockWebsitePanelData from '../../mock/websitePanel';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import { Chip } from '@mui/material';


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

const WebsitePanel = () => {
  const [dataList, setDataList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'panelName', direction: 'asc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;
const [queryFilter, setQueryFilter] = useState('All');
const [selectedIndex, setSelectedIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    id: '',
    panelName: '',
    panelType: '',
    section: '',
    description: '',
    developer: '',
    status: 'Active'
  });
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    setDataList(mockWebsitePanelData);
  }, []);

 const filteredData = useMemo(() => {
  let data = [...dataList];

  // Search filter
  if (searchTerm) {
    data = data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Status filter
  if (queryFilter !== 'All') {
    data = data.filter(item => item.status === queryFilter);
  }

  // Sorting
  data.sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return data;
}, [dataList, searchTerm, queryFilter, sortConfig]);


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

  const handleDelete = () => {
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    setDataList(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setDeleteDialog(false);
  };

  const handleCreate = () => {
    setDialogMode('create');
    setFormData({
      id: Date.now(),
      panelName: '',
      panelType: '',
      section: '',
      description: '',
      developer: '',
      status: 'Active'
    });
    setOpenDialog(true);
  };

  const handleModify = () => {
    if (selectedIds.length !== 1) {
      alert('Please select exactly one row to modify.');
      return;
    }
    const selected = dataList.find(item => item.id === selectedIds[0]);
    setDialogMode('edit');
    setFormData({ ...selected });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDialog = () => {
    if (dialogMode === 'create') {
      setDataList(prev => [formData, ...prev]);
    } else {
      setDataList(prev =>
        prev.map(item => (item.id === formData.id ? formData : item))
      );
    }
    setOpenDialog(false);
    setSelectedIds([]);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
      <Breadcrumbs />
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 2 }}>
        Website Panel
      </Typography>
<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1.5,
    mb: 2,
  }}
>
  {/* Left-side buttons */}
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button
      variant="contained"
      size="small"
      onClick={handleModify}
      disabled={selectedIds.length !== 1}
      sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
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
      onClick={handleDelete}
      disabled={selectedIds.length === 0}
      sx={{ bgcolor:  '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
    >
      Delete
    </Button>
  </Box>

  {/* Right-side controls */}
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    <TextField
      size="small"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ width: 140, ...smallerInputSx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
<FormControl size="small" sx={{ minWidth: 140 }}>
  <InputLabel sx={{ fontSize: '0.75rem', top: '-4px' }}>Status</InputLabel>
  <Select
    value={queryFilter}
    label="Status"
    onChange={(e) => setQueryFilter(e.target.value)}
    sx={{
      height: 36,
      borderRadius: '8px',
      fontSize: '0.75rem',
      backgroundColor: '#fff'
    }}
  >
    <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
    <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
    <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
    <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
  </Select>
</FormControl>

<IconButton
  size="small"
  sx={{ color: 'green' }}
  title="Export to Excel"
  onClick={() => {
    const formatted = filteredData.map(item => ({
      'Panel Name': item.panelName,
      'Panel Type': item.panelType,
      'Section': item.section,
      'Description': item.description,
      'Developer': item.developer,
      'Status': item.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WebsitePanel');

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) cell.s = { font: { bold: true } };
    }

    worksheet['!cols'] = Array(range.e.c + 1).fill({ wch: 20 });
    XLSX.writeFile(workbook, 'website_panel.xlsx');
  }}
>
  <DescriptionIcon fontSize="medium" />
</IconButton>

    <Button
      variant="contained"
      size="small"
      startIcon={<AddIcon />}
      onClick={handleCreate}
      sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
    >
      Create
    </Button>
  </Box>
</Box>

      <TableContainer component={Paper}>
        <Table size="small">
<TableHead>
  <TableRow sx={{ backgroundColor: '#122E3E' }}>
    <TableCell padding="checkbox">
      <Checkbox
        checked={selectedIds.length === filteredData.length}
        onChange={handleSelectAll}
        sx={{ color: '#fff' }}
      />
    </TableCell>

    {[
      { key: 'panelName', label: 'Panel Name' },
      { key: 'panelType', label: 'Panel Type' },
      { key: 'section', label: 'Section' },
      { key: 'description', label: 'Description' },
      { key: 'developer', label: 'Developer' },
      { key: 'status', label: 'Status' }
    ].map(({ key, label }) => (
      <TableCell key={key} sx={{ color: '#fff', fontSize: '0.8rem' }}>
        <TableSortLabel
          active={sortConfig.key === key}
          direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
          onClick={() => handleSort(key)}
          sx={{
            color: '#fff !important',
            '& .MuiTableSortLabel-icon': {
              color: '#fff !important',
            },
          }}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    ))}
  </TableRow>
</TableHead>
<TableBody>
  {filteredData.length > 0 ? (
    filteredData
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map((item, idx) => {
        const globalIndex = (page - 1) * itemsPerPage + idx;
        const isSelected = selectedIds.includes(globalIndex);

        return (
          <TableRow
            key={idx}
            onClick={() => {
              if (isSelected) {
                setSelectedIds(selectedIds.filter(i => i !== globalIndex));
              } else {
                setSelectedIds([...selectedIds, globalIndex]);
              }
              setSelectedIndex(globalIndex); // Optional: only if you track selected row
            }}
            sx={{
              backgroundColor: isSelected ? '#d0ebff' : 'white',
              cursor: 'pointer'
            }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSelected}
                onChange={() => {}} // Checkboxes work via row click
              />
            </TableCell>

            <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelName}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelType}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.section}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.developer}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>
              <Chip
                label={item.status}
                size="small"
                sx={{
                  backgroundColor:
                    item.status === 'Active'
                      ? '#d4edda'
                      : item.status === 'Inactive'
                      ? '#f8d7da'
                      : '#fff3cd',
                  color:
                    item.status === 'Active'
                      ? '#155724'
                      : item.status === 'Inactive'
                      ? '#721c24'
                      : '#856404',
                  fontWeight: 500
                }}
              />
            </TableCell>
          </TableRow>
        );
      })
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        <Typography variant="body2" sx={{ py: 2 }}>
          No records found.
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>

      <Box mt={2}>
        <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={page} onChange={setPage} size="small" />
      </Box>
<Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Confirm Delete
    <IconButton size="small" onClick={() => setDeleteDialog(false)}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <DialogContentText>Are you sure you want to delete the selected record(s)?</DialogContentText>
  </DialogContent>
  <DialogActions sx={{ px: 2, pb: 1 }}>
  <Button
    size="small"
    variant="contained"
    onClick={confirmDelete}
    sx={{
      bgcolor: '#122E3E',
      textTransform: 'none',
      fontSize: '0.75rem',
      px: 2,
      py: 0.5,
      minWidth: 80
    }}
  >
    Delete
  </Button>
</DialogActions>
</Dialog>

      {/* Create / Modify Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{
          fontWeight: 600, fontSize: '1rem', color: '#122E3E',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2
        }}>
          {dialogMode === 'create' ? 'Create Panel' : 'Modify Panel'}
          <IconButton size="small" onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
  {['panelName', 'panelType', 'section', 'description', 'developer'].map((field) => (
    <TextField
      key={field}
      name={field}
      label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
      value={formData[field]}
      onChange={handleChange}
      size="small"
      fullWidth
      InputLabelProps={{ style: { fontSize: '0.75rem' } }}
      sx={{
        '& .MuiInputBase-root': {
          fontSize: '0.75rem',
          minHeight: '30px',
          padding: '4px 8px',
        },
        '& input': {
          textAlign: 'left',
        },
        '& .MuiInputLabel-root': {
          top: '8px',
          left: '8px',
          transform: 'none',
        },
        '& label.MuiInputLabel-shrink': {
          top: 0,
          transform: 'translate(14px, -7px) scale(0.75)',
        }
      }}
    />
  ))}

  <TextField
    select
    label="Status"
    value={formData.status}
    onChange={e => setFormData({ ...formData, status: e.target.value })}
    fullWidth
    size="small"
    InputLabelProps={{ style: { fontSize: '0.75rem' } }}
    SelectProps={{
      MenuProps: {
        PaperProps: {
          sx: { fontSize: '0.75rem' }
        }
      }
    }}
    sx={{
      '& .MuiSelect-select': {
        fontSize: '0.75rem',
        padding: '4px 8px',
      },
      '& .MuiInputBase-root': {
        minHeight: '30px',
      }
    }}
  >
    <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
    <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
    <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
  </TextField>
</DialogContent>

<DialogActions sx={{ px: 2, pb: 1 }}>
  <Button
    size="small"
    variant="contained"
    onClick={handleSubmitDialog}
    sx={{
      bgcolor: '#122E3E',
      textTransform: 'none',
      fontSize: '0.75rem',
      px: 2,
      py: 0.5,
      minWidth: 80
    }}
  >
    {dialogMode === 'edit' ? 'Update' : 'Save'}
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
};

export default WebsitePanel;

