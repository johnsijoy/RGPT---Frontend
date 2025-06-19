// src/pages/setup/websitestates/WebsiteStatesDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WebsiteStatesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const mockState = {
    id,
    name: 'Tamil Nadu',
    masterState: 'Tamil Nadu',
    country: 'India',
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Website State Details</h2>
      <div className="space-y-2">
        <p><strong>State Name:</strong> {mockState.name}</p>
        <p><strong>Master State:</strong> {mockState.masterState}</p>
        <p><strong>Country:</strong> {mockState.country}</p>
      </div>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default WebsiteStatesDetails;
