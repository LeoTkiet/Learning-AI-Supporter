import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach Bearer token from localStorage if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const apiService = {
  // Authentication & Users
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: { email: string; password: string; full_name?: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_profile');
    }
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Lớp 1: Quizzes
  getQuiz: async (subjectId: string) => {
    const response = await apiClient.get(`/quizzes/${subjectId}`);
    return response.data;
  },

  submitQuiz: async (data: any) => {
    const response = await apiClient.post('/quizzes/submit', data);
    return response.data;
  },

  // Lớp 2: Upload File & OCR
  uploadHandwriting: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/ocr/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Lớp 3: AI Diagnosis
  analyzeSolution: async (data: { questionId: string; ocrText: string; subject: string }) => {
    const response = await apiClient.post('/ai/analyze', data);
    return response.data;
  },

  // Gamification
  getLeaderboard: async () => {
    const response = await apiClient.get('/gamification/leaderboard');
    return response.data;
  },
};

export default apiService;
