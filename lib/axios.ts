import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

// Lấy base URL từ biến môi trường, với giá trị mặc định cho local development
const baseURL = 'http://192.168.1.4:3000';

const axiosClient = axios.create({
  baseURL: baseURL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosClient.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const queryString = config.params
    ? `?${new URLSearchParams(config.params).toString()}`
    : '';

  console.log('URL:', `${config.baseURL}${config.url}${queryString}`);

  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('🔴 Network Error:', error.message);
      // Tạo một lỗi mới với thông báo thân thiện hơn
      const networkError = new Error(
        'Lỗi kết nối mạng. Vui lòng kiểm tra lại.'
      );
      return Promise.reject(networkError);
    }

    console.error(
      '⚠️ Error in response:',
      error.response?.data || error.message
    );
    return Promise.reject(error);

  }
);

export default axiosClient;
