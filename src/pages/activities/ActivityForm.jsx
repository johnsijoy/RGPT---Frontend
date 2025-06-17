import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack
} from '@mui/material';

const CreateActivityForm = ({ formData, setFormData }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Activity"
          size="small"
          fullWidth
          value={formData.activity}
          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={formData.activityType}
            label="Activity Type"
            onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
          >
            <MenuItem value="Follow Up">Follow Up</MenuItem>
            <MenuItem value="Site Visit">Site Visit</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Meeting">Meeting</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date Time"
          type="datetime-local"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
        />

        <TextField
          label="End Date Time"
          type="datetime-local"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
        />

        <TextField
          label="Lead"
          size="small"
          fullWidth
          value={formData.lead}
          onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
        />

        <TextField
          label="Client"
          size="small"
          fullWidth
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
        />

        <TextField
          label="Assigned To"
          size="small"
          fullWidth
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
        />

        <TextField
          label="Description"
          size="small"
          fullWidth
          multiline
          minRows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </Stack>
    </Box>
  );
};

export default CreateActivityForm;
