import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorListPage from './pages/patient/DoctorListPage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import AppointmentHistoryPage from './pages/patient/AppointmentHistoryPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute roles={['PATIENT']}>
              <AppLayout><PatientDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute roles={['PATIENT']}>
              <AppLayout><DoctorListPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/book/:doctorId" element={
            <ProtectedRoute roles={['PATIENT']}>
              <AppLayout><BookAppointmentPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={['PATIENT']}>
              <AppLayout><AppointmentHistoryPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <ProtectedRoute roles={['DOCTOR']}>
              <AppLayout><DoctorDashboard /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
