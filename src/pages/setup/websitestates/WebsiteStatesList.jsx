import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Checkbox,
  FormControl,
  Typography,
  InputLabel,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';


const WebsiteStatesList = () => {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchNameOperator, setSearchNameOperator] = useState('Contains');
  const [searchName, setSearchName] = useState('');
  const [countryOperator, setCountryOperator] = useState('Is one of');
  const [countryValue, setCountryValue] = useState('');
  const [page, setPage] = useState(0);
  const [checkedStateId, setCheckedStateId] = useState(null);
   const [filterQuery, setFilterQuery] = useState('');
  const [query, setQuery] = useState('All States');
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const queryOptions = ['Active States', 'Inactive States', 'All States'];

  const mockData = [
  { id: 1, name: 'Tamil Nadu', masterState: 'Tamil Nadu', country: 'India' },
  { id: 2, name: 'California', masterState: 'California', country: 'USA' },
  { id: 3, name: 'New South Wales', masterState: 'NSW', country: 'Australia' },
  { id: 4, name: 'Texas', masterState: 'Texas', country: 'USA' },
  { id: 5, name: 'Maharashtra', masterState: 'Maharashtra', country: 'India' },
  { id: 6, name: 'New York', masterState: 'New York', country: 'USA' },
  { id: 7, name: 'Kerala', masterState: 'Kerala', country: 'India' },

];


  const handleCreateClick = () => {
    localStorage.removeItem('stateToEdit');
    navigate('/setup/website-states/new');
  };

  const handleModifyClick = () => {
    const state = mockData.find((s) => s.id === checkedStateId);
    if (state) {
      localStorage.setItem('stateToEdit', JSON.stringify(state));
      navigate('/setup/website-states/new');
    } else {
      alert('Please select a state to modify.');
    }
  };

  const handleDeleteClick = () => {
    const state = mockData.find((s) => s.id === checkedStateId);
    if (state) {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${state.name}?`);
      if (confirmDelete) {
        alert(`Deleted ${state.name}`);
      }
    } else {
      alert('Please select a state to delete.');
    }
  };

  const filterByName = (state) => {
    const name = state.name.toLowerCase();
    const value = searchName.toLowerCase();
    switch (searchNameOperator) {
      case 'Contains': return name.includes(value);
      case 'Does not contain': return !name.includes(value);
      case 'Equals': return name === value;
      case 'Does not Equal': return name !== value;
      case 'Is Empty': return !state.name.trim();
      case 'Is not Empty': return !!state.name.trim();
      default: return true;
    }
  };

  const filterByCountry = (state) => {
    const value = countryValue.trim();
    switch (countryOperator) {
      case 'Is one of': return value ? value.split(',').map(v => v.trim().toLowerCase()).includes(state.country.toLowerCase()) : true;
      case 'Is not one of': return value ? !value.split(',').map(v => v.trim().toLowerCase()).includes(state.country.toLowerCase()) : true;
      case 'Is Empty': return !state.country.trim();
      case 'Is Not Empty': return !!state.country.trim();
      default: return true;
    }
  };

  const filteredStates = mockData.filter((state) => filterByName(state) && filterByCountry(state));
  const paginatedStates = filteredStates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCheckboxChange = (stateId) => {
    setCheckedStateId(stateId === checkedStateId ? null : stateId);
  };

  const handleSearchClick = () => {
    setShowAdvancedFilter((prev) => !prev);
  };

  const handleReset = () => {
    setSearchName('');
    setCountryValue('');
    setSearchNameOperator('Contains');
    setCountryOperator('Is one of');
  };

  const handleSave = () => {
    alert('Search criteria saved.');
  };

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Select a Query</InputLabel>
          <Select
            label="Select a Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minWidth: 200, backgroundColor: '#f0f0f0', color: 'grey' }}
          >
            {queryOptions.map((option, idx) => (
              <MenuItem key={idx} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <button className="btn-blue" onClick={handleSearchClick}>SEARCH</button>
      </div>

      {showAdvancedFilter && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <Typography sx={{ width: 160 }}>Website State Name</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select value={searchNameOperator} onChange={(e) => setSearchNameOperator(e.target.value)}>
                <MenuItem value="Contains">Contains</MenuItem>
                <MenuItem value="Does not contain">Does not contain</MenuItem>
                <MenuItem value="Equals">Equals</MenuItem>
                <MenuItem value="Does not Equal">Does not Equal</MenuItem>
                <MenuItem value="Is Empty">Is Empty</MenuItem>
                <MenuItem value="Is not Empty">Is not Empty</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <Typography sx={{ width: 160 }}>Country</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select value={countryOperator} onChange={(e) => setCountryOperator(e.target.value)}>
                <MenuItem value="Is one of">Is one of</MenuItem>
                <MenuItem value="Is not one of">Is not one of</MenuItem>
                <MenuItem value="Is Empty">Is Empty</MenuItem>
                <MenuItem value="Is Not Empty">Is Not Empty</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" value={countryValue} onChange={(e) => setCountryValue(e.target.value)} placeholder="e.g. India, USA" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn-blue" onClick={handleSearchClick}>SEARCH</button>
            <button className="btn-grey-outline" onClick={handleSave}>SAVE</button>
            <button className="btn-grey-outline" onClick={handleReset}>RESET</button>
          </div>
        </Paper>
      )}

      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <span className="btn-blue-text" onClick={handleCreateClick}>+ CREATE</span>
        <span className="btn-grey-text" onClick={handleModifyClick}>MODIFY</span>
        <span className="btn-grey-text" onClick={handleDeleteClick}>DELETE</span>
      </div>
      
      <Box sx={{ overflowX: 'auto' }}>
      <Paper variant="outlined" sx={{ width: '100%', minWidth: '1000px' }}>
        <Table size="Small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                Website State Name <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                Master State <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                Country <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStates.length > 0 ? (
              paginatedStates.map((state) => (
                <TableRow key={state.id}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={checkedStateId === state.id} onChange={() => handleCheckboxChange(state.id)} />
                  </TableCell>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.masterState}</TableCell>
                  <TableCell>{state.country}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No Records Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredStates.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Paper>
      </Box>
      <style>{`
        .btn-blue {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 6px 18px;
          font-size: 13px;
          border-radius: 3px;
          cursor: pointer;
        }

        .btn-blue-text {
          color: #007bff;
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-grey-text {
          color: grey;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-grey-outline {
          background: none;
          border: 1px solid grey;
          padding: 6px 14px;
          font-size: 13px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default WebsiteStatesList;
