import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';

export default function WebsiteAreasForm({ initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    masterArea: '',
    name: '',
    city: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    setFormData({
      masterArea: initialData.masterArea || '',
      name: initialData.name || '',
      city: initialData.city || '',
      latitude: initialData.latitude || '',
      longitude: initialData.longitude || '',
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Website Area:', formData);
    onCancel();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData && initialData.name ? 'Modify Website Area' : 'Create Website Area'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Master Area"
            size="small"
            fullWidth
            value={formData.masterArea}
            onChange={handleChange('masterArea')}
            required
          />
          <TextField
            label="Website Area Name"
            size="small"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            required
          />
          <TextField
            label="City"
            size="small"
            fullWidth
            value={formData.city}
            onChange={handleChange('city')}
            required
          />
          <TextField
            label="Latitude"
            size="small"
            fullWidth
            value={formData.latitude}
            onChange={handleChange('latitude')}
          />
          <TextField
            label="Longitude"
            size="small"
            fullWidth
            value={formData.longitude}
            onChange={handleChange('longitude')}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="success" type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
