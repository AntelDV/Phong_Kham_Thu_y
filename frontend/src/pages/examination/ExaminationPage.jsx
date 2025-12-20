import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Activity, Prescription2, PlusCircle, Trash } from 'react-bootstrap-icons';
import axios from 'axios';

const ExaminationPage = () => {
  const [bookings, setBookings] = useState([]);
  const [medicines, setMedicines] = useState([]);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [examData, setExamData] = useState({ TrieuChung: '', ChanDoan: '', KetLuan: '' });
  const [prescription, setPrescription] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBook = await axios.get('http://localhost:5000/api/bookings');
        setBookings(resBook.data.filter(b => b.TrangThai === 'ChoKham'));
        const resMed = await axios.get('http://localhost:5000/api/medicines');
        setMedicines(resMed.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddMedicine = () => {
    if (medicines.length === 0) return alert("Kho thuốc đang trống!");
    setPrescription([...prescription, { MaThuoc: medicines[0]?.MaThuoc, SoLuong: 1, CachDung: '' }]);
  };

  const updatePrescription = (index, field, value) => {
    const newPres = [...prescription];
    newPres[index][field] = value;
    setPrescription(newPres);
  };

  const removeMedicine = (index) => {
    setPrescription(prescription.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedBooking) return alert('Chưa chọn bệnh nhân!');
    const payload = {
      MaLH: selectedBooking.MaLH,
      MaTC: selectedBooking.MaTC,
      MaBS: selectedBooking.MaBS || 1, 
      ...examData,
      Medicines: prescription
    };

    try {
      await axios.post('http://localhost:5000/api/examinations', payload);
      alert('Đã lưu bệnh án & Trừ kho thành công!');
      window.location.reload();
    } catch (err) { 
      console.error(err);
      alert('Lỗi: ' + (err.response?.data?.error || err.message)); 
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="fw-bold text-dark mb-4">Khám Bệnh & Điều Trị</h2>
      <Row>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-0 pt-4 pb-0"><h5 className="fw-bold text-primary">Hàng đợi khám</h5></Card.Header>
            <Card.Body>
              {bookings.length === 0 ? <p className="text-muted">Không có bệnh nhân chờ.</p> : 
                bookings.map(b => (
                  <div key={b.MaLH} 
                    className={`p-3 mb-2 rounded-3 cursor-pointer border ${selectedBooking?.MaLH === b.MaLH ? 'bg-primary text-white border-primary' : 'bg-light border-light'}`}
                    onClick={() => setSelectedBooking(b)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fw-bold">{b.TenTC} ({b.LoaiHen})</div>
                    <div className="small opacity-75">Chủ: {b.TenKhach}</div>
                  </div>
                ))
              }
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <Card.Body className="p-4">
              {selectedBooking ? (
                <>
                  <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                    <Activity size={24}/>
                    <h4 className="mb-0 fw-bold">Đang khám: {selectedBooking.TenTC}</h4>
                  </div>
                  
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Triệu chứng lâm sàng</Form.Label>
                      <Form.Control as="textarea" rows={2} value={examData.TrieuChung} onChange={e => setExamData({...examData, TrieuChung: e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Chẩn đoán</Form.Label>
                      <Form.Control type="text" value={examData.ChanDoan} onChange={e => setExamData({...examData, ChanDoan: e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Kết luận / Dặn dò</Form.Label>
                      <Form.Control as="textarea" rows={2} value={examData.KetLuan} onChange={e => setExamData({...examData, KetLuan: e.target.value})} />
                    </Form.Group>

                    <hr className="my-4"/>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0 text-success"><Prescription2 className="me-2"/>Kê Đơn Thuốc</h5>
                      <Button variant="light" size="sm" className="text-success fw-bold" onClick={handleAddMedicine}><PlusCircle/> Thêm thuốc</Button>
                    </div>

                    <Table borderless className="align-middle">
                      <thead className="text-muted small border-bottom">
                        <tr><th style={{width: '40%'}}>Tên thuốc</th><th style={{width: '20%'}}>Số lượng</th><th style={{width: '35%'}}>Cách dùng</th><th></th></tr>
                      </thead>
                      <tbody>
                        {prescription.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <Form.Select size="sm" value={item.MaThuoc} onChange={e => updatePrescription(idx, 'MaThuoc', e.target.value)}>
                                {medicines.map(m => (
                                  <option key={m.MaThuoc} value={m.MaThuoc} disabled={m.SoLuongTon <= 0}>
                                    {m.TenThuoc} (Tồn: {m.SoLuongTon})
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control size="sm" type="number" min="1" value={item.SoLuong} onChange={e => updatePrescription(idx, 'SoLuong', e.target.value)} />
                            </td>
                            <td>
                              <Form.Control size="sm" type="text" placeholder="Sáng/Chiều..." value={item.CachDung} onChange={e => updatePrescription(idx, 'CachDung', e.target.value)} />
                            </td>
                            <td><Button variant="link" className="text-danger p-0" onClick={() => removeMedicine(idx)}><Trash/></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-end mt-4">
                      <Button size="lg" variant="primary" className="px-5 shadow" style={{borderRadius: '12px'}} onClick={handleSave}>
                        Hoàn tất khám
                      </Button>
                    </div>
                  </Form>
                </>
              ) : (
                <div className="text-center py-5 text-muted">
                  <Activity size={48} className="mb-3 opacity-50"/>
                  <p>Vui lòng chọn bệnh nhân từ hàng đợi để bắt đầu khám.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ExaminationPage;