import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';

const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '28px',
    paddingTop: '4px',
    paddingBottom: '4px',
    '& .MuiOutlinedInput-input': {
      padding: '4px 8px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: -8,
    left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0,
      transform: 'translate(14px, -7px) scale(0.75) !important',
      transformOrigin: 'top left',
    },
  },
};

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
            sx={smallerInputSx}
          />
          <TextField
            label="Website Area Name"
            size="small"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            required
            sx={smallerInputSx}
          />
          <TextField
            label="City"
            size="small"
            fullWidth
            value={formData.city}
            onChange={handleChange('city')}
            required
            sx={smallerInputSx}
          />
          <TextField
            label="Latitude"
            size="small"
            fullWidth
            value={formData.latitude}
            onChange={handleChange('latitude')}
            sx={smallerInputSx}
          />
          <TextField
            label="Longitude"
            size="small"
            fullWidth
            value={formData.longitude}
            onChange={handleChange('longitude')}
            sx={smallerInputSx}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'none',
                backgroundColor: '#162F40',
                '&:hover': {
                  backgroundColor: '#122E3E',
                },
              }}
            >
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={onCancel} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
