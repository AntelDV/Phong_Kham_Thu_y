import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Printer, PlusLg } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null); // State hóa đơn cần in
  const [formData, setFormData] = useState({ MaKH: 1, MaNV: 1, MaBA: null, TongTien: 0, HinhThucTT: 'TienMat' });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    const res = await axios.get('http://localhost:5000/api/invoices');
    setInvoices(res.data);
  };
  
  const fetchCustomers = async () => {
    const res = await axios.get('http://localhost:5000/api/customers');
    setCustomers(res.data);
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:5000/api/invoices', formData);
      setShowModal(false);
      fetchInvoices();
    } catch (err) { alert('Error'); }
  };

  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
    // Đợi state cập nhật xong mới in
    setTimeout(() => {
        window.print();
        setPrintInvoice(null); // In xong thì reset
    }, 500);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div><h2 className="fw-bold text-dark">Hóa Đơn & Thanh Toán</h2><p className="text-muted">Lịch sử giao dịch</p></div>
        <Button variant="primary" className="shadow-sm d-flex gap-2 align-items-center" onClick={() => setShowModal(true)}>
          <PlusLg /> Lập hóa đơn lẻ
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden no-print" style={{ borderRadius: '20px' }}>
        <Table hover responsive className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3">Mã HĐ</th>
              <th>Khách hàng</th>
              <th>Nhân viên lập</th>
              <th>Ngày tạo</th>
              <th>Hình thức</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <motion.tr key={inv.MaHD} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <td className="ps-4 fw-bold text-primary">#{inv.MaHD}</td>
                <td className="fw-semibold">{inv.TenKhach}</td>
                <td className="text-muted small">{inv.TenNhanVien || 'Admin'}</td>
                <td>{new Date(inv.NgayTao).toLocaleDateString('vi-VN')}</td>
                <td>{inv.HinhThucTT === 'ChuyenKhoan' ? <Badge bg="info">CK Ngân hàng</Badge> : <Badge bg="light" text="dark" className="border">Tiền mặt</Badge>}</td>
                <td className="fw-bold fs-6">{inv.TongTien.toLocaleString()} ₫</td>
                <td><Badge bg="success" className="px-3 py-2 rounded-pill">Đã thanh toán</Badge></td>
                <td className="text-end pe-4">
                    <Button variant="link" className="text-muted" onClick={() => handlePrint(inv)}><Printer/></Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* KHUNG IN HÓA ĐƠN (Chỉ hiện khi in) */}
      {printInvoice && (
        <div id="printable-area">
            <div className="text-center mb-4">
                <h2>PHÒNG KHÁM THÚ Y PET CLINIC</h2>
                <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                <h3>HÓA ĐƠN THANH TOÁN</h3>
            </div>
            <div className="mb-3">
                <p><strong>Mã HĐ:</strong> #{printInvoice.MaHD}</p>
                <p><strong>Khách hàng:</strong> {printInvoice.TenKhach}</p>
                <p><strong>Ngày lập:</strong> {new Date(printInvoice.NgayTao).toLocaleString('vi-VN')}</p>
                <p><strong>Nhân viên:</strong> {printInvoice.TenNhanVien || 'Admin'}</p>
            </div>
            <table className="table table-bordered">
                <thead><tr><th>Nội dung</th><th>Thành tiền</th></tr></thead>
                <tbody>
                    <tr><td>Dịch vụ & Thuốc</td><td>{printInvoice.TongTien.toLocaleString()} ₫</td></tr>
                    <tr><td className="fw-bold text-end">TỔNG CỘNG</td><td className="fw-bold">{printInvoice.TongTien.toLocaleString()} ₫</td></tr>
                </tbody>
            </table>
            <div className="text-center mt-5">
                <p><i>Cảm ơn quý khách và hẹn gặp lại!</i></p>
            </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="soft-modal no-print">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold text-primary">Thanh Toán Mới</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Khách hàng</Form.Label>
              <Form.Select onChange={e => setFormData({...formData, MaKH: e.target.value})}>
                {customers.map(c => <option key={c.MaKH} value={c.MaKH}>{c.HoTen}</option>)}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Tổng tiền (VNĐ)</Form.Label>
                <Form.Control type="number" value={formData.TongTien} onChange={e => setFormData({...formData, TongTien: e.target.value})} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Hình thức</Form.Label>
                <Form.Select onChange={e => setFormData({...formData, HinhThucTT: e.target.value})}>
                  <option value="TienMat">Tiền mặt</option>
                  <option value="ChuyenKhoan">Chuyển khoản</option>
                </Form.Select>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button variant="primary" onClick={handleCreate}>Thanh toán ngay</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default InvoiceList;