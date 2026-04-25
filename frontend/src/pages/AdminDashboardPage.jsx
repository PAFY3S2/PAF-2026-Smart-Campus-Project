import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCog, ArrowLeft, Users, Activity, ShieldCheck, Mail, Database } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useWebSocket } from '../hooks/useWebSocket';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-[#050b18] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>

      <header className="glass-dark border-b border-slate-700/50 px-8 py-4 flex items-center sticky top-0 z-50 backdrop-blur-2xl">
         <motion.a 
            whileHover={{ x: -5 }}
            href="/dashboard" 
            className="mr-6 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
         >
           <ArrowLeft size={20} />
         </motion.a>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-500/20 flex items-center justify-center border border-white/10">
            <Shield className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight text-glow">Admin Command Center</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">Nexus Security Protocol Active</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 mr-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">System Status</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-semibold text-emerald-500">Operational</span>
                </div>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Database</span>
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                   <Database size={12} /> Connected
                </span>
             </div>
          </div>

          <NotificationBell liveNotifications={liveNotifications} />
          <div className="w-px h-8 bg-slate-700/50"></div>
          <div className="flex items-center gap-4 bg-slate-800/40 p-1.5 pr-4 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600/50 flex items-center justify-center text-slate-300 font-bold">
               {user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter flex items-center gap-1">
                 <ShieldCheck size={10} /> {user?.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Operators', value: usersList.length, icon: Users, color: 'blue' },
            { label: 'Active Sessions', value: '14', icon: Activity, color: 'emerald' },
            { label: 'Pending Approvals', value: '3', icon: Shield, color: 'amber' },
            { label: 'System Alerts', value: '0', icon: Activity, color: 'rose' }
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="glass-dark p-6 rounded-3xl border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`}>
                 <stat.icon size={120} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{loading ? '...' : stat.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* User Management Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 opacity-50"></div>
          
          <div className="p-8 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                   <UserCog className="text-blue-400" size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Identity Registry</h2>
                   <p className="text-sm text-slate-400">Modify access levels and authentication protocols</p>
                </div>
             </div>
             
             <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2 text-xs font-bold text-slate-300">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   {usersList.length} TOTAL USERS
                </div>
             </div>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-[11px] uppercase tracking-[0.15em] font-black text-slate-500 border-b border-slate-700/50">
                  <th className="px-8 py-5">Identity Protocol</th>
                  <th className="px-8 py-5">Origin</th>
                  <th className="px-8 py-5">Registry Date</th>
                  <th className="px-8 py-5 text-right">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                         <span className="text-slate-400 font-bold tracking-widest text-[10px]">DECRYPTING REGISTRY...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {usersList.map((u, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        key={u.id} 
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                                {u.name?.charAt(0)}
                             </div>
                             <div className="flex flex-col">
                               <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{u.name}</span>
                               <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <Mail size={12} className="opacity-50" /> {u.email}
                               </span>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1.5 bg-slate-800/50 text-slate-300 border border-slate-700/50 rounded-lg text-[10px] font-black tracking-widest uppercase">
                            {u.provider}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-slate-400 text-sm font-medium">
                          {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            disabled={u.id === user.id}
                            className={`text-xs font-black tracking-widest uppercase rounded-xl border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${u.id === user.id ? 'opacity-30 cursor-not-allowed bg-slate-900' : 'bg-slate-900 hover:bg-slate-800 shadow-lg border-2 px-4 py-2.5 cursor-pointer appearance-none'}`}
                          >
                            <option value="USER">USER</option>
                            <option value="TECHNICIAN">TECHNICIAN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-900/30 border-t border-slate-700/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             <span>Security Protocol v4.2.0</span>
             <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                Encryption Level: AES-256
             </span>
          </div>
        </motion.div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 114, 143, 0.5);
        }
      `}} />
    </div>
  );
};

export default AdminDashboardPage;
