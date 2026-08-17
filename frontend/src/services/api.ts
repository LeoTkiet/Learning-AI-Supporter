import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
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
