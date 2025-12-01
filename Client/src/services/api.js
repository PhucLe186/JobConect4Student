const API_BASE_URL = 'http://localhost:5000';

// Helper function để lấy token
const getToken = () => localStorage.getItem('token');

// Helper function để tạo headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Student APIs
export const studentAPI = {
  getProfile: () => fetch(`${API_BASE_URL}/student`, { headers: getHeaders() }).then(handleResponse),
  getFullProfile: () => fetch(`${API_BASE_URL}/student/profile`, { headers: getHeaders() }).then(handleResponse),
  updateProfile: (data) => fetch(`${API_BASE_URL}/student`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
};

// Employer APIs
export const employerAPI = {
  getProfile: () => fetch(`${API_BASE_URL}/employer/me`, { headers: getHeaders() }).then(handleResponse),
  getFullProfile: () => fetch(`${API_BASE_URL}/employer/profile`, { headers: getHeaders() }).then(handleResponse),
  createCompany: (data) => fetch(`${API_BASE_URL}/employer`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getHeaders() }).then(handleResponse),
  getForumStats: () => fetch(`${API_BASE_URL}/dashboard/forum`, { headers: getHeaders() }).then(handleResponse),
  
  // User Management
  getAllUsers: () => fetch(`${API_BASE_URL}/dashboard/users`, { headers: getHeaders() }).then(handleResponse),
  getUserById: (id) => fetch(`${API_BASE_URL}/dashboard/users/${id}`, { headers: getHeaders() }).then(handleResponse),
  updateUser: (id, data) => fetch(`${API_BASE_URL}/dashboard/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteUser: (id) => fetch(`${API_BASE_URL}/dashboard/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),

  // Job Management
  getAllJobs: () => fetch(`${API_BASE_URL}/dashboard/jobs`, { headers: getHeaders() }).then(handleResponse),
  getJobById: (id) => fetch(`${API_BASE_URL}/dashboard/jobs/${id}`, { headers: getHeaders() }).then(handleResponse),
  updateJob: (id, data) => fetch(`${API_BASE_URL}/dashboard/jobs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteJob: (id) => fetch(`${API_BASE_URL}/dashboard/jobs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
  getPendingJobs: () => fetch(`${API_BASE_URL}/dashboard/jobs/pending`, { headers: getHeaders() }).then(handleResponse),
  approveJob: (id) => fetch(`${API_BASE_URL}/dashboard/jobs/${id}/approve`, {
    method: 'PUT',
    headers: getHeaders(),
  }).then(handleResponse),
  rejectJob: (id) => fetch(`${API_BASE_URL}/dashboard/jobs/${id}/reject`, {
    method: 'PUT',
    headers: getHeaders(),
  }).then(handleResponse),
};

// Resume APIs
export const resumeAPI = {
  createResume: (data) => fetch(`${API_BASE_URL}/resume`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  getMyResumes: () => fetch(`${API_BASE_URL}/resume`, { headers: getHeaders() }).then(handleResponse),
  getResumeById: (id) => fetch(`${API_BASE_URL}/resume/${id}`, { headers: getHeaders() }).then(handleResponse),
  updateResume: (id, data) => fetch(`${API_BASE_URL}/resume/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteResume: (id) => fetch(`${API_BASE_URL}/resume/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
  getPublicResume: (id) => fetch(`${API_BASE_URL}/resume/public/${id}`).then(handleResponse),
};

// Applications APIs
export const applicationAPI = {
  applyJob: (jobId) => fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ id: jobId }),
  }).then(handleResponse),
};

// Jobs APIs
export const jobsAPI = {
  getAllJobs: () => fetch(`${API_BASE_URL}/jobs`, { headers: getHeaders() }).then(handleResponse),
  getJobById: (id) => fetch(`${API_BASE_URL}/jobs/${id}`, { headers: getHeaders() }).then(handleResponse),
  createJob: (data) => fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateJob: (id, data) => fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteJob: (id) => fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

// Skills APIs
export const skillsAPI = {
  getAllSkills: () => fetch(`${API_BASE_URL}/skills`, { headers: getHeaders() }).then(handleResponse),
  createSkill: (data) => fetch(`${API_BASE_URL}/skills`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
};

// Forum APIs
export const forumAPI = {
  getAllPosts: () => fetch(`${API_BASE_URL}/forum`, { headers: getHeaders() }).then(handleResponse),
  getPostById: (id) => fetch(`${API_BASE_URL}/forum/${id}`, { headers: getHeaders() }).then(handleResponse),
  createPost: (data) => fetch(`${API_BASE_URL}/forum`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  updatePost: (id, data) => fetch(`${API_BASE_URL}/forum/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deletePost: (id) => fetch(`${API_BASE_URL}/forum/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

// Comments APIs
export const commentAPI = {
  getComments: (postId) => fetch(`${API_BASE_URL}/comments/${postId}`, { headers: getHeaders() }).then(handleResponse),
  createComment: (data) => fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateComment: (id, data) => fetch(`${API_BASE_URL}/comments/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteComment: (id) => fetch(`${API_BASE_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

// Likes APIs
export const likesAPI = {
  likePost: (postId) => fetch(`${API_BASE_URL}/likes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ postId }),
  }).then(handleResponse),
  unlikePost: (postId) => fetch(`${API_BASE_URL}/likes/${postId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

const apiService = {
  authAPI,
  studentAPI,
  employerAPI,
  dashboardAPI,
  resumeAPI,
  applicationAPI,
  jobsAPI,
  skillsAPI,
  forumAPI,
  commentAPI,
  likesAPI,
};

export default apiService;