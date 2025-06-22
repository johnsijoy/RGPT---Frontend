import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  IconButton,
  Select,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Pagination from '../../../components/common/Pagination';

import { websiteAreasMockData } from '../../../mock/websiteareas';

export default function WebsiteAreasList({ onEdit, onCreate }) {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageSize = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    let sortable = [...websiteAreasMockData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesZone = selectedZone === '' || item.masterArea === selectedZone;
      const matchesSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesZone && matchesSearch;
    });
  }, [sortedData, selectedZone, searchTerm]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page]);

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleModify = () => {
    const selected = websiteAreasMockData.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDelete = () => {
    alert('Delete functionality to be implemented in parent component.');
  };

  const handleExport = () => {
    import('xlsx').then((XLSX) => {
      const worksheetData = filteredData.map(({ id, ...rest }) => rest);
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'WebsiteAreas');
      XLSX.writeFile(workbook, 'website_areas.xlsx');
    });
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box mb={2}>
        <Breadcrumbs
          items={[
            { label: 'Setup', path: '/setup' },
            { label: 'Website Area List' },
          ]}
        />
      </Box>

      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Website Areas
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleModify}
            disabled={!selectedId}
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.75rem', textTransform: 'none', padding: '4px 10px' }}
          >
            Modify
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!selectedId}
            variant="outlined"
            size="small"
            color="error"
            sx={{ fontSize: '0.75rem', textTransform: 'none', padding: '4px 10px' }}
          >
            Delete
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              width: 130,
              '& .MuiInputBase-root': {
                height: 30,
                fontSize: '0.7rem',
              },
              '& .MuiInputBase-input': {
                padding: '0px 6px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
          />
          <Select
  size="small"
  value={selectedZone}
  displayEmpty
  onChange={(e) => {
    setSelectedZone(e.target.value);
    setPage(1);
  }}
  sx={{
    fontSize: '0.75rem',
    height: 30,
    minWidth: 130,
    bgcolor: '#f0f0f0',
    color: selectedZone ? 'inherit' : 'gray', // <-- sets gray when no selection
    '& .MuiSelect-select': {
      padding: '4px 10px',
    },
  }}
  renderValue={(selected) =>
    selected ? selected : <span style={{ color: 'gray' }}>Select a Query</span>
  }
>
  <MenuItem value="">
    <em>None</em>
  </MenuItem>
  <MenuItem value="Zone A">Zone A</MenuItem>
  <MenuItem value="Zone B">Zone B</MenuItem>
  <MenuItem value="Zone C">Zone C</MenuItem>
</Select>

          

          <IconButton size="small" onClick={handleExport} title="Export to Excel" sx={{ color: 'green' }}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            onClick={onCreate}
            size="small"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#134ca7',
              fontSize: '0.75rem',
              padding: '4px 10px',
              textTransform: 'none',
              minWidth: 'fit-content',
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#162F40' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
                  Select
                </TableCell>
                {['masterArea', 'name', 'city', 'latitude', 'longitude'].map((key) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key)}
                    sx={{ color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                    {sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUpwardIcon fontSize="inherit" sx={{ color: '#fff' }} />
                      ) : (
                        <ArrowDownwardIcon fontSize="inherit" sx={{ color: '#fff' }} />
                      )
                    ) : (
                      <ArrowDownwardIcon fontSize="inherit" sx={{ color: '#fff', opacity: 0.3 }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedId === item.id}
                    onClick={() => handleCheckbox(item.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selectedId === item.id}
                        onChange={() => handleCheckbox(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.masterArea}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.city}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.latitude}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.longitude}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                    No Website Areas Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </Box>
    </Box>
  );
}
