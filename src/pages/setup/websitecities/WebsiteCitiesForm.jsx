import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Select,
  FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WebsiteCitiesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    masterCity: '',
    state: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const editData = localStorage.getItem('cityToEdit');
    if (editData) {
      setFormData(JSON.parse(editData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    localStorage.removeItem('cityToEdit');
    navigate('/setup/website-cities');
  };

  const handleClear = () => {
    navigate('/setup/website-cities');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f7f9fb', minHeight: '100vh' }}>
     

      {/* Form Title */}
      <Typography
        variant="h6"
        style={{
          fontWeight: 'bold',
          borderBottom: '1px solid #ccc',
          marginBottom: '30px'
        }}
      >
        General Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', maxWidth: '700px', borderSpacing: '20px 15px' }}>
          <tbody>
            <tr>
              <td style={{ width: '200px' }}>
                <label><b>State</b> <span style={{ color: 'red' }}>*</span></label>
              </td>
              <td>
                <FormControl fullWidth required size="small">
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Type to select</MenuItem>
                    <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                    <MenuItem value="Karnataka">Karnataka</MenuItem>
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  </Select>
                </FormControl>
              </td>
            </tr>

            <tr>
              <td>
                <label><b>Master City</b> <span style={{ color: 'red' }}>*</span></label>
              </td>
              <td>
                <FormControl fullWidth required size="small">
                  <Select
                    name="masterCity"
                    value={formData.masterCity}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Type to select</MenuItem>
                    <MenuItem value="Chennai Central">Chennai Central</MenuItem>
                    <MenuItem value="Bangalore Metro">Bangalore Metro</MenuItem>
                    <MenuItem value="Greater Mumbai">Greater Mumbai</MenuItem>
                  </Select>
                </FormControl>
              </td>
            </tr>

            <tr>
              <td>
                <label><b>Website City Name</b> <span style={{ color: 'red' }}>*</span></label>
              </td>
              <td>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                />
              </td>
            </tr>

            <tr>
              <td>
                <label><b>Latitude</b></label>
              </td>
              <td>
                <TextField
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </td>
            </tr>

            <tr>
              <td>
                <label><b>Longitude</b></label>
              </td>
              <td>
                <TextField
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Buttons */}
        <div style={{ marginTop: '30px' }}>
          <Button
  type="submit"
  variant="contained"
  style={{
    backgroundColor: '#122E3E', // same as Create button
    color: '#fff',
    marginRight: '10px',
    textTransform: 'none'
  }}
>
  ✔ Submit
</Button>

          <Button
            variant="contained"
            onClick={handleClear}
            style={{
              backgroundColor: '#c0c0c0',
              textTransform: 'none'
            }}
          >
            ✖ Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteCitiesForm;
