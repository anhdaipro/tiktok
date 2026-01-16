/**
 * API INTERCEPTORS - Xử lý request/response middleware
 * 
 * Chức năng:
 * 1. Request Interceptor:
 *    - Tự động thêm Authorization token
 *    - Thêm headers chung (Accept-Language, Device-Info, etc.)
 *    - Log requests (development)
 * 
 * 2. Response Interceptor:
 *    - Xử lý lỗi tập trung
 *    - Auto refresh token khi 401
 *    - Transform response data
 *    - Log responses (development)
 */

import { useAuthStore } from '@/stores/auth.store';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as Device from 'expo-device';
import { router } from 'expo-router';

// ============================================
// REQUEST INTERCEPTOR
// ============================================

/**
 * Xử lý trước khi gửi request
 * - Thêm Authorization header
 * - Thêm device info
 * - Log request (dev only)
 */
export const setupRequestInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // 1. Lấy token từ auth store
            const token = useAuthStore.getState().token;

            // 2. Thêm Authorization header nếu có token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // 3. Thêm headers chung
            config.headers['Accept-Language'] = 'vi-VN'; // Ngôn ngữ
            config.headers['X-Device-OS'] = Device.osName || 'unknown';
            config.headers['X-Device-Model'] = Device.modelName || 'unknown';
            config.headers['X-App-Version'] = '1.0.0'; // Từ app.json

            // 4. Log request (chỉ development)
            if (__DEV__) {
                console.log('📤 API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    params: config.params,
                    data: config.data,
                    headers: config.headers,
                });
            }

            return config;
        },
        (error) => {
            // Lỗi khi setup request
            console.error('❌ Request Setup Error:', error);
            return Promise.reject(error);
        }
    );
};

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

/**
 * Xử lý sau khi nhận response
 * - Transform data
 * - Xử lý lỗi
 * - Auto refresh token
 */
export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        // SUCCESS: Status 2xx
        (response) => {
            // Log response (development only)
            if (__DEV__) {
                console.log('📥 API Response:', {
                    url: response.config.url,
                    status: response.status,
                    data: response.data,
                });
            }

            // Transform: Unwrap data nếu API trả về { success: true, data: {...} }
            // Tùy vào format API của bạn
            if (response.data?.data) {
                return {
                    ...response,
                    data: response.data.data, // Unwrap data
                };
            }

            return response;
        },

        // ERROR: Status khác 2xx
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Log error (development)
            if (__DEV__) {
                console.error('❌ API Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                });
            }

            // ========================================
            // CASE 1: 401 Unauthorized - Token hết hạn
            // ========================================
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Đánh dấu đã retry

                try {
                    // Lấy refresh token
                    const refreshToken = useAuthStore.getState().refreshToken;

                    if (!refreshToken) {
                        // Không có refresh token → logout
                        handleLogout();
                        return Promise.reject(error);
                    }

                    // Gọi API refresh token
                    const response = await axios.post('/auth/refresh', {
                        refreshToken,
                    });

                    const newToken = response.data.token;

                    // Lưu token mới vào store
                    useAuthStore.getState().setToken(newToken);

                    // Retry request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    // Refresh token cũng hết hạn → logout
                    console.error('❌ Refresh token failed:', refreshError);
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            }

            // ========================================
            // CASE 2: 403 Forbidden - Không có quyền
            // ========================================
            if (error.response?.status === 403) {
                // Hiển thị thông báo
                alert('Bạn không có quyền truy cập tài nguyên này');
                // Có thể navigate về home
                router.replace('/');
            }

            // ========================================
            // CASE 3: 404 Not Found
            // ========================================
            if (error.response?.status === 404) {
                console.warn('⚠️ Resource not found:', error.config?.url);
                // Có thể show toast hoặc error page
            }

            // ========================================
            // CASE 4: 500 Server Error
            // ========================================
            if (error.response?.status === 500) {
                console.error('🔥 Server Error:', error.response?.data);
                alert('Lỗi server, vui lòng thử lại sau');
            }

            // ========================================
            // CASE 5: Network Error (Không có kết nối)
            // ========================================
            if (error.message === 'Network Error') {
                console.error('📡 No internet connection');
                alert('Không có kết nối mạng. Vui lòng kiểm tra lại.');
            }

            // ========================================
            // CASE 6: Timeout
            // ========================================
            if (error.code === 'ECONNABORTED') {
                console.error('⏱️ Request timeout');
                alert('Yêu cầu quá lâu. Vui lòng thử lại.');
            }

            // Return error để component xử lý tiếp
            return Promise.reject(error);
        }
    );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Logout user và clear storage
 * Navigate về login screen
 */
const handleLogout = () => {
    // Clear auth store
    useAuthStore.getState().logout();

    // Navigate về login
    router.replace('/login');

    // Optional: Show message
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
};

/**
 * Setup tất cả interceptors
 * Gọi hàm này khi khởi tạo API client
 */
export const setupInterceptors = (axiosInstance: AxiosInstance) => {
    setupRequestInterceptor(axiosInstance);
    setupResponseInterceptor(axiosInstance);
};
