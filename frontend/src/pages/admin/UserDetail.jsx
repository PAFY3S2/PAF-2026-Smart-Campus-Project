import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  User as UserIcon, 
  Mail, 
  Building2, 
  Users, 
  Hash, 
  Phone,
  ClipboardList,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          api.get(`/auth/users/${id}`),
          api.get(`/bookings/user/${id}`)
        ]);
        setUserData(userRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-slate-700 font-black tracking-widest uppercase animate-pulse">Accessing Encrypted Records...</div>;
  if (!userData) return <div className="p-20 text-center text-rose-500 font-black tracking-widest uppercase">Entity Not Found in Registry</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/admin/users')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white hover:border-primary/50 transition-all shadow-inner group"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-1 block">ADMIN :: SYSTEM 360-VIEW</span>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{userData.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:items-start">
        {/* LEFT COLUMN: IDENTIFIER CARD */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mr-16 -mt-16 rounded-full" />
            
            <div className="relative mb-8">
               <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-50 rounded-full" />
               <img src={userData.avatar} className="relative w-40 h-40 rounded-[2.5rem] border-2 border-white/5 object-cover" alt="" />
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
               </div>
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{userData.name}</h2>
            <div className="inline-flex px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-black text-slate-500 tracking-widest uppercase mb-8">
               Node Status: Active
            </div>

            <div className="w-full space-y-4 pt-8 border-t border-slate-900">
               <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-600">Access Role</span>
                  <span className="text-primary">{userData.role}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-600">Joined</span>
                  <span className="text-slate-400">{new Date(userData.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-600">Secure Mail</span>
                  <span className="text-slate-400">{userData.email.split('@')[0]}...</span>
               </div>
            </div>
          </motion.div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] space-y-6">
             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center">
               <Shield className="w-3.5 h-3.5 mr-2" /> Administrative Log
             </h3>
             <div className="space-y-4">
               {[
                 { label: 'Academic ID', val: userData.studentId, icon: Hash },
                 { label: 'Faculty Path', val: userData.faculty, icon: Building2 },
                 { label: 'Operational Batch', val: userData.batch, icon: Users },
                 { label: 'Contact Node', val: userData.contactNumber, icon: Phone }
               ].map((meta, i) => (
                 <div key={i} className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-700 border border-slate-800">
                      <meta.icon className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{meta.label}</p>
                     <p className="text-[11px] font-bold text-slate-300 uppercase">{meta.val || 'Not Configured'}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING HISTORY */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   <ClipboardList className="w-5 h-5 text-primary" />
                   <h3 className="text-lg font-black text-white uppercase tracking-tight">Full Booking History</h3>
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   Total Records: {bookings.length}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {bookings.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 text-slate-800 mb-4" />
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No reservation history recorded for this entity</p>
                  </div>
                ) : (
                  bookings.map((booking, i) => (
                    <motion.div 
                      key={booking._id} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-slate-950/50 border border-slate-900/50 p-6 rounded-3xl hover:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
                          <Box className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{booking.resourceId?.type}</p>
                          <h4 className="text-base font-black text-white uppercase tracking-tight">{booking.resourceId?.name}</h4>
                          <div className="flex items-center space-x-3 mt-2">
                             <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                <span>{booking.date}</span>
                             </div>
                             <div className="w-1 h-1 bg-slate-800 rounded-full" />
                             <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                <span>{booking.startTime} - {booking.endTime}</span>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border shadow-sm
                           ${booking.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                             booking.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                             'bg-slate-800 text-slate-600 border-slate-700/50'}`}
                         >
                           {booking.status}
                         </div>
                         <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-700 hover:text-primary transition-all shadow-inner">
                            <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
           </div>

           <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-10 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                 <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Performance Analytics</h4>
                 <p className="text-xs text-slate-500 font-medium tracking-wide">Historical reliability and resource utilization metrics for this user node.</p>
              </div>
              <button className="relative z-10 px-8 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-white transition-all uppercase flex items-center space-x-3">
                 <span>Full Audit</span>
                 <ExternalLink className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
