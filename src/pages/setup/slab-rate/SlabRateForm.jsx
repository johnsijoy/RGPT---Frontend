import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

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
    formula: ''
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
      formula: initialData.formula || ''
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
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
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select value={formData.type} label="Type" onChange={handleChange('type')} required>
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
          />

          <TextField
            label="Slab End Value"
            size="small"
            fullWidth
            value={formData.slabEnd}
            onChange={handleChange('slabEnd')}
            type="number"
            required
          />

          <TextField
            label="Slab Percent"
            size="small"
            fullWidth
            value={formData.percent}
            onChange={handleChange('percent')}
            type="number"
          />

          <TextField
            label="Slab Amount"
            size="small"
            fullWidth
            value={formData.amount}
            onChange={handleChange('amount')}
            type="number"
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
          />

          <FormControl fullWidth size="small">
            <InputLabel>Projects Applicable</InputLabel>
            <Select
              value={formData.project}
              label="Projects Applicable"
              onChange={handleChange('project')}
              required
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
