import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { CalendarEvent, Clock, Person, Heart, ChatLeftText, PlusLg, PersonBadge } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const BookingCalendar = () => {
  // 1. State chứa dữ liệu từ DB
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allPets, setAllPets] = useState([]); // Tất cả thú cưng
  const [filteredPets, setFilteredPets] = useState([]); // Thú cưng lọc theo khách chọn

  // 2. State hiển thị Modal
  const [showModal, setShowModal] = useState(false);
  
  // 3. State Form nhập liệu
  const [form, setForm] = useState({
    MaKH: '', 
    MaTC: '', 
    MaBS: '', 
    NgayGioHen: '', 
    LoaiHen: 'Khám bệnh', 
    GhiChu: '' 
  });

  // --- LOAD DỮ LIỆU TỪ API ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Gọi song song các API để tiết kiệm thời gian
      const [resBookings, resCustomers, resDoctors, resPets] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/customers'),
        axios.get('http://localhost:5000/api/staff/doctors'),
        axios.get('http://localhost:5000/api/pets')
      ]);

      setBookings(resBookings.data);
      setCustomers(resCustomers.data);
      setDoctors(resDoctors.data);
      setAllPets(resPets.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  // --- XỬ LÝ LOGIC FORM ---
  
  // Khi chọn Khách hàng -> Lọc danh sách thú cưng tương ứng
  const handleCustomerChange = (e) => {
    const selectedMaKH = parseInt(e.target.value);
    setForm({ ...form, MaKH: selectedMaKH, MaTC: '' }); // Reset chọn thú cưng

    // Logic lọc: Chỉ lấy thú cưng có MaKH trùng với khách vừa chọn
    const petsOfCustomer = allPets.filter(pet => pet.MaKH === selectedMaKH);
    setFilteredPets(petsOfCustomer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.MaKH || !form.MaTC || !form.MaBS) {
      alert("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', form);
      setShowModal(false);
      fetchInitialData(); // Load lại lịch hẹn mới nhất
      alert("Đặt lịch thành công!");
      // Reset form
      setForm({ MaKH: '', MaTC: '', MaBS: '', NgayGioHen: '', LoaiHen: 'Khám bệnh', GhiChu: '' });
    } catch (err) {
      alert('Lỗi khi đặt lịch: ' + err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Lịch Hẹn Khám</h2>
          <p className="text-muted">Quản lý lịch trình phòng khám</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex gap-2 align-items-center" onClick={() => setShowModal(true)}>
          <PlusLg /> Đặt lịch mới
        </Button>
      </div>

      {/* DANH SÁCH LỊCH HẸN (Timeline Cards) */}
      <Row className="g-4">
        {bookings.length === 0 && <p className="text-center text-muted py-5">Chưa có lịch hẹn nào.</p>}
        
        {bookings.map((item, index) => (
          <Col md={6} lg={4} key={item.MaLH}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-sm h-100 position-relative" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className={`position-absolute top-0 start-0 h-100 ${item.TrangThai === 'ChoKham' ? 'bg-warning' : 'bg-success'}`} style={{ width: '6px' }}></div>
                <Card.Body className="ps-4">
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg="light" text="dark" className="border d-flex align-items-center gap-1">
                      <CalendarEvent /> {new Date(item.NgayGioHen).toLocaleDateString('vi-VN')}
                    </Badge>
                    <Badge bg="info" className="d-flex align-items-center gap-1">
                      <Clock /> {new Date(item.NgayGioHen).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </Badge>
                  </div>
                  
                  <h5 className="fw-bold mt-3 mb-1">{item.TenTC}</h5>
                  <p className="text-muted small mb-3"><Person className="me-1"/> Chủ: {item.TenKhach}</p>
                  
                  <div className="bg-light p-3 rounded-4 mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Dịch vụ:</span>
                      <span className="fw-bold text-primary">{item.LoaiHen}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Bác sĩ:</span>
                      <span className="fw-semibold text-dark">
                        <PersonBadge className="me-1"/> {item.TenBacSi || 'Chưa phân công'}
                      </span>
                    </div>
                  </div>

                  {item.GhiChu && (
                    <div className="d-flex gap-2 text-muted small fst-italic">
                      <ChatLeftText /> {item.GhiChu}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* MODAL ĐẶT LỊCH (Dynamic Dropdowns) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="soft-modal" size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary">Đặt Lịch Hẹn Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* 1. Chọn Khách Hàng */}
              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Khách hàng</Form.Label>
                <Form.Select required value={form.MaKH} onChange={handleCustomerChange}>
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map(cus => (
                    <option key={cus.MaKH} value={cus.MaKH}>{cus.HoTen} - {cus.SDT}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* 2. Chọn Thú Cưng (Phụ thuộc vào Khách hàng) */}
              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Thú cưng</Form.Label>
                <Form.Select 
                  required 
                  value={form.MaTC} 
                  onChange={e => setForm({...form, MaTC: e.target.value})}
                  disabled={!form.MaKH} // Khóa nếu chưa chọn khách
                >
                  <option value="">-- Chọn thú cưng --</option>
                  {filteredPets.length > 0 ? (
                    filteredPets.map(pet => (
                      <option key={pet.MaTC} value={pet.MaTC}>{pet.TenTC} ({pet.Loai})</option>
                    ))
                  ) : (
                    <option disabled>Khách này chưa có thú cưng</option>
                  )}
                </Form.Select>
              </Col>

              {/* 3. Chọn Bác Sĩ */}
              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Bác sĩ phụ trách</Form.Label>
                <Form.Select required value={form.MaBS} onChange={e => setForm({...form, MaBS: e.target.value})}>
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map(doc => (
                    <option key={doc.MaNV} value={doc.MaNV}>BS. {doc.HoTen} ({doc.ChuyenKhoa || 'Đa khoa'})</option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Ngày giờ hẹn</Form.Label>
                <Form.Control type="datetime-local" required value={form.NgayGioHen} onChange={e => setForm({...form, NgayGioHen: e.target.value})} />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label className="fw-semibold">Loại dịch vụ</Form.Label>
                <div className="d-flex gap-3">
                  {['Khám bệnh', 'Tiêm phòng', 'Spa/Làm đẹp', 'Phẫu thuật'].map(type => (
                    <Form.Check 
                      key={type}
                      type="radio"
                      label={type}
                      name="LoaiHen"
                      checked={form.LoaiHen === type}
                      onChange={() => setForm({...form, LoaiHen: type})}
                    />
                  ))}
                </div>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Ghi chú thêm</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Ví dụ: Bé đang sốt, bỏ ăn..." value={form.GhiChu} onChange={e => setForm({...form, GhiChu: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button variant="light" onClick={() => setShowModal(false)}>Hủy bỏ</Button>
              <Button type="submit" variant="primary" className="px-4 fw-bold">Xác nhận lịch hẹn</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BookingCalendar;