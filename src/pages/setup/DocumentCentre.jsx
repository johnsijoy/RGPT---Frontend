// src/pages/setup/DocumentCentre.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  Typography,
  Stack,
  TableContainer,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  List as ListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Dummy data
const initialDocs = [
  { id: 1, name: 'Report Logo', category: 'Report Images', description: 'Logo for final reports', assignedTo: ['Team Orbit'], teams: ['Public Team'] },
  { id: 2, name: 'Inner Logo', category: 'Logos', description: 'Logo used in document header', assignedTo: ['Team Alpha'], teams: ['Design'] },
  { id: 3, name: 'Invoice Template', category: 'Templates', description: 'PDF Invoice format', assignedTo: ['Finance'], teams: ['Billing'] },
  { id: 4, name: 'Proposal Draft', category: 'Documents', description: 'Draft format for client proposal', assignedTo: ['Sales'], teams: ['Proposal Team'] },
  { id: 5, name: 'Annual Report', category: 'Reports', description: 'Company annual summary', assignedTo: ['Executive'], teams: ['Board'] },
  { id: 6, name: 'Onboarding Guide', category: 'HR', description: 'For new hires', assignedTo: ['HR'], teams: ['Training'] },
  { id: 7, name: 'Legal Agreement', category: 'Legal', description: 'Standard NDA', assignedTo: ['Legal'], teams: ['Compliance'] },
];

function DocumentCentre() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [queryType, setQueryType] = useState('');
  const [documents, setDocuments] = useState(initialDocs);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [dialogType, setDialogType] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', description: '', assignedTo: [], teams: [] });

  // Filter documents by search and query type
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = Object.values(doc).some((val) =>
      typeof val === 'string'
        ? val.toLowerCase().includes(searchText.toLowerCase())
        : Array.isArray(val) && val.join(',').toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesQuery = queryType ? doc.category.toLowerCase().includes(queryType.toLowerCase()) : true;
    return matchesSearch && matchesQuery;
  });

  const pageDocs = filteredDocs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Select all on current page
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(pageDocs.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Select individual row
  const handleRowSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Open dialogs: create, modify, batch update, delete
  const openDialog = (type) => {
    if (type === 'modify' && selectedIds.length === 1) {
      const doc = documents.find((d) => d.id === selectedIds[0]);
      setForm({ ...doc });
    } else if (type === 'batch') {
      setForm({ teams: [] });
    } else if (type === 'create') {
      setForm({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    }
    setDialogType(type);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setForm({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    setDialogType(null);
  };

  // Create new document
  const handleCreate = () => {
    setDocuments((docs) => [...docs, { ...form, id: Date.now() }]);
    closeDialog();
  };

  // Modify selected document
  const handleModify = () => {
    setDocuments((docs) =>
      docs.map((d) => (d.id === selectedIds[0] ? { ...d, ...form } : d))
    );
    closeDialog();
  };

  // Batch update teams on selected documents
  const handleBatchUpdate = () => {
    setDocuments((docs) =>
      docs.map((d) =>
        selectedIds.includes(d.id)
          ? { ...d, teams: form.teams.length ? form.teams : d.teams }
          : d
      )
    );
    closeDialog();
  };

  // Delete selected documents
  const handleDelete = () => {
    setDocuments((docs) => docs.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    closeDialog();
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: 2,
        maxWidth: '100%',
        mx: 'auto',
        color: theme.palette.text.primary,
        fontSize: '0.95rem',
        boxSizing: 'border-box', // ensure padding included
      }}
    >
      {/* Search & Filters */}
      <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
        <Paper
          component="form"
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: 360,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            inputProps={{ 'aria-label': 'search documents' }}
          />
          <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
        </Paper>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="query-select-label">Select A Query</InputLabel>
          <Select
            labelId="query-select-label"
            value={queryType}
            label="Select A Query"
            onChange={(e) => setQueryType(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="report">Report</MenuItem>
            <MenuItem value="logo">Logo</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" size="small" onClick={() => setPage(0)}>Search</Button>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>Save</Button>
        <Button variant="outlined" size="small" onClick={() => { setSearchText(''); setQueryType(''); setPage(0); }}>Reset</Button>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        <Button size="small" startIcon={<AddIcon />} onClick={() => openDialog('create')}>
          Create
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => openDialog('modify')} disabled={selectedIds.length !== 1}>
          Modify
        </Button>
        <Button size="small" startIcon={<ListIcon />} onClick={() => openDialog('batch')} disabled={selectedIds.length === 0}>
          Batch Update
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => openDialog('delete')} disabled={selectedIds.length === 0}>
          Delete
        </Button>
      </Stack>

      {/* Documents Table */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          boxSizing: 'border-box',
          overflowX: 'auto', // added here for overflow horizontally
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2, px: 1 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '0.05em' }}>
            Documents
          </Typography>
        </Box>

        <TableContainer sx={{ width: '100%' }}>
          <Table
            size="small"
            sx={{
              minWidth: 850,
              '& .MuiTableCell-root': {
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                padding: '8px 12px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
              },
              '& .MuiTableHead-root': {
                backgroundColor: theme.palette.grey[100],
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                  <Checkbox
                    indeterminate={selectedIds.length > 0 && selectedIds.length < pageDocs.length}
                    checked={pageDocs.length > 0 && selectedIds.length === pageDocs.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all documents on page' }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>Document Name</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Document</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Category</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Description</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Assigned To</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Teams</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageDocs.map((doc) => (
                <TableRow
                  key={doc.id}
                  hover
                  selected={selectedIds.includes(doc.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => handleRowSelect(doc.id)}
                      inputProps={{ 'aria-labelledby': `doc-checkbox-${doc.id}` }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">{doc.name}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell sx={{ whiteSpace: 'normal' }}>{doc.description}</TableCell>
                  <TableCell>{doc.assignedTo.join(', ')}</TableCell>
                  <TableCell>{doc.teams.join(', ')}</TableCell>
                </TableRow>
              ))}
              {pageDocs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <TablePagination
            component="div"
            count={filteredDocs.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}
          />
        </Box>
      </Box>

      {/* Create / Modify Dialog */}
      {(dialogType === 'create' || dialogType === 'modify') && (
        <Dialog open onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{dialogType === 'create' ? 'Create Document' : 'Modify Document'}</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Document Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoFocus
              size="small"
            />
            <TextField
              label="Category"
              fullWidth
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              size="small"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              size="small"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" disabled={!form.name || !form.category} onClick={dialogType === 'create' ? handleCreate : handleModify}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Batch Update Dialog */}
      {dialogType === 'batch' && (
        <Dialog open onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>Batch Update</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="New Teams (comma separated)"
              fullWidth
              value={form.teams.join(', ')}
              onChange={(e) => setForm((f) => ({ ...f, teams: e.target.value.split(',').map(s => s.trim()) }))}
              helperText="Apply to selected documents"
              size="small"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleBatchUpdate}>Submit</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {dialogType === 'delete' && (
        <Dialog open onClose={closeDialog} maxWidth="xs">
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent dividers>
            <Typography>Are you sure you want to delete the selected record(s)?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Confirm</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default DocumentCentre;