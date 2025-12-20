import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form, Table } from 'react-bootstrap';
import { PlusLg, Search, Filter, JournalMedical, FileEarmarkMedical } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  
  // State Modal Thêm
  const [showModal, setShowModal] = useState(false);
  const [newPet, setNewPet] = useState({ MaKH: '', TenTC: '', Loai: 'Chó', Giong: '', Tuoi: '', CanNang: '', GioiTinh: 'Đực', TieuSuBenh: '' });

  // State Modal Lịch Sử (MỚI)
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPetHistory, setSelectedPetHistory] = useState([]);
  const [selectedPetName, setSelectedPetName] = useState('');

  useEffect(() => { fetchPets(); fetchCustomers(); }, []);
  useEffect(() => {
    setFilteredPets(pets.filter(p => p.TenTC.toLowerCase().includes(searchTerm.toLowerCase()) || (p.TenChu && p.TenChu.toLowerCase().includes(searchTerm.toLowerCase()))));
  }, [searchTerm, pets]);

  const fetchPets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pets');
      setPets(res.data); setFilteredPets(res.data);
    } catch (error) { toast.error("Lỗi tải thú cưng"); }
  };

  const fetchCustomers = async () => {
    try { const res = await axios.get('http://localhost:5000/api/customers'); setCustomers(res.data); } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPet.MaKH) return toast.warning("Chọn chủ nuôi!");
    try {
      await axios.post('http://localhost:5000/api/pets', newPet);
      setShowModal(false); fetchPets(); toast.success("Thêm thành công!");
    } catch (error) { toast.error("Lỗi thêm mới"); }
  };

  // Hàm xem lịch sử bệnh án (MỚI)
  const handleViewHistory = async (pet) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/pets/${pet.MaTC}/history`);
        setSelectedPetHistory(res.data);
        setSelectedPetName(pet.TenTC);
        setShowHistoryModal(true);
    } catch (err) { toast.error("Không tải được lịch sử khám"); }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold mb-0 text-dark">Hồ sơ Thú cưng</h2><p className="text-muted">Quản lý bệnh nhân</p></div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2" onClick={() => setShowModal(true)}><PlusLg /> Thêm mới</Button>
      </div>

      <Card className="mb-4 shadow-sm border-0"><Card.Body className="d-flex gap-3 align-items-center p-3">
          <div className="position-relative flex-grow-1">
            <Search className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: '15px' }} />
            <input type="text" className="form-control ps-5 border-0 bg-light" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
      </Card.Body></Card>

      <Row className="g-4">
        {filteredPets.map((pet, index) => (
          <Col md={6} lg={4} xl={3} key={pet.MaTC}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div className={`position-absolute top-0 start-0 w-100 h-100 ${pet.Loai === 'Mèo' ? 'bg-warning' : 'bg-primary'}`} style={{ opacity: 0.05, zIndex: 0 }}></div>
                <Card.Body className="position-relative z-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, fontSize: '24px' }}>{pet.Loai === 'Mèo' ? '🐱' : '🐶'}</div>
                    <Badge bg={pet.GioiTinh === 'Đực' ? 'info' : 'danger'} pill>{pet.GioiTinh}</Badge>
                  </div>
                  <h5 className="fw-bold text-dark">{pet.TenTC}</h5>
                  <p className="text-muted small mb-2">{pet.Giong} • {pet.Tuoi} tuổi</p>
                  <hr className="my-2 dashed" style={{ borderStyle: 'dashed' }} />
                  <div className="d-flex justify-content-between align-items-center small">
                    <span className="text-muted">Chủ: {pet.TenChu || 'Vãng lai'}</span>
                    {/* NÚT XEM HỒ SƠ */}
                    <Button variant="link" className="text-primary fw-bold text-decoration-none p-0 d-flex align-items-center gap-1" onClick={() => handleViewHistory(pet)}>
                        <FileEarmarkMedical/> Hồ sơ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* MODAL THÊM MỚI (Giữ nguyên) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="soft-modal">
        <Modal.Header closeButton><Modal.Title className="fw-bold">Thêm Thú Cưng</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                  <Form.Label>Chủ nuôi</Form.Label>
                  <Form.Select required value={newPet.MaKH} onChange={(e) => setNewPet({...newPet, MaKH: e.target.value})}>
                    <option value="">-- Chọn chủ nuôi --</option>
                    {customers.map(c => <option key={c.MaKH} value={c.MaKH}>{c.HoTen} - {c.SDT}</option>)}
                  </Form.Select>
              </Col>
              <Col md={6} className="mb-3"><Form.Label>Tên</Form.Label><Form.Control required value={newPet.TenTC} onChange={(e) => setNewPet({...newPet, TenTC: e.target.value})} /></Col>
              <Col md={6} className="mb-3"><Form.Label>Loài</Form.Label><Form.Select value={newPet.Loai} onChange={(e) => setNewPet({...newPet, Loai: e.target.value})}><option>Chó</option><option>Mèo</option></Form.Select></Col>
              <Col md={6} className="mb-3"><Form.Label>Giống</Form.Label><Form.Control value={newPet.Giong} onChange={(e) => setNewPet({...newPet, Giong: e.target.value})} /></Col>
              <Col md={3} className="mb-3"><Form.Label>Tuổi</Form.Label><Form.Control type="number" value={newPet.Tuoi} onChange={(e) => setNewPet({...newPet, Tuoi: e.target.value})} /></Col>
              <Col md={3} className="mb-3"><Form.Label>Cân nặng</Form.Label><Form.Control type="number" value={newPet.CanNang} onChange={(e) => setNewPet({...newPet, CanNang: e.target.value})} /></Col>
              <Col md={12} className="mb-3"><Form.Label>Tiểu sử</Form.Label><Form.Control as="textarea" value={newPet.TieuSuBenh} onChange={(e) => setNewPet({...newPet, TieuSuBenh: e.target.value})} /></Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100">Lưu</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL LỊCH SỬ KHÁM BỆNH (MỚI) */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-light">
            <Modal.Title className="fw-bold text-primary"><JournalMedical className="me-2"/>Hồ Sơ Bệnh Án: {selectedPetName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
            {selectedPetHistory.length > 0 ? (
                <Table hover className="mb-0">
                    <thead className="bg-light text-muted small">
                        <tr><th>Ngày khám</th><th>Bác sĩ</th><th>Chẩn đoán</th><th>Kết luận / Điều trị</th></tr>
                    </thead>
                    <tbody>
                        {selectedPetHistory.map((h, i) => (
                            <tr key={i}>
                                <td className="fw-bold">{new Date(h.NgayKham).toLocaleDateString('vi-VN')}</td>
                                <td>{h.TenBacSi || '---'}</td>
                                <td className="text-danger fw-semibold">{h.ChanDoan}</td>
                                <td>{h.KetLuan}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div className="text-center py-5 text-muted">
                    <JournalMedical size={40} className="mb-3 opacity-50"/>
                    <p>Chưa có lịch sử khám bệnh nào.</p>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PetList;