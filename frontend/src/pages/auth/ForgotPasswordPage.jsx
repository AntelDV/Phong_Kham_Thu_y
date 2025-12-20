import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/custom.scss';

const ForgotPasswordPage = () => {
  return (
    <div className="login-wrapper">
      <div className="login-card text-center" style={{ maxWidth: '450px' }}>
        <div className="mb-4 text-primary bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
          <i className="bi bi-key-fill fs-1"></i>
        </div>
        <h3 className="fw-bold mb-2">Quên Mật Khẩu?</h3>
        <p className="text-muted mb-4">Nhập số điện thoại của bạn, chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.</p>
        
        <form>
          <div className="mb-3 text-start">
            <label className="form-label fw-bold text-secondary fs-7 text-uppercase">Số điện thoại đã đăng ký</label>
            <input type="text" className="form-input-modern" placeholder="0912345678" />
          </div>
          <button className="btn-modern w-100 py-3 mb-3">Gửi Yêu Cầu</button>
          <Link to="/login" className="text-decoration-none fw-bold text-muted small">
            <i className="bi bi-arrow-left me-1"></i> Quay lại đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;