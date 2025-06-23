import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Checkbox, Button,
  InputAdornment, Select, MenuItem, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TableSortLabel
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

import * as XLSX from 'xlsx';

import mockDocuments from '../../mock/DocumentCentre';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const DocumentCentre = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    assignedTo: [],
    teams: [],
  });

  const rowsPerPage = 25;
  const categories = [...new Set(documents.map(doc => doc.category))];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filtered = useMemo(() => {
    let result = documents.filter(doc => {
      const matchesSearch = Object.values(doc).some(val =>
        typeof val === 'string'
          ? val.toLowerCase().includes(search.toLowerCase())
          : Array.isArray(val) &&
            val.join(', ').toLowerCase().includes(search.toLowerCase())
      );
      const matchesCategory = category ? doc.category === category : true;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
        const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [documents, search, category, sortConfig]);

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginated.map(doc => doc.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const data = filtered.map(doc => ({
      Name: doc.name,
      Category: doc.category,
      Description: doc.description,
      'Assigned To': doc.assignedTo.join(', '),
      Teams: doc.teams.join(', ')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Documents');
    XLSX.writeFile(wb, 'DocumentCentre.xlsx');
  };

  const handleDialogSave = () => {
    if (dialogType === 'create') {
      const newId = documents.length > 0
        ? Math.max(...documents.map(d => d.id)) + 1
        : 1;
      setDocuments([...documents, { ...formData, id: newId }]);
    } else if (dialogType === 'modify') {
      setDocuments(docs =>
        docs.map(d =>
          d.id === formData.id ? { ...formData } : d
        )
      );
    }
    setOpenDialog(false);
    setFormData({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    setSelectedIds([]);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'teams', label: 'Teams' },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Document Centre
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', my: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
            disabled={selectedIds.length !== 1}
            onClick={() => {
              const selected = documents.find(doc => doc.id === selectedIds[0]);
              setFormData({ ...selected });
              setDialogType('modify');
              setOpenDialog(true);
            }}
          >
            Modify
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
            disabled={selectedIds.length === 0}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', fontSize: '0.75rem', textTransform: 'none' }}
            disabled
          >
            Batch Update
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 160, '& input': { fontSize: '0.75rem' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
            displayEmpty
            sx={{ width: 160, fontSize: '0.75rem' }}
            MenuProps={{ PaperProps: { sx: { fontSize: '0.75rem' } } }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: '0.75rem' }}>{cat}</MenuItem>
            ))}
          </Select>

          <Tooltip title="Export to Excel">
            <IconButton size="small" sx={{ color: 'green' }} onClick={handleExport}>
              <DescriptionIcon fontSize="medium" />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({ name: '', category: '', description: '', assignedTo: [], teams: [] });
              setDialogType('create');
              setOpenDialog(true);
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                  <Checkbox
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginated.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {columns.map(col => (
                  <TableCell key={col.key} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    <TableSortLabel
                      active={sortConfig.key === col.key}
                      direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': { opacity: 0, color: '#fff' },
                        '&:hover .MuiTableSortLabel-icon': { opacity: 1 }
                      }}
                    >
                      <b>{col.label}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(doc => (
                <TableRow key={doc.id} hover selected={selectedIds.includes(doc.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => handleSelectOne(doc.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.category}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.assignedTo.join(', ')}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.teams.join(', ')}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem' }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>
      </Paper>

      {/* Dialog and Delete Dialog remain unchanged */}
    </Box>
  );
};

export default DocumentCentre;
