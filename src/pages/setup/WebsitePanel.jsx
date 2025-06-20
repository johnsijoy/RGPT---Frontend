import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Select, MenuItem, FormControl, InputLabel,
  TableContainer
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

const initialPanels = [
  { id: 1, panelName: "Home Banner", panelType: "Home", section: "Top", description: "Main page banner", developer: "Team A", status: "Active" },
  { id: 2, panelName: "Footer Links", panelType: "Footer", section: "Bottom", description: "Contact links", developer: "Team B", status: "Inactive" },
  { id: 3, panelName: "Sidebar Menu", panelType: "Navigation", section: "Left", description: "Side navigation menu", developer: "Team C", status: "Active" },
  { id: 4, panelName: "Product Carousel", panelType: "Product", section: "Middle", description: "Rotating product display", developer: "Team A", status: "Active" },
  { id: 5, panelName: "About Us Section", panelType: "Content", section: "Main", description: "Company information", developer: "Team B", status: "Active" },
];

function WebsitePanel() { // Changed to a named function for default export
  const [search, setSearch] = useState("");
  const [panels, setPanels] = useState(initialPanels);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active"
  });

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBatchUpdateDialog, setOpenBatchUpdateDialog] = useState(false);
  const [openNoSelectionDialog, setOpenNoSelectionDialog] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      setPanels(panels.map(panel => panel.id === editingId ? { ...formData, id: editingId } : panel));
    } else {
      const newId = panels.length > 0 ? Math.max(...panels.map(p => p.id)) + 1 : 1;
      setPanels([...panels, { ...formData, id: newId }]);
    }

    setShowForm(false);
    setIsEditMode(false);
    setFormData({ panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active" });
    setEditingId(null);
    setSelectedId(null); // Clear selection after add/update
  };

  const handleEditClick = () => {
    if (selectedId === null) {
      setOpenNoSelectionDialog(true);
      return;
    }
    const panelToEdit = panels.find(panel => panel.id === selectedId);
    if (panelToEdit) {
      setFormData(panelToEdit);
      setIsEditMode(true);
      setEditingId(selectedId);
      setShowForm(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedId === null) {
      setOpenNoSelectionDialog(true);
      return;
    }
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setPanels(panels.filter(panel => panel.id !== selectedId));
    setSelectedId(null);
    setOpenDeleteDialog(false);
  };

  const handleBatchUpdateClick = () => {
    if (selectedId === null) {
      setOpenNoSelectionDialog(true);
      return;
    }
    setOpenBatchUpdateDialog(true);
    // In a real app, this dialog would allow updating properties of selected panel
  };

  const filteredPanels = panels.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Website Panels
      </Typography>

      {/* Search and Action Buttons */}
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
          maxWidth: '250px',
        }
      }}>
        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search by any field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          flexBasis: 'content',
          flexShrink: 0,
          flexGrow: 1,
          minWidth: 'fit-content',
          mt: { xs: 1, sm: 0 },
          mb: { xs: 1, sm: 0 },
        }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#134ca7', color: 'white', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setFormData({ panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active" });
            }}
          >
            + Create
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleEditClick}
            disabled={selectedId === null}
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Modify
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleBatchUpdateClick}
            disabled={selectedId === null}
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Batch Update
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClick}
            disabled={selectedId === null}
            color="error"
            sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Create/Edit Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '6px', bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#134ca7', mb: 1.5, fontSize: '1rem' }}>
            {isEditMode ? "Edit Panel" : "Add New Panel"}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
            {["panelName", "panelType", "section", "description", "developer"].map(field => (
              <TextField
                key={field}
                size="small"
                label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                name={field}
                value={formData[field]}
                onChange={handleFormChange}
                sx={{ flexBasis: 'calc(33.33% - 10px)', ...smallerInputSx }}
                multiline={field === "description"}
                rows={field === "description" ? 2 : 1}
              />
            ))}
            <FormControl size="small" sx={{ flexBasis: 'calc(33.33% - 10px)', ...smallerInputSx }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                MenuProps={smallerMenuProps}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddOrUpdate}
            sx={{ bgcolor: '#007bff', color: 'white', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowForm(false)}
            sx={{ marginLeft: '8px', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
          >
            Cancel
          </Button>
        </Paper>
      )}

      {/* Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Select</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Panel Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Panel Type</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Section</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Description</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Developer</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPanels.length > 0 ? (
              filteredPanels.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  sx={{
                    backgroundColor: selectedId === item.id ? "#e3f2fd" : "inherit",
                    cursor: "pointer",
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedId === item.id}
                      onChange={() => setSelectedId(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.panelType}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.section}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.developer}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Dialogs --- */}

      {/* No Selection Dialog */}
      <Dialog
        open={openNoSelectionDialog}
        onClose={() => setOpenNoSelectionDialog(false)}
      >
        <DialogTitle>{"Selection Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a row to perform this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoSelectionDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
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
            Are you sure you want to delete this panel? This action cannot be undone.
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
            You have selected a panel for batch update.
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
}

export default WebsitePanel; // Changed to default export