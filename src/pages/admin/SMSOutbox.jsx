import React, { useState, useEffect } from 'react';

import {
  Box, Typography, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TableSortLabel from '@mui/material/TableSortLabel';
import * as XLSX from 'xlsx';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import TableViewIcon from '@mui/icons-material/TableView';
import smsOutbox from '../../mock/smsOutbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', minHeight: '28px', paddingTop: '4px', paddingBottom: '4px',
    '& .MuiOutlinedInput-input': { padding: '4px 8px' },
    '& .MuiSelect-select': {
      paddingTop: '4px !important', paddingBottom: '4px !important', minHeight: 'auto !important',
      lineHeight: '1.2 !important',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem', top: -8, left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0, transform: 'translate(14px, -7px) scale(0.75) !important', transformOrigin: 'top left',
    },
  },
  '& .MuiSelect-icon': { fontSize: '1.2rem', top: 'calc(50% - 0.6em)', right: '8px' },
};

const SMSOutbox = () => {
  const [data, setData] = useState(smsOutbox);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(['Outbox ID', 'Send Date', 'Message', 'Recipient', 'Status', 'Error Code', 'Parent Row ID', 'Par Entity', 'Client ID']);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [openResendDialog, setOpenResendDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedVisibleIndex, setSelectedVisibleIndex] = useState(null);
  const [selectedHiddenIndex, setSelectedHiddenIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [actionType, setActionType] = useState('');

  const [checkedIds, setCheckedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [formData, setFormData] = useState({
    outboxId: '', sendDate: '', message: '', recipient: '', status: '', errorCode: '', parentRowId: '', parEntity: '', clientId: ''
  });

  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = data.filter((row) =>
    (row.message.toLowerCase().includes(search.toLowerCase()) ||
      row.recipient.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === '' || row.status === filterStatus)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleDialogOpen = (type) => {
    if (type === 'edit') {
      const selected = data.find((d) => d.outboxId === checkedIds[0]);
      if (selected) setFormData(selected);
    } else {
      setFormData({
        outboxId: '', sendDate: '', message: '', recipient: '', status: '', errorCode: '', parentRowId: '', parEntity: '', clientId: ''
      });
    }
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData(prev => prev.map(d => d.outboxId === formData.outboxId ? { ...formData } : d));
    } else {
      const newId = data.length ? Math.max(...data.map(d => d.outboxId)) + 1 : 1;
      setData(prev => [...prev, { outboxId: newId, ...formData }]);
    }
    setDialogOpen(false);
    setCheckedIds([]);
  };

  const moveToVisible = () => {
    if (selectedHiddenIndex !== null) {
      const col = hiddenColumns[selectedHiddenIndex];
      setVisibleColumns([...visibleColumns, col]);
      setHiddenColumns(hiddenColumns.filter((_, i) => i !== selectedHiddenIndex));
      setSelectedHiddenIndex(null);
    }
  };

  const moveToHidden = () => {
    if (selectedVisibleIndex !== null) {
      const col = visibleColumns[selectedVisibleIndex];
      setHiddenColumns([...hiddenColumns, col]);
      setVisibleColumns(visibleColumns.filter((_, i) => i !== selectedVisibleIndex));
      setSelectedVisibleIndex(null);
    }
  };

  const handleReset = () => {
    setVisibleColumns(['Outbox ID', 'Send Date', 'Message', 'Recipient', 'Status', 'Error Code', 'Parent Row ID', 'Par Entity', 'Client ID']);
    setHiddenColumns([]);
  };

  const handleSaveColumns = () => {
    console.log('Visible Columns:', visibleColumns);
    setColumnDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="SMS Outbox" />
      <Typography variant="h6" sx={{ mb: 2 }}>SMS Outbox</Typography>
     <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 2 }}>
  {/* Select Action */}
  <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
  <InputLabel>Select Action</InputLabel>
  <Select 
    value=""
    label="Select Action"
    onChange={(e) => {
      const value = e.target.value;
      setActionType(value);
      if (value === 'resend') {
        const firstFailed = smsOutbox.find((sms) => sms.status === 'Failed');
        if (firstFailed) {
          setSelectedMessage(firstFailed);
          setOpenResendDialog(true);
          
        }
      }
    }}
     MenuProps={{
          PaperProps: {
            sx: { '& .MuiMenuItem-root': { fontSize: '0.75em' } }
          }
        }}
      >
  
    <MenuItem value=""><em>Select Action</em></MenuItem>
    <MenuItem value="resend">Resend SMS</MenuItem>
  </Select>
</FormControl>

       {/* Search Input */}
  <TextField
    variant="outlined"
    size="small"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{ minWidth: 160, ...smallerInputSx }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      )
    }}
  />

  {/* Status Filter */}
  <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
             <InputLabel>Select a Query</InputLabel>
             <Select
               value={filterType}
               label="Select a Query"
     
      onChange={(e) => setFilterStatus(e.target.value)}
       MenuProps={{
          PaperProps: {
            sx: { '& .MuiMenuItem-root': { fontSize: '0.75em' } }
          }
        }}
      >
    
      <MenuItem value=""><em>All</em></MenuItem>
      <MenuItem value="Delivered">Delivered</MenuItem>
      <MenuItem value="Failed">Failed</MenuItem>
      <MenuItem value="Pending">Pending</MenuItem>
    </Select>
  </FormControl>

  {/* Column Preferences Icon */}
  <IconButton
    size="small"
    title="Column Preferences"
    sx={{ color: 'grey' }}
    onClick={() => setColumnDialogOpen(true)}
  >
    <TableViewIcon fontSize="small" />
  </IconButton>

  {/* Export to Excel Icon */}
  <IconButton
    size="small"
    sx={{ color: 'green' }}
    title="Export to Excel"
    onClick={() => {
      const rows = data.map((row) => [
        row.outboxId || '',
        row.sendDate || '',
        row.message || '',
        row.recipient || '',
        row.status || '',
        row.errorCode || '',
        row.parentRowId || '',
        row.parEntity || '',
        row.clientId || '',
          row.created || '',
  row.createdBy || '',
  row.lastUpdatedBy || '',
  row.lastUpdated || ''
      ]);
      const sheet = XLSX.utils.aoa_to_sheet([
        ['Outbox ID', 'Send Date', 'Message', 'Recipient', 'Status', 'Error Code', 'Parent Row ID', 'Par Entity', 'Client ID', 'Created', 'Created By', 'Last Updated By', 'Last Updated'],
        ...rows
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'SMSOutbox');
      XLSX.writeFile(wb, 'SMSOutbox.xlsx');
    }}
  >
    <DescriptionIcon fontSize="medium" />
  </IconButton>
</Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={paginated.length > 0 && paginated.every(row => checkedIds.includes(row.outboxId))}
                  indeterminate={checkedIds.length > 0 && checkedIds.length < paginated.length}
                  onChange={(e) => {
                    const ids = paginated.map(row => row.outboxId);
                    setCheckedIds(e.target.checked ? [...new Set([...checkedIds, ...ids])] : checkedIds.filter(id => !ids.includes(id)));
                  }}
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              {[
                { key: 'outboxId', label: 'Outbox ID' },
                { key: 'sendDate', label: 'Send Date' },
                { key: 'message', label: 'Message' },
                { key: 'recipient', label: 'Recipient' },
                { key: 'status', label: 'Status' },
                { key: 'errorCode', label: 'Error Code' },
                { key: 'parentRowId', label: 'Parent Row ID' },
                { key: 'entity', label: 'Par Entity' },
                { key: 'clientId', label: 'Client ID' },
              ].map(({ key, label }) => (
                <TableCell
                  key={key}
                  sx={{ color: '#fff', fontSize: 13, '& .MuiTableSortLabel-root': { color: '#fff' }, '& .MuiTableSortLabel-root:hover': { color: '#fff' }, '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' }, '& .MuiTableSortLabel-icon': { color: '#fff !important' } }}
                >
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((row) => (
                <TableRow key={row.outboxId}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={checkedIds.includes(row.outboxId)}
                      onChange={() =>
                        setCheckedIds((prev) =>
                          prev.includes(row.outboxId)
                            ? prev.filter((id) => id !== row.outboxId)
                            : [...prev, row.outboxId]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.outboxId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.sendDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.message}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.recipient}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.errorCode}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.parentRowId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.entity}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.clientId}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">No Records Found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Pagination count={totalPages} page={page + 1} onChange={(p) => setPage(p - 1)} />
      </Box>

      <Dialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" fontSize="1rem">Column Preferences</Typography>
      <IconButton size="small" onClick={() => setColumnDialogOpen(false)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  </DialogTitle>

  <DialogContent>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Configure which columns to show/hide using the arrows. You can also reset column settings.
    </Typography>

    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Hidden Columns */}
      <Box flex={1}>
        <Typography variant="subtitle2" fontSize="0.875rem">Hidden Columns</Typography>
        <List sx={{ border: '1px solid #ccc', height: 180, overflow: 'auto' }}>
          {hiddenColumns.map((col, index) => (
            <ListItem
              key={index}
              button
              selected={index === selectedHiddenIndex}
              onClick={() => setSelectedHiddenIndex(index)}
            >
              <ListItemText primary={col} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Arrow Buttons */}
      <Box display="flex" flexDirection="column" justifyContent="center" gap={1}>
        <Button size="small" variant="outlined" onClick={moveToVisible}>{'>>'}</Button>
        <Button size="small" variant="outlined" onClick={moveToHidden}>{'<<'}</Button>
      </Box>

      {/* Visible Columns */}
      <Box flex={1}>
        <Typography variant="subtitle2" fontSize="0.875rem">Visible Columns</Typography>
        <List sx={{ border: '1px solid #ccc', height: 180, overflow: 'auto' }}>
          {visibleColumns.map((col, index) => (
            <ListItem
              key={index}
              button
              selected={index === selectedVisibleIndex}
              onClick={() => setSelectedVisibleIndex(index)}
            >
              <ListItemText primary={col} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  </DialogContent>

 <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
  <Button
    size="small"
    variant="outlined"
    disabled 
    sx={{
      bgcolor: '#122E3E',
      color: '#fff',
      textTransform: 'none',
      '&.Mui-disabled': { bgcolor: '#ccc', color: '#888' }
    }}
    onClick={handleReset}
  >
    Reset
  </Button>

  <Button
    size="small"
    variant="contained"
    disabled // disables the Save button
    sx={{
      bgcolor: '#122E3E',
      color: '#fff',
      textTransform: 'none',
      '&.Mui-disabled': { bgcolor: '#ccc', color: '#888' }
    }}
    onClick={handleSaveColumns}
  >
    Save
  </Button>
</DialogActions>

</Dialog>
    </Box>

    


    
  );
};

export default SMSOutbox;
