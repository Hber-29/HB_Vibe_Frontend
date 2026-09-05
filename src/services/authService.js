import axios from 'axios'; // Dùng axios riêng cho Keycloak vì nó khác BaseURL
import apiClient from './api';

export const authService = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', 'password');

        const response = await axios.post(import.meta.env.VITE_KEYCLOAK_TOKEN_URL, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        if(response.data?.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response.data;
    },

    register: async (userData) => {
        try {
            // Gọi endpoint đúng: /user/registration
            const response = await apiClient.post('/user/register', userData);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi đăng ký - Status:', error.response?.status);
            console.error('📍 Response:', error.response?.data);
            throw error;
        }
    }
};