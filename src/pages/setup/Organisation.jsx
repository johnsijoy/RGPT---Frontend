import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Paper, TableSortLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Chip, MenuItem,
  IconButton, Select, InputLabel, FormControl, InputAdornment
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import * as XLSX from 'xlsx';
import mockOrganisationData from '../../mock/organisation';

const Organisation = () => {
  const [search, setSearch] = useState('');
  const [selectQuery, setSelectQuery] = useState('All');
  const [organisations, setOrganisations] = useState(mockOrganisationData);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active'
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
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

  const sorted = [...organisations].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(search.toLowerCase())
    ) && (selectQuery === 'All' || item.status === selectQuery)
  );

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      const updated = [...organisations];
      updated[editingIndex] = formData;
      setOrganisations(updated);
    } else {
      setOrganisations([...organisations, formData]);
    }
    setShowForm(false);
    setFormData({ name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active' });
    setIsEditMode(false);
    setEditingIndex(null);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(organisations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Organisations');
    XLSX.writeFile(workbook, 'organisations.xlsx');
  };

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const idx = selectedItems[0];
      setFormData(organisations[idx]);
      setIsEditMode(true);
      setEditingIndex(idx);
      setShowForm(true);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#122E3E', mb: 1 }}>
        Organisations
      </Typography>

      {/* Top control layout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', mb: 2 }}>
        {/* Left buttons - Modify & Batch */}
        {/* Left buttons - Modify & Batch */}
<Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
  <Button
    variant="outlined"
    size="small"
    disabled={selectedItems.length !== 1}
    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
    onClick={handleEdit}
  >
    Modify
  </Button>
  <Button
    variant="outlined"
    size="small"
    disabled
    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
  >
    Batch Update
  </Button>
</Box>

        {/* Right controls - Search, Filter, Export, Create */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Updated Search */}
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
              sx: {
                height: 36,
                borderRadius: '8px',
                fontSize: '0.8rem',
                backgroundColor: '#fff'
              }
            }}
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                height: 36,
                borderRadius: '8px',
                fontSize: '0.8rem'
              }
            }}
          />

          {/* Updated Select Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ fontSize: '0.8rem', top: '-4px' }}>Select a Query</InputLabel>
            <Select
              value={selectQuery}
              label="Select a Query"
              onChange={(e) => setSelectQuery(e.target.value)}
              sx={{
                height: 36,
                borderRadius: '8px',
                fontSize: '0.8rem',
                backgroundColor: '#fff'
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={handleExportToExcel} sx={{ color: 'green' }}>
            <DescriptionIcon />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setFormData({ name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active' });
            }}
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filtered.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(filtered.map((_, i) => (page - 1) * itemsPerPage + i));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
              </TableCell>
              {['name', 'type', 'industry', 'description', 'createdBy', 'status'].map(col => (
                <TableCell
                  key={col}
                  sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}
                >
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                    sx={{ color: '#fff !important', '& .MuiTableSortLabel-icon': { color: '#fff !important' } }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, idx) => {
              const globalIndex = (page - 1) * itemsPerPage + idx;
              const isSelected = selectedItems.includes(globalIndex);
              return (
                <TableRow
                  key={idx}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedItems(selectedItems.filter(i => i !== globalIndex));
                    } else {
                      setSelectedItems([...selectedItems, globalIndex]);
                    }
                    setSelectedIndex(globalIndex);
                  }}
                  sx={{
                    backgroundColor: isSelected ? '#d0ebff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.industry}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.createdBy}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        backgroundColor: item.status === 'Active' ? '#d4edda' : '#f8d7da',
                        color: item.status === 'Active' ? '#155724' : '#721c24',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            }) : (
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

      <Box mt={1.5}>
        <Pagination
          count={Math.ceil(filtered.length / itemsPerPage)}
          page={page}
          onChange={setPage}
          size="small"
        />
      </Box>

      {/* Dialog Form */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f5faff', fontWeight: 600 }}>{isEditMode ? 'Edit Organisation' : 'Create Organisation'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {['name', 'type', 'industry', 'description', 'createdBy'].map(field => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
              fullWidth
              size="small"
            />
          ))}
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            fullWidth
            size="small"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="small" variant="contained" sx={{ bgcolor: '#134ca7' }} onClick={handleAddOrUpdate}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Organisation;








