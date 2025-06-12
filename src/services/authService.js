import api from './api';
import mockApi from './mockApi';

const useMock = process.env.REACT_APP_USE_MOCK_API === 'true';

export const authService = {
  login: async (email, password) => {
    if (useMock) {
      return mockApi.post('/login', { email, password }).then((res) => {
        return { 
          id: 1, 
          name: 'Admin User', 
          email, 
          token: 'mock-token', 
          avatar: 'https://i.pravatar.cc/150?img=3' 
        };
      });
    }
    
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  logout: () => {
    // Clear token from storage
    localStorage.removeItem('token');
  },
};