import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // Xóa token khỏi localStorage
            localStorage.removeItem('access_token');
            
            // Redirect sang login (không cho quay lại)
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="home-container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px'
            }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
                    🛒 HB Vibe
                </h1>
                <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.9 }}>
                    Chào mừng bạn đến với Trang chủ!
                </p>
                
                <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '30px'
                }}>
                    <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                        📧 <strong>Email:</strong> {localStorage.getItem('user_email') || 'Chưa cập nhật'}
                    </p>
                    <p style={{ fontSize: '16px' }}>
                        👤 <strong>Tài khoản:</strong> {localStorage.getItem('username') || 'Khách'}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    style={{
                        padding: '12px 30px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#ff6b6b',
                        color: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isLoading ? 0.7 : 1
                    }}
                    onMouseOver={(e) => !isLoading && (e.target.style.background = '#ff5252')}
                    onMouseOut={(e) => (e.target.style.background = '#ff6b6b')}
                >
                    {isLoading ? 'Đang xử lý...' : '🚪 ĐĂNG XUẤT'}
                </button>
            </div>

            <p style={{
                marginTop: '50px',
                opacity: 0.7,
                fontSize: '14px'
            }}>
                ⚠️ Nút quay lại trình duyệt sẽ bị vô hiệu hóa khi đã đăng nhập
            </p>
        </div>
    );
};

export default Home;
