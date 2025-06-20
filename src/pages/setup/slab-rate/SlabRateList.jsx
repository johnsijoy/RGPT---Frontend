import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog, // Import Dialog components
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography // Added Typography for potential heading
} from '@mui/material';

function SlabRateList({ data, onEdit, onCreate, onDelete }) { // Changed to a named function for default export
  const [selectedId, setSelectedId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleModify = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDeleteClick = () => {
    if (!selectedId) return; // Should already be disabled, but good to double-check
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedId); // Call the provided onDelete prop
    setSelectedId(null); // Clear selection after deletion
    setOpenDeleteDialog(false); // Close the dialog
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Close dialog without deleting
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Optional: Add a heading for the list if needed */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Slab Rate List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          onClick={handleModify}
          disabled={!selectedId}
          variant="outlined" // Consistent outlined variant
          size="small" // Consistent small size
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }} // Consistent styles
        >
          Modify
        </Button>
        <Button
          onClick={handleDeleteClick} // Use the new handler for dialog
          disabled={!selectedId}
          variant="outlined" // Consistent outlined variant
          size="small" // Consistent small size
          color="error" // Indicate a destructive action
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }} // Consistent styles
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={onCreate}
          color="primary" // Assuming primary maps to blue, or use bgcolor
          size="small" // Consistent small size
          sx={{ bgcolor: '#134ca7', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }} // Consistent styles
        >
          Create
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={1}> {/* Added elevation for subtle shadow */}
        <Table size="small"> {/* Using small size for compact table */}
          <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Consistent dark header background */}
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>
                Select {/* Changed to Select for clarity, checkbox is implied */}
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Type</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Slab Start</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Slab End</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Percent</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Amount</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>From</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>To</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Project</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Formula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small" // Make checkbox smaller
                      checked={selectedId === item.id}
                      onChange={() => handleCheckbox(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.slabStart}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.slabEnd}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.percent}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.amount}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.from}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.to}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.project}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.formula}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                  No Slab Rates Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this slab rate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="info" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SlabRateList; // Changed to default export