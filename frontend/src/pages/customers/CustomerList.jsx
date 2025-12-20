import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/khach_hang')
      .then(res => res.json())
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(err => setLoading(false));
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bold text-dark mb-1">Khách Hàng</h3>
           <p className="text-muted mb-0">Quản lý hồ sơ chủ nuôi thú cưng</p>
        </div>
        <button className="btn-grad">
          <i className="bi bi-person-plus-fill me-2"></i> Thêm Mới
        </button>
      </div>

      <div className="table-responsive">
        <table className="table-modern">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Tên Chủ Nuôi</th>
              <th>Liên Hệ</th>
              <th>Địa Chỉ</th>
              <th>Ngày Đăng Ký</th>
              <th className="text-end">Tác Vụ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td></tr>
            ) : customers.map((cus) => (
              <tr key={cus.id}>
                <td className="fw-bold text-success">#{cus.id}</td>
                <td>
                   <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-light text-success fw-bold d-flex align-items-center justify-content-center me-3" style={{width: 40, height: 40}}>
                         {cus.hoten.charAt(0)}
                      </div>
                      <span className="fw-bold text-dark">{cus.hoten}</span>
                   </div>
                </td>
                <td>
                   <div className="d-flex flex-column">
                      <span className="fw-bold text-dark"><i className="bi bi-phone me-1 text-muted"></i>{cus.sdt}</span>
                      <small className="text-muted">{cus.email}</small>
                   </div>
                </td>
                <td className="text-muted">{cus.diachi}</td>
                <td><span className="badge bg-light text-dark border">{cus.ngay_dk}</span></td>
                <td className="text-end">
                   <button className="btn btn-sm btn-light text-primary me-2 shadow-sm"><i className="bi bi-pencil-fill"></i></button>
                   <button className="btn btn-sm btn-light text-danger shadow-sm"><i className="bi bi-trash-fill"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;