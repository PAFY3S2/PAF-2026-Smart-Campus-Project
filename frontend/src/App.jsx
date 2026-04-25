import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import TechnicianLayout from './layouts/technician/TechnicianLayout';

// Pages
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Resources from './pages/resources/Resources';
import Bookings from './pages/bookings/Bookings';
import MyBookings from './pages/bookings/MyBookings';
import AdminBookings from './pages/bookings/AdminBookings';
import Tickets from './pages/tickets/Tickets';
import MyTickets from './pages/tickets/MyTickets';
import AdminTickets from './pages/tickets/AdminTickets';
import AdminTechnicians from './pages/dashboard/AdminTechnicians';
import UserManagement from './pages/admin/UserManagement';
import UserDetail from './pages/admin/UserDetail';
import Profile from './pages/profile/Profile';

// Member 1: Resource Pages
import AddResource from './pages/admin/resources/AddResource';
import EditResource from './pages/admin/resources/EditResource';
import ResourceDetails from './pages/resources/ResourceDetails';

// Technician Pages
import TechDashboard from './pages/technician/Dashboard';
import TechInProgress from './pages/technician/InProgress';
import TechResolved from './pages/technician/Resolved';
import TechPriority from './pages/technician/Priority';
import TechClosedHistory from './pages/technician/ClosedHistory';
import TechTicketDetails from './pages/technician/TicketDetailsPage';
import TechProfile from './pages/technician/Profile';

import RegisterPage from './pages/RegisterPage';

// Handles the redirect back from Google OAuth - picks up ?token=... and navigates to /dashboard
const OAuth2Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role === 'TECHNICIAN') {
          navigate('/technician/dashboard', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Token decode failed', e);
      }
    }
    navigate('/dashboard', { replace: true });
  }, [navigate]);
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#F5AB24] border-t-[#142B5D] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Signing you in...</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* Technician specialized layout */}
            <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><TechnicianLayout /></ProtectedRoute>}>
              <Route path="/technician/dashboard" element={<TechDashboard />} />
              <Route path="/technician/in-progress" element={<TechInProgress />} />
              <Route path="/technician/resolved" element={<TechResolved />} />
              <Route path="/technician/priority" element={<TechPriority />} />
              <Route path="/technician/closed" element={<TechClosedHistory />} />
              <Route path="/technician/profile" element={<TechProfile />} />
              <Route path="/technician/tickets/details/:id" element={<TechTicketDetails />} />
            </Route>

            {/* Main Layout for Users and Admin */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetails />} />
              <Route path="/profile" element={<Profile />} />

              {/* User Routes */}
              <Route path="/bookings" element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']}><Bookings /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['USER']}><MyBookings /></ProtectedRoute>} />
              <Route path="/tickets" element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'MANAGER']}><Tickets /></ProtectedRoute>} />
              <Route path="/my-tickets" element={<ProtectedRoute allowedRoles={['USER']}><MyTickets /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />
              <Route path="/admin/technicians" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTechnicians /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserDetail /></ProtectedRoute>} />
              
              {/* Member 1: Resource Management Admin Routes */}
              <Route path="/admin/resources/add" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddResource /></ProtectedRoute>} />
              <Route path="/admin/resources/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditResource /></ProtectedRoute>} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
