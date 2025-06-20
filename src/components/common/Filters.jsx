import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const Filters = ({ filters, onChange, onReset }) => {
  return (
    <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
      {filters.map((filter) => (
        <TextField
          key={filter.name}
          label={filter.label}
          name={filter.name}
          value={filter.value}
          onChange={(e) => onChange(filter.name, e.target.value)}
          size="small"
        />
      ))}
      <Button variant="contained" onClick={() => onChange('search')}>
        Search
      </Button>
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
};

export default Filters;
