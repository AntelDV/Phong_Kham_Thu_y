import React, { useState, useEffect } from 'react';
import '../../styles/custom.scss';

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/lich_hen');
        const data = await res.json();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã hoàn thành': return 'bg-success bg-opacity-10 text-success';
      case 'Đang chờ': return 'bg-warning bg-opacity-10 text-warning';
      case 'Đã hủy': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-up">
        <div>
          <h2 className="fw-bold text-primary mb-1">Lịch Hẹn Khám</h2>
          <p className="text-muted mb-0">Quản lý các cuộc hẹn sắp tới</p>
        </div>
        <button className="btn-modern">
          <i className="bi bi-calendar-plus me-2"></i> Đặt Lịch Mới
        </button>
      </div>

      <div className="glass-panel p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="text-secondary text-uppercase fs-7 border-bottom">
              <tr>
                <th className="py-3">Thời Gian</th>
                <th className="py-3">Thú Cưng</th>
                <th className="py-3">Bác Sĩ</th>
                <th className="py-3">Dịch Vụ</th>
                <th className="py-3">Trạng Thái</th>
                <th className="py-3 text-end">Tác Vụ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="6" className="text-center py-5">Đang tải lịch hẹn...</td></tr>
              ) : bookings.map((item, index) => (
                <tr key={item.id} className="border-bottom-0 hover-bg" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards` }}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-bold fs-5">{new Date(item.thoi_gian).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <small className="text-muted">{new Date(item.thoi_gian).toLocaleDateString()}</small>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold text-dark d-block">TC #{item.thu_cung_id}</span>
                  </td>
                  <td>BS #{item.bac_si_id}</td>
                  <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{item.loai_hen}</span></td>
                  <td>
                    <span className={`badge px-3 py-2 rounded-pill ${getStatusBadge(item.trang_thai)}`}>
                      {item.trang_thai}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-icon btn-sm rounded-circle hover-scale text-primary bg-light me-2">
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button className="btn btn-icon btn-sm rounded-circle hover-scale text-danger bg-light">
                      <i className="bi bi-x-lg"></i>
                    </button>
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

export default BookingCalendar;