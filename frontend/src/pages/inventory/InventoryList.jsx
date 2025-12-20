import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { BoxSeam, ExclamationTriangle, PlusLg } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const InventoryList = () => {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMed, setNewMed] = useState({
    TenThuoc: '', DonViTinh: 'Chai', SoLuongTon: 0, GiaNhap: 0, GiaBan: 0, HanSuDung: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicines', newMed);
      setShowModal(false);
      fetchMedicines();
      setNewMed({ TenThuoc: '', DonViTinh: 'Chai', SoLuongTon: 0, GiaNhap: 0, GiaBan: 0, HanSuDung: '' });
    } catch (err) { alert('Error'); }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Kho Thuốc & Vật Tư</h2>
          <p className="text-muted">Quản lý nhập xuất tồn</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex gap-2 align-items-center" onClick={() => setShowModal(true)}>
          <PlusLg /> Nhập thuốc mới
        </Button>
      </div>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><BoxSeam size={24}/></div>
            <div><h4 className="mb-0 fw-bold">{medicines.length}</h4><small className="text-muted">Tổng đầu thuốc</small></div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
            <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning"><ExclamationTriangle size={24}/></div>
            <div><h4 className="mb-0 fw-bold">{medicines.filter(m => m.SoLuongTon < 10).length}</h4><small className="text-muted">Sắp hết hàng</small></div>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Table hover responsive className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3">Mã</th>
              <th>Tên thuốc</th>
              <th>Đơn vị</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Hạn sử dụng</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m, i) => (
              <motion.tr key={m.MaThuoc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <td className="ps-4 fw-bold">#{m.MaThuoc}</td>
                <td className="fw-semibold text-primary">{m.TenThuoc}</td>
                <td><Badge bg="light" text="dark" className="border">{m.DonViTinh}</Badge></td>
                <td>{m.GiaNhap.toLocaleString()} ₫</td>
                <td className="fw-bold text-success">{m.GiaBan.toLocaleString()} ₫</td>
                <td>
                  {m.SoLuongTon < 10 ? 
                    <Badge bg="danger">Sắp hết ({m.SoLuongTon})</Badge> : 
                    <Badge bg="success" className="bg-opacity-75">{m.SoLuongTon}</Badge>
                  }
                </td>
                <td>{new Date(m.HanSuDung).toLocaleDateString('vi-VN')}</td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="soft-modal">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold text-primary">Nhập Thuốc Mới</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Tên thuốc</Form.Label><Form.Control required value={newMed.TenThuoc} onChange={e => setNewMed({...newMed, TenThuoc: e.target.value})} /></Form.Group>
            <Row>
              <Col md={6} className="mb-3"><Form.Label>Đơn vị tính</Form.Label>
                <Form.Select value={newMed.DonViTinh} onChange={e => setNewMed({...newMed, DonViTinh: e.target.value})}>
                  <option>Chai</option><option>Viên</option><option>Gói</option><option>Hộp</option><option>Ống</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3"><Form.Label>Số lượng nhập</Form.Label><Form.Control type="number" required value={newMed.SoLuongTon} onChange={e => setNewMed({...newMed, SoLuongTon: e.target.value})} /></Col>
              <Col md={6} className="mb-3"><Form.Label>Giá nhập</Form.Label><Form.Control type="number" required value={newMed.GiaNhap} onChange={e => setNewMed({...newMed, GiaNhap: e.target.value})} /></Col>
              <Col md={6} className="mb-3"><Form.Label>Giá bán</Form.Label><Form.Control type="number" required value={newMed.GiaBan} onChange={e => setNewMed({...newMed, GiaBan: e.target.value})} /></Col>
              <Col md={12} className="mb-3"><Form.Label>Hạn sử dụng</Form.Label><Form.Control type="date" required value={newMed.HanSuDung} onChange={e => setNewMed({...newMed, HanSuDung: e.target.value})} /></Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button type="submit" variant="primary">Nhập kho</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default InventoryList;