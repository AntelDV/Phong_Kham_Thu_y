import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/custom.scss'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', fullName: '', phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100" 
         style={{background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'}}>
      
      <div className="glass-card p-5 animate-enter" style={{width: '500px', background: 'rgba(255,255,255,0.95)'}}>
        <h2 className="fw-bold text-dark mb-4 text-center">Tạo Tài Khoản Mới</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
             <div className="col-12">
                <input type="text" className="w-100 input-rounded" placeholder="Họ và tên nhân viên" 
                       onChange={e => setFormData({...formData, fullName: e.target.value})} required />
             </div>
             <div className="col-12">
                <input type="text" className="w-100 input-rounded" placeholder="Số điện thoại (Sẽ dùng làm SĐT liên hệ)" 
                       onChange={e => setFormData({...formData, phone: e.target.value})} required />
             </div>
             <div className="col-12">
                <input type="text" className="w-100 input-rounded" placeholder="Tên đăng nhập (Username)" 
                       onChange={e => setFormData({...formData, username: e.target.value})} required />
             </div>
             <div className="col-12">
                <input type="password" className="w-100 input-rounded" placeholder="Mật khẩu" 
                       onChange={e => setFormData({...formData, password: e.target.value})} required />
             </div>
          </div>
          
          <button type="submit" className="btn-grad w-100 py-3 mt-4">
            HOÀN TẤT ĐĂNG KÝ
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" style={{color: '#667eea', fontWeight: '600'}}>Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;