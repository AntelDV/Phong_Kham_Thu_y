import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PersonPlus, Envelope, Lock, Person, Telephone, GeoAlt, ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/custom.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    hoTen: '', username: '', password: '', confirmPass: '', email: '', sdt: '', diaChi: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) return setError("Mật khẩu xác nhận không khớp");
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-5">
              <div className="text-center mb-4">
                <div className="bg-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                  <PersonPlus size={32} className="text-primary" />
                </div>
                <h2 className="fw-bold text-dark">Tạo Tài Khoản</h2>
                <p className="text-muted">Tham gia cộng đồng yêu thú cưng</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text border-0 bg-white"><Person/></span>
                      <Form.Control placeholder="Họ và tên" required onChange={e => setFormData({...formData, hoTen: e.target.value})} />
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text border-0 bg-white"><Telephone/></span>
                      <Form.Control placeholder="Số điện thoại" required onChange={e => setFormData({...formData, sdt: e.target.value})} />
                    </div>
                  </Col>
                </Row>
                
                <div className="mb-3 input-group">
                   <span className="input-group-text border-0 bg-white"><Envelope/></span>
                   <Form.Control type="email" placeholder="Email (tùy chọn)" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="mb-3 input-group">
                   <span className="input-group-text border-0 bg-white"><GeoAlt/></span>
                   <Form.Control placeholder="Địa chỉ" onChange={e => setFormData({...formData, diaChi: e.target.value})} />
                </div>

                <div className="mb-3 input-group">
                   <span className="input-group-text border-0 bg-white"><Person/></span>
                   <Form.Control placeholder="Tên đăng nhập" required onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>

                <Row>
                    <Col md={6} className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text border-0 bg-white"><Lock/></span>
                            <Form.Control type="password" placeholder="Mật khẩu" required onChange={e => setFormData({...formData, password: e.target.value})} />
                        </div>
                    </Col>
                    <Col md={6} className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text border-0 bg-white"><Lock/></span>
                            <Form.Control type="password" placeholder="Nhập lại MK" required onChange={e => setFormData({...formData, confirmPass: e.target.value})} />
                        </div>
                    </Col>
                </Row>

                <Button type="submit" className="w-100 py-3 fw-bold mb-3 btn-primary">ĐĂNG KÝ NGAY</Button>
                <div className="text-center">
                    <Link to="/login" className="text-decoration-none text-dark fw-bold"><ArrowLeft/> Quay lại đăng nhập</Link>
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default RegisterPage;