import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các Layout và Pages
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute';
import ProductDetail from '../pages/ProductDetail';
import Forbidden403 from "../pages/error/Forbidden403";
import BrandDashboardLayout from '../layouts/BrandDashboardLayout';
import BrandProtectedRoute from './BrandProtectedRoute';
import ProductManager from '../pages/brand/ProductManager';

const AppRoutes = () => {
    return (
        <Routes>
            {/* 1. Tuyến đường dành cho Khách (Chưa đăng nhập) */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* 2. Tuyến đường chính (Trang chủ) - Bảo vệ bởi ProtectedRoute */}
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            
            {/* 3. Redirect trang chủ sang login (Default) */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 4. Trang chi tiết sản phẩm */}
            <Route path="/product/:slug" element={<ProductDetail />} />

            {/* 5. Trang báo lỗi thiếu quyền */}
            <Route path="/403" element={<Forbidden403 />} />
            
            {/* 6. PHÂN HỆ QUẢN TRỊ BRAND */}
            <Route element={<BrandProtectedRoute />}>
                <Route path="/brand-dashboard" element={<BrandDashboardLayout />}>
                    
                    {/* Render một giao diện tạm thời thay vì redirect để test Sidebar */}
                    <Route index element={
                        <div className="bg-white p-10 border border-[#E5E5E5] w-full">
                            <h1 className="font-serif text-3xl mb-4 text-[#111111]">Chào mừng đến Brand Portal</h1>
                            <p className="text-[14px] text-[#666666]">Vui lòng chọn một mục trên menu bên trái để bắt đầu quản lý.</p>
                        </div>
                    } />

                    {/* Khi nào bạn tạo xong file ProductManager, hãy bỏ comment dòng dưới */}
                    {/* <Route path="products" element={<ProductManager />} /> */}
                    
                    {/* Khi nào bạn tạo xong file TeamManager, hãy bỏ comment dòng dưới */}
                    {/* <Route path="team" element={<TeamManager />} /> */}
                </Route>
            </Route>

            {/* 7. BẮT LỖI 404 - BẮT BUỘC PHẢI ĐẶT Ở DƯỚI CÙNG */}
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* 6. PHÂN HỆ QUẢN TRỊ BRAND */}
            <Route element={<BrandProtectedRoute />}>
                <Route path="/brand-dashboard" element={<BrandDashboardLayout />}>
                    
                    {/* Đổi index để nó tự trỏ thẳng vào /products thay vì hiện chữ Chào Mừng */}
                    <Route index element={<Navigate to="products" replace />} />

                    {/* BỎ COMMENT DÒNG NÀY ĐỂ KÍCH HOẠT TRANG SẢN PHẨM */}
                    <Route path="products" element={<ProductManager />} />
                    
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;