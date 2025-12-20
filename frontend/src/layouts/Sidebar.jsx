import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HouseDoor, People, HeartPulse, CalendarCheck, Receipt, BoxSeam, BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import PawLogo from '../components/common/PawLogo';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        const savedAvatar = localStorage.getItem(`avatar_${parsed.MaNV || parsed.MaKH}`);
        setAvatar(savedAvatar);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const normalizeRole = (dbRole) => {
    if (!dbRole) return 'KhachHang';
    if (dbRole === 'QuanLy' || dbRole === 'Quản lý' || dbRole === 'Admin') return 'Admin';
    if (dbRole === 'BacSi' || dbRole === 'Bác sĩ') return 'BacSi';
    if (dbRole === 'LeTan' || dbRole === 'Lễ tân') return 'LeTan';
    return 'KhachHang';
  };

  const getMenuItems = (dbRole) => {
    const role = normalizeRole(dbRole);
    const allItems = [
      { path: '/dashboard', name: 'Tổng quan', icon: <HouseDoor size={20} />, roles: ['Admin', 'BacSi', 'LeTan'] },
      { path: '/bookings', name: 'Đặt lịch hẹn', icon: <CalendarCheck size={20} />, roles: ['Admin', 'LeTan', 'KhachHang'] },
      { path: '/pets', name: 'Hồ sơ Thú cưng', icon: <HeartPulse size={20} />, roles: ['Admin', 'BacSi', 'KhachHang'] },
      { path: '/examination', name: 'Khám bệnh', icon: <HeartPulse size={20} />, roles: ['Admin', 'BacSi'] },
      { path: '/customers', name: 'Khách hàng', icon: <People size={20} />, roles: ['Admin', 'LeTan'] },
      { path: '/invoices', name: 'Hóa đơn & Thu chi', icon: <Receipt size={20} />, roles: ['Admin', 'LeTan'] },
      { path: '/inventory', name: 'Kho thuốc', icon: <BoxSeam size={20} />, roles: ['Admin', 'BacSi'] },
    ];
    return allItems.filter(item => role === 'Admin' || item.roles.includes(role));
  };

  const menuItems = getMenuItems(user?.ChucVu);

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 h-100 sidebar-wrapper" style={{ width: '280px' }}>
      <div className="d-flex align-items-center mb-4 px-2">
        <div className="bg-white rounded-circle p-1">
             <PawLogo width={35} color="#00b09b" />
        </div>
        <span className="fs-4 fw-bold ms-2 text-white">Pet Clinic</span>
      </div>
      
      <div 
        className="mb-4 px-3 py-3 bg-white bg-opacity-10 rounded-4 d-flex align-items-center gap-3 cursor-pointer border border-white border-opacity-25"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/profile')}
      >
        {avatar ? (
            <img src={avatar} alt="" className="rounded-circle border border-2 border-white" style={{width: 40, height: 40, objectFit: 'cover'}} />
        ) : (
            <PersonCircle size={40} className="text-white opacity-75" />
        )}
        <div style={{ overflow: 'hidden' }}>
            <div className="fw-bold text-white text-truncate">{user?.HoTen || 'Khách'}</div>
            <div className="small text-white opacity-75">{user?.ChucVu || 'Guest'}</div>
        </div>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink 
              to={item.path}
              className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-3 ${isActive ? 'active-menu' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto border-top border-white border-opacity-25 pt-3">
        <button onClick={handleLogout} className="btn w-100 d-flex align-items-center justify-content-center gap-2 sidebar-footer-btn fw-bold">
            <BoxArrowRight /> Đăng xuất
        </button>
      </div>
    </div>
  );
};
export default Sidebar;