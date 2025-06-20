import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination, // For Material-UI pagination
  TableSortLabel, // For Material-UI sorting
  InputAdornment, // For search icon
  IconButton, // For search icon button
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions // For dialogs
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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

const initialMockData = [
    { id: 1, number: '918012345678', provider: 'Telco A', status: 'Active' },
    { id: 2, number: '919023456789', provider: 'Telco B', status: 'Inactive' },
    { id: 3, number: '918034567890', provider: 'Telco A', status: 'Active' },
    { id: 4, number: '917045678901', provider: 'Telco C', status: 'Pending' },
    { id: 5, number: '916056789012', provider: 'Telco B', status: 'Active' },
    { id: 6, number: '918067890123', provider: 'Telco A', status: 'Active' },
    { id: 7, number: '919978901234', provider: 'Telco C', status: 'Inactive' },
    { id: 8, number: '918089012345', provider: 'Telco B', status: 'Active' },
    { id: 9, number: '917090123456', provider: 'Telco A', status: 'Pending' },
    { id: 10, number: '916001234567', provider: 'Telco B', status: 'Active' },
    { id: 11, number: '912312345678', provider: 'Telco A', status: 'Active' },
    { id: 12, number: '919923456789', provider: 'Telco B', status: 'Inactive' },
];


const VirtualNumber = () => {
  const [dataList, setDataList] = useState(initialMockData);
  const [formData, setFormData] = useState({ number: '', provider: '', status: '' });
  const [editId, setEditId] = useState(null); // Changed to editId for better tracking
  const [selectedIds, setSelectedIds] = useState([]);
  const [queryFilter, setQueryFilter] = useState(''); // For the "Select a Query" dropdown
  const [searchTerm, setSearchTerm] = useState(''); // For the free-text search field
  const [sortConfig, setSortConfig] = useState({ key: 'number', direction: 'asc' });
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBatchUpdateDialog, setOpenBatchUpdateDialog] = useState(false);
  const [openNoSelectionDialog, setOpenNoSelectionDialog] = useState(false);


  // Form handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number) return; // Basic validation

    if (editId !== null) {
      setDataList(dataList.map(item => item.id === editId ? { ...formData, id: editId } : item));
      setEditId(null);
    } else {
      const newId = Math.max(...dataList.map(item => item.id), 0) + 1; // Generate new ID
      setDataList([...dataList, { ...formData, id: newId }]);
    }
    setFormData({ number: '', provider: '', status: '' });
  };

  const handleEditClick = () => {
    if (selectedIds.length === 0) {
      setOpenNoSelectionDialog(true);
      return;
    }
    if (selectedIds.length > 1) {
      setOpenModifyDialog(true); // Inform user only one row can be modified
      return;
    }
    const itemToEdit = dataList.find(item => item.id === selectedIds[0]);
    if (itemToEdit) {
      setEditId(itemToEdit.id);
      setFormData(itemToEdit);
    }
  };

  const handleDeleteClick = () => {
    if (selectedIds.length === 0) {
      setOpenNoSelectionDialog(true);
      return;
    }
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setDataList(dataList.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setOpenDeleteDialog(false);
  };

  const handleBatchUpdateClick = () => {
    if (selectedIds.length === 0) {
      setOpenNoSelectionDialog(true);
      return;
    }
    setOpenBatchUpdateDialog(true); // Open batch update dialog
    // In a real app, this dialog would have fields to update common properties
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredSortedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Memoized filtered and sorted data
  const filteredSortedData = useMemo(() => {
    let currentData = [...dataList];

    // Apply query filter (dropdown)
    if (queryFilter) {
      currentData = currentData.filter(item => item.number.startsWith(queryFilter));
    }

    // Apply search term filter (text field)
    if (searchTerm) {
      currentData = currentData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      currentData.sort((a, b) => {
        const aValue = String(a[sortConfig.key]).toLowerCase();
        const bValue = String(b[sortConfig.key]).toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return currentData;
  }, [dataList, queryFilter, searchTerm, sortConfig]);


  const paginatedData = filteredSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 3, width: '100%', fontFamily: 'Arial' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Virtual Numbers
      </Typography>

      {/* Top Controls (Search, Filter, Actions) */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2,
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'flex-start',
        '& > *': {
          flexGrow: 1,
          minWidth: '100px',
          maxWidth: '250px', // Adjusted max width for fields
        }
      }}>
        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: '180px', ...smallerInputSx }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ padding: '4px' }}>
                  <SearchIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Query Filter */}
        <FormControl size="small" sx={{ minWidth: 180, ...smallerInputSx }}>
          <InputLabel id="query-filter-label">Select a Query</InputLabel>
          <Select
            labelId="query-filter-label"
            value={queryFilter}
            onChange={(e) => setQueryFilter(e.target.value)}
            label="Select a Query"
            MenuProps={smallerMenuProps}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="9180">Numbers starting with 9180</MenuItem>
            <MenuItem value="9190">Numbers starting with 9190</MenuItem>
            <MenuItem value="9123">Numbers starting with 9123</MenuItem>
            <MenuItem value="9199">Numbers starting with 9199</MenuItem>
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          flexBasis: 'content',
          flexShrink: 0,
          flexGrow: 1,
          minWidth: 'fit-content', // Allow buttons to shrink on small screens
          mt: { xs: 1, sm: 0 },
          mb: { xs: 1, sm: 0 },
        }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#134ca7',
              color: 'white',
              fontSize: '0.75rem',
              padding: '4px 10px',
              textTransform: 'none',
              minWidth: 'fit-content',
            }}
            onClick={() => { setEditId(null); setFormData({ number: '', provider: '', status: '' }); }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleEditClick}
            disabled={selectedIds.length === 0}
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Modify
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClick}
            disabled={selectedIds.length === 0}
            color="error"
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleBatchUpdateClick}
            disabled={selectedIds.length === 0}
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Batch Update
          </Button>
        </Box>
      </Box>

      {/* Form Section */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <TextField
          size="small"
          label="Virtual Number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          sx={{ ...smallerInputSx, flexGrow: 1, maxWidth: '200px' }}
        />
        <TextField
          size="small"
          label="Provider"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          sx={{ ...smallerInputSx, flexGrow: 1, maxWidth: '150px' }}
        />
        <FormControl size="small" sx={{ ...smallerInputSx, flexGrow: 1, maxWidth: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
            MenuProps={smallerMenuProps}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" size="small"
          sx={{
            bgcolor: '#007bff', // Match previous blue button style
            color: 'white',
            border: 'none',
            fontSize: '0.75rem',
            padding: '4px 10px',
            textTransform: 'none'
          }}
        >
          {editId !== null ? 'Update' : 'Add'}
        </Button>
      </Box>

      {/* Table */}
      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  sx={{ color: '#fff' }}
                  checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {/* Columns headers with sorting */}
              {['number', 'provider', 'status'].map((headCell) => (
                <TableCell
                  key={headCell}
                  sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}
                  sortDirection={sortConfig.key === headCell ? sortConfig.direction : false}
                >
                  <TableSortLabel
                    active={sortConfig.key === headCell}
                    direction={sortConfig.key === headCell ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(headCell)}
                    sx={{
                      color: '#fff !important',
                      '&:hover': { color: '#fff !important' },
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                    }}
                  >
                    {headCell.charAt(0).toUpperCase() + headCell.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.number}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.provider}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Added more rows per page options
          component="div"
          count={filteredSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{ borderTop: '1px solid #eee' }}
        />
      </Paper>

      {/* --- Dialogs --- */}

      {/* No Selection Dialog */}
      <Dialog
        open={openNoSelectionDialog}
        onClose={() => setOpenNoSelectionDialog(false)}
      >
        <DialogTitle>{"No Selection Made"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select at least one row to perform this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoSelectionDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modify Multiple Selection Dialog */}
      <Dialog
        open={openModifyDialog}
        onClose={() => setOpenModifyDialog(false)}
      >
        <DialogTitle>{"Modify Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select only one row to modify.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModifyDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected virtual number(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="info" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Update Dialog (Placeholder) */}
      <Dialog
        open={openBatchUpdateDialog}
        onClose={() => setOpenBatchUpdateDialog(false)}
      >
        <DialogTitle>{"Batch Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected {selectedIds.length} item(s) for batch update.
            (This is a placeholder for batch update functionality.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBatchUpdateDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VirtualNumber;