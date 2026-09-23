import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { hasAnyRole } from '../utils/tokenUtils';

const BrandDashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        navigate('/login', { replace: true });
    };

    // Định nghĩa danh sách menu và điều kiện quyền (Roles)
    const navItems = [
        { 
            path: '/brand-dashboard/products', 
            label: 'Sản phẩm', 
            // Tất cả các role đều có thể xem và sửa sản phẩm
            roles: ['product_write', 'product_delete'] 
        },
        { 
            path: '/brand-dashboard/team', 
            label: 'Nhân sự', 
            // BRAND_STAFF không có các quyền này nên sẽ không thấy menu Nhân sự
            roles: ['brand_member_write', 'brand_member_delete'] 
        },
        { 
            path: '/brand-dashboard/settings', 
            label: 'Cài đặt', 
            // Chỉ BRAND_OWNER và BRAND_MANAGER (có brand_write) mới thấy
            roles: ['brand_write'] 
        },
    ];

    return (
        <div className="min-h-screen flex bg-[#F9F9F8] text-[#111111] font-sans">
            
            {/* SIDEBAR - VERTICAL NAVIGATION */}
            <aside className="w-[250px] border-r border-[#E5E5E5] flex flex-col justify-between fixed h-screen bg-white z-50">
                {/* Khu vực Top: Logo & Menu */}
                <div>
                    <div className="p-8 border-b border-[#E5E5E5] flex flex-col items-center justify-center">
                        <span 
                            onClick={() => navigate('/')}
                            className="font-serif text-2xl font-bold tracking-widest uppercase cursor-pointer" 
                        >
                            HB VIBE
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#666666] mt-2 font-semibold">
                            Brand Portal
                        </span>
                    </div>

                    <nav className="flex flex-col mt-6 px-4 space-y-2">
                        {navItems.map((item, idx) => {
                            // Kiểm tra quyền: Nếu user không có role nào khớp, ẩn menu này
                            if (!hasAnyRole(item.roles)) return null;
                            
                            // Kiểm tra trạng thái Active của menu
                            const isActive = location.pathname.includes(item.path);
                            
                            return (
                                <Link 
                                    key={idx}
                                    to={item.path}
                                    className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all border ${
                                        isActive 
                                        ? 'bg-[#111111] text-white border-[#111111]' 
                                        : 'bg-transparent border-transparent text-[#111111] hover:border-[#E5E5E5] hover:bg-[#F9F9F8]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Khu vực Bottom: Actions */}
                <div className="p-4 border-t border-[#E5E5E5] flex flex-col space-y-3 bg-white">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full text-center px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] border border-[#E5E5E5] hover:border-[#111111] transition-colors bg-white"
                    >
                        Quay lại trang chủ
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-center px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] bg-[#111111] text-white hover:bg-[#333333] transition-colors border border-[#111111]"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* KHOẢNG ĐỆM ĐỂ ĐẨY MAIN CONTENT SANG PHẢI (Do Sidebar fixed) */}
            <div className="w-[250px] shrink-0"></div>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-h-screen bg-[#F9F9F8] p-10">
                {/* 
                  <Outlet /> là nơi các Component con (Ví dụ: Trang quản lý Sản phẩm)
                  sẽ được render vào. Nó đóng vai trò như một placeholder.
                */}
                <Outlet />
            </main>
        </div>
    );
};

export default BrandDashboardLayout;