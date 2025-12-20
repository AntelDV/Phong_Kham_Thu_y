import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.scss';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import MainLayout from './layouts/MainLayout';
import PetList from './pages/pets/PetList';
import CustomerList from './pages/customers/CustomerList';
import BookingCalendar from './pages/booking/BookingCalendar';
import InventoryList from './pages/inventory/InventoryList';
import ExaminationPage from './pages/examination/ExaminationPage';
import InvoiceList from './pages/invoice/InvoiceList';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="/" element={<MainLayout />}>
             <Route path="dashboard" element={<AdminDashboard />} />
             <Route path="profile" element={<ProfilePage />} />
             <Route path="pets" element={<PetList />} />
             <Route path="customers" element={<CustomerList />} />
             <Route path="bookings" element={<BookingCalendar />} />
             <Route path="inventory" element={<InventoryList />} />
             <Route path="examination" element={<ExaminationPage />} />
             <Route path="invoices" element={<InvoiceList />} />
             <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<div className="text-center mt-5 text-white"><h1>404 Not Found</h1></div>} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </>
  );
}

export default App;