import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

const WebsiteStatesList = () => {
  const [checkedStateId, setCheckedStateId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog

  const [data, setData] = useState([
    { id: 1, name: 'Tamil Nadu', country: 'India' },
    { id: 2, name: 'Karnataka', country: 'India' },
    { id: 3, name: 'Maharashtra', country: 'India' },
    { id: 4, name: 'Telangana', country: 'India' },
    { id: 5, name: 'Delhi', country: 'India' }
  ]);

  const handleCheckboxChange = (id) => {
    setCheckedStateId(checkedStateId === id ? null : id);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = () => {
    setData((prev) => prev.filter((item) => item.id !== checkedStateId));
    setCheckedStateId(null);
    setOpenDeleteDialog(false); // Close dialog
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Close dialog without deleting
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Website States
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: '#134ca7', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          + Create
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={!checkedStateId}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Modify
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={!checkedStateId}
          color="error"
          onClick={handleDeleteClick} // Use the new handler to open the dialog
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Box>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Updated background color */}
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>
                  <Checkbox size="small" sx={{ color: '#fff' }} /> {/* Checkbox color in header */}
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Website State Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={checkedStateId === state.id}
                        onChange={() => handleCheckboxChange(state.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{state.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{state.country}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ fontSize: '0.75rem' }}>No Records Found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record? This action cannot be undone.
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
};

export default WebsiteStatesList;