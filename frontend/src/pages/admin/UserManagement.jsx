import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  User as UserIcon, 
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    api.get('/admin/users')
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update user role.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-2 block animate-pulse">ADMIN :: PERSONNEL DIRECTORY</span>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">User Management</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
             <input 
              type="text" 
              placeholder="Search Name, Email, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-300 w-64 transition-all placeholder:text-slate-700"
             />
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['ALL', 'USER', 'ADMIN', 'TECHNICIAN'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all uppercase ${filterRole === role ? 'bg-blue-900 dark:bg-white text-white dark:text-blue-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-32 text-center text-slate-700 font-extrabold tracking-[0.5em] uppercase animate-pulse">Syncing Directory Nodes...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-32 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800">
               <Users className="w-8 h-8 text-slate-700" />
             </div>
             <p className="text-slate-500 font-black tracking-widest text-[10px] uppercase">Zero results matched current query</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-900">
                  <th className="px-10 py-6 font-black text-[10px] text-slate-600 uppercase tracking-[.3em]">Institutional Entity</th>
                  <th className="px-6 py-6 font-black text-[10px] text-slate-600 uppercase tracking-[.3em]">Access Role</th>
                  <th className="px-6 py-6 font-black text-[10px] text-slate-600 uppercase tracking-[.3em]">Student ID</th>
                  <th className="px-6 py-6 font-black text-[10px] text-slate-600 uppercase tracking-[.3em]">Lifecycle</th>
                  <th className="px-10 py-6 font-black text-[10px] text-slate-600 uppercase tracking-[.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredUsers.map((u) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={u.id} 
                    className="hover:bg-slate-900/40 transition-all group cursor-pointer"
                  >
                    <td className="px-10 py-6" onClick={() => navigate(`/admin/users/${u.id}`)}>
                       <div className="flex items-center space-x-4">
                         <div className="relative">
                            <img src={u.avatar} className="w-11 h-11 rounded-xl border border-slate-800 object-cover" alt="" />
                            <div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                         </div>
                         <div>
                           <p className="font-black text-white text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{u.name}</p>
                           <p className="text-[10px] text-slate-500 font-bold tracking-tight">{u.email}</p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent navigation on click
                        className={`appearance-none px-3 py-1 rounded-full text-[9px] font-black tracking-widest border shadow-sm uppercase outline-none cursor-pointer
                          ${u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                            u.role === 'TECHNICIAN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            'bg-primary/10 text-primary border-primary/20'}`}
                      >
                        <option value="USER" className="bg-slate-900 text-white">USER</option>
                        <option value="TECHNICIAN" className="bg-slate-900 text-white">TECHNICIAN</option>
                        <option value="ADMIN" className="bg-slate-900 text-white">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-6">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                         {u.studentId || 'ID#_UNDEF'}
                       </span>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex flex-col gap-1">
                         <div className="text-[9px] font-black text-slate-600 uppercase">Registered</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {new Date(u.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                         </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 inline-block group-hover:text-primary group-hover:border-primary/50 transition-all shadow-inner">
                          <ArrowUpRight className="w-4 h-4" />
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
