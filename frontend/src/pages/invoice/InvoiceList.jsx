import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/hoa_don')
      .then(res => res.json())
      .then(data => setInvoices(data));
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-up">
        <h2 className="fw-bold text-primary">Hóa Đơn & Thanh Toán</h2>
        <button className="btn-modern">
          <i className="bi bi-plus-circle me-2"></i> Tạo Hóa Đơn
        </button>
      </div>

      <div className="glass-panel p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="text-uppercase text-secondary fs-7">
              <tr>
                <th className="py-3">Mã HĐ</th>
                <th className="py-3">Ngày Tạo</th>
                <th className="py-3">Khách Hàng</th>
                <th className="py-3">Thu Ngân</th>
                <th className="py-3 text-end">Tổng Tiền</th>
                <th className="py-3 text-center">Trạng Thái</th>
                <th className="py-3 text-end">Tác Vụ</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="fw-bold text-primary">#{inv.id}</td>
                  <td>{inv.ngay_tao}</td>
                  <td>KH #{inv.khach_hang_id}</td>
                  <td>NV #{inv.nhan_vien_id}</td>
                  <td className="text-end fw-bold fs-5 text-dark">
                    {inv.tong_tien?.toLocaleString()} đ
                  </td>
                  <td className="text-center">
                    <span className={`badge px-3 py-2 rounded-pill ${inv.trang_thai === 'Đã thanh toán' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                      {inv.trang_thai}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-light text-primary"><i className="bi bi-printer-fill"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;