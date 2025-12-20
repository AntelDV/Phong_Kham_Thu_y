import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import { PlusLg, Search, Telephone, Envelope, GeoAlt, PencilSquare, Trash } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Mode sửa
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ HoTen: '', SDT: '', Email: '', DiaChi: '', TenDangNhap: '', MatKhau: '123456' });

  useEffect(() => { fetchCustomers(); }, []);
  useEffect(() => {
    setFilteredCustomers(customers.filter(c => c.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) || c.SDT.includes(searchTerm)));
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) { toast.error("Lỗi tải dữ liệu"); }
  };

  const openModalAdd = () => {
    setIsEdit(false);
    setFormData({ HoTen: '', SDT: '', Email: '', DiaChi: '', TenDangNhap: '', MatKhau: '123456' });
    setShowModal(true);
  };

  const openModalEdit = (cus) => {
    setIsEdit(true);
    setCurrentId(cus.MaKH);
    setFormData({ HoTen: cus.HoTen, SDT: cus.SDT, Email: cus.Email, DiaChi: cus.DiaChi, TenDangNhap: '', MatKhau: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/customers/${currentId}`, formData);
        toast.success("Cập nhật thành công!");
      } else {
        await axios.post('http://localhost:5000/api/customers', formData);
        toast.success("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) { toast.error("Lỗi thao tác"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        try {
            await axios.delete(`http://localhost:5000/api/customers/${id}`);
            toast.success("Đã xóa khách hàng!");
            fetchCustomers();
        } catch (error) { toast.error("Lỗi khi xóa"); }
    }
  };

  return (
    <div className="container-fluid fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold text-dark">Khách hàng</h2><p className="text-muted">Quản lý thông tin chủ nuôi</p></div>
        <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm" onClick={openModalAdd}>
          <PlusLg /> Thêm khách hàng
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden mb-4" style={{ borderRadius: '24px' }}>
         <Card.Body className="p-3">
            <div className="input-group">
                <span className="input-group-text bg-white border-0"><Search/></span>
                <input type="text" className="form-control border-0 shadow-none" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
         </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light text-muted">
              <tr>
                <th className="ps-4 py-3">ID</th>
                <th>Họ tên</th>
                <th>Liên hệ</th>
                <th>Địa chỉ</th>
                <th>Ngày đăng ký</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cus, index) => (
                <motion.tr key={cus.MaKH} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                  <td className="ps-4 fw-bold text-primary">#{cus.MaKH}</td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{width: 40, height: 40}}>{cus.HoTen.charAt(0)}</div>
                      <span className="fw-semibold">{cus.HoTen}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column small text-muted">
                      <span className="mb-1"><Telephone size={12} className="me-2"/>{cus.SDT}</span>
                      <span><Envelope size={12} className="me-2"/>{cus.Email || '---'}</span>
                    </div>
                  </td>
                  <td><span className="text-muted small"><GeoAlt className="me-1"/>{cus.DiaChi}</span></td>
                  <td><Badge bg="light" text="dark" className="border">{new Date(cus.NgayDK).toLocaleDateString('vi-VN')}</Badge></td>
                  <td className="text-end pe-4">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openModalEdit(cus)}><PencilSquare/></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cus.MaKH)}><Trash/></Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="soft-modal">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold text-primary">{isEdit ? 'Cập Nhật' : 'Thêm Mới'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Họ tên</Form.Label><Form.Control required value={formData.HoTen} onChange={e => setFormData({...formData, HoTen: e.target.value})} /></Form.Group>
            <div className="row">
              <div className="col-md-6 mb-3"><Form.Label>SĐT</Form.Label><Form.Control required value={formData.SDT} onChange={e => setFormData({...formData, SDT: e.target.value})} /></div>
              <div className="col-md-6 mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} /></div>
            </div>
            <Form.Group className="mb-3"><Form.Label>Địa chỉ</Form.Label><Form.Control as="textarea" rows={2} value={formData.DiaChi} onChange={e => setFormData({...formData, DiaChi: e.target.value})} /></Form.Group>
            {!isEdit && (
                <div className="row">
                    <div className="col-md-6 mb-3"><Form.Label>Username</Form.Label><Form.Control required value={formData.TenDangNhap} onChange={e => setFormData({...formData, TenDangNhap: e.target.value})} /></div>
                    <div className="col-md-6 mb-3"><Form.Label>Password</Form.Label><Form.Control required value={formData.MatKhau} onChange={e => setFormData({...formData, MatKhau: e.target.value})} /></div>
                </div>
            )}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button type="submit" variant="primary">Lưu thông tin</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default CustomerList;