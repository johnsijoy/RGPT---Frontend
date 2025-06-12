const mockData = {
    activities: [
      { id: 1, name: 'Meeting', date: '2023-05-01', status: 'Completed' },
      { id: 2, name: 'Call', date: '2023-05-02', status: 'Pending' },
    ],
    leads: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
    ],
    // Add more mock data as needed
  };
  
  const mockApi = {
    get: (url) => {
      const endpoint = url.split('/')[1];
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockData[endpoint] || [] });
        }, 500);
      });
    },
    post: (url, data) => {
      const endpoint = url.split('/')[1];
      return new Promise((resolve) => {
        setTimeout(() => {
          const newItem = { ...data, id: Math.floor(Math.random() * 10000) };
          mockData[endpoint] = [...(mockData[endpoint] || []), newItem];
          resolve({ data: newItem });
        }, 500);
      });
    },
    // Implement other methods as needed
  };
  
  export default mockApi;