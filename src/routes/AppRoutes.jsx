import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các Layout và Pages
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* 1. Tuyến đường dành cho Khách (Chưa đăng nhập) */}
            {/* Bất kỳ route nào nằm trong AuthLayout đều sẽ có cái nền gradient */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* 2. Tuyến đường chính (Trang chủ) - Bảo vệ bởi ProtectedRoute */}
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            
            {/* 3. Redirect trang chủ sang login (Default) */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 4. Bắt lỗi 404 (Khi người dùng gõ link bậy bạ) */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;