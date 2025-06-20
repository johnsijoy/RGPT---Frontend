import React, { useState } from 'react';
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
  FormControl
} from '@mui/material';

import CreateActivityForm from './ActivityForm';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import { mockActivities } from '../../mock/activities';

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
  const itemsPerPage = 1;

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

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
      <Breadcrumbs />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Activities</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Activity
        </Button>
      </Box>

      {filteredActivities.length > 0 ? (
  <>
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
            {['activity', 'activityType', 'start', 'end', 'client', 'assignedTo', 'status'].map((col) => (
              <TableCell key={col}>
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
              <TableCell>{act.activity}</TableCell>
              <TableCell>{act.activityType}</TableCell>
              <TableCell>{act.start}</TableCell>
              <TableCell>{act.end}</TableCell>
              <TableCell>{act.client}</TableCell>
              <TableCell>{act.assignedTo}</TableCell>
              <TableCell>{act.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Box mt={2} display="flex" justifyContent="center">
      <Pagination
        count={Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage))}
        page={page}
        onChange={setPage}
      />
    </Box>
  </>
) : (
  <>
    <Typography variant="body1" align="center" mt={5}>
      No activities found.
    </Typography>

    {/* ✅ Still show pagination */}
    <Box mt={2} display="flex" justifyContent="center">
      <Pagination
        count={1}
        page={1}
        onChange={() => {}}
      />
    </Box>
  </>
)}



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
