import React, { useState } from 'react';
import { slabRateMockData } from '../../../mock/slabrate';
import SlabRateForm from './SlabRateForm';
import SlabRateList from './SlabRateList';
import { Dialog, DialogContent } from '@mui/material';

export default function SlabRateDetails() {
  const [dataList, setDataList] = useState(slabRateMockData);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleCreate = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleDelete = (idToDelete) => {
    setDataList((prev) => prev.filter(item => item.id !== idToDelete));
  };

  const handleEdit = (data) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = (formData) => {
    if (editData && editData.id) {
      setDataList((prev) =>
        prev.map((item) => (item.id === editData.id ? { ...item, ...formData } : item))
      );
    } else {
      const newId = dataList.length ? Math.max(...dataList.map((d) => d.id)) + 1 : 1;
      setDataList((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowForm(false);
  };

  return (
    <>
      <SlabRateList
        data={dataList}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={showForm} onClose={handleCancel} maxWidth="md" fullWidth>
        
        <DialogContent dividers>
          <SlabRateForm
            initialData={editData || {}}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        </DialogContent>
       
      </Dialog>
    </>
  );
}
