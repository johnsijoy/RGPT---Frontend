import React, { useState } from 'react';

export default function Organisation() {
  const [search, setSearch] = useState("");
  const [organisations, setOrganisations] = useState([
    { name: "Tech Orbit", type: "Corporate", industry: "IT", description: "Software company", createdBy: "Admin", status: "Active" },
    { name: "Green Earth NGO", type: "NGO", industry: "Environment", description: "Climate advocacy", createdBy: "User1", status: "Active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active'
  });

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      const updated = [...organisations];
      updated[editingIndex] = formData;
      setOrganisations(updated);
    } else {
      setOrganisations([...organisations, formData]);
    }

    setShowForm(false);
    setFormData({ name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active' });
    setIsEditMode(false);
    setEditingIndex(null);
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const updated = organisations.filter((_, idx) => idx !== selectedIndex);
      setOrganisations(updated);
      setSelectedIndex(null);
    }
  };

  const handleEdit = () => {
    if (selectedIndex !== null) {
      setFormData(organisations[selectedIndex]);
      setIsEditMode(true);
      setEditingIndex(selectedIndex);
      setShowForm(true);
    }
  };

  const filtered = organisations.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Button Styles
  const blueBtn = {
    backgroundColor: '#007bff', color: 'white', border: 'none',
    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'
  };

  const outlineBtn = {
    ...blueBtn, backgroundColor: 'white', color: '#007bff',
    border: '1px solid #007bff'
  };

  const dangerBtn = {
    backgroundColor: '#dc3545', color: 'white', border: 'none',
    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Organisations</h2>

      {/* Search */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '8px' }}
        />
        <button style={blueBtn}>Search</button>
        <button style={{ ...outlineBtn, marginLeft: '5px' }}>Save</button>
        <button style={{ ...outlineBtn, marginLeft: '5px' }}>Reset</button>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button style={blueBtn} onClick={() => {
          setShowForm(true); setIsEditMode(false); setFormData({
            name: '', type: '', industry: '', description: '', createdBy: '', status: 'Active'
          });
        }}>+ Create</button>
        <button style={{ ...blueBtn, marginLeft: '5px' }} onClick={handleEdit}>Modify</button>
        <button style={{ ...blueBtn, marginLeft: '5px' }}>Batch Update</button>
        <button style={{ ...dangerBtn, marginLeft: '5px' }} onClick={handleDelete}>Delete</button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          border: '1px solid #ccc', padding: '15px', marginBottom: '20px',
          borderRadius: '6px', backgroundColor: '#f9f9f9'
        }}>
          <h4>{isEditMode ? "Edit Organisation" : "Add Organisation"}</h4>
          {["name", "type", "industry", "description", "createdBy"].map(field => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
              style={{ margin: '4px', padding: '5px' }}
            />
          ))}
          <br />
          <button style={{ ...blueBtn, marginTop: '8px' }} onClick={handleAddOrUpdate}>
            {isEditMode ? "Update" : "Add"}
          </button>
          <button style={{ ...outlineBtn, marginLeft: '8px', marginTop: '8px' }} onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f3f3' }}>
            <th>#</th>
            <th>Organisation Name</th>
            <th>Type</th>
            <th>Industry</th>
            <th>Description</th>
            <th>Created By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, idx) => (
            <tr
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                backgroundColor: selectedIndex === idx ? "#d0ebff" : "white",
                cursor: "pointer"
              }}
            >
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.industry}</td>
              <td>{item.description}</td>
              <td>{item.createdBy}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
