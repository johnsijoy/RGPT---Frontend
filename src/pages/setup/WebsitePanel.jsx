import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Button, Checkbox, TextField, InputAdornment, IconButton,
  TableSortLabel, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import mockWebsitePanelData from '../../mock/websitePanel';
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

const WebsitePanel = () => {
  const [dataList, setDataList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  // Dialog-related states
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

  useEffect(() => {
    setDataList(mockWebsitePanelData);
  }, []);

  const filteredData = useMemo(() => {
    let data = [...dataList];

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
  }, [dataList, searchTerm, sortConfig]);

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
    setDataList(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
<Box sx={{ display: 'flex', gap: 1 }}>
  <Button
    variant="outlined"
    size="small"
    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
    disabled={selectedIds.length !== 1}
    onClick={handleModify}
  >
    Modify
  </Button>

  <Button
    variant="outlined"
    size="small"
    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
    disabled={selectedIds.length === 0}
  >
    Batch Update
  </Button>

  <Button
    variant="outlined"
    size="small"
    color="error"
    onClick={handleDelete}
    disabled={selectedIds.length === 0}
    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
  >
    Delete
  </Button>
</Box>


        <Box sx={{ display: 'flex', gap: 1 }}>
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
              )
            }}
          />

          <IconButton
            size="small"
            sx={{ color: 'green' }}
            title="Export to Excel"
            onClick={() => {
              const worksheet = XLSX.utils.json_to_sheet(filteredData);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'WebsitePanel');
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
                />
              </TableCell>
              {[
                { key: 'id', label: 'ID' },
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
            {filteredData
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
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelType}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.section}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.developer}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.status}</TableCell>
                </TableRow>
              ))}
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

      {/* Dialog for Create & Modify */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === 'create' ? 'Create Panel' : 'Modify Panel'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField name="panelName" label="Panel Name" value={formData.panelName} onChange={handleChange} />
          <TextField name="panelType" label="Panel Type" value={formData.panelType} onChange={handleChange} />
          <TextField name="section" label="Section" value={formData.section} onChange={handleChange} />
          <TextField name="description" label="Description" value={formData.description} onChange={handleChange} />
          <TextField name="developer" label="Developer" value={formData.developer} onChange={handleChange} />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
<Button variant="contained" onClick={handleSubmitDialog}>
  Save
</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebsitePanel;
