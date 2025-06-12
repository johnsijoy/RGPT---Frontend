import { useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const useApi = () => {
  const { currentUser } = useContext(AuthContext);

  const get = async (url, config = {}) => {
    try {
      const response = await api.get(url, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${currentUser?.token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const post = async (url, data, config = {}) => {
    try {
      const response = await api.post(url, data, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${currentUser?.token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const put = async (url, data, config = {}) => {
    try {
      const response = await api.put(url, data, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${currentUser?.token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const del = async (url, config = {}) => {
    try {
      const response = await api.delete(url, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${currentUser?.token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { get, post, put, delete: del };
};

export default useApi;