import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  InputAdornment,
  IconButton,
  Typography,
  Checkbox,
  FormControl,
  InputLabel, // Added InputLabel for consistency with Select
  Button, // Added Button for action buttons
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions // For alert and delete dialogs
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

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

const WebsiteCitiesList = () => {
  const [search, setSearch] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(0);
  const [checkedCityId, setCheckedCityId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [openAlertDialog, setOpenAlertDialog] = useState(false); // State for "Please select a city" dialog
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const mockData = [
    { id: 1, name: 'Chennai', masterCity: 'Chennai Central', state: 'Tamil Nadu', country: 'India' },
    { id: 2, name: 'Bangalore', masterCity: 'Bangalore Metro', state: 'Karnataka', country: 'India' },
    { id: 3, name: 'Mumbai', masterCity: 'Greater Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 4, name: 'Coimbatore', masterCity: 'Coimbatore Central', state: 'Tamil Nadu', country: 'India' },
    { id: 5, name: 'Hyderabad', masterCity: 'Hyderabad Metro', state: 'Telangana', country: 'India' },
    { id: 6, name: 'Madurai', masterCity: 'Madurai City', state: 'Tamil Nadu', country: 'India' },
    { id: 7, name: 'Delhi', masterCity: 'New Delhi', state: 'Delhi', country: 'India' },
  ];

  const filteredCities = mockData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterQuery === '' || // No filter applied or specific filter logic
     (filterQuery === 'Metro' && c.masterCity.includes('Metro')) ||
     (filterQuery === 'South' && ['Tamil Nadu', 'Karnataka', 'Telangana'].includes(c.state)))
  );

  const paginatedCities = filteredCities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCreateClick = () => {
    localStorage.removeItem('cityToEdit');
    navigate('/setup/website-cities/new');
  };

  const handleModifyClick = () => {
    const city = mockData.find((city) => city.id === checkedCityId);
    if (city) {
      localStorage.setItem('cityToEdit', JSON.stringify(city));
      navigate('/setup/website-cities/new');
    } else {
      setOpenAlertDialog(true); // Open Material-UI alert dialog
    }
  };

  const handleDeleteClick = () => {
    if (checkedCityId) {
      setOpenDeleteDialog(true); // Open delete confirmation dialog
    } else {
      setOpenAlertDialog(true); // Open Material-UI alert dialog if no city selected
    }
  };

  const handleDeleteConfirm = () => {
    // In a real application, you would perform the deletion here
    // For this mock, we'll simulate by filtering the data (if it were in state)
    // For now, since mockData is constant, this is just a placeholder action.
    console.log(`Deleting city with ID: ${checkedCityId}`);
    setCheckedCityId(null); // Clear selection after hypothetical delete
    setOpenDeleteDialog(false);
  };

  const handleCheckboxChange = (cityId) => {
    setCheckedCityId(cityId === checkedCityId ? null : cityId);
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Filter Row */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2, // Adjusted margin-bottom to make space for heading below
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'flex-start',
        '& > *': {
          flexGrow: 1,
          minWidth: '100px',
          maxWidth: '250px', // Allow search field to be a bit wider
        }
      }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            backgroundColor: 'white',
            minWidth: '180px', // Ensure search field has a good min-width
            ...smallerInputSx
          }}
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

        <FormControl size="small" sx={{ minWidth: 180, ...smallerInputSx }}>
          <InputLabel id="filter-query-label">Select a Query</InputLabel>
          <Select
            labelId="filter-query-label"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            label="Select a Query"
            MenuProps={smallerMenuProps}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Metro">Metro Cities</MenuItem>
            <MenuItem value="South">South India</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#134ca7',
            color: 'white',
            fontSize: '0.75rem',
            padding: '4px 10px',
            textTransform: 'none', // Normal case
            minWidth: 'fit-content',
            ml: 0, // Remove ml: auto from here, it's a search button now
          }}
        >
          Search
        </Button>
      </Box>

      {/* Heading */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>
        Website Cities
      </Typography>

      {/* Actions Row */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleCreateClick}
          sx={{ bgcolor: '#134ca7', fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          + Create
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleModifyClick}
          disabled={!checkedCityId}
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Modify
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleDeleteClick}
          disabled={!checkedCityId}
          color="error" // Indicate a destructive action
          sx={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Paper variant="outlined" sx={{ width: '100%' }}> {/* Removed minWidth: '1000px' - let the table handle its width naturally or set on table if specific width needed */}
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Consistent header background */}
              <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox size="small" sx={{ color: '#fff' }} /> {/* Header checkbox color */}
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Website City Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Master City</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>State</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCities.length > 0 ? (
                paginatedCities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small" // Make checkbox smaller
                        checked={checkedCityId === city.id}
                        onChange={() => handleCheckboxChange(city.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.masterCity}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.state}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{city.country}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2, fontSize: '0.75rem' }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCities.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            sx={{ borderTop: '1px solid #eee' }} // Consistent border
          />
        </Paper>
      </Box>

      {/* Alert Dialog (e.g., for "Please select a city to modify") */}
      <Dialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Selection Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select a city from the list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlertDialog(false)} autoFocus sx={{ textTransform: 'none' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the selected city? This action cannot be undone.
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
    </Box>
  );
};

export default WebsiteCitiesList;