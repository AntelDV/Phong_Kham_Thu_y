import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CustomerList from './pages/customers/CustomerList';
import PetList from './pages/pets/PetList';
import BookingCalendar from './pages/booking/BookingCalendar';
import ExaminationPage from './pages/examination/ExaminationPage';
import InventoryList from './pages/inventory/InventoryList';
import InvoiceList from './pages/invoice/InvoiceList';
import ProfilePage from './pages/profile/ProfilePage';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="pets" element={<PetList />} />
          <Route path="booking" element={<BookingCalendar />} />
          <Route path="examination" element={<ExaminationPage />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="invoice" element={<InvoiceList />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;