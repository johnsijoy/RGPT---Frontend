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

export default function WebsiteAreasList({ onEdit, onCreate }) {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      masterArea: 'Zone A',
      name: 'North Zone',
      city: 'Chennai',
      latitude: '13.0827',
      longitude: '80.2707',
    },
    {
      id: 2,
      masterArea: 'Zone B',
      name: 'South Zone',
      city: 'Bangalore',
      latitude: '12.9716',
      longitude: '77.5946',
    },
    {
      id: 3,
      masterArea: 'Zone C',
      name: 'East Zone',
      city: 'Kolkata',
      latitude: '22.5726',
      longitude: '88.3639',
    },
  ]);

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleModify = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');
    if (confirmed) {
      setData((prev) => prev.filter((item) => item.id !== selectedId));
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
        <Button variant="contained" onClick={onCreate}>
          Create
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Master Area</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
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
                <TableCell>{item.masterArea}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.city}</TableCell>
                <TableCell>{item.latitude}</TableCell>
                <TableCell>{item.longitude}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
