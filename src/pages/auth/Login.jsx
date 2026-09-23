import React, { useState, useEffect } from 'react'; // Bổ sung import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // THÊM ĐOẠN NÀY: Chặn truy cập trang Login nếu đã có Token
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/home', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login(credentials.username, credentials.password);
            localStorage.setItem('username', credentials.username);
            alert('Đăng nhập thành công!');
            navigate('/home', { replace: true }); 
        } catch (err) {
            setError('Sai tài khoản hoặc mật khẩu!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h2 className="auth-title">HB Vibe</h2>
            {error && <div className="error-msg">{error}</div>}
            
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                </button>
            </form>
            <div className="auth-link">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
        </div>
    );
};

export default Login;