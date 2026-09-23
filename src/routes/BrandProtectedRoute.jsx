// src/routes/BrandProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isBrandUser } from '../utils/tokenUtils';

const BrandProtectedRoute = () => {
    const token = localStorage.getItem('access_token');

    // 1. Nếu chưa đăng nhập -> Đuổi về trang Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng KHÔNG CÓ quyền Brand -> Đuổi về trang 403
    if (!isBrandUser()) {
        return <Navigate to="/403" replace />;
    }

    // 3. Hợp lệ -> Cho phép đi tiếp vào trang quản trị (render các route con)
    return <Outlet />;
};

export default BrandProtectedRoute;