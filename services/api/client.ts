/**
 * API CLIENT - Axios instance với interceptors
 * 
 * Centralized API client để:
 * - Tái sử dụng cấu hình
 * - Dễ mock cho testing
 * - Consistent error handling
 */

import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Base URL từ environment
const BASE_URL = __DEV__
    ? 'http://192.168.1.10:3000/api'  // ⚠️ Thay IP của bạn
    : process.env.EXPO_PUBLIC_API_URL;

/**
 * Main API client
 * Dùng cho tất cả API calls
 */
export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,                     // 30s timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Setup interceptors
setupInterceptors(apiClient);

/**
 * Upload client - riêng cho upload files
 * Timeout dài hơn, multipart/form-data
 */
export const uploadClient = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,                    // 2 phút cho upload
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Setup interceptors cho upload client
setupInterceptors(uploadClient);

export default apiClient;
