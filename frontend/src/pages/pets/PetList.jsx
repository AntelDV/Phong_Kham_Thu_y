import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/thu_cung')
      .then(res => res.json())
      .then(data => { setPets(data); setLoading(false); });
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
           <h3 className="fw-bold text-dark mb-1">Hồ Sơ Thú Cưng</h3>
           <p className="text-muted mb-0">Theo dõi sức khỏe các bé</p>
        </div>
        <button className="btn-grad">
          <i className="bi bi-plus-circle-fill me-2"></i> Tiếp Nhận
        </button>
      </div>

      <div className="row g-4">
        {loading ? <div className="text-center w-100">Đang tải...</div> : pets.map((pet) => (
          <div className="col-12 col-md-6 col-xl-4" key={pet.id}>
            <div className="glass-card p-0 h-100 d-flex flex-column">
              <div className="p-4 d-flex align-items-center border-bottom bg-light bg-opacity-25">
                 <div className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center shadow-sm ${pet.loai === 'Chó' ? 'bg-warning text-white' : 'bg-info text-white'}`} style={{width: 60, height: 60}}>
                    <i className={`fs-3 bi ${pet.loai === 'Chó' ? 'bi-emoji-smile' : 'bi-emoji-heart-eyes'}`}></i>
                 </div>
                 <div>
                    <h5 className="fw-bold mb-0 text-dark">{pet.ten}</h5>
                    <span className="badge bg-white text-secondary border mt-1">{pet.giong}</span>
                 </div>
                 <div className="ms-auto text-end">
                    <span className="d-block fw-bold text-success fs-5">{pet.can_nang}kg</span>
                    <small className="text-muted">{pet.tuoi} tuổi</small>
                 </div>
              </div>
              
              <div className="p-4 flex-grow-1">
                 <div className="d-flex justify-content-between mb-3 bg-light p-2 rounded">
                    <small className="text-muted">Chủ nuôi:</small>
                    <strong className="text-dark">Mã KH #{pet.khach_hang_id}</strong>
                 </div>
                 <div className="mb-3">
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem'}}>Tiền sử bệnh án</small>
                    <p className="mb-0 mt-1 fst-italic text-dark">{pet.tieu_su_benh || "Sức khỏe tốt"}</p>
                 </div>
              </div>

              <div className="p-3 border-top bg-light bg-opacity-10 d-flex gap-2">
                 <button className="btn btn-outline-modern w-100 btn-sm">Chi tiết</button>
                 <button className="btn btn-grad w-100 btn-sm">Khám ngay</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetList;