import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const ExaminationPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/benh_an')
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-up">
        <h2 className="fw-bold text-primary">Khám Chữa Bệnh</h2>
        <button className="btn-modern bg-danger border-0">
          <i className="bi bi-heart-pulse-fill me-2"></i> Ca Cấp Cứu
        </button>
      </div>

      <div className="row g-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {records.map((rec, index) => (
          <div className="col-12 col-xl-6" key={rec.id}>
            <div className="glass-panel p-4 h-100 card-hover">
              <div className="d-flex justify-content-between mb-3">
                 <span className="badge bg-primary">BA #{rec.id}</span>
                 <span className="text-muted small">{rec.ngay_kham}</span>
              </div>
              <div className="d-flex gap-3 mb-4">
                <div className="bg-light p-3 rounded flex-grow-1">
                  <small className="text-uppercase text-muted fw-bold d-block mb-1">Thú Cưng</small>
                  <span className="fw-bold fs-5">ID #{rec.thu_cung_id}</span>
                </div>
                <div className="bg-light p-3 rounded flex-grow-1">
                  <small className="text-uppercase text-muted fw-bold d-block mb-1">Bác Sĩ</small>
                  <span className="fw-bold fs-5">ID #{rec.bac_si_id}</span>
                </div>
              </div>
              <div className="mb-3">
                <h6 className="fw-bold text-danger"><i className="bi bi-activity me-2"></i>Chẩn đoán:</h6>
                <p className="mb-0 bg-white bg-opacity-50 p-2 rounded">{rec.chan_doan}</p>
              </div>
              <div>
                <h6 className="fw-bold text-success"><i className="bi bi-check-circle me-2"></i>Kết luận:</h6>
                <p className="mb-0 bg-white bg-opacity-50 p-2 rounded">{rec.ket_luan}</p>
              </div>
              <hr />
              <div className="text-end">
                <button className="btn btn-sm btn-outline-primary">Xem Đơn Thuốc</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExaminationPage;