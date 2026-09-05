import React from 'react';
import { Navigate } from 'react-router-dom';

// Component này bảo vệ các trang yêu cầu đăng nhập
const ProtectedRoute = ({ element }) => {
    const isAuthenticated = () => {
        // Kiểm tra token trong localStorage
        const token = localStorage.getItem('access_token');
        return token !== null && token !== undefined && token !== '';
    };

    // Nếu chưa đăng nhập, redirect về login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, hiển thị component
    return element;
};

export default ProtectedRoute;
