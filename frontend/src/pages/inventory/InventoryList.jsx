import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const InventoryList = () => {
  const [medicines, setMedicines] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/thuoc')
      .then(res => res.json())
      .then(data => setMedicines(data));
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-up">
        <h2 className="fw-bold text-primary">Kho Thuốc & Vật Tư</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-light text-primary fw-bold shadow-sm">
            <i className="bi bi-download me-2"></i> Nhập Kho
          </button>
          <button className="btn-modern">
            <i className="bi bi-upload me-2"></i> Xuất Kho
          </button>
        </div>
      </div>

      <div className="row g-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {medicines.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={item.id}>
            <div className="glass-panel h-100 p-0 overflow-hidden card-hover">
              <div className="p-3 bg-white bg-opacity-40 border-bottom d-flex justify-content-between align-items-center">
                <span className="badge bg-primary">{item.dvt}</span>
                <small className="text-muted fw-bold">HSD: {item.han_sd}</small>
              </div>
              <div className="p-4 text-center">
                <div className="mb-3 d-inline-block p-3 rounded-circle bg-success bg-opacity-10 text-success">
                   <i className="bi bi-capsule fs-1"></i>
                </div>
                <h5 className="fw-bold text-dark mb-1">{item.ten_thuoc}</h5>
                <p className="text-muted small mb-3">Mã: TH00{item.id}</p>
                <h3 className="text-primary fw-bold mb-0">{item.so_luong_ton}</h3>
                <small className="text-muted">Tồn kho</small>
              </div>
              <div className="p-3 bg-light bg-opacity-50 border-top d-flex justify-content-between">
                <div>
                   <small className="d-block text-muted">Giá nhập</small>
                   <span className="fw-bold">{item.gia_nhap?.toLocaleString()}</span>
                </div>
                <div className="text-end">
                   <small className="d-block text-muted">Giá xuất</small>
                   <span className="fw-bold text-success">{item.gia_xuat?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;