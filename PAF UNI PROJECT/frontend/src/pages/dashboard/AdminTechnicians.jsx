import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Users, Mail, Lock, Shield, Trash2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  
  // New technician form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const fetchTechnicians = async () => {
    try {
      const res = await api.get('/auth/technicians');
      setTechnicians(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/technicians', formData);
      setFormData({ name: '', email: '', password: '' });
      setShowAddForm(false);
      fetchTechnicians();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create technician');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <PageHeader title="Staff Management" subtitle="Manage Support Technicians" />
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-[#142B5D] text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-[#0D1E40] transition shadow-lg shadow-blue-900/20"
        >
          {showAddForm ? 'Cancel' : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Technician
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black text-[#142B5D] mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-[#F5AB24]" />
            Provision New Technician Account
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-bold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#142B5D] uppercase tracking-widest px-1">Full Name</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Smith"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#F5AB24] rounded-xl pl-12 pr-4 py-3 outline-none transition text-sm font-bold text-[#142B5D]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#142B5D] uppercase tracking-widest px-1">Staff Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="tech@sliit.lk"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#F5AB24] rounded-xl pl-12 pr-4 py-3 outline-none transition text-sm font-bold text-[#142B5D]"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#142B5D] uppercase tracking-widest px-1">Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#F5AB24] rounded-xl pl-12 pr-4 py-3 outline-none transition text-sm font-bold text-[#142B5D]"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end mt-4">
              <button 
                type="submit"
                className="px-8 py-3 bg-[#F5AB24] text-[#142B5D] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e09a1f] transition shadow-lg shadow-[#F5AB24]/20"
              >
                Activate Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-[#142B5D] uppercase tracking-widest text-xs">Active Staff Directory</h3>
          <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-[#142B5D]">
            {technicians.length} Technicians
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Technician</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Institutional Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">System Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm font-bold text-slate-400 italic">
                    Accessing staff records...
                  </td>
                </tr>
              ) : technicians.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm font-bold text-slate-400 italic">
                    No technician accounts provisioned yet.
                  </td>
                </tr>
              ) : (
                technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={tech.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}&bg=142B5D&color=fff`} className="w-10 h-10 rounded-full border-2 border-slate-100 mr-4" alt="" />
                        <span className="font-bold text-[#142B5D] text-sm">{tech.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500 font-mono tracking-tight">{tech.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        Field Expert
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTechnicians;
