import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockDetails = {
  1: {
    name: 'Chennai',
    masterCity: 'Chennai Central',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: '13.0827',
    longitude: '80.2707',
  },
  // You can add more mock details if needed
};

const WebsiteCitiesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = mockDetails[id];

  if (!data) {
    return <div className="p-6 text-red-600">City not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">City Details</h2>
      <div className="space-y-3 text-gray-800 text-sm">
        <p><strong>Website City Name:</strong> {data.name}</p>
        <p><strong>Master City:</strong> {data.masterCity}</p>
        <p><strong>State:</strong> {data.state}</p>
        <p><strong>Country:</strong> {data.country}</p>
        <p><strong>Latitude:</strong> {data.latitude}</p>
        <p><strong>Longitude:</strong> {data.longitude}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/setup/website-cities')}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default WebsiteCitiesDetails;
