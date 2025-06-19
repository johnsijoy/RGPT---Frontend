import React, { useState } from 'react';
import {
  Box,
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
  InputAdornment,
  IconButton,
  Typography,
  Checkbox,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const WebsiteCitiesList = () => {
  const [search, setSearch] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(0);
  const [checkedCityId, setCheckedCityId] = useState(null);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const mockData = [
    { id: 1, name: 'Chennai', masterCity: 'Chennai Central', state: 'Tamil Nadu', country: 'India' },
    { id: 2, name: 'Bangalore', masterCity: 'Bangalore Metro', state: 'Karnataka', country: 'India' },
    { id: 3, name: 'Mumbai', masterCity: 'Greater Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 4, name: 'Coimbatore', masterCity: 'Coimbatore Central', state: 'Tamil Nadu', country: 'India' },
    { id: 5, name: 'Hyderabad', masterCity: 'Hyderabad Metro', state: 'Telangana', country: 'India' },
    { id: 6, name: 'Madurai', masterCity: 'Madurai City', state: 'Tamil Nadu', country: 'India' },
    { id: 7, name: 'Delhi', masterCity: 'New Delhi', state: 'Delhi', country: 'India' },
  ];

  const filteredCities = mockData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCities = filteredCities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCreateClick = () => {
    localStorage.removeItem('cityToEdit');
    navigate('/setup/website-cities/new');
  };

  const handleModifyClick = () => {
    const city = mockData.find((city) => city.id === checkedCityId);
    if (city) {
      localStorage.setItem('cityToEdit', JSON.stringify(city));
      navigate('/setup/website-cities/new');
    } else {
      alert('Please select a city to modify.');
    }
  };

  const handleCheckboxChange = (cityId) => {
    setCheckedCityId(cityId === checkedCityId ? null : cityId);
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Filter Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, backgroundColor: 'white' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select a Query</MenuItem>
            <MenuItem value="Metro">Metro Cities</MenuItem>
            <MenuItem value="South">South India</MenuItem>
          </Select>
        </FormControl>

        <button className="btn-blue">SEARCH</button>
      </Box>

      {/* Actions Row */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <span className="action-blue" onClick={handleCreateClick}>+ CREATE</span>
        <span className="action-grey" onClick={handleModifyClick}>MODIFY</span>
        <span className="action-grey">DELETE</span>
      </Box>

      {/* Heading */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Website Cities
      </Typography>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Paper variant="outlined" sx={{ width: '100%', minWidth: '1000px' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell>Website City Name</TableCell>
                <TableCell>Master City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCities.length > 0 ? (
                paginatedCities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={checkedCityId === city.id}
                        onChange={() => handleCheckboxChange(city.id)}
                      />
                    </TableCell>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.masterCity}</TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell>{city.country}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCities.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </Paper>
      </Box>

      {/* Styles */}
      <style>{`
        .btn-blue {
          background-color:rgb(0, 128, 255);
          color: white;
          border: none;
          padding: 6px 20px;
          font-size: 13px;
          border-radius: 3px;
          cursor: pointer;
        }

        .action-blue {
          color:rgb(0, 128, 255);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .action-grey {
          color: grey;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </Box>
  );
};

export default WebsiteCitiesList;
