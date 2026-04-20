import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, ShieldCheck, Hash, Building2, Phone, Users, Edit3, X, Save, 
  Camera, CheckCircle2, QrCode, Activity, BookOpen, FlaskConical, Database, Award, Fingerprint, Calendar
} from 'lucide-react';
import api from '../../services/api';
import TiltCard from '../../components/shared/TiltCard';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    faculty: user?.faculty || '',
    contactNumber: user?.contactNumber || '',
    batch: user?.batch || '',
    avatar: user?.avatar || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/me', formData);
      const token = localStorage.getItem('token');
      login({ token, user: res.data });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (err) {
      alert('Failed to update telemetry node');
    } finally {
      setLoading(false);
    }
  };

  const getAuthorizations = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Root Infrastructure', icon: Database, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { name: 'Admin Console Access', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Global Override', icon: Fingerprint, color: 'text-primary', bg: 'bg-primary/10' },
      ];
    } else if (user?.role === 'TECHNICIAN') {
      return [
        { name: 'Server Nodes', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { name: 'Hardware Labs', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Maintenance Override', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      ];
    } else {
      return [
        { name: '24/7 Library Pass', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Computing Clusters', icon: Database, color: 'text-primary', bg: 'bg-primary/10' },
        { name: 'Student Lounge B', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      ];
    }
  };

  return (
    <div className="space-y-12 pb-20 relative">
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-16"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-emerald-500/5">
          <span className="text-[10px] font-black tracking-[0.4em] text-emerald-400 uppercase mb-2 block animate-pulse drop-shadow-md">SYSTEM :: ACCOUNT TELEMETRY</span>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic drop-shadow-xl">Institutional Identity</h1>
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-3 px-8 py-3.5 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl text-[10px] font-black tracking-[0.2em] text-slate-200 hover:text-white hover:bg-slate-900 hover:border-primary/50 transition-all uppercase group shadow-xl"
        >
          <Edit3 className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span>Modify Metadata</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10 mt-8">
        {/* HIGH FIDELITY DIGITAL PASS */}
        <div className="lg:col-span-1">
          <TiltCard 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group aspect-[3/5] flex flex-col justify-between"
          >
            {/* Holographic Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-accent/20 blur-[80px] -mr-48 -mt-48 rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[60px] -ml-32 -mb-32 rounded-full pointer-events-none mix-blend-screen" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                       <Shield className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                       <p className="text-[7px] font-black tracking-[0.3em] text-slate-400 uppercase leading-none">Global</p>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">Access</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">CLEARANCE</p>
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md mt-1 border border-primary/20">{user?.role}</p>
                 </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-6 mt-4">
                <div className="relative inline-block group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-emerald-400 to-accent rounded-[2.5rem] blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img src={user?.avatar || "https://i.pravatar.cc/150"} alt={user?.name} className="relative w-44 h-44 rounded-[2rem] border-4 border-slate-900 shadow-2xl object-cover" />
                  
                  {/* Verified Checkmark Overlay */}
                  <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-2 rounded-xl border-[3px] border-slate-900 text-slate-900 shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                
                <div>
                   <h2 className="text-3xl font-black text-white tracking-tight uppercase line-clamp-2 leading-none">{user?.name || "Student"}</h2>
                   <p className="text-xs font-bold text-primary uppercase tracking-widest mt-3 opacity-90">{user?.faculty || "Faculty Not Assigned"}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-slate-700/50 flex justify-between items-end mt-8">
               <div>
                  <p className="text-[7px] font-black tracking-widest text-slate-400 uppercase mb-1">SECURE IDENTIFIER</p>
                  <p className="text-sm font-mono font-bold text-white tracking-[0.2em]">{user?.studentId || 'ID-XXX-XXXX'}</p>
               </div>
               
               {/* QR CODE Graphic */}
               <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-shadow">
                 <QrCode className="w-full h-full text-slate-900" strokeWidth={1.5} />
               </div>
            </div>
          </TiltCard>
        </div>

        {/* METADATA GRID & ACCENTS */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
           {/* Authorizations Row */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-6 overflow-hidden shadow-sm"
           >
              <div>
                 <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center mb-3">
                   <Award className="w-3 h-3 mr-1" /> Active Authorizations
                 </p>
                 <div className="flex flex-wrap gap-3">
                   {getAuthorizations().map((auth, idx) => (
                     <div key={idx} className={`flex items-center px-4 py-2 ${auth.bg} rounded-xl border border-white/5`}>
                        <auth.icon className={`w-4 h-4 mr-2 ${auth.color}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${auth.color}`}>{auth.name}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Academic ID', value: user?.studentId || 'Not Configured', icon: Hash },
                { label: 'Primary Contact', value: user?.contactNumber || 'Not Configured', icon: Phone },
                { label: 'Faculty / Dept', value: user?.faculty || 'Not Configured', icon: Building2 },
                { label: 'Active Batch', value: user?.batch || 'Not Configured', icon: Users },
                { label: 'Secure Email', value: user?.email || 'Not Configured', icon: Mail },
                { label: 'Security Role', value: user?.role || 'STUDENT', icon: ShieldCheck },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center space-x-5 hover:border-primary/30 transition-all group shadow-sm"
                >
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-200 dark:border-slate-800">
                     <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white tracking-wide uppercase line-clamp-1">{item.value}</p>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Activity Footprint Mocks */}
              <div className="col-span-2 flex items-center space-x-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                 <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Resources Booked</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">14</p>
                 </div>
              </div>
              
              <div className="col-span-2 flex items-center space-x-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                 <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Activity className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tickets Raised</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">3</p>
                 </div>
              </div>
           </div>

           {/* Enhanced Security Clearance */}
           <div className="mt-auto bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
              {/* Warning Stripes */}
              <div className="absolute top-0 inset-x-0 h-2" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, transparent 10px, transparent 20px)' }} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-none">
                 <div className="flex items-center space-x-5">
                    <div className="relative flex items-center justify-center w-12 h-12">
                       <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                       <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-slate-950">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
                          Security Clearance Active
                       </h3>
                       <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm mt-1">Profile synchronized with institutional database. System logs indicate secure operational integrity.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* EDIT MODAL REMAINS UNCHANGED BUT WITH A FEW TWEAKS FOR AESTHETICS */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsEditing(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative z-10"
            >
              <div className="flex justify-between items-start mb-10">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">Modify Protocol Attributes</h3>
                   <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-3">Node ID: {user?.id?.slice(-8)}</p>
                 </div>
                 <button 
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                   <X className="w-8 h-8" />
                 </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">NAME</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">STUDENT ID</label>
                    <input 
                      type="text" 
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white shadow-inner"
                      placeholder="ITXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">FACULTY</label>
                    <select 
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white appearance-none shadow-inner"
                    >
                      <option value="">Select Faculty...</option>
                      <option value="Computing">Faculty of Computing</option>
                      <option value="Business">Business School</option>
                      <option value="Engineering">Faculty of Engineering</option>
                      <option value="Humanities">Humanities & Sciences</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">CONTACT NUMBER</label>
                    <input 
                      type="text" 
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white shadow-inner"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">AVATAR DATA URI</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="text" 
                      value={formData.avatar}
                      onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white font-mono truncate shadow-inner"
                      placeholder="https://..."
                    />
                    <div className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-lg">
                      <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <motion.button 
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  disabled={loading || success}
                  className="w-full py-5 bg-blue-900 dark:bg-white text-white dark:text-blue-900 hover:bg-blue-800 dark:hover:bg-slate-100 text-[12px] font-black tracking-[0.4em] rounded-[1.5rem] transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg transform hover:-translate-y-0.5 duration-200 uppercase mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>TELEMETRY COMMITTED</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>COMMIT CHANGES</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
