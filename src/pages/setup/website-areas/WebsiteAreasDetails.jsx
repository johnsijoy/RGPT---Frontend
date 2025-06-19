import React, { useState } from 'react';
import WebsiteAreasForm from './WebsiteAreasForm';
import WebsiteAreasList from './WebsiteAreasList';

export default function WebsiteAreasDetails() {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (data) => {
    setEditData(data);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditData();
    setFormOpen(true);
  };

  const handleCancel = () => {
    setFormOpen(false);
  };

  return (
    <>
      {formOpen ? (
        <WebsiteAreasForm
          initialData={editData}
          onCancel={handleCancel}
        />
      ) : (
        <WebsiteAreasList onEdit={handleEdit} onCreate={handleCreate} />
      )}
    </>
  );
}
