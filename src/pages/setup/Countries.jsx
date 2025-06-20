import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, TextField, InputAdornment, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper, TablePagination,
  Button, FormControl, InputLabel, TableSortLabel,
} from '@mui/material';

import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Reusable SX for smaller inputs
const smallerInputSx = {
  // Target the root of the InputBase within FormControl/TextField
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', // Smaller font size for selected values / text field input
    minHeight: '28px', // Reduce overall height of the input field
    paddingTop: '4px', // Adjust vertical padding for selected text/chips
    paddingBottom: '4px', // Adjust vertical padding
    '& .MuiOutlinedInput-input': { // Specific for TextField's input
      padding: '4px 8px', // Adjust padding inside text field
    },
    // Adjust padding for Select component's input specifically
    '& .MuiSelect-select': {
      paddingTop: '4px !important',
      paddingBottom: '4px !important',
      minHeight: 'auto !important', // Allow height to adjust
      lineHeight: '1.2 !important', // Adjust line height for better spacing
    },
  },
  // Target the InputLabel specifically
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem', // Smaller font size for the label
    top: -8, // Adjusted: Nudge label up for smaller inputs
    left: '0px', // Ensure label starts at the left edge
    '&.MuiInputLabel-shrink': {
      top: 0, // Adjusted: Shrunk label top position
      transform: 'translate(14px, -7px) scale(0.75) !important', // Fine-tuned transform for shrunk label
      transformOrigin: 'top left', // Ensure it scales from top-left
    },
  },
  // Target the dropdown arrow icon (for Select components)
  '& .MuiSelect-icon': {
    fontSize: '1.2rem', // Adjust size of the icon if needed
    top: 'calc(50% - 0.6em)', // Nudge icon vertically to align
    right: '8px', // Adjust horizontal position if needed
  },
};

// Reusable MenuProps for smaller dropdown items
const smallerMenuProps = {
  sx: {
    '& .MuiMenuItem-root': {
      fontSize: '0.75rem', // Smaller font size for individual menu items
      minHeight: 'auto', // Allow menu items to shrink
      paddingTop: '6px', // Adjust padding for menu items
      paddingBottom: '6px', // Adjust padding for menu items
    },
    '& .MuiCheckbox-root': { // For checkbox within MenuItem (if used for multi-select)
        transform: 'scale(0.8)',
        padding: '4px',
    }
  },
};

const countriesData = [
  { id: '47730966742691691', name: 'Dubai, UAE', code: 'UAE', description: 'Middle Eastern Country' },
  { id: '452841597447000171', name: 'India', code: 'IN', description: 'South Asian Country' },
  { id: '23489472378937842', name: 'United States', code: 'US', description: 'North American Country' },
  { id: '91823478972348912', name: 'Canada', code: 'CA', description: 'Country in North America' },
  { id: '91238912389128391', name: 'Germany', code: 'DE', description: 'European Country' },
  { id: '21389472389472389', name: 'Singapore', code: 'SG', description: 'Island Country in Southeast Asia' },
  { id: '48374982374982374', name: 'Australia', code: 'AU', description: 'Country in Oceania' },
];

const Countries = () => {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...countriesData].sort((a, b) => {
    const valA = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
    const valB = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(row =>
    (!query || row.code === query) && // Only filter by code, not name.includes(query) if it's a select filter
    (!search ||
      row.id.includes(search) ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectAll = (event) => {
    setSelectedRows(event.target.checked ? filteredData.map((row) => row.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((row) => ({
      ID: row.id,
      Name: row.name,
      Code: row.code,
      Description: row.description || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Countries');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(blob, 'Countries.xlsx');
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#134ca7', mb: 2 }}>Countries</Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5, // Adjusted gap
        mb: 2,
        alignItems: 'flex-end', // Align items to the bottom (e.g., text fields with labels)
        width: '100%',
        justifyContent: 'flex-start', // Align items to the start
        '& > *': { // Apply base styles to all immediate children in this Box
          flexGrow: 1, // Allow items to grow
          minWidth: '100px', // Adjusted: Sensible minimum width
          maxWidth: '180px', // Adjusted: Prevent controls from getting too wide
        }
      }}>
        <FormControl
          size="small"
          sx={{
            minWidth: 160, // Adjusted minWidth for this specific filter
            ...smallerInputSx
          }}
        >
          <InputLabel id="filter-label">Filter by Country</InputLabel>
          <Select
            labelId="filter-label"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            label="Filter by Country"
            MenuProps={smallerMenuProps}
          >
            <MenuItem value=""><em>None</em></MenuItem> {/* Added a "None" option to clear filter */}
            {countriesData.map((country) => (
              <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ padding: '4px' }}> {/* Smaller IconButton */}
                  <SearchIcon sx={{ fontSize: '1.1rem' }} /> {/* Smaller icon */}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 180, // Slightly wider for search
            ...smallerInputSx
          }}
        />

        <Button
  variant="contained"
  size="small"
  startIcon={<DownloadIcon sx={{ fontSize: '1.1rem' }} />}
  onClick={handleExportExcel}
  sx={{
    backgroundColor: '#134ca7',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '4px 10px',
    textTransform: 'none',
    minWidth: 'fit-content',
    ml: 'auto',
    '&:hover': {
      backgroundColor: '#0f3e8e', // Slightly darker shade on hover
    },
  }}
>
  Export to Excel
</Button>

      </Box>

      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#162F40' }}> {/* Updated background color */}
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  sx={{ color: '#fff' }} 
                />
              </TableCell>
              {[ 'name', 'code', 'description'].map((col) => (
                <TableCell key={col} sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                    // Ensure all parts of the sort label (text and icon) are white
                    sx={{
                      color: '#fff !important',
                      '&:hover': {
                        color: '#fff !important'
                      },
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important'
                      }
                    }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.name}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.code}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.description || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{ borderTop: '1px solid #eee' }}
        />
      </Paper>
    </Box>
  );
};

export default Countries;