import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCog, ArrowLeft } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useWebSocket } from '../hooks/useWebSocket';

const AdminDashboardPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { notifications: liveNotifications } = useWebSocket(user?.id);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsersList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role', error);
      alert('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center shadow-sm sticky top-0 z-10">
         <a href="/dashboard" className="mr-6 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
           <ArrowLeft size={20} />
         </a>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500 shadow-sm flex items-center justify-center">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <NotificationBell liveNotifications={liveNotifications} />
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-end mr-4">
            <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
            <span className="text-xs text-red-600 font-bold uppercase tracking-wider">{user?.role}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <UserCog className="text-gray-400" />
             <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Auth Provider</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">Loading users...</td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex flex-col">
                        <span className="font-semibold text-gray-800">{u.name}</span>
                        <span className="text-xs text-gray-500">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          {u.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          disabled={u.id === user.id} // prevent self-demotion
                          className={`text-sm rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 transition-shadow ${u.id === user.id ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white shadow-sm border px-3 py-1.5'}`}
                        >
                          <option value="USER">USER</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
