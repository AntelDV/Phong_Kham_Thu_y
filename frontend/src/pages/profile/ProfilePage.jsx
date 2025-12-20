import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: '', role: '', phone: '', email: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        role: storedUser.role,
        phone: '0911111111', 
        email: 'admin@petclinic.com'
      });
    }
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="fw-bold text-primary mb-4 animate-slide-up">Hồ Sơ Của Tôi</h2>
      
      <div className="row g-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="col-md-4">
          <div className="glass-panel p-4 text-center h-100">
            <div className="mb-3 position-relative d-inline-block">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff&size=128`} 
                className="rounded-circle shadow-lg" 
                alt="Avatar" 
              />
              <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2"></span>
            </div>
            <h4 className="fw-bold mb-1">{user.name}</h4>
            <p className="text-muted mb-3">{user.role}</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-sm btn-primary">Đổi Avatar</button>
              <button className="btn btn-sm btn-outline-danger">Đăng Xuất</button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold mb-4 border-bottom pb-2">Thông Tin Chi Tiết</h5>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-secondary">Họ và Tên</label>
                  <input type="text" className="form-control bg-white bg-opacity-50" value={user.name} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-secondary">Chức Vụ</label>
                  <input type="text" className="form-control bg-white bg-opacity-50" value={user.role} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-secondary">Số Điện Thoại</label>
                  <input type="text" className="form-control bg-white bg-opacity-50" value={user.phone} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-secondary">Email</label>
                  <input type="email" className="form-control bg-white bg-opacity-50" value={user.email} readOnly />
                </div>
              </div>
              <button className="btn-modern mt-4">
                <i className="bi bi-save me-2"></i> Lưu Thay Đổi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;