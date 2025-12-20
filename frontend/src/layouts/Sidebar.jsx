import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PawLogo from '../components/common/PawLogo'; // Import logo mới
import '../styles/custom.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ hoten: 'Guest', chuc_vu: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Đăng xuất khỏi hệ thống?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // --- LOGIC PHÂN QUYỀN (Menu Dynamic) ---
  const getAllMenus = () => {
    const role = user.chuc_vu || '';
    
    // Menu chung cho tất cả
    const common = [
      { path: '/', name: 'Tổng Quan', icon: 'bi-grid-fill' },
      { path: '/profile', name: 'Cá Nhân', icon: 'bi-person-circle' }
    ];

    // Menu của Bác sĩ
    const doctorMenus = [
      { path: '/booking', name: 'Lịch Hẹn', icon: 'bi-calendar-check-fill' },
      { path: '/examination', name: 'Khám Bệnh', icon: 'bi-heart-pulse-fill' },
      { path: '/pets', name: 'Thú Cưng', icon: 'bi-github' }
    ];

    // Menu của Lễ tân
    const receptionistMenus = [
      { path: '/customers', name: 'Khách Hàng', icon: 'bi-people-fill' },
      { path: '/booking', name: 'Đặt Lịch', icon: 'bi-calendar-plus-fill' },
      { path: '/invoice', name: 'Thu Ngân', icon: 'bi-cash-stack' },
      { path: '/pets', name: 'Thú Cưng', icon: 'bi-github' }
    ];

    // Menu của Admin (Quản trị viên)
    const adminMenus = [
      { path: '/customers', name: 'Khách Hàng', icon: 'bi-people-fill' },
      { path: '/pets', name: 'Thú Cưng', icon: 'bi-github' },
      { path: '/booking', name: 'Lịch Hẹn', icon: 'bi-calendar-week-fill' },
      { path: '/examination', name: 'Khám Bệnh', icon: 'bi-activity' },
      { path: '/inventory', name: 'Kho Thuốc', icon: 'bi-box-seam-fill' },
      { path: '/invoice', name: 'Tài Chính', icon: 'bi-graph-up-arrow' },
    ];

    // Trả về menu theo quyền
    if (role === 'Quản trị viên') return [...common, ...adminMenus];
    if (role === 'Bác sĩ') return [...common, ...doctorMenus];
    if (role === 'Lễ tân') return [...common, ...receptionistMenus];
    
    return common; // Mặc định
  };

  const menuItems = getAllMenus();

  return (
    <div className="sidebar-fixed">
      {/* Header Logo */}
      <div className="p-4 d-flex align-items-center justify-content-center border-bottom">
        <div className="me-2 animate-bounce">
           <PawLogo />
        </div>
        <div>
          <h4 className="fw-bold mb-0 text-dark" style={{letterSpacing: '-1px'}}>PetClinic</h4>
          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2">v2.5</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-grow-1 overflow-auto py-3 custom-scrollbar">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index} style={{animation: `slideInRight 0.4s ease-out forwards ${index * 0.05}s`, opacity: 0}}>
              <NavLink to={item.path} className="nav-link">
                <i className={`bi ${item.icon}`}></i>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Footer */}
      <div className="p-3 mt-auto border-top bg-light">
        <div className="d-flex align-items-center justify-content-between">
           <div className="d-flex align-items-center">
              <div className="rounded-circle bg-white border d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm me-2" style={{width: 40, height: 40}}>
                 {user.hoten.charAt(0)}
              </div>
              <div style={{lineHeight: '1.2', maxWidth: '140px'}}>
                 <span className="d-block fw-bold text-dark text-truncate" style={{fontSize: '0.9rem'}}>{user.hoten}</span>
                 <small className="text-muted" style={{fontSize: '0.75rem'}}>{user.chuc_vu}</small>
              </div>
           </div>
           <button onClick={handleLogout} className="btn btn-sm btn-white text-danger hover-bg-danger" title="Đăng xuất">
              <i className="bi bi-box-arrow-right fs-5"></i>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;