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
import AdminTechnicians from '../pages/dashboard/AdminTechnicians';
import TechnicianLayout from '../layouts/technician/TechnicianLayout';
import TechDashboard from '../pages/technician/Dashboard';
import TechInProgress from '../pages/technician/InProgress';
import TechResolved from '../pages/technician/Resolved';
import TechPriority from '../pages/technician/Priority';
import TechClosedHistory from '../pages/technician/ClosedHistory';
import TechTicketDetails from '../pages/technician/TicketDetailsPage';
import TechProfile from '../pages/technician/Profile';
import Home from '../pages/home/Home';
import Profile from '../pages/profile/Profile';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />

      {/* Technician Specialized Layout */}
      {user?.role === 'TECHNICIAN' && (
        <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><TechnicianLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/technician/dashboard" element={<TechDashboard />} />
          <Route path="/technician/in-progress" element={<TechInProgress />} />
          <Route path="/technician/resolved" element={<TechResolved />} />
          <Route path="/technician/priority" element={<TechPriority />} />
          <Route path="/technician/closed" element={<TechClosedHistory />} />
          <Route path="/technician/profile" element={<TechProfile />} />
          <Route path="/technician/tickets/details/:id" element={<TechTicketDetails />} />
          <Route path="/tickets/:id" element={<TechTicketDetails />} />
          {/* Compatibility for old links */}
          <Route path="/technician/tickets" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/technician/locations" element={<Navigate to="/technician/dashboard" replace />} />
        </Route>
      )}

      {/* Main Layout for Admin and Users */}
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
        <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />
        <Route path="/admin/technicians" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTechnicians /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
