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
import TableViewIcon from '@mui/icons-material/TableView';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import entityIdRepo from '../../mock/entityIdRepo';



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


const EntityIdRepository = () => {
   const [data, setData] = useState(entityIdRepo); 

    const [checkedIds, setCheckedIds] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [formData, setFormData] = useState({ idgeneratorName: '', currentId: '', idprefix: '', idsuffix: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(['Id Generator Name', 'Current Id', 'Id Prefix', 'Id Suffix']);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [selectedVisibleIndex, setSelectedVisibleIndex] = useState(null);
    const [selectedHiddenIndex, setSelectedHiddenIndex] = useState(null);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [page, setPage] = useState(0);
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [importType, setImportType] = useState('comma');
    const [importAction, setImportAction] = useState('create');
    const [fieldDelimiter, setFieldDelimiter] = useState('');
    const [filterQuery, setFilterQuery] = useState(''); 


  const rowsPerPage = 25;
 

 const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

 const filtered = data.filter((row) =>
  (!filterQuery || row.idgeneratorName === filterQuery) &&
  (search === '' ||
    row.idgeneratorName.toLowerCase().includes(search.toLowerCase()) ||
    row.idprefix.toLowerCase().includes(search.toLowerCase()) ||
    row.idsuffix.toLowerCase().includes(search.toLowerCase()) ||
    row.currentId.toString().includes(search))
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
      setFormData({ generatorName: '', currentId: '', prefix: '', suffix: '' });
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

 // Functionality
  const moveToVisible = () => {
  if (selectedHiddenIndex !== null) {
    const col = hiddenColumns[selectedHiddenIndex];
    setVisibleColumns([...visibleColumns, col]);
    setHiddenColumns(hiddenColumns.filter((_, i) => i !== selectedHiddenIndex));
    setSelectedHiddenIndex(null);
  }
};

const moveToHidden = () => {
  if (selectedVisibleIndex !== null) {
    const col = visibleColumns[selectedVisibleIndex];
    setHiddenColumns([...hiddenColumns, col]);
    setVisibleColumns(visibleColumns.filter((_, i) => i !== selectedVisibleIndex));
    setSelectedVisibleIndex(null);
  }
};

const handleExport = () => {
  const dataStr = JSON.stringify({ visibleColumns, hiddenColumns }, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'column-preferences.json';
  link.click();
};

const moveAllToVisible = () => {
  setVisibleColumns((prev) => [...prev, ...hiddenColumns]);
  setHiddenColumns([]);
  setSelectedHiddenIndex(null);
};

const moveAllToHidden = () => {
  setHiddenColumns((prev) => [...prev, ...visibleColumns]);
  setVisibleColumns([]);
  setSelectedVisibleIndex(null);
};


const handleReset = () => {
  setVisibleColumns(['Id Generator Name', 'Current Id', 'Id Prefix', 'Id Suffix']);
  setHiddenColumns([]);
};

const handleSaveColumns = () => {
  console.log('Visible Columns:', visibleColumns);
  setColumnDialogOpen(false);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log('Uploaded file:', file.name);
    // You can add logic to read or process the file here.
  }
};

const handleImportSubmit = () => {
  console.log('Import submitted');
  // Add your submission logic here
  setOpenImportDialog(false); 
};

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="Entity ID Repository" />
      <Typography variant="h6" sx={{ mb: 2}}>Entity ID Repository</Typography>

     <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2, gap: 1 }}>


        {/*  Modify | Delete | Batch Update */}
              <Box sx={{ display: 'flex', gap: 1, padding: '4px 10px' }}>
              <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleDialogOpen('edit')}
                  disabled={checkedIds.length !== 1}
                  sx={{bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',padding: '4px 10px', textTransform: 'none',
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
                    bgcolor: '#122E3E', color: '#fff', fontSize: '0.75rem',padding: '4px 10px', textTransform: 'none',
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
    value={filterQuery}
    label="Select a Query"
    onChange={(e) => setFilterQuery(e.target.value)}
    MenuProps={{
      PaperProps: {
        sx: { '& .MuiMenuItem-root': { fontSize: '0.75em' } }
      }
    }}
  >
    <MenuItem value="">
      <em>All Id Generators Name</em>
    </MenuItem>
    {[...new Set(data.map(item => item.idgeneratorName))]
      .slice(0, 15)
      .map((name) => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
    ))}
  </Select>
</FormControl>


       
       
           {/* Import icon */}
            <IconButton size="small" title="Import" onClick={() => setOpenImportDialog(true)} sx={{ color: 'grey' }}>
            <UploadFileIcon fontSize="medium" />
            </IconButton>
       
         {/* Table view icon */}
       <IconButton
         size="small"
         title="Column Preferences"
         sx={{ color: 'grey' }}
         onClick={() => setColumnDialogOpen(true)}
       >
         <TableViewIcon />
       </IconButton>
       
          
           {/* Download Excel */}
       <IconButton
         size="small"
         sx={{ color: 'green' }}
         title="Export to Excel"
         onClick={() => {
           const rows = data.map(d => [
  d.idgeneratorName || '',
  d.currentId || '',
  d.idprefix || '',
  d.idsuffix || '',
  d.created || '',
  d.createdBy || '',
  d.lastUpdatedBy || '',
  d.lastUpdated || ''
]);

       
           const sheet = XLSX.utils.aoa_to_sheet([
             ['Id Generator Name', 'Current Id', 'Id Prefix', 'Id Suffix', 'Created', 'Created By', 'Last Updated By', 'Last Updated'],
             ...rows
           ]);
       
           const wb = XLSX.utils.book_new();
           XLSX.utils.book_append_sheet(wb, sheet, 'EntityIdRepository');
           XLSX.writeFile(wb, 'EntityIdRepository.xlsx');
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
             {['idgeneratorName', 'currentId', 'idprefix', 'idsuffix'].map((key) => (
                <TableCell
    key={key}
    sx={{
      color: '#fff',
      fontSize: 13,
      '& .MuiTableSortLabel-root': { color: '#fff' },
      '& .MuiTableSortLabel-root:hover': { color: '#fff' },
      '& .MuiTableSortLabel-root.Mui-active': { color: '#fff' },
      '& .MuiTableSortLabel-icon': { color: '#fff !important' }
    }}
  >
    <TableSortLabel
      active={sortConfig.key === key}
      direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
      onClick={() => handleSort(key)}
    >
      {{
        idgeneratorName: 'Id Generator Name',
        currentId: 'Current Id',
        idprefix: 'Id Prefix',
        idsuffix: 'Id Suffix'
      }[key]}
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
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.idgeneratorName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.currentId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.idprefix}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.idsuffix}</TableCell>
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
            {dialogType === 'edit' ? 'Edit Id' : 'Create Id'}
            <IconButton size="small" onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
       <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
  <TextField
    label="Id Generator Name"
    fullWidth
    margin="dense"
    value={formData.idgeneratorName}
    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Current Id"
    fullWidth
    value={formData.currentId}
    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Prefix"
    fullWidth
    value={formData.idprefix}
    onChange={(e) => setFormData({ ...formData, displayValue: e.target.value })}
    sx={{
      fontSize: '0.75rem',
      '& .MuiInputBase-input': { fontSize: '0.75rem' },
      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
    }}
  />
  <TextField
    label="Suffix"
    fullWidth
    value={formData.idsuffix}
    onChange={(e) => setFormData({ ...formData, isDefault: e.target.value })}
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


      
            {/* Dialog for Column Preference (Table view) */}
           <Dialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontSize="1rem">Column Preferences</Typography>
            <IconButton size="small" onClick={() => setColumnDialogOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
      
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Configure which columns to show/hide using the arrows. You can also reset column settings.
          </Typography>
      
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Hidden Columns */}
            <Box flex={1}>
              <Typography variant="subtitle2" fontSize="0.875rem">Hidden Columns</Typography>
              <List sx={{ border: '1px solid #ccc', height: 180, overflow: 'auto' }}>
                {hiddenColumns.map((col, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={index === selectedHiddenIndex}
                    onClick={() => setSelectedHiddenIndex(index)}
                  >
                    <ListItemText primary={col} />
                  </ListItem>
                ))}
              </List>
            </Box>
      
            {/* Arrow Buttons */}
            <Box display="flex" flexDirection="column" justifyContent="center" gap={1}>
              <Button size="small" variant="outlined" onClick={moveToVisible}>{'>>'}</Button>
              <Button size="small" variant="outlined" onClick={moveToHidden}>{'<<'}</Button>
            </Box>
      
            {/* Visible Columns */}
            <Box flex={1}>
              <Typography variant="subtitle2" fontSize="0.875rem">Visible Columns</Typography>
              <List sx={{ border: '1px solid #ccc', height: 180, overflow: 'auto' }}>
                {visibleColumns.map((col, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={index === selectedVisibleIndex}
                    onClick={() => setSelectedVisibleIndex(index)}
                  >
                    <ListItemText primary={col} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
      
        {/* Dialog Footer Buttons */}
        <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
          <Button size="small" variant="outlined" sx={{ bgcolor: '#122E3E', color: '#fff', textTransform: 'none' }} onClick={handleReset}>Reset</Button>
      
          <Button
            size="small"
            variant="contained"
            sx={{ bgcolor: '#122E3E', color: '#fff', textTransform: 'none' }}
            onClick={handleSaveColumns}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog for Import Values */}
      <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize="1rem" fontWeight={600}>Import Values</Typography>
            <IconButton size="small" onClick={() => setOpenImportDialog(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
      
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <Typography fontSize="0.875rem" fontWeight={500}>What is the Data Source? *</Typography>
            <Box display="flex" gap={2} mt={1}>
              <FormControlLabel
                control={
                  <Radio
                    checked={importType === 'comma'}
                    onChange={() => setImportType('comma')}
                  />
                }
                label="Comma delimited file"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={importType === 'custom'}
                    onChange={() => setImportType('custom')}
                  />
                }
                label="Custom delimited file"
              />
            </Box>
          </FormControl>
      
          {importType === 'custom' && (
            <TextField
              label="Fields Qualified By"
              fullWidth
              size="small"
              placeholder='e.g. "|"'
              value={fieldDelimiter}
              onChange={(e) => setFieldDelimiter(e.target.value)}
            />
          )}
      
          <FormControl>
            <Typography fontSize="0.875rem" fontWeight={500}>Import Action</Typography>
            <Box display="flex" gap={2} mt={1}>
              <FormControlLabel
                control={
                  <Radio
                    checked={importAction === 'create'}
                    onChange={() => setImportAction('create')}
                  />
                }
                label="Create Records"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={importAction === 'createUpdate'}
                    onChange={() => setImportAction('createUpdate')}
                  />
                }
                label="Create And Update Records"
              />
            </Box>
          </FormControl>
      
      
        </DialogContent>
      
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            component="label"
            sx={{ bgcolor: '#122E3E', color: '#fff', textTransform: 'none', padding:'3px 9px', width: 'fit-content' }}
          >
            Upload File
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ bgcolor: '#122E3E', color: '#fff', textTransform: 'none' }}
            onClick={handleImportSubmit}
          >
            Import
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

export default EntityIdRepository;
