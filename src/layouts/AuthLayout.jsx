
import { Outlet } from 'react-router-dom';
import '../styles/Auth.css'; // File CSS tôi gửi ở tin nhắn trước

const AuthLayout = () => {
    return (
        <div className="auth-container">
            {/* <Outlet /> chính là cái lỗ hổng để nhúng Login.jsx hoặc Register.jsx vào giữa */}
            <Outlet /> 
        </div>
    );
};

export default AuthLayout;