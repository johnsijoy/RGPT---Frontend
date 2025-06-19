// src/pages/setup/websitestates/WebsiteStatesForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WebsiteStatesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    masterState: '',
    country: '',
  });

  useEffect(() => {
    if (isEdit) {
      const storedState = JSON.parse(localStorage.getItem('stateToEdit'));
      if (storedState) {
        setFormData(storedState);
      }
    }
  }, [isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEdit ? 'Modified successfully!' : 'Created successfully!');
    navigate('/setup/website-states');
  };

  const handleCancel = () => {
    navigate('/setup/website-states');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{isEdit ? 'Modify Website State' : 'Create Website State'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Website State Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="State Name"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Master State</label>
          <input
            type="text"
            name="masterState"
            value={formData.masterState}
            onChange={handleChange}
            placeholder="Master State"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.submitButton }}
          >
            {isEdit ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
  },
};

export default WebsiteStatesForm;
