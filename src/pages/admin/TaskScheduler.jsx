import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Checkbox, TextField, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TableSortLabel, InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import * as XLSX from 'xlsx';

import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import taskScheduler from '../../mock/taskscheduler';

const columns = [
  { key: 'recurringSchedule', label: 'Recurring Schedule' },
  { key: 'active', label: 'Active' },
  { key: 'task', label: 'Task' },
  { key: 'scriptTagName', label: 'Script Tag Name' },
  { key: 'scheduleType', label: 'Schedule Type' },
  { key: 'fixedSchedule', label: 'Fixed Schedule' },
  { key: 'emailCampaign', label: 'Email Campaign' },
  { key: 'smsCampaign', label: 'Sms Campaign' }
];

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '36px',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px',
    fontSize: '0.75rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: '8px',
    '&.MuiInputLabel-shrink': {
      top: 0,
      transform: 'translate(14px, -9px) scale(0.75) !important',
    },
  },
};

const TaskScheduler = () => {
  const [data, setData] = useState(taskScheduler);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    recurringSchedule: '',
    active: '',
    task: '',
    scriptTagName: '',
    scheduleType: '',
    fixedSchedule: '',
    emailCampaign: '',
    smsCampaign: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [queryFilter, setQueryFilter] = useState('');

  const rowsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.task?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchQuery = queryFilter ? item.scheduleType === queryFilter : true;
    return matchSearch && matchQuery;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleDialogOpen = (type) => {
    setDialogType(type);
    if (type === 'edit') {
      const selected = data.find(d => d.id === checkedIds[0]);
      if (selected) setFormData(selected);
    } else {
      setFormData({
        recurringSchedule: '',
        active: '',
        task: '',
        scriptTagName: '',
        scheduleType: '',
        fixedSchedule: '',
        emailCampaign: '',
        smsCampaign: ''
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      recurringSchedule: '',
      active: '',
      task: '',
      scriptTagName: '',
      scheduleType: '',
      fixedSchedule: '',
      emailCampaign: '',
      smsCampaign: ''
    });
    setCheckedIds([]);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData(prev => prev.map(item => item.id === formData.id ? formData : item));
    } else {
      const newId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData(prev => [...prev, { id: newId, ...formData }]);
    }
    handleDialogClose();
  };

  const handleDelete = () => setConfirmDeleteOpen(true);
  const confirmDelete = () => {
    setData(prev => prev.filter(d => !checkedIds.includes(d.id)));
    setCheckedIds([]);
    setConfirmDeleteOpen(false);
  };

  const handleStatusChange = (newStatus) => {
    if (checkedIds.length > 0) {
      setData(prev =>
        prev.map(item =>
          checkedIds.includes(item.id) ? { ...item, active: newStatus } : item
        )
      );
      setCheckedIds([]);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="Task Scheduler" />
      <Typography variant="h6" sx={{ mb: 2 }}>Task Scheduler</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDialogOpen('edit')}
            disabled={checkedIds.length !== 1}
            sx={{
              bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', textTransform: 'none',
              '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
            }}
          >
            Modify
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDelete}
            disabled={checkedIds.length === 0}
            sx={{
              bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', textTransform: 'none',
              '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
            }}
          >
            Delete
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140, ...smallerInputSx }} disabled={checkedIds.length === 0}>
            <InputLabel>Action</InputLabel>
            <Select
              value=""
              onChange={(e) => handleStatusChange(e.target.value)}
              label="Action"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, ...smallerInputSx }}>
            <InputLabel>Schedule Type</InputLabel>
            <Select
              value={queryFilter}
              onChange={(e) => setQueryFilter(e.target.value)}
              label="Schedule Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Recurring">Recurring</MenuItem>
              <MenuItem value="Fixed">Fixed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="Search Tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 180, ...smallerInputSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <IconButton
            onClick={() => {
              const headers = columns.map(c => c.label);
              const rows = data.map(d => columns.map(col => d[col.key]));
              const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
              XLSX.writeFile(wb, 'task_scheduler.xlsx');
            }}
            sx={{ color: 'green' }}
            size="small"
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            onClick={() => handleDialogOpen('create')}
            sx={{ bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem', textTransform: 'none' }}
          >
            + Create
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: '#122E3E',
              '& .MuiTableRow-root:hover': {
                backgroundColor: '#122E3E !important'
              }
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  sx={{ color: '#fff' }}
                  checked={checkedIds.length === paginatedData.length && paginatedData.length > 0}
                  onChange={(e) =>
                    setCheckedIds(e.target.checked ? paginatedData.map(r => r.id) : [])
                  }
                />
              </TableCell>
              {columns.map(col => (
                <TableCell key={col.key} sx={{ color: '#fff', fontSize: 13 }}>
                  <TableSortLabel
                    active={sortConfig.key === col.key}
                    direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={checkedIds.includes(row.id)}
                    onChange={() => {
                      setCheckedIds(prev =>
                        prev.includes(row.id)
                          ? prev.filter(id => id !== row.id)
                          : [...prev, row.id]
                      );
                    }}
                  />
                </TableCell>
                {columns.map(col => (
                  <TableCell key={col.key} sx={{ fontSize: '0.75rem' }}>
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialogType === 'edit' ? 'Edit Task' : 'Create Task'}
          <IconButton onClick={handleDialogClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {columns.map(col => (
            <TextField
              key={col.key}
              label={col.label}
              value={formData[col.key]}
              onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
              fullWidth
              sx={{
                ...smallerInputSx,
                mt: col.key === 'recurringSchedule' ? 2 : 0
              }}
              InputLabelProps={{ shrink: true }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ fontSize: '0.75rem' }}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained" color="primary" sx={{ fontSize: '0.75rem' }}>
            {dialogType === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

     <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
  <DialogTitle sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: 600
  }}>
    Confirm Delete
    <IconButton onClick={() => setConfirmDeleteOpen(false)} size="small">
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
    Are you sure you want to delete selected task(s)?
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={confirmDelete}
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

export default TaskScheduler;
