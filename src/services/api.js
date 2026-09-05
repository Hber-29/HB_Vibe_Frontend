import axios from 'axios';

// Khởi tạo một instance của axios với URL mặc định là API Gateway
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Quá 10 giây không phản hồi thì báo lỗi kết nối
    withCredentials: false, // CORS - không gửi credentials
});

// Thêm interceptor để handle CORS
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 0 || error.message === 'Network Error') {
            console.error('❌ CORS Error hoặc Backend không chạy');
            console.error('📍 Kiểm tra: Backend có chạy trên', import.meta.env.VITE_API_GATEWAY_URL, 'không?');
        }
        return Promise.reject(error);
    }
);

export default apiClient;