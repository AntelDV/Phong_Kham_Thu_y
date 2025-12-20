import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/custom.scss'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); // Chuyển vào Dashboard
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Không thể kết nối đến Server');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="glass-card p-5 animate-slide-up" style={{width: '420px', background: 'rgba(255,255,255,0.95)'}}>
        <div className="text-center mb-5">
           <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3 shadow" style={{width: 70, height: 70}}>
              <i className="bi bi-hospital fs-1"></i>
           </div>
           <h3 className="fw-bold text-dark">PetCare+</h3>
           <p className="text-muted">Đăng nhập hệ thống quản lý</p>
        </div>

        {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
             <label className="fw-bold text-secondary small mb-1">TÊN ĐĂNG NHẬP</label>
             <input type="text" className="input-modern" placeholder="admin / bacsi" 
                    value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-4">
             <div className="d-flex justify-content-between mb-1">
                <label className="fw-bold text-secondary small">MẬT KHẨU</label>
                <Link to="/forgot-password" style={{color: '#00b09b', textDecoration: 'none', fontSize: '0.85rem'}}>Quên mật khẩu?</Link>
             </div>
             <input type="password" className="input-modern" placeholder="••••••" 
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-grad w-100 py-3 shadow-sm">ĐĂNG NHẬP</button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
           <span className="text-muted">Chưa có tài khoản? </span>
           <Link to="/register" style={{color: '#00b09b', fontWeight: 'bold'}}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;