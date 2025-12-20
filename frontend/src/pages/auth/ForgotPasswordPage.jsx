import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldLock, Key, CheckCircle, ArrowRight } from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/custom.scss';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { username });
      setStep(2);
      setMsg('Mã OTP đã được gửi đến hệ thống (Xem Terminal Backend)');
      setError('');
    } catch (err) { setError(err.response?.data?.message || 'Lỗi hệ thống'); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { username, otp, newPassword });
      setStep(3);
    } catch (err) { setError(err.response?.data?.message || 'Mã OTP sai hoặc lỗi'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <motion.div className="glass-panel p-5 text-center">
              <div className="mb-4 text-primary"><ShieldLock size={50} /></div>
              <h3 className="fw-bold mb-4">Khôi Phục Mật Khẩu</h3>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {msg && <Alert variant="info">{msg}</Alert>}

              <AnimatePresence mode='wait'>
                {step === 1 && (
                  <motion.form key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={sendOTP}>
                    <p className="text-muted mb-4">Nhập tên đăng nhập để nhận mã OTP xác thực.</p>
                    <Form.Control className="mb-4 py-3" placeholder="Tên đăng nhập" required value={username} onChange={e => setUsername(e.target.value)} />
                    <Button type="submit" className="w-100 py-3 btn-primary fw-bold">GỬI MÃ OTP <ArrowRight/></Button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={resetPassword}>
                    <p className="text-muted mb-4">Nhập mã OTP vừa nhận và mật khẩu mới.</p>
                    <Form.Control className="mb-3 py-3" placeholder="Nhập mã OTP (6 số)" required value={otp} onChange={e => setOtp(e.target.value)} />
                    <Form.Control className="mb-4 py-3" type="password" placeholder="Mật khẩu mới" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <Button type="submit" className="w-100 py-3 btn-primary fw-bold">ĐỔI MẬT KHẨU</Button>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <CheckCircle size={60} className="text-success mb-3" />
                    <h4 className="text-success fw-bold">Thành Công!</h4>
                    <p className="text-muted mb-4">Mật khẩu của bạn đã được cập nhật.</p>
                    <Button onClick={() => navigate('/login')} className="w-100 py-3 btn-success fw-bold">VỀ TRANG ĐĂNG NHẬP</Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {step < 3 && <div className="mt-4"><Link to="/login" className="text-decoration-none text-muted">Hủy bỏ</Link></div>}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default ForgotPasswordPage;