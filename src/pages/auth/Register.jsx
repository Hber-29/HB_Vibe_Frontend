import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/Auth.css'; 

const Register = () => {
    const navigate = useNavigate();
    
    // Đã cập nhật đúng với cấu trúc DTO của bạn
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Dùng riêng cho FE để validate
        phoneNumber: '',
        gender: 'MALE', // Giá trị mặc định
        birthDate: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
        if (error) setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate cơ bản
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        setIsLoading(true);

        try {
            // Tách confirmPassword ra, chỉ gửi các trường Backend cần
            const { confirmPassword, ...dataToSend } = formData;
            
            await authService.register(dataToSend);
            
            setSuccess('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Lỗi khi đăng ký:', err);
            
            // Xử lý các loại lỗi khác nhau
            if (err.response?.status === 0) {
                setError('❌ Không thể kết nối đến server. Kiểm tra backend có chạy không?');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 400) {
                setError('❌ Dữ liệu không hợp lệ. Kiểm tra lại thông tin đăng ký.');
            } else if (err.response?.status === 409) {
                setError('❌ Tài khoản đã tồn tại. Vui lòng dùng email/username khác.');
            } else {
                setError('❌ Có lỗi xảy ra. Vui lòng thử lại sau!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card" style={{ maxWidth: '600px' }}>
            <h2 className="auth-title">Đăng Ký Tài Khoản</h2>
            
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            
            <form onSubmit={handleRegister}>
                {/* Dòng 1: Họ và Tên */}
                <div className="form-row">
                    <div className="input-group">
                        <label>Họ (First Name)</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Tên (Last Name)</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>

                {/* Dòng 2: Username và Email */}
                <div className="form-row">
                    <div className="input-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>

                {/* Dòng 3: Số điện thoại và Ngày sinh */}
                <div className="form-row">
                    <div className="input-group">
                        <label>Số điện thoại</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Ngày sinh</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                    </div>
                </div>

                {/* Dòng 4: Giới tính */}
                <div className="input-group">
                    <label>Giới tính</label>
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                        style={{
                            width: '100%', padding: '12px 15px', border: '1px solid #ddd', 
                            borderRadius: '10px', fontSize: '15px', backgroundColor: '#f9f9fc',
                            outline: 'none', cursor: 'pointer'
                        }}
                    >
                        <option value="MALE">Nam (Male)</option>
                        <option value="FEMALE">Nữ (Female)</option>
                        <option value="OTHER">Khác (Other)</option>
                    </select>
                </div>
                
                {/* Dòng 5: Mật khẩu */}
                <div className="form-row">
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                </div>
                
                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Đang khởi tạo tài khoản...' : 'HOÀN TẤT ĐĂNG KÝ'}
                </button>
            </form>

            <div className="auth-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </div>
        </div>
    );
};

export default Register;