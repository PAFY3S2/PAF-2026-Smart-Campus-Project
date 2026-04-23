import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  ArrowUpRight,
  UserCheck,
  Wrench,
  GraduationCap,
  Mail,
  Hash,
  Building2,
  Phone,
  CalendarDays
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import technicianDefault from '../../assets/technician_default.png';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    api.get('/auth/users')
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let result = users;
    if (filterRole !== 'ALL') {
      result = result.filter(u => u.role === filterRole);
    }
    if (searchTerm) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.studentId && u.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredUsers(result);
  }, [searchTerm, filterRole, users]);

  // Stats
  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'USER').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    technicians: users.filter(u => u.role === 'TECHNICIAN').length,
  };

  const roleBadge = (role) => {
    const map = {
      ADMIN: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-1 ring-rose-500/30', icon: Shield, label: 'Admin' },
      TECHNICIAN: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/30', icon: Wrench, label: 'Technician' },
      USER: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-1 ring-blue-500/30', icon: GraduationCap, label: 'Student' },
    };
    return map[role] || map.USER;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div>
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block">
          MODULE U: PERSONNEL DIRECTORY
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">View and manage all registered users across the platform.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Students', val: stats.students, icon: GraduationCap, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Admins', val: stats.admins, icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
          { label: 'Technicians', val: stats.technicians, icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center justify-between`}
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
            <s.icon className={`w-8 h-8 ${s.color} opacity-40`} />
          </motion.div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, email, or student ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-slate-300 w-72 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {['ALL', 'USER', 'ADMIN', 'TECHNICIAN'].map(role => (
            <motion.button
              key={role}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all ${
                filterRole === role 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {role === 'USER' ? 'STUDENT' : role}
              {role !== 'ALL' && (
                <span className="ml-1.5 text-[8px] opacity-60">
                  ({role === 'USER' ? stats.students : role === 'ADMIN' ? stats.admins : role === 'TECHNICIAN' ? stats.technicians : stats.total})
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500 font-bold tracking-widest animate-pulse">LOADING USERS...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">No users match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">User</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Role</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Student ID</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Faculty</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Contact</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Joined</th>
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em] text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredUsers.map((u, i) => {
                  const badge = roleBadge(u.role);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      key={u._id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                    >
                      {/* User Info */}
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img 
                              src={u.avatar && !u.avatar.includes('ui-avatars.com') ? u.avatar : (u.role === 'TECHNICIAN' ? technicianDefault : u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&bg=334155&color=fff`)} 
                              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 object-cover" 
                              alt={u.name} 
                              onError={(e) => {
                                if (u.role === 'TECHNICIAN') e.target.src = technicianDefault;
                                else e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&bg=334155&color=fff`;
                              }}
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              u.role === 'ADMIN' ? 'bg-rose-400' : u.role === 'TECHNICIAN' ? 'bg-emerald-400' : 'bg-blue-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{u.name}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${badge.bg} ${badge.text} ${badge.ring}`}>
                          <badge.icon className="w-3 h-3 mr-1.5" />
                          {badge.label}
                        </span>
                      </td>

                      {/* Student ID */}
                      <td className="px-6 py-5">
                        {u.studentId ? (
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            {u.studentId}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Faculty */}
                      <td className="px-6 py-5">
                        {u.faculty ? (
                          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {u.faculty}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        {u.contactNumber ? (
                          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {u.contactNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-1.5 text-sm text-slate-600 dark:text-slate-400">
                          <CalendarDays className="w-3.5 h-3.5 text-primary" />
                          <span>
                            {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-8 py-5 text-right">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all cursor-pointer"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && filteredUsers.length > 0 && (
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
