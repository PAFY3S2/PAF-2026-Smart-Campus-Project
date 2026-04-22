import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Lazy loading could be added here, using simple imports for now
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Resources from '../pages/resources/Resources';
import Bookings from '../pages/bookings/Bookings';
import MyBookings from '../pages/bookings/MyBookings';
import AdminBookings from '../pages/bookings/AdminBookings';
import Tickets from '../pages/tickets/Tickets';
import MyTickets from '../pages/tickets/MyTickets';
import AdminTickets from '../pages/tickets/AdminTickets';
import Profile from '../pages/profile/Profile';
import Home from '../pages/home/Home';
import UserManagement from '../pages/admin/UserManagement.jsx';
import UserDetail from '../pages/admin/UserDetail.jsx';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* User Routes */}
        <Route path="/bookings" element={<ProtectedRoute allowedRoles={['USER']}><Bookings /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['USER']}><MyBookings /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute allowedRoles={['USER']}><Tickets /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute allowedRoles={['USER']}><MyTickets /></ProtectedRoute>} />

        {/* Admin/Technician Routes */}
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminTickets /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserDetail /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
