import axios from 'axios';

const API_BASE_URL = 'https://ai-coding-interview.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
return Promise.reject(error.response?.data?.message || error.message);  }
);

export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  // register: (userData) => api.post('/auth/register', userData),
  // verifyOtp: (otpData) => api.post('/auth/verify-otp', otpData),
};

export const AdminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data || []; // Ensure array is returned
  },
};

export const interviewAPI = {
  createInterview: (interviewData) => api.post('/interview/new', interviewData),
  getAllInterviews: () => api.get('/interview/get-all'),
  assignInterview: (interviewId, userIds) => api.post(`/interview/assign/${interviewId}`, { userIds }),
  getSubmittedInterviews: () => api.get('/interview/submitted-interviews'),
  selectUser: (userId, interviewId) => api.post(`/interview/select-user/${userId}`, { interviewId }),
};

export const UserService = {
  getAssignedInterviews: () => api.get('/user/interviews'),
  getQuestions: (interviewId) => api.get(`/user/questions/${interviewId}`),
  submitInterview: (interviewId, responses) => api.post(`/user/interview/submit/${interviewId}`, { responses }),
};

export default api;