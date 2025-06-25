import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, TableSortLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Select, MenuItem,
  InputAdornment, FormControl, InputLabel, Checkbox, Chip
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Pagination from '../../../components/common/Pagination';
import * as XLSX from 'xlsx';
import mockReportData from '../../../mock/Report';

const fieldLabels = {
  name: 'Name',
  displayName: 'Display Name',
  module: 'Module',
  visibility: 'Visibility',
  mailMergeTemplate: 'Mail Merge Template',
  toBeUsedFor: 'To Be Used For',
};

const Report = () => {
  const [search, setSearch] = useState('');
  const [selectQuery, setSelectQuery] = useState('All');
  const [reports, setReports] = useState(mockReportData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', displayName: '', module: '', visibility: '',
    mailMergeTemplate: '', toBeUsedFor: '', status: 'Active'
  });

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    setPage(1);
  }, [search, selectQuery]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = [...reports].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter(item =>
    Object.values(item).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    ) && (selectQuery === 'All' || item.status === selectQuery)
  );

  const handleExportToExcel = () => {
    const formatted = reports.map(r => ({
      Name: r.name, DisplayName: r.displayName, Module: r.module,
      Visibility: r.visibility, 'Mail Merge Template': r.mailMergeTemplate,
      'To Be Used For': r.toBeUsedFor, Status: r.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'reports.xlsx');
  };

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const report = filtered[selectedItems[0]];
      const globalIndex = reports.findIndex(r => r.name === report.name);
      setFormData(report);
      setEditingIndex(globalIndex);
      setIsEditMode(true);
      setShowForm(true);
    }
  };

  const handleDelete = () => {
  const namesToDelete = selectedItems.map(idx => filtered[idx].name);
  const updated = reports.filter(report => !namesToDelete.includes(report.name));
  setReports(updated);
  setSelectedItems([]);
  setDeleteConfirm(false);
};


  const handleSave = () => {
    if (isEditMode && editingIndex !== null) {
      const updated = [...reports];
      updated[editingIndex] = formData;
      setReports(updated);
    } else {
      setReports([...reports, formData]);
    }
    setShowForm(false);
    setIsEditMode(false);
    setFormData({
      name: '', displayName: '', module: '', visibility: '',
      mailMergeTemplate: '', toBeUsedFor: '', status: 'Active'
    });
  };

  const handleCheckboxChange = (idx) => {
    if (selectedItems.includes(idx)) {
      setSelectedItems(prev => prev.filter(i => i !== idx));
    } else {
      setSelectedItems(prev => [...prev, idx]);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="Reports" />
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 1 }}>
        Reports
      </Typography>

      {/* ======= Top Control Bar ======= */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
  {/* Left-side buttons */}
  {/* Left-side buttons (updated with WebsitePanel sizing) */}
<Box sx={{ display: 'flex', gap: 1 }}>
  <Button
    variant="contained"
    size="small"
    disabled={selectedItems.length !== 1}
    onClick={handleEdit}
    sx={{
      bgcolor: '#122E3E',
      textTransform: 'none',
      fontSize: '0.75rem',
      px: 2,
      py: 0.5,
      minWidth: 80
    }}
  >
    Modify
  </Button>

  <Button
    variant="outlined"
    size="small"
    disabled
    sx={{
      textTransform: 'none',
      fontSize: '0.75rem',
      color: 'gray',
      borderColor: 'gray',
      px: 2,
      py: 0.5,
      minWidth: 80
    }}
  >
    Batch Update
  </Button>

  <Button
    variant="contained"
    size="small"
    disabled={selectedItems.length === 0}
    onClick={() => setDeleteConfirm(true)}
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
</Box>

  {/* Right-side controls */}
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
    <TextField
      size="small"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        width: 180,
        '& input': { fontSize: '0.75rem' }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
          </InputAdornment>
        )
      }}
    />

    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel sx={{ fontSize: '0.75rem', top: '-4px' }}>Select a Query</InputLabel>
      <Select
        value={selectQuery}
        onChange={(e) => setSelectQuery(e.target.value)}
        label="Select a Query"
        sx={{ fontSize: '0.75rem', height: 36 }}
      >
        <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
        <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
        <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
      </Select>
    </FormControl>

    <IconButton onClick={handleExportToExcel} sx={{ color: 'green' }}>
      <DescriptionIcon />
    </IconButton>

    <Button
      variant="contained"
      size="small"
      startIcon={<AddIcon />}
      sx={{
        bgcolor: '#122E3E',
        textTransform: 'none',
        fontSize: '0.75rem',
        px: 2,
        py: 0.5
      }}
      onClick={() => {
        setIsEditMode(false);
        setFormData({
          name: '', displayName: '', module: '', visibility: '',
          mailMergeTemplate: '', toBeUsedFor: '', status: 'Active'
        });
        setShowForm(true);
      }}
    >
      Create
    </Button>
  </Box>
</Box>

{/* ======= Table Head with Sorting ======= */}
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#122E3E' }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedItems.length === filtered.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems(filtered.map((_, idx) => idx));
              } else {
                setSelectedItems([]);
              }
            }}
            sx={{ color: '#fff' }}
          />
        </TableCell>

        {Object.keys(fieldLabels).map((key) => (
          <TableCell key={key} sx={{ color: '#fff', fontSize: '0.8rem' }}>
            <TableSortLabel
              active={sortConfig.key === key}
              direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
              onClick={() => handleSort(key)}
              sx={{
                color: '#fff !important',
                '& .MuiTableSortLabel-icon': {
                  opacity: sortConfig.key === key ? 1 : 0,
                  color: '#fff !important'
                }
              }}
            >
              {fieldLabels[key]}
            </TableSortLabel>
          </TableCell>
        ))}

        <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}>
          <TableSortLabel
            active={sortConfig.key === 'status'}
            direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('status')}
            sx={{
              color: '#fff !important',
              '& .MuiTableSortLabel-icon': {
                opacity: sortConfig.key === 'status' ? 1 : 0,
                color: '#fff !important'
              }
            }}
          >
            Status
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filtered.length > 0 ? (
        filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, idx) => (
          <TableRow key={idx}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedItems.includes(idx)}
                onChange={() => handleCheckboxChange(idx)}
              />
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.displayName}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.module}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.visibility}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.mailMergeTemplate}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>{item.toBeUsedFor}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}>
              <Chip label={item.status} size="small" />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={8} align="center">
            <Typography variant="body2" sx={{ py: 2 }}>No records found.</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>


      <Box mt={2}>
        <Pagination count={Math.ceil(filtered.length / itemsPerPage)} page={page} onChange={setPage} />
      </Box>

      {/* CREATE / MODIFY DIALOG */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
  {isEditMode ? 'Edit Report' : 'Create Report'}
  <IconButton
    size="small"
    onClick={() => setShowForm(false)}
    sx={{ position: 'absolute', right: 8, top: 8 }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.keys(fieldLabels).map(field => (
            <TextField
              key={field}
              label={fieldLabels[field]}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              fullWidth
              size="small"
              InputProps={{ sx: { fontSize: '0.75rem' } }}
              InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
            />
          ))}
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            fullWidth
            size="small"
            InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            SelectProps={{
              MenuProps: {
                PaperProps: { sx: { fontSize: '0.75rem' } }
              }
            }}
            sx={{
              '& .MuiSelect-select': { fontSize: '0.75rem', padding: '4px 8px' },
              '& .MuiInputBase-root': { minHeight: '30px' }
            }}
          >
            <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
            <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
            <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            size="small"
            sx={{ fontSize: '0.75rem', bgcolor: '#122E3E' }}
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Delete
          <IconButton size="small" onClick={() => setDeleteConfirm(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete the selected report(s)?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleDelete}
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Report;
