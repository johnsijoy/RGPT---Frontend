import React, { useState, useMemo } from 'react';
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
  TableRow,
  TextField,
  TableSortLabel,
  IconButton,
  Stack,
  InputAdornment,
  Typography,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Pagination from '../../../components/common/Pagination';

function SlabRateList({ data, onEdit, onCreate, onDelete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'type', direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const handleCheckbox = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key] ?? '';
      const valB = b[sortConfig.key] ?? '';

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, page]);

  const handleModify = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (selected) onEdit(selected);
  };

  const handleDeleteClick = () => {
    if (selectedId) {
      onDelete(selectedId);
      setSelectedId(null);
    }
  };

  const handleExport = () => {
    const worksheetData = data.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SlabRates');
    XLSX.writeFile(workbook, 'slab_rates.xlsx');
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box mb={2}>
        <Breadcrumbs
          items={[
            { label: 'Setup', path: '/setup' },
            { label: 'Slab Rate List' },
          ]}
        />
      </Box>

      <Typography variant="h6" sx={{ flexGrow: 1, mb: 2 }}>
        Slab Rate
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Button
            onClick={handleModify}
            disabled={!selectedId}
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.75rem', px: 2, textTransform: 'none' }}
          >
            Modify
          </Button>

          <Button
            onClick={() => alert('Batch update clicked')}
            disabled={!selectedId}
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.75rem', px: 2, textTransform: 'none' }}
          >
            Batch Update
          </Button>

          <Button
            onClick={handleDeleteClick}
            disabled={!selectedId}
            variant="outlined"
            size="small"
            color="error"
            sx={{ fontSize: '0.75rem', px: 2, textTransform: 'none' }}
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

          <IconButton
            size="small"
            onClick={handleExport}
            title="Export to Excel"
            sx={{ color: 'green' }}
          >
            <DescriptionIcon fontSize="medium" />
          </IconButton>

          <Button
            variant="contained"
            onClick={onCreate}
            size="small"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#122E3E',
              fontSize: '0.75rem',
              px: 2,
              textTransform: 'none',
              minWidth: 'fit-content',
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                Select
              </TableCell>
              {[
                'type',
                'slabStart',
                'slabEnd',
                'percent',
                'amount',
                'from',
                'to',
                'project',
                'formula',
              ].map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  sortDirection={sortConfig.key === key ? sortConfig.direction : false}
                  onClick={() => handleSort(key)}
                >
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    IconComponent={() =>
                      sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? (
                          <ArrowUpwardIcon sx={{ color: '#fff', fontSize: '0.85rem' }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ color: '#fff', fontSize: '0.85rem' }} />
                        )
                      ) : (
                        <ArrowDownwardIcon
                          sx={{ color: '#fff', fontSize: '0.75rem', opacity: 0.4 }}
                        />
                      )
                    }
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important',
                      },
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedId === item.id}
                      onChange={() => handleCheckbox(item.id)}
                    />
                  </TableCell>
                  {[
                    'type',
                    'slabStart',
                    'slabEnd',
                    'percent',
                    'amount',
                    'from',
                    'to',
                    'project',
                    'formula',
                  ].map((field) => (
                    <TableCell key={field} sx={{ fontSize: '0.75rem' }}>
                      {item[field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ fontSize: '0.75rem', py: 2 }}>
                  No Slab Rates Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={pageCount}
          page={page}
          onChange={setPage}
          size="small"
        />
      </Box>
    </Box>
  );
}

export default SlabRateList;
