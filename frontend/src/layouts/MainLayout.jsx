import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import '../styles/custom.scss';

const MainLayout = () => {
  return (
    <div className="d-flex w-100">
      <Sidebar /> {/* Sidebar cố định bên trái */}
      <div className="flex-grow-1 min-vh-100 d-flex flex-column" style={{background: '#f1f5f9'}}>
        {/* Nội dung chính cuộn độc lập */}
        <div className="p-4 flex-grow-1 overflow-x-hidden">
           <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;