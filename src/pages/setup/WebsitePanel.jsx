import React, { useState } from 'react';

export default function WebsitePanel() {
  const [search, setSearch] = useState("");
  const [panels, setPanels] = useState([
    { panelName: "Home Banner", panelType: "Home", section: "Top", description: "Main page banner", developer: "Team A", status: "Active" },
    { panelName: "Footer Links", panelType: "Footer", section: "Bottom", description: "Contact links", developer: "Team B", status: "Inactive" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [formData, setFormData] = useState({
    panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active"
  });

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      const updated = [...panels];
      updated[editingIndex] = formData;
      setPanels(updated);
    } else {
      setPanels([...panels, formData]);
    }

    setShowForm(false);
    setIsEditMode(false);
    setFormData({ panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active" });
    setEditingIndex(null);
  };

  const handleEdit = () => {
    if (selectedIndex !== null) {
      setFormData(panels[selectedIndex]);
      setIsEditMode(true);
      setEditingIndex(selectedIndex);
      setShowForm(true);
    }
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const updated = panels.filter((_, idx) => idx !== selectedIndex);
      setPanels(updated);
      setSelectedIndex(null);
    }
  };

  const filtered = panels.filter(item =>
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
      <h2>Website Panels</h2>

      {/* Search Bar */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by any field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '8px' }}
        />
        <button style={blueBtn}>Search</button>
        <button style={{ ...outlineBtn, marginLeft: '5px' }}>Save</button>
        <button style={{ ...outlineBtn, marginLeft: '5px' }}>Reset</button>
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button style={blueBtn} onClick={() => {
          setShowForm(true);
          setIsEditMode(false);
          setFormData({ panelName: "", panelType: "", section: "", description: "", developer: "", status: "Active" });
        }}>+ Create</button>
        <button style={{ ...blueBtn, marginLeft: '5px' }} onClick={handleEdit}>Modify</button>
        <button style={{ ...blueBtn, marginLeft: '5px' }}>Batch Update</button>
        <button style={{ ...dangerBtn, marginLeft: '5px' }} onClick={handleDelete}>Delete</button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div style={{
          border: '1px solid #ccc', padding: '15px', marginBottom: '20px',
          borderRadius: '6px', backgroundColor: '#f9f9f9'
        }}>
          <h4>{isEditMode ? "Edit Panel" : "Add New Panel"}</h4>
          {["panelName", "panelType", "section", "description", "developer"].map(field => (
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
            <th>Panel Name</th>
            <th>Panel Type</th>
            <th>Section</th>
            <th>Description</th>
            <th>Developer</th>
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
              <td>{item.panelName}</td>
              <td>{item.panelType}</td>
              <td>{item.section}</td>
              <td>{item.description}</td>
              <td>{item.developer}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
