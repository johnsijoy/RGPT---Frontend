import React, { useState } from 'react';

const VirtualNumber = () => {
  const [formData, setFormData] = useState({ number: '' });
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [queryFilter, setQueryFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form handler
  const handleChange = (e) => {
    setFormData({ ...formData, number: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...dataList];
      updated[editIndex] = formData;
      setDataList(updated);
      setEditIndex(null);
    } else {
      setDataList([...dataList, formData]);
    }
    setFormData({ number: '' });
  };

  const handleEdit = () => {
    if (selectedItems.length !== 1) {
      alert('Please select one row to modify.');
      return;
    }
    setEditIndex(selectedItems[0]);
    setFormData(dataList[selectedItems[0]]);
  };

  const handleDelete = () => {
    const updated = dataList.filter((_, i) => !selectedItems.includes(i));
    setDataList(updated);
    setSelectedItems([]);
  };

  const handleBatchUpdate = () => {
    alert('Batch Update clicked for ' + selectedItems.length + ' row(s)');
  };

  const handleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSort = () => {
    const sorted = [...dataList].sort((a, b) =>
      sortAsc ? a.number.localeCompare(b.number) : b.number.localeCompare(a.number)
    );
    setDataList(sorted);
    setSortAsc(!sortAsc);
  };

  const handleQueryChange = (e) => {
    setQueryFilter(e.target.value);
  };

  const handleSearch = () => {
    if (!queryFilter) return;
    const filtered = dataList.filter((item) => item.number.includes(queryFilter));
    setDataList(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const paginatedData = dataList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* Top Controls */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setEditIndex(null)} style={btn}>Create</button>
        <button onClick={handleEdit} style={btn}>Modify</button>
        <button onClick={handleDelete} style={btn}>Delete</button>
        <button onClick={handleBatchUpdate} style={btn}>Batch Update</button>
        <select onChange={handleQueryChange} value={queryFilter} style={{ marginLeft: '15px', padding: '6px' }}>
          <option value="">Select A Query</option>
          <option value="23">Virtuals starting with 23</option>
          <option value="99">Virtuals starting with 99</option>
        </select>
        <button onClick={handleSearch} style={btnBlue}>Search</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Virtual Number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={btnBlue}>{editIndex !== null ? 'Update' : 'Add'}</button>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th><input type="checkbox" disabled /></th>
            <th onClick={handleSort} style={{ cursor: 'pointer', color: 'blue' }}>
              Virtual Number {sortAsc ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes((currentPage - 1) * itemsPerPage + index)}
                  onChange={() => handleSelect((currentPage - 1) * itemsPerPage + index)}
                />
              </td>
              <td>{item.number}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} style={btnPage}>{'<<'}</button>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={btnPage}>{'<'}</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={btnPage}>{'>'}</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} style={btnPage}>{'>>'}</button>
      </div>
    </div>
  );
};

// CSS styles
const btn = {
  padding: '6px 12px',
  marginRight: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

const btnBlue = {
  ...btn,
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
};

const btnPage = {
  ...btn,
  backgroundColor: '#f4f4f4'
};

export default VirtualNumber;
