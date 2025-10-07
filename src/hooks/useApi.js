import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const useApi = () => {
  const { user, logout } = useAuth();

  const getToken = () => localStorage.getItem("access");

  const withAuthHeaders = (config = {}) => {
    const token = getToken();
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
  };

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out.");
      logout();
    }
  };

  const get = async (url, config = {}) => {
    try { return await api.get(url, withAuthHeaders(config)); }
    catch (error) { handleAuthError(error); throw error; }
  };
  const post = async (url, data, config = {}) => {
    try { return await api.post(url, data, withAuthHeaders(config)); }
    catch (error) { handleAuthError(error); throw error; }
  };
  const put = async (url, data, config = {}) => {
    try { return await api.put(url, data, withAuthHeaders(config)); }
    catch (error) { handleAuthError(error); throw error; }
  };
  const del = async (url, config = {}) => {
    try { return await api.delete(url, withAuthHeaders(config)); }
    catch (error) { handleAuthError(error); throw error; }
  };

  // -------------------
  // ✅ Real Estate API
  // -------------------

  const getProjects = (params) => get("/projects/", { params });
  const createProject = (data) => post("/projects/", data);
  const updateProject = (id, data) => put(`/projects/${id}/`, data);
  const deleteProject = (id) => del(`/projects/${id}/`);

  const getBlocks = (params) => get("/blocks/", { params });
  const createBlock = (data) => post("/blocks/", data);
  const updateBlock = (id, data) => put(`/blocks/${id}/`, data);
  const deleteBlock = (id) => del(`/blocks/${id}/`);

  const getUnits = (params) => get("/units/", { params });
  const createUnit = (data) => post("/units/", data);
  const updateUnit = (id, data) => put(`/units/${id}/`, data);
  const deleteUnit = (id) => del(`/units/${id}/`);

  const getProjectsGeo = () => get("/geo/projects/");
  const getBlocksGeo = () => get("/geo/blocks/");
  const getUnitsGeo = () => get("/geo/units/");

  const getProjectFilters = () => get("/projects/filters/");
  const getProjectLocations = () => get("/projects/locations/");

  const registerUser = (data) => post("/auth/register/", data);

  return {
    get, post, put, delete: del,
    getProjects, createProject, updateProject, deleteProject,
    getBlocks, createBlock, updateBlock, deleteBlock,
    getUnits, createUnit, updateUnit, deleteUnit,
    getProjectsGeo, getBlocksGeo, getUnitsGeo,
    getProjectFilters, getProjectLocations,
    registerUser,
  };
};

export default useApi;
