import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Typography,
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
    '& .MuiSelect-select': {
      paddingTop: '4px !important',
      paddingBottom: '4px !important',
      minHeight: 'auto !important',
      lineHeight: '1.2 !important',
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

export default function SlabRateForm({ initialData = {}, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    type: '',
    slabStart: '',
    slabEnd: '',
    percent: '',
    amount: '',
    from: '',
    to: '',
    project: '',
    formula: '',
  });

  useEffect(() => {
    setFormData({
      type: initialData.type || '',
      slabStart: initialData.slabStart || '',
      slabEnd: initialData.slabEnd || '',
      percent: initialData.percent || '',
      amount: initialData.amount || '',
      from: initialData.from || '',
      to: initialData.to || '',
      project: initialData.project || '',
      formula: initialData.formula || '',
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData && initialData.id ? 'Edit Slab Rate' : 'Create Slab Rate'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel required>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={handleChange('type')}
              required
              size="small"
            >
              <MenuItem value="Percentage">Percentage</MenuItem>
              <MenuItem value="Amount">Amount</MenuItem>
              <MenuItem value="Flat">Flat</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Slab Start Value"
            size="small"
            fullWidth
            value={formData.slabStart}
            onChange={handleChange('slabStart')}
            type="number"
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Slab End Value"
            size="small"
            fullWidth
            value={formData.slabEnd}
            onChange={handleChange('slabEnd')}
            type="number"
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Slab Percent"
            size="small"
            fullWidth
            value={formData.percent}
            onChange={handleChange('percent')}
            type="number"
            sx={smallerInputSx}
          />

          <TextField
            label="Slab Amount"
            size="small"
            fullWidth
            value={formData.amount}
            onChange={handleChange('amount')}
            type="number"
            sx={smallerInputSx}
          />

          <TextField
            label="Applicable From"
            size="small"
            fullWidth
            value={formData.from}
            onChange={handleChange('from')}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            sx={smallerInputSx}
          />

          <TextField
            label="Applicable To"
            size="small"
            fullWidth
            value={formData.to}
            onChange={handleChange('to')}
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            sx={smallerInputSx}
          />

          <FormControl fullWidth size="small" sx={smallerInputSx}>
            <InputLabel required>Projects Applicable</InputLabel>
            <Select
              value={formData.project}
              label="Projects Applicable"
              onChange={handleChange('project')}
              required
              size="small"
            >
              <MenuItem value="All Projects">All Projects</MenuItem>
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Formula"
            size="small"
            fullWidth
            value={formData.formula}
            onChange={handleChange('formula')}
            sx={smallerInputSx}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'none',
                backgroundColor: '#162F40',
                '&:hover': { backgroundColor: '#121f2a' },
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onCancel}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
