import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export default function SlabRateList({ data, onEdit, onCreate, onDelete }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleModify = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const confirmed = window.confirm('Are you sure you want to delete this slab rate?');
    if (confirmed) {
      onDelete(selectedId);
      setSelectedId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button onClick={handleModify} disabled={!selectedId}>
          Modify
        </Button>
        <Button onClick={handleDelete} disabled={!selectedId}>
          Delete
        </Button>
        <Button variant="contained" onClick={onCreate} color="primary">
          Create
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Slab Start</TableCell>
              <TableCell>Slab End</TableCell>
              <TableCell>Percent</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Formula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedId === item.id}
                    onChange={() => handleCheckbox(item.id)}
                  />
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.slabStart}</TableCell>
                <TableCell>{item.slabEnd}</TableCell>
                <TableCell>{item.percent}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell>{item.project}</TableCell>
                <TableCell>{item.formula}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
