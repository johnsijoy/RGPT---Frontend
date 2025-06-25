import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, TableSortLabel, Collapse, Divider
} from '@mui/material';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import * as XLSX from 'xlsx';

import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { listViewColumnMockData } from '../../mock/listviewcolumn';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const darkBlue = '#122E3E';
const grayDisabled = '#B0B0B0';

export default function ListViewColumn() {
  const [data, setData] = useState(listViewColumnMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(25);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [expandGeneral, setExpandGeneral] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  

  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [modifyFormData, setModifyFormData] = useState({
    user: '',
    serialNumber: '',
    moduleName: '',
    fieldName: '',
    listViewRenderedAs: '',
  });
   const [modifyDetailsDialogOpen, setModifyDetailsDialogOpen] = useState(false);
  const [modifyDetailsFormData, setModifyDetailsFormData] = useState({
    userName: '',
    accessRoles: '',
    teams: '',
    userDetailsFactory: '',
    primaryTeam: '',
  });

  const columns = [
    { label: 'User', key: 'user' },
    { label: 'Serial Number', key: 'serialNumber' },
    { label: 'Module Name', key: 'moduleName' },
    { label: 'Field Name', key: 'fieldName' },
    { label: 'List View Rendered As', key: 'listViewRenderedAs' },
  ];

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);
  const openModifyDialog = () => {
  if (checkedIds.length === 1) {
    const selected = data.find(d => d.id === checkedIds[0]);
    if (selected) {
      setModifyFormData({
        user: selected.user || '',
        serialNumber: selected.serialNumber || '',
        moduleName: selected.moduleName || '',
        fieldName: selected.fieldName || '',
        listViewRenderedAs: selected.listViewRenderedAs || '',
      });
      setModifyDialogOpen(true);
    }
  }
};


  const handleModifyInputChange = (field) => (event) => {
    setModifyFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleModifySave = () => {
    setData(prev =>
      prev.map(item =>
        item.id === checkedIds[0]
          ? { ...item, ...modifyFormData }
          : item
      )
    );
    setModifyDialogOpen(false);
    setCheckedIds([]); 
  };
  const smallFormControlSx = {
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    minHeight: '28px',
    paddingTop: '4px',
    paddingBottom: '4px',
    '& .MuiOutlinedInput-input': {
      padding: '4px 8px',
      fontSize: '0.75rem',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    top: '50%',
    left: 8,
    transform: 'translateY(-50%)',
    transition: 'all 0.2s ease',
    '&.MuiInputLabel-shrink': {
      top: 0,
      left: 0,
      transform: 'translate(14px, -7px) scale(0.75) !important',
      transformOrigin: 'top left',
    },
  },
};


  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = (checked) => {
    const pageIds = paginatedData.map(row => row.id);
    setCheckedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...pageIds]));
      return prev.filter(id => !pageIds.includes(id));
    });
  };

  const handleCheckbox = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setData(prev => prev.filter(d => !checkedIds.includes(d.id)));
    setCheckedIds([]);
    setOpenDeleteDialog(false);
  };

  const handleExport = () => {
    const rows = data.map(d => [
      d.user, d.serialNumber, d.moduleName, d.fieldName, d.listViewRenderedAs
    ]);
    const sheet = XLSX.utils.aoa_to_sheet([
      ['User', 'Serial Number', 'Module Name', 'Field Name', 'List View Rendered As'],
      ...rows
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'ListViewColumn');
    XLSX.writeFile(wb, 'ListViewColumn.xlsx');
  };
   const openModifyDetailsDialog = (preload = null) => {
    const src = preload || selectedUser;
    if (!src) return;
    setModifyDetailsFormData({
      userName: src.user,
      password: '',
      confirmPassword: '',
      allowMobile: src.allowMobile || false,
      mobileDeviceId: src.mobileDeviceId || '',
      fromDate: src.fromDate || '',
      toDate: src.toDate || '',
      accessRoles: src.accessRoles || '',
      teams: src.teams || '',
      publicTeam: src.publicTeam || '',
      primaryTeam: src.primaryTeam || '',
      ipAddresses: src.ipAddresses || '',
    });
    setUserDialogOpen(false);

    setModifyDetailsDialogOpen(true);
  };
  const handleModifyDetailsInputChange = (field) => (event) => {
    setModifyDetailsFormData(prev => ({ ...prev, [field]: event.target.value }));
  };
  const handleModifyDetailsSave = () => {
  if (!selectedUser) return;

  setData(prev =>
    prev.map(item =>
      item.id === selectedUser.id
        ? {
            ...item,
            user: modifyDetailsFormData.userName,
            accessRoles: modifyDetailsFormData.accessRoles,
            teams: modifyDetailsFormData.teams,
            userDetailsFactory: modifyDetailsFormData.userDetailsFactory,
            primaryTeam: modifyDetailsFormData.primaryTeam,
          }
        : item
    )
  );

 setSelectedUser(prev => ({
    ...prev,
    user: modifyDetailsFormData.userName,
    accessRoles: modifyDetailsFormData.accessRoles,
    teams: modifyDetailsFormData.teams,
    userDetailsFactory: modifyDetailsFormData.userDetailsFactory,
    primaryTeam: modifyDetailsFormData.primaryTeam,
  }));

  setModifyDetailsDialogOpen(false);
};
  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Breadcrumbs current="List View Column" />
      <Typography variant="h6" sx={{ mb: 2 }}>List View Column</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
  variant="contained"
  size="small"
  disabled={checkedIds.length !== 1}
  onClick={openModifyDialog}
  sx={{
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.75rem',
    padding: '3px 8px',
    minWidth: 60,
    height: 25,
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
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.75rem',
    minWidth: 60,
    height: 25,
  }}
          >
            Delete
          </Button>
          <Button variant="contained" size="small" disabled sx={{ bgcolor: grayDisabled, fontSize: '0.75rem',
    
    minWidth: 60,
    height: 25 }}>
            Batch Update
          </Button>
        </Box>
        <Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle
    sx={{ m: 0, p: 2, position: 'relative', borderBottom: 'none' }}
  >
    <Typography variant="h6">Confirm Delete</Typography>
    <IconButton
      aria-label="close"
      onClick={() => setOpenDeleteDialog(false)}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: darkBlue,
      }}
      size="small"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ borderTop: 'none' }}>
    <Typography fontSize="0.875rem">
      Are you sure you want to delete {checkedIds.length} selected
      item{checkedIds.length > 1 ? 's' : ''}?
    </Typography>
  </DialogContent>

  <DialogActions sx={{ pr: 3, pb: 2 }}>
    <Button
      onClick={() => {
        // Confirm delete logic here
        setData(prev => prev.filter(item => !checkedIds.includes(item.id)));
        setCheckedIds([]);
        setOpenDeleteDialog(false);
      }}
      size="small"
      variant="contained"
      sx={{
        backgroundColor: darkBlue,
        fontSize: '0.75rem',
        '&:hover': { backgroundColor: '#0f2230' },
        minWidth: 60,
        height: 25,
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
             sx={{
              width: 130,
              '& .MuiInputBase-root': {
                height: 30,
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input': {
                padding: '0px 6px',
              },
            }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
          />
          <IconButton onClick={handleExport} sx={{ color: 'green', padding: '4px' }} title="Export to Excel">
            <DescriptionIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      

      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: darkBlue }}>
            <TableRow
    hover={false}

            sx={{
          // Disable hover background on header row
          '&:hover': {
            backgroundColor: darkBlue,
          },
        }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={paginatedData.length > 0 && paginatedData.every(row => checkedIds.includes(row.id))}
                  indeterminate={checkedIds.length > 0 && checkedIds.length < paginatedData.length}
                  onChange={e => handleSelectAll(e.target.checked)}
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              {columns.map(({ label, key }) => (
                <TableCell key={key} sx={{ color: '#fff', fontSize: 13 }}>
                  <TableSortLabel
  active={sortConfig.key === key}
  direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
  onClick={() => handleSort(key)}
  sx={{
    color: '#fff !important',          // always white
    '&:hover': {
      color: '#fff !important',        // no hover color change
    },
    '&.Mui-active': {
      color: '#fff !important',        // no active color change
    },
    '&.Mui-focusVisible': {
      color: '#fff !important',        // no focus color change
      outline: 'none',                 // remove outline if any
      boxShadow: 'none',
    },
    '&:focus': {
      color: '#fff !important',        // no focus color change on keyboard focus
      outline: 'none',
      boxShadow: 'none',
    },
    '&.MuiTableSortLabel-icon': {
     color: '#fff !important',   
    },
  }}
>
  {label}
</TableSortLabel>

                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => (
                <TableRow key={row.id} hover={false}
                
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={checkedIds.includes(row.id)}
                      onChange={() => handleCheckbox(row.id)}
                    />
                  </TableCell>

                  <TableCell
  sx={{ fontSize: '0.75rem', color: '#1976d2', cursor: 'pointer' }}
  onClick={() => {
    setSelectedUser(row);
    setUserDialogOpen(true);
  }}
>
  {row.user}
</TableCell>


                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.serialNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.moduleName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.fieldName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.listViewRenderedAs}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">No Records Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Pagination count={totalPages} page={page + 1} onChange={(_e, value) => setPage(value - 1)} />
      </Box>

      {/* Delete Dialog */}
      <Dialog
        open={modifyDialogOpen}
        onClose={() => setModifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Modify Entry
          <IconButton
            onClick={() => setModifyDialogOpen(false)}
            size="small"
            sx={{ color: 'grey.600' }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers
         sx={{
    borderTop: 'none',
    borderBottom: 'none',
  }}
        >
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleModifySave();
            }}
          >
             <TextField
        label="User "
        size="small"
        fullWidth
        required
        value={modifyFormData.user}
        onChange={handleModifyInputChange('user')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
      <TextField
        label="Serial Number"
        size="small"
        fullWidth
        value={modifyFormData.serialNumber}
        onChange={handleModifyInputChange('serialNumber')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
      <TextField
        label="Module Name"
        size="small"
        fullWidth
        value={modifyFormData.moduleName}
        onChange={handleModifyInputChange('moduleName')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
      <TextField
        label="Field Name"
        size="small"
        fullWidth
        value={modifyFormData.fieldName}
        onChange={handleModifyInputChange('fieldName')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
      <TextField
        label="List View Rendered As"
        size="small"
        fullWidth
        value={modifyFormData.listViewRenderedAs}
        onChange={handleModifyInputChange('listViewRenderedAs')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
    </Box>
  </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleModifySave}
            size="small"
            sx={{
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.65rem',
    padding: '3px 8px',
    minWidth: 50,
    height: 24,
  }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

<Dialog
  open={userDialogOpen}
  onClose={() => setUserDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    User Details
    <IconButton
      onClick={() => setUserDialogOpen(false)}
      size="small"
      sx={{ color: 'grey.600' }}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent>
  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
    <Button
      variant="contained"
      size="small"
       sx={{
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.65rem',
    padding: '3px 8px',
    minWidth: 50,
    height: 24,
  }}
      onClick={() => {
        setUserDialogOpen(false);
        openModifyDetailsDialog(); 
      }}
    >
      Modify
    </Button>

    <Button
  variant="contained"
  size="small"
   sx={{
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.65rem',
    padding: '3px 8px',
    minWidth: 50,
    height: 24,
  }}
  onClick={() => {
    const duplicate = {
      ...selectedUser,
      id: data.length + 1,
      user: `${selectedUser.user}_copy`,
    };
    setData(prev => [...prev, duplicate]);
    setSelectedUser(duplicate);
    setUserDialogOpen(false);
  }}
>
  Duplicate
</Button>

  </Box>

  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography sx={{ fontSize: '0.875rem' }}>
      <strong>User Name (*)</strong> : {selectedUser?.user || 'teamorbit'}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem' }}>
      <strong>Access Roles (*)</strong> : {selectedUser?.accessRoles || 'Admin'}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem' }}>
      <strong>Teams (*)</strong> : {selectedUser?.teams || 'Public'}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem' }}>
      <strong>User Details Factory (*)</strong> : {selectedUser?.userDetailsFactory || 'Database'}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem' }}>
      <strong>Primary Team</strong> : {selectedUser?.primaryTeam || 'Global Team'}
    </Typography>
  </Box>
</DialogContent>
</Dialog>



<Dialog
  open={modifyDetailsDialogOpen}
  onClose={() => setModifyDetailsDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Modify Details
    <IconButton
      onClick={() => setModifyDetailsDialogOpen(false)}
      size="small"
      sx={{ color: 'grey.600' }}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

   
  <DialogContent dividers
   sx={{
    borderTop: 'none',
    borderBottom: 'none',
  }}
  >
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleModifyDetailsSave();
      }}
    >
      {/* User Name */}
      <TextField
        label="User Name (*)"
        size="small"
        fullWidth
        value={modifyDetailsFormData.userName}
        onChange={handleModifyDetailsInputChange('userName')}
        
      InputProps={{ sx: { fontSize: '0.75rem' } }}
      InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* Password */}
      <TextField
        label="Enter Password"
        type="password"
        size="small"
        fullWidth
        value={modifyDetailsFormData.password || ''}
        onChange={handleModifyDetailsInputChange('password')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* Confirm Password */}
      <TextField
        label="Confirm Password"
        type="password"
        size="small"
        fullWidth
        value={modifyDetailsFormData.confirmPassword || ''}
        onChange={handleModifyDetailsInputChange('confirmPassword')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* Allow Mobile Access Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={!!modifyDetailsFormData.allowMobile}
          onChange={(e) =>
            setModifyDetailsFormData(prev => ({
              ...prev,
              allowMobile: e.target.checked,
            }))
          }
          size="small"
          
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
        />
        <Typography sx={{ fontSize: '0.75rem', ml: 0.5 }}>
  User Allow Mobile Access ?
</Typography>
</Box>

      {/* Mobile Device ID */}
      <TextField
        label="Mobile Device ID"
        size="small"
        fullWidth
        value={modifyDetailsFormData.mobileDeviceId || ''}
        onChange={handleModifyDetailsInputChange('mobileDeviceId')}
        
      InputProps={{ sx: { fontSize: '0.75rem' } }}
      InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      


      {/* Access Roles */}
      <TextField
        label="Access Roles (*)"
        size="small"
        fullWidth
        value={modifyDetailsFormData.accessRoles}
        onChange={handleModifyDetailsInputChange('accessRoles')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* Teams */}
      <TextField
        label="Teams (*)"
        size="small"
        fullWidth
        value={modifyDetailsFormData.teams}
        onChange={handleModifyDetailsInputChange('teams')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* Primary Team */}
      <TextField
        label="Primary Team"
        size="small"
        fullWidth
        value={modifyDetailsFormData.primaryTeam}
        onChange={handleModifyDetailsInputChange('primaryTeam')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />

      {/* IP Addresses Allowed */}
      <TextField
        label="IP Addresses Allowed"
        size="small"
        fullWidth
        value={modifyDetailsFormData.ipAddresses || ''}
        onChange={handleModifyDetailsInputChange('ipAddresses')}
  InputProps={{ sx: { fontSize: '0.75rem' } }}
  InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
      />
    </Box>
  </LocalizationProvider>
</DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      variant="contained"
      onClick={() => {
        setUserDialogOpen(false);
        openModifyDetailsDialog();
      }}
      size="small"
       sx={{
    bgcolor: darkBlue,
    color: '#fff',
    fontSize: '0.65rem',
    padding: '3px 8px',
    minWidth: 50,
    height: 24,
  }}
    >
      Modify
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
}