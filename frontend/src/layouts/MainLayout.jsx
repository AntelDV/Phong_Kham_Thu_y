import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', height: '100vh' }}>
        {/* Nơi nội dung các trang con sẽ hiển thị */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;