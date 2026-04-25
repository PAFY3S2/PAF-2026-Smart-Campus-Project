import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCog, ArrowLeft, Search, Users, ShieldCheck, HardHat, Briefcase, RefreshCw, MoreVertical, ExternalLink } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useWebSocket } from '../hooks/useWebSocket';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboardPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, admins: 0, technicians: 0, managers: 0, students: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { notifications: liveNotifications } = useWebSocket(user?.id);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/users/stats')
      ]);
      setUsersList(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
      // Refresh stats after role change
      const statsRes = await api.get('/admin/users/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/10`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'TECHNICIAN': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'MANAGER': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-outfit">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center sticky top-0 z-30 shadow-sm">
         <a href="/dashboard" className="mr-6 text-gray-400 hover:text-gray-900 transition-all p-2 rounded-xl hover:bg-gray-100 group">
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
         </a>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/20 flex items-center justify-center">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Management & Oversight</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-transparent border-none outline-none text-sm w-48 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <NotificationBell liveNotifications={liveNotifications} />
          
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-white shadow-sm flex items-center justify-center text-rose-600 font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-indigo-500" delay={0.1} />
          <StatCard title="Admins" value={stats.admins} icon={ShieldCheck} color="bg-rose-500" delay={0.2} />
          <StatCard title="Technicians" value={stats.technicians} icon={HardHat} color="bg-amber-500" delay={0.3} />
          <StatCard title="Managers" value={stats.managers} icon={Briefcase} color="bg-blue-500" delay={0.4} />
        </div>

        {/* User Management Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                 <UserCog size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-900">User Directory</h2>
                 <p className="text-sm text-gray-500 font-medium">Manage permissions and roles</p>
               </div>
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all font-bold text-sm border border-gray-200"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Identified User</th>
                  <th className="px-8 py-5">Authentication</th>
                  <th className="px-8 py-5">Registration Date</th>
                  <th className="px-8 py-5 text-right">System Role</th>
                  <th className="px-8 py-5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan="5" className="text-center py-20">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="animate-spin text-rose-500" size={32} />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Synchronizing Database...</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : filteredUsers.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan="5" className="text-center py-20 text-gray-400">
                        <p className="text-lg font-bold">No users matched your search</p>
                        <p className="text-sm">Try adjusting your filters or search term</p>
                      </td>
                    </motion.tr>
                  ) : (
                    filteredUsers.map((u, index) => (
                      <motion.tr 
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gray-50/80 transition-all"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                              {u.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{u.name}</span>
                              <span className="text-xs text-gray-400 font-medium">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${u.provider === 'GOOGLE' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            {u.provider}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            disabled={u.id === user.id}
                            className={`text-xs font-black uppercase tracking-wider rounded-xl border-2 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer px-4 py-2 ${getRoleStyle(u.role)} ${u.id === user.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                          >
                            <option value="USER">Student</option>
                            <option value="TECHNICIAN">Technician</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Administrator</option>
                          </select>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 opacity-0 group-hover:opacity-100">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">
              Showing {filteredUsers.length} of {usersList.length} total entries
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50">Next</button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
