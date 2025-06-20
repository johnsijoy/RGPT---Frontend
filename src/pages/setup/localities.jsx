import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Checkbox, Button,
  InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Pagination from '../../components/common/Pagination';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  return (
    <Typography
      variant="body2"
      sx={{ fontSize: '0.75rem', mb: 2, cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      Home / <span style={{ color: '#000' }}>Localities</span>
    </Typography>
  );
};

const Localities = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', area: '' });
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const rowsPerPage = 25;

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase()) ||
      r.area.toLowerCase().includes(query.toLowerCase())
  );

  const paginatedData = filteredRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const allSelectedOnPage =
    paginatedData.length > 0 &&
    paginatedData.every((_, idx) => selectedRows.includes((page - 1) * rowsPerPage + idx));

  const handleCreateOrUpdate = () => {
    const updatedRecords = [...records];
    if (editIndex !== null) {
      updatedRecords[editIndex] = { ...formData };
    } else {
      updatedRecords.push({ ...formData });
    }
    setRecords(updatedRecords);
    setFormData({ name: '', description: '', area: '' });
    setOpen(false);
    setEditIndex(null);
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = (checked) => {
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;
    const currentPageIndexes = records.slice(start, end).map((_, idx) => start + idx);
    setSelectedRows(
      checked
        ? [...new Set([...selectedRows, ...currentPageIndexes])]
        : selectedRows.filter((i) => !currentPageIndexes.includes(i))
    );
  };

  const handleDelete = () => {
    const updatedRecords = records.filter((_, i) => !selectedRows.includes(i));
    setRecords(updatedRecords);
    setSelectedRows([]);
  };

  const handleModify = () => {
    if (selectedRows.length === 1) {
      const idx = selectedRows[0];
      setFormData(records[idx]);
      setEditIndex(idx);
      setOpen(true);
    }
  };

  const handleExport = () => {
    const data = records.map((row) => ({
      'Locality Name': row.name,
      'Description': row.description,
      'Area': row.area
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Localities');
    XLSX.writeFile(wb, 'Localities.xlsx');
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Left Controls */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleModify}
            disabled={selectedRows.length !== 1}
            sx={{ fontSize: '0.75rem' }}
          >
            Modify
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
            color="error"
            sx={{ fontSize: '0.75rem' }}
          >
            Delete
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{ fontSize: '0.75rem' }}
          >
            Audit Trail
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{ fontSize: '0.75rem' }}
          >
            Batch Update
          </Button>
        </Stack>

        {/* Right Controls */}
        <Stack direction="row" spacing={1}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 160, fontSize: '0.75rem' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <IconButton size="small" onClick={handleExport} sx={{ color: 'green' }} title="Export to Excel">
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#122E3E', textTransform: 'none', fontSize: '0.75rem' }}
            onClick={() => {
              setFormData({ name: '', description: '', area: '' });
              setEditIndex(null);
              setOpen(true);
            }}
          >
            Create
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#122E3E' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                  <Checkbox checked={allSelectedOnPage} onChange={(e) => handleSelectAll(e.target.checked)} />
                </TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Locality Name</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Locality Description</b></TableCell>
                <TableCell sx={{ color: '#fff', fontSize: '0.8rem' }}><b>Area</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => {
                  const absoluteIndex = (page - 1) * rowsPerPage + idx;
                  return (
                    <TableRow key={idx}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(absoluteIndex)}
                          onChange={() => handleSelectRow(absoluteIndex)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.description}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.area}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ fontSize: '0.75rem', py: 6 }}>
                    No records found. Create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filteredRecords.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            size="small"
          />
        </Box>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editIndex !== null ? 'Edit Locality' : 'Create Locality'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Locality Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Locality Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Localities;
