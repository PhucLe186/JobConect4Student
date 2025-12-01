import api from '~/Lib/Axios';

export const AdminAPI = {
  // Admin Authentication
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Job Management
  getAllJobs: async () => {
    const response = await api.get('/admin/jobs');
    return response.data;
  },

  // Forum Management
  getAllForumPosts: async () => {
    const response = await api.get('/admin/forum');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },
};