import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import PawLogo from '../../components/common/PawLogo';
import { useNavigate, Link } from 'react-router-dom';
import { Person, Lock } from 'react-bootstrap-icons';
import axios from 'axios';
import '../../styles/custom.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
        navigate('/dashboard'); 
      }
    } catch (err) { setError(err.response?.data?.message || 'Lỗi kết nối'); }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    }}>
      <motion.div 
        animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -50, 50, 0],
            rotate: [0, 180, 360] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '-10%', 
            width: '600px', 
            height: '600px', 
            background: 'radial-gradient(circle, rgba(147,250,165,0.4) 0%, rgba(255,255,255,0) 70%)', 
            borderRadius: '50%', 
            zIndex: 0 
        }} 
      />
      <motion.div 
        animate={{ 
            x: [0, -100, 50, 0], 
            y: [0, 100, -50, 0],
            scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ 
            position: 'absolute', 
            bottom: '-10%', 
            right: '-10%', 
            width: '700px', 
            height: '700px', 
            background: 'radial-gradient(circle, rgba(32,156,255,0.3) 0%, rgba(255,255,255,0) 70%)', 
            borderRadius: '50%', 
            zIndex: 0 
        }} 
      />

      <Container style={{ position: 'relative', zIndex: 10 }}>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.9 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
              }}
              className="p-5 text-center"
            >
              <div className="mb-4">
                <div className="d-inline-block bg-white rounded-circle p-3 shadow-sm mb-3">
                   <PawLogo width={60} color="#00b09b" />
                </div>
                <h2 className="fw-bold text-dark">Xin Chào!</h2>
                <p className="text-muted">Đăng nhập để quản lý phòng khám</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>
                </motion.div>
              )}

              <Form onSubmit={handleLogin}>
                <div className="input-group mb-3">
                  <span className="input-group-text border-0 bg-white ps-3"><Person className="text-primary"/></span>
                  <Form.Control 
                    placeholder="Tên đăng nhập" 
                    className="border-0 shadow-none py-3" 
                    style={{background: 'white'}}
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>

                <div className="input-group mb-4">
                  <span className="input-group-text border-0 bg-white ps-3"><Lock className="text-primary"/></span>
                  <Form.Control 
                    type="password" 
                    placeholder="Mật khẩu" 
                    className="border-0 shadow-none py-3" 
                    style={{background: 'white'}}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>

                <div className="d-flex justify-content-between mb-4 small px-1">
                  <Form.Check type="checkbox" label="Ghi nhớ tôi" />
                  <Link to="/forgot-password" style={{ color: '#00b09b', fontWeight: 'bold', textDecoration: 'none' }}>Quên mật khẩu?</Link>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="submit" 
                    className="w-100 py-3 fw-bold text-white border-0"
                    style={{
                        background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
                        boxShadow: '0 10px 20px rgba(0, 176, 155, 0.3)'
                    }}
                  >
                    ĐĂNG NHẬP
                  </Button>
                </motion.div>
              </Form>

              <div className="mt-5 pt-3 border-top">
                <p className="text-muted small">Chưa có tài khoản?</p>
                <Link to="/register" className="btn btn-outline-secondary w-100 rounded-pill fw-bold border-2">Tạo tài khoản mới</Link>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default LoginPage;