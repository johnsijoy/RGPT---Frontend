import React, { useState } from 'react';
import {
  Box, Typography, Button, Checkbox, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';


const WebsiteAreasList = ({ onEdit, onCreate }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog

  const [data, setData] = useState([
    { id: 1, masterArea: 'Zone A', name: 'North Zone', city: 'Chennai', latitude: '13.0827', longitude: '80.2707' },
    { id: 2, masterArea: 'Zone B', name: 'South Zone', city: 'Bangalore', latitude: '12.9716', longitude: '77.5946' },
    { id: 3, masterArea: 'Zone C', name: 'East Zone', city: 'Kolkata', latitude: '22.5726', longitude: '88.3639' },
  ]);

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleModify = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = () => {
    setData((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
    setOpenDeleteDialog(false); // Close dialog
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Close dialog without deleting
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Website Areas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          onClick={handleModify}
          disabled={!selectedId}
          variant="outlined"
          size="small"
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Modify
        </Button>
        <Button
          onClick={handleDeleteClick} // Use the new handler to open dialog
          disabled={!selectedId}
          variant="outlined"
          size="small"
          color="error" // Added color for delete button
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Delete
        </Button>
        <Button
          onClick={onCreate}
          variant="contained"
          size="small"
          sx={{ bgcolor: '#134ca7', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Create
        </Button>
      </Box>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Updated background color */}
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Select</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Master Area</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>City</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Latitude</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Longitude</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedId === item.id}
                      onChange={() => handleCheckbox(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.masterArea}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.city}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.latitude}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.longitude}</TableCell>
                </TableRow>
              ))}
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

export default WebsiteAreasList;