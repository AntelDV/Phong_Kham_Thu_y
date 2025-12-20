import React from 'react';
import '../../styles/custom.scss';

const AdminDashboard = () => {
  const stats = [
    { title: 'Tổng Khách', value: '1,240', icon: 'bi-people-fill', color: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' },
    { title: 'Thú Cưng', value: '856', icon: 'bi-github', color: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)' },
    { title: 'Lịch Hẹn', value: '15', icon: 'bi-calendar-check', color: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    { title: 'Doanh Thu', value: '45M', icon: 'bi-currency-dollar', color: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
  ];

  return (
    <div className="container-fluid page-enter">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Tổng Quan</h2>
          <p className="text-muted">Số liệu hoạt động trong ngày hôm nay.</p>
        </div>
        <button className="btn-grad shadow-lg">
          <i className="bi bi-printer-fill me-2"></i> Xuất Báo Cáo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
            <div className="glass-card p-4 text-white h-100 position-relative border-0" 
                 style={{background: stat.color}}>
              <div className="position-relative z-1">
                 <h6 className="text-white text-uppercase opacity-75 mb-2 fw-bold">{stat.title}</h6>
                 <h2 className="fw-bold mb-0 display-5">{stat.value}</h2>
              </div>
              <i className={`bi ${stat.icon} position-absolute`} 
                 style={{fontSize: '6rem', right: '-20px', bottom: '-30px', opacity: 0.2, transform: 'rotate(-10deg)'}}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h5 className="fw-bold text-dark border-start border-4 border-success ps-3">Lịch Hẹn Gần Nhất</h5>
               <button className="btn btn-sm btn-light text-success fw-bold">Xem tất cả</button>
            </div>
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Khách Hàng</th>
                    <th>Dịch Vụ</th>
                    <th>Thời Gian</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center">
                           <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{width: 40, height: 40}}>
                              <i className="bi bi-person-fill text-success"></i>
                           </div>
                           <span className="fw-bold">Nguyễn Văn A</span>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border">Tiêm Vaccine</span></td>
                      <td>09:00 AM</td>
                      <td><span className="badge bg-success rounded-pill px-3">Hoàn thành</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-lg-4">
           <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-start border-4 border-primary ps-3">Thông Báo</h5>
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="d-flex gap-3 mb-4 align-items-start">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2 text-primary">
                       <i className="bi bi-bell-fill"></i>
                    </div>
                    <div>
                       <h6 className="mb-1 fw-bold text-dark">Hệ thống cập nhật</h6>
                       <p className="text-muted small mb-0">Đã đồng bộ dữ liệu mới...</p>
                    </div>
                    <small className="text-muted ms-auto">5p</small>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;