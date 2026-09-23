// src/pages/error/Forbidden403.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden403 = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#111111] font-sans">
            <h1 className="font-serif text-[80px] leading-[1] mb-4">403</h1>
            <p className="text-[12px] uppercase tracking-[0.15em] font-semibold mb-8">Access Denied</p>
            <p className="text-[#666666] text-[14px] mb-10 max-w-md text-center">
                Tài khoản của bạn không có đặc quyền để truy cập vào không gian Quản trị Thương hiệu.
            </p>
            <button 
                onClick={() => navigate('/', { replace: true })}
                className="bg-[#111111] text-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#333333] transition-colors rounded-none"
            >
                Quay lại Trang chủ
            </button>
        </div>
    );
};

export default Forbidden403;