import React, { useState } from 'react';
import {
  Box, Typography, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TableSortLabel from '@mui/material/TableSortLabel';
import * as XLSX from 'xlsx';
import listOfValues from '../../mock/listofvalues';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';


const smallerInputSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem', minHeight: '28px', paddingTop: '4px', paddingBottom: '4px',
    '& .MuiOutlinedInput-input': { padding: '4px 8px' },
    '& .MuiSelect-select': {
      paddingTop: '4px !important', paddingBottom: '4px !important', minHeight: 'auto !important',
      lineHeight: '1.2 !important',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem', top: -8, left: '0px',
    '&.MuiInputLabel-shrink': {
      top: 0, transform: 'translate(14px, -7px) scale(0.75) !important', transformOrigin: 'top left',
    },
  },
  '& .MuiSelect-icon': { fontSize: '1.2rem', top: 'calc(50% - 0.6em)', right: '8px' },
};

const ListOfValues = () => {
  const [data, setData] = useState(listOfValues);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
 
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [formData, setFormData] = useState({
    type: '', value: '', displayValue: '', isDefault: '', depth: '', parent: '', sequence: ''
  });

  const rowsPerPage = 25;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = data.filter((row) =>
    (row.type.toLowerCase().includes(search.toLowerCase()) ||
      row.value.toLowerCase().includes(search.toLowerCase())) &&
    (filterType === '' || row.type === filterType)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });


   const totalPages = Math.ceil(filtered.length / rowsPerPage);
   const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleDialogOpen = (type) => {
    if (type === 'edit') {
      const selected = data.find((d) => d.id === checkedIds[0]);
      if (selected) setFormData(selected);
    } else {
      setFormData({ type: '', value: '', displayValue: '', isDefault: '', depth: '', parent: '', sequence: '' });
    }
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'edit') {
      setData(prev => prev.map(d => d.id === formData.id ? { ...formData } : d));
    } else {
      const newId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData(prev => [...prev, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
    setCheckedIds([]);
  };

  const handleDelete = () => {
    setData(prev => prev.filter(d => !checkedIds.includes(d.id)));
    setCheckedIds([]);
  };

 


  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="List Of Values" />
      <Typography variant="h6" sx={{ mb: 2 }}>List Of Values</Typography>

     <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2, gap: 1 }}>



  {/*  Modify | Delete | Batch Update */}
  <Box sx={{ display: 'flex', gap: 1 }}>
   <Button
           variant="contained"
           size="small"
           onClick={() => handleDialogOpen('edit')}
           disabled={checkedIds.length !== 1}
           sx={{bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',padding: '3px 9px', textTransform: 'none',
             '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
           }}
         >
           Modify
         </Button>
         <Button
           variant="contained"
           size="small"
           onClick={() => setOpenDeleteDialog(true)}
           disabled={checkedIds.length === 0}
           sx={{
             bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',padding: '3px 9px', textTransform: 'none',
             '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#888' }
           }}
         >
           Delete
         </Button>

    <Button
               variant="contained"
               size="small"
               sx={{ bgcolor: '#122E3E', fontSize: '0.75rem',padding: '3px 9px', textTransform: 'none' }}
               disabled
             >
               Batch Update
             </Button>
  </Box>

  {/* Search | Select | Download | Create */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>



    {/* Search */}
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ minWidth: 160, ...smallerInputSx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />

    {/* Select a Query */}
    <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
           <InputLabel>Select a Query</InputLabel>
           <Select
             value={filterType}
             label="Select a Query"
             onChange={(e) => setFilterType(e.target.value)}
        MenuProps={{
          PaperProps: {
            sx: { '& .MuiMenuItem-root': { fontSize: '0.75em' } }
          }
        }}
      >
        <MenuItem value=""><em>All Types</em></MenuItem>
        {[...new Set(data.map((item) => item.type))].map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </Select>
    </FormControl>

   
    {/* Download Excel */}
<IconButton
  size="small"
  sx={{ color: 'green' }}
  title="Export to Excel"
  onClick={() => {
    const rows = data.map(d => [
      d.type, d.value, d.displayValue, d.isDefault || '', d.depth || '', d.parent || '', d.sequence || '',  d.created || '', d.createdBy || '', d.lastUpdatedBy || '', d.lastUpdated || ''
    ]);

    const sheet = XLSX.utils.aoa_to_sheet([
      ['Type','Value', 'Display Value', 'Is Default?', 'Depth', 'Parent List Of Value', 'Sequence', 'Created', 'Created By', 'Last Updated By', 'Last Updated'],
      ...rows
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'ListOfValues');
    XLSX.writeFile(wb, 'ListOfValues.xlsx');
  }}
>
  <DescriptionIcon fontSize="medium" />
</IconButton>


    {/* Create */}
    <Button
      variant="contained"
      size="small"
      onClick={() => handleDialogOpen('create')}
      sx={{
        bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',
        padding: '4px 10px', textTransform: 'none'
      }}>
      + Create
    </Button>
  </Box>
</Box>



      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#122E3E' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={paginated.length > 0 && paginated.every(row => checkedIds.includes(row.id))}
                  indeterminate={checkedIds.length > 0 && checkedIds.length < paginated.length}
                  onChange={(e) => {
                    const ids = paginated.map(row => row.id);
                    setCheckedIds(e.target.checked
                      ? [...new Set([...checkedIds, ...ids])]
                      : checkedIds.filter(id => !ids.includes(id)));
                  }}
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              {['type', 'value', 'displayValue', 'isDefault', 'depth', 'parent', 'sequence'].map((key) => (
                <TableCell
                 key={key}
                 sx={{color: '#fff', fontSize: 13,'& .MuiTableSortLabel-root': {color: '#fff', },
                 '& .MuiTableSortLabel-root:hover': {color: '#fff',  },'& .MuiTableSortLabel-root.Mui-active': {
                    color: '#fff', },'& .MuiTableSortLabel-icon': {color: '#fff !important', } }}>
  <TableSortLabel
    active={sortConfig.key === key}
    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
    onClick={() => handleSort(key)}
  >
    {key.charAt(0).toUpperCase() + key.slice(1)}
  </TableSortLabel>
</TableCell>

              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={checkedIds.includes(row.id)}
                      onChange={() =>
                        setCheckedIds((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.value}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.displayValue}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.isDefault}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.depth}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.parent}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.sequence}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={8} align="center">No Records Found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

        <Box mt={2}>
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(p) => setPage(p - 1)}
      />
    </Box>
    

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'edit' ? 'Edit Value' : 'Create Value'}
            <IconButton size="small" onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
       <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
  <TextField
    label="Type"
    fullWidth
    margin="dense"
    value={formData.type}
    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Value"
    fullWidth
    value={formData.value}
    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Display Value"
    fullWidth
    value={formData.displayValue}
    onChange={(e) => setFormData({ ...formData, displayValue: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Is Default"
    fullWidth
    value={formData.isDefault}
    onChange={(e) => setFormData({ ...formData, isDefault: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Depth"
    fullWidth
    value={formData.depth}
    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Parent"
    fullWidth
    value={formData.parent}
    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Sequence"
    fullWidth
    value={formData.sequence}
    onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
</DialogContent>

        <DialogActions>
          <Button variant="contained" sx={{ bgcolor: '#122E3E',fontSize: '0.75rem', padding: '3px 9px', color: '#fff' }} onClick={handleDialogSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Dialog */}
<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600 }}>
    Confirm Delete
    <IconButton onClick={() => setOpenDeleteDialog(false)} size="small">
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ fontSize: '0.875rem', mt: 1 }}>
    Are you sure you want to delete the selected record{checkedIds.length > 1 ? 's' : ''}?
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => {
        handleDelete();
        setOpenDeleteDialog(false);
      }}
      variant="contained"
      size="small"
      sx={{bgcolor: '#122E3E',color: '#fff',fontSize: '0.75rem',padding: '4px 12px',textTransform: 'none','&:hover': { bgcolor: '#0e1e2a' }}}>
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default ListOfValues;