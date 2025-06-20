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
  DialogContentText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GroupWork as BatchUpdateIcon,
  Refresh as ResetIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Reusable SX for smaller inputs
const smallerInputSx = {
  // Target the root of the InputBase within FormControl/TextField
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', // Smaller font size for selected values / text field input
    minHeight: '28px', // Reduce overall height of the input field
    paddingTop: '4px', // Adjust vertical padding for selected text/chips
    paddingBottom: '4px', // Adjust vertical padding
    '& .MuiOutlinedInput-input': { // Specific for TextField's input
      padding: '4px 8px', // Adjust padding inside text field
    },
    // Adjust padding for Select component's input specifically
    '& .MuiSelect-select': {
      paddingTop: '4px !important',
      paddingBottom: '4px !important',
      minHeight: 'auto !important', // Allow height to adjust
      lineHeight: '1.2 !important', // Adjust line height for better spacing
    },
  },
  // Target the InputLabel specifically
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem', // Smaller font size for the label
    top: -8, // Adjusted: Nudge label up for smaller inputs
    left: '0px', // Ensure label starts at the left edge
    '&.MuiInputLabel-shrink': {
      top: 0, // Adjusted: Shrunk label top position
      transform: 'translate(14px, -7px) scale(0.75) !important', // Fine-tuned transform for shrunk label
      transformOrigin: 'top left', // Ensure it scales from top-left
    },
  },
  // Target the dropdown arrow icon (for Select components)
  '& .MuiSelect-icon': {
    fontSize: '1.2rem', // Adjust size of the icon if needed
    top: 'calc(50% - 0.6em)', // Nudge icon vertically to align
    right: '8px', // Adjust horizontal position if needed
  },
};

// Reusable MenuProps for smaller dropdown items
const smallerMenuProps = {
  sx: {
    '& .MuiMenuItem-root': {
      fontSize: '0.75rem', // Smaller font size for individual menu items
      minHeight: 'auto', // Allow menu items to shrink
      paddingTop: '6px', // Adjust padding for menu items
      paddingBottom: '6px', // Adjust padding for menu items
    },
    '& .MuiCheckbox-root': { // For checkbox within MenuItem (if used for multi-select)
        transform: 'scale(0.8)',
        padding: '4px',
    }
  },
};

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
  const [rowsPerPage, setRowsPerPage] = useState(25); // Default to 25
  const [dialogType, setDialogType] = useState(null); // 'create', 'modify', 'batch', 'delete'
  const [form, setForm] = useState({ name: '', category: '', description: '', assignedTo: [], teams: [] });

  // Dialogs for various confirmations/messages
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoDialogMessage, setInfoDialogMessage] = useState('');

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
    if (type === 'modify') {
      if (selectedIds.length !== 1) {
        setInfoDialogMessage('Please select exactly one document to modify.');
        setOpenInfoDialog(true);
        return;
      }
      const doc = documents.find((d) => d.id === selectedIds[0]);
      setForm({ ...doc });
    } else if (type === 'batch') {
      if (selectedIds.length === 0) {
        setInfoDialogMessage('Please select at least one document for batch update.');
        setOpenInfoDialog(true);
        return;
      }
      setForm({ teams: [] }); // Reset teams for batch update
    } else if (type === 'delete') {
        if (selectedIds.length === 0) {
            setInfoDialogMessage('Please select at least one document to delete.');
            setOpenInfoDialog(true);
            return;
        }
    } else if (type === 'create') {
      setForm({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    }
    setDialogType(type);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setForm({ name: '', category: '', description: '', assignedTo: [], teams: [] });
    setDialogType(null);
    setSelectedIds([]); // Clear selection on dialog close for most cases
  };

  // Create new document
  const handleCreate = () => {
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    setDocuments((docs) => [...docs, { ...form, id: newId }]);
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
    const updatedTeams = form.teams.filter(team => team); // Filter out empty strings from split
    setDocuments((docs) =>
      docs.map((d) =>
        selectedIds.includes(d.id)
          ? { ...d, teams: updatedTeams.length > 0 ? updatedTeams : d.teams } // Only update if new teams are provided
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <Box
      sx={{
        p: 3, // Reduced padding
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2, // Adjusted border radius
        boxShadow: 2,
        maxWidth: '100%',
        mx: 'auto',
        color: theme.palette.text.primary,
        fontSize: '0.875rem', // Adjusted base font size for consistency
        boxSizing: 'border-box',
      }}
    >
      {/* Page Title */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Document Centre
      </Typography>

      {/* Search & Filters */}
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2} flexWrap="wrap">
        <Paper
          component="form"
          sx={{
            p: '2px 4px', // Smaller padding
            display: 'flex',
            alignItems: 'center',
            width: 250, // Smaller width
            backgroundColor: theme.palette.background.default,
            borderRadius: 1, // Smaller border radius
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }} // Smaller font size
            placeholder="Search documents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            inputProps={{ 'aria-label': 'search documents' }}
          />
          <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 0.5, fontSize: '1.2rem' }} />
        </Paper>

        <FormControl size="small" sx={{ minWidth: 120, ...smallerInputSx }}> {/* Applied smallerInputSx */}
          <InputLabel id="query-select-label">Category Filter</InputLabel>
          <Select
            labelId="query-select-label"
            value={queryType}
            label="Category Filter"
            onChange={(e) => setQueryType(e.target.value)}
            MenuProps={smallerMenuProps} // Applied smallerMenuProps
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="report images">Report Images</MenuItem>
            <MenuItem value="logos">Logos</MenuItem>
            <MenuItem value="templates">Templates</MenuItem>
            <MenuItem value="documents">Documents</MenuItem>
            <MenuItem value="reports">Reports</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="legal">Legal</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="small"
          onClick={() => setPage(0)}
          sx={{ bgcolor: '#007bff', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveIcon sx={{ fontSize: '1rem' }} />} // Icon added
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ResetIcon sx={{ fontSize: '1rem' }} />} // Icon added
          onClick={() => { setSearchText(''); setQueryType(''); setPage(0); }}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Reset
        </Button>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => openDialog('create')}
          sx={{ bgcolor: '#134ca7', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => openDialog('modify')}
          disabled={selectedIds.length !== 1}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Modify
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<BatchUpdateIcon sx={{ fontSize: '1rem' }} />} // Changed icon
          onClick={() => openDialog('batch')}
          disabled={selectedIds.length === 0}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Batch Update
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => openDialog('delete')}
          disabled={selectedIds.length === 0}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Stack>

      {/* Documents Table */}
      <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden' }}> {/* Using Paper component */}
        <TableContainer sx={{ maxHeight: 440 }}> {/* Set max height for scrollable table body */}
          <Table stickyHeader size="small"> {/* stickyHeader for persistent header */}
            <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Consistent dark header */}
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 50, color: '#fff', fontWeight: 500, fontSize: 13 }}>
                  <Checkbox
                    indeterminate={selectedIds.length > 0 && selectedIds.length < pageDocs.length}
                    checked={pageDocs.length > 0 && selectedIds.length === pageDocs.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all documents on page' }}
                    sx={{ color: '#fff' }} // White checkbox in header
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 150, color: '#fff', fontWeight: 500, fontSize: 13 }}>Document Name</TableCell>
                <TableCell sx={{ minWidth: 120, color: '#fff', fontWeight: 500, fontSize: 13 }}>Category</TableCell>
                <TableCell sx={{ minWidth: 250, color: '#fff', fontWeight: 500, fontSize: 13 }}>Description</TableCell>
                <TableCell sx={{ minWidth: 150, color: '#fff', fontWeight: 500, fontSize: 13 }}>Assigned To</TableCell>
                <TableCell sx={{ minWidth: 150, color: '#fff', fontWeight: 500, fontSize: 13 }}>Teams</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageDocs.map((doc) => (
                <TableRow
                  key={doc.id}
                  hover
                  selected={selectedIds.includes(doc.id)}
                  onClick={() => handleRowSelect(doc.id)} // Click row to select
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => handleRowSelect(doc.id)} // Still allow direct checkbox click
                      inputProps={{ 'aria-labelledby': `doc-checkbox-${doc.id}` }}
                      size="small" // Smaller checkbox in body
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }} component="th" scope="row">{doc.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.category}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>{doc.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.assignedTo.join(', ')}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{doc.teams.join(', ')}</TableCell>
                </TableRow>
              ))}
              {pageDocs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, fontSize: '0.75rem' }}> {/* Adjusted colspan */}
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredDocs.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          rowsPerPageOptions={[5, 10, 25, 50]} // Added 50 as an option
          showFirstButton
          showLastButton
          sx={{ borderTop: '1px solid #eee', fontSize: '0.75rem' }}
        />
      </Paper>

      {/* Create / Modify Dialog */}
      {(dialogType === 'create' || dialogType === 'modify') && (
        <Dialog open onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{dialogType === 'create' ? 'Create Document' : 'Modify Document'}</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Document Name"
              fullWidth
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoFocus
              size="small"
              sx={smallerInputSx}
            />
            <TextField
              label="Category"
              fullWidth
              name="category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              size="small"
              sx={smallerInputSx}
            />
            <TextField
              label="Description"
              fullWidth
              name="description"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              size="small"
              sx={smallerInputSx}
            />
            {/* These fields might need a dedicated multi-select component in a real app */}
            <TextField
              label="Assigned To (comma separated)"
              fullWidth
              name="assignedTo"
              value={form.assignedTo.join(', ')}
              onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
              size="small"
              sx={smallerInputSx}
            />
            <TextField
              label="Teams (comma separated)"
              fullWidth
              name="teams"
              value={form.teams.join(', ')}
              onChange={(e) => setForm((f) => ({ ...f, teams: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
              size="small"
              sx={smallerInputSx}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none', bgcolor: '#007bff' }}
              disabled={!form.name || !form.category}
              onClick={dialogType === 'create' ? handleCreate : handleModify}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Batch Update Dialog */}
      {dialogType === 'batch' && (
        <Dialog open onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>Batch Update Selected Documents</DialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{mb: 2}}>
                Update teams for the {selectedIds.length} selected document(s).
                Enter new teams as a comma-separated list. Existing teams will be replaced.
            </DialogContentText>
            <TextField
              label="New Teams (comma separated)"
              fullWidth
              value={form.teams.join(', ')}
              onChange={(e) => setForm((f) => ({ ...f, teams: e.target.value.split(',').map(s => s.trim()) }))}
              helperText="e.g., Marketing, New Projects"
              size="small"
              sx={smallerInputSx}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleBatchUpdate} sx={{ textTransform: 'none', bgcolor: '#007bff' }}>
                Apply Update
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {dialogType === 'delete' && (
        <Dialog open onClose={closeDialog} maxWidth="xs">
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Are you sure you want to delete the {selectedIds.length} selected record(s)? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ textTransform: 'none' }}>
                Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Generic Info/Error Dialog */}
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        maxWidth="sm"
      >
        <DialogTitle>Information</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{infoDialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfoDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DocumentCentre;