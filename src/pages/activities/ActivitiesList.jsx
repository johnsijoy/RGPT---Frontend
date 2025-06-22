import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description'; // Excel-like icon
import CreateActivityForm from './ActivityForm';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import { mockActivities } from '../../mock/activities';
import * as XLSX from 'xlsx';


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

const ActivitiesList = () => {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState(mockActivities);
  const [formData, setFormData] = useState({
    activity: '',
    activityType: '',
    start: '',
    end: '',
    lead: '',
    client: '',
    description: '',
    assignedTo: '',
    remind: false,
    remindBefore: 15
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'start', direction: 'asc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleSubmit = () => {
    const newActivity = {
      id: activities.length + 1,
      ...formData,
      status: 'Scheduled'
    };
    setActivities([...activities, newActivity]);
    setOpen(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredActivities = sortedActivities.filter((act) => {
    const matchesSearch = Object.values(act).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'All' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
      <Breadcrumbs />

      {/* Top controls */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Activities
        </Typography>




        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 160, // Adjusted minWidth for this specific filter
            ...smallerInputSx
          }}
        />

        <FormControl size="xsmall" sx={{
            minWidth: 160, // Adjusted minWidth for this specific filter
            ...smallerInputSx
          }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            MenuProps={smallerMenuProps} // Apply smaller styles to dropdown items
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {/* Green Excel download icon */}
        <IconButton
          size="small"
          sx={{ color: 'green' }}
          title="Export to Excel"
          onClick={() => {
            const worksheetData = activities.map(({ id, ...rest }) => rest); // optional: omit `id`
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');
            XLSX.writeFile(workbook, 'activities.xlsx');
          }}
        >
          <DescriptionIcon fontSize="medium" />
        </IconButton>

        <Button
          variant="contained"
          size="small"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: '#122E3E',
            textTransform: 'none',
            fontSize: '0.75rem',
            padding: '4px 10px',
            minWidth: 'fit-content'
          }}
        >
          Create
        </Button>
      </Box>

      {/* Table */}
      {filteredActivities.length > 0 ? (
        <>
          <TableContainer component={Paper} elevation={1}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#122E3E' }}>
                  {['activity', 'activityType', 'start', 'end', 'client', 'assignedTo', 'status'].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: '#fff',
                        fontSize: '0.8rem',
                        '& .MuiTableSortLabel-root': { color: '#fff' },
                        '& .MuiTableSortLabel-root:hover': { color: '#fff' },
                        '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                        '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === col}
                        direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort(col)}
                      >
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedActivities.map((act) => (
                  <TableRow key={act.id}>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.activity}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.activityType}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.start}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.end}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.client}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.assignedTo}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{act.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={1.5} display="flex" justifyContent="flex-end">
            <Pagination
              count={Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage))}
              page={page}
              onChange={setPage}
              size="small"
            />
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body2" align="center" mt={5}>
            No activities found.
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination count={1} page={1} onChange={() => {}} size="small" />
          </Box>
        </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Activity</DialogTitle>
        <DialogContent>
          <CreateActivityForm formData={formData} setFormData={setFormData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivitiesList;