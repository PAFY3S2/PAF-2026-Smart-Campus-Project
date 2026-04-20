import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import { useWebSocket } from '../hooks/useWebSocket';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { notifications: liveNotifications } = useWebSocket(user?.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 shadow-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm">CH</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Campus Hub</h1>
        </div>
        <div className="flex items-center gap-6">
          <NotificationBell liveNotifications={liveNotifications} />
          
          <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{user?.role}</span>
            </div>
            <button 
              onClick={logout}
              className="text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
              <p className="text-gray-500">Your campus hub is ready. What would you like to do today?</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl w-full md:w-auto">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <span className="font-bold text-lg">{user?.name ? user.name.charAt(0) : 'U'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
                <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white w-fit tracking-wide">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
              <h3 className="font-bold text-blue-900 mb-2">My Bookings</h3>
              <p className="text-sm text-blue-700">View and manage your facility bookings.</p>
            </div>
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 p-6 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
              <h3 className="font-bold text-teal-900 mb-2">Active Tickets</h3>
              <p className="text-sm text-teal-700">Track and update your maintenance requests.</p>
            </div>
            {user?.role === 'ADMIN' && (
               <div className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-6 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
               <h3 className="font-bold text-purple-900 mb-2">Admin Panel</h3>
               <p className="text-sm text-purple-700">Manage user roles and system settings.</p>
               <a href="/admin" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-800 underline underline-offset-4 decoration-purple-200">Go to Panel &rarr;</a>
             </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
