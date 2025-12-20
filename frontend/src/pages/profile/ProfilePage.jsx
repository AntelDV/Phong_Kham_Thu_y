import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { PersonCircle, Save, Telephone, Envelope, GeoAlt, Upload } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [formData, setFormData] = useState({ hoTen: '', sdt: '', email: '', diaChi: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        hoTen: parsedUser.HoTen || '',
        sdt: parsedUser.SDT || '',
        email: parsedUser.Email || '',
        diaChi: parsedUser.DiaChi || ''
      });
      const savedAvatar = localStorage.getItem(`avatar_${parsedUser.MaNV || parsedUser.MaKH}`);
      setAvatarUrl(savedAvatar || '');
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200000000) { 
        toast.error("File ảnh quá lớn! Vui lòng chọn ảnh < 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const id = user.MaNV || user.MaKH;
      const role = user.ChucVu || 'KhachHang';
      
      const res = await axios.post('http://localhost:5000/api/auth/update-profile', {
        id, role, ...formData
      });

      if (res.data.success) {
        const updatedUser = { ...user, HoTen: formData.hoTen, SDT: formData.sdt, Email: formData.email, DiaChi: formData.diaChi };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Lưu ảnh Base64 vào localStorage
        if (avatarUrl) localStorage.setItem(`avatar_${id}`, avatarUrl);

        setUser(updatedUser);
        toast.success("Cập nhật hồ sơ thành công!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error("Lỗi cập nhật: " + (err.response?.data?.error || err.message));
    }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4 text-dark">Hồ sơ cá nhân</h2>
      <Row>
        <Col md={4}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Card className="text-center p-4 mb-4">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div 
                  className="rounded-circle overflow-hidden shadow" 
                  style={{ width: '160px', height: '160px', border: '5px solid white' }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <PersonCircle size={80} className="text-secondary opacity-50"/>
                    </div>
                  )}
                </div>
                <button 
                    className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, border: '3px solid white' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <Upload size={16}/>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                />
              </div>
              
              <h4 className="fw-bold">{user.HoTen}</h4>
              <div className="mt-2">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary border-opacity-25">
                    {user.ChucVu || 'Khách Hàng'}
                </span>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col md={8}>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Card className="p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold mb-0 text-primary">Thông tin chi tiết</h5>
              </div>
              
              <Form onSubmit={handleUpdate}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">HỌ VÀ TÊN</Form.Label>
                      <Form.Control className="fw-bold" value={formData.hoTen} onChange={e => setFormData({...formData, hoTen: e.target.value})} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">SỐ ĐIỆN THOẠI</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><Telephone/></span>
                        <Form.Control value={formData.sdt} onChange={e => setFormData({...formData, sdt: e.target.value})} />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">EMAIL</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><Envelope/></span>
                        <Form.Control value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">VAI TRÒ</Form.Label>
                      <Form.Control value={user.ChucVu || 'Khách Hàng'} disabled className="bg-light text-muted" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">ĐỊA CHỈ</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><GeoAlt/></span>
                        <Form.Control value={formData.diaChi} onChange={e => setFormData({...formData, diaChi: e.target.value})} />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                  <Button type="submit" variant="primary" className="px-5 py-2 d-flex align-items-center gap-2">
                    <Save/> Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};
export default ProfilePage;