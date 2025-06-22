import React, { useState } from 'react';
import WebsiteAreasList from './WebsiteAreasList';
import WebsiteAreasForm from './WebsiteAreasForm';
import { Dialog,  DialogContent } from '@mui/material';

const initialData = [
  { id: 1, masterArea: 'Zone A', name: 'North Zone', city: 'Chennai', latitude: '13.0827', longitude: '80.2707' },
  { id: 2, masterArea: 'Zone B', name: 'South Zone', city: 'Bangalore', latitude: '12.9716', longitude: '77.5946' },
  { id: 3, masterArea: 'Zone C', name: 'East Zone', city: 'Kolkata', latitude: '22.5726', longitude: '88.3639' },
];

export default function WebsiteAreasDetails() {
  const [dataList, setDataList] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const handleCreate = () => {
    setEditData(null);
    setShowForm(true);
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
      const newId = dataList.length ? Math.max(...dataList.map(d => d.id)) + 1 : 1;
      setDataList((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowForm(false);
  };

  const handleDelete = (idToDelete) => {
    setDataList((prev) => prev.filter(item => item.id !== idToDelete));
  };

  return (
    <>
      <WebsiteAreasList
        data={dataList}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={showForm} onClose={handleCancel} maxWidth="sm" fullWidth>
        
        <DialogContent dividers>
          <WebsiteAreasForm
            initialData={editData || {}}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
