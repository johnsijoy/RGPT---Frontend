import React, { useState } from 'react';
import SlabRateForm from './SlabRateForm';
import SlabRateList from './SlabRateList';

const initialData = [
  {
    id: 1,
    type: 'Residential',
    slabStart: 100,
    slabEnd: 200,
    percent: 5,
    amount: 1000,
    from: '2024-01-01',
    to: '2024-12-31',
    project: 'Project A',
    bucket: 'A1',
    formula: 'A + B',
  },
  {
    id: 2,
    type: 'Commercial',
    slabStart: 201,
    slabEnd: 300,
    percent: 7.5,
    amount: 2000,
    from: '2024-02-01',
    to: '2024-11-30',
    project: 'Project B',
    bucket: 'B1',
    formula: 'C - D',
  },
  {
    id: 3,
    type: 'Industrial',
    slabStart: 301,
    slabEnd: 500,
    percent: 10,
    amount: 5000,
    from: '2024-03-15',
    to: '2024-10-15',
    project: 'Project C',
    bucket: 'C1',
    formula: 'E * F',
  },
];

export default function SlabRateDetails() {
  const [dataList, setDataList] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Open form for create
  const handleCreate = () => {
    setEditData(null);
    setShowForm(true);
  };

  // Delete item by id
  const handleDelete = (idToDelete) => {
    setDataList((prev) => prev.filter(item => item.id !== idToDelete));
  };

  // Open form for edit
  const handleEdit = (data) => {
    setEditData(data);
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
  };

  // Save form data (create or update)
  const handleSubmit = (formData) => {
    if (editData && editData.id) {
      // Update existing
      setDataList((prev) =>
        prev.map((item) => (item.id === editData.id ? { ...item, ...formData } : item))
      );
    } else {
      // Create new with next id
      const newId = dataList.length ? Math.max(...dataList.map((d) => d.id)) + 1 : 1;
      setDataList((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowForm(false);
  };

  return (
    <>
      {showForm ? (
        <SlabRateForm
          initialData={editData || {}}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          onDelete={handleDelete} // Optional, keep if your form uses it
        />
      ) : (
        <SlabRateList data={dataList} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </>
  );
}
