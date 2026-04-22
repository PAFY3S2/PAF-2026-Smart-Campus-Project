import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Mail, ShieldCheck, Hash, Building2, Phone, Users, Edit3, X, Save,
  CheckCircle2, QrCode, Activity, BookOpen, FlaskConical, Database,
  Clock, GraduationCap, MapPin, Zap, Calendar, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const CAMPUS_IMG = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2400&auto=format&fit=crop';
const GRAD_IMG   = 'https://images.unsplash.com/photo-1523240615152-44df0e1f7481?q=80&w=800&auto=format&fit=crop';

/* ─── Animated counter hook ─── */
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─── Stagger variants ─── */
const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemV      = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
const slideLeft  = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const contentRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '', studentId: user?.studentId || '',
    faculty: user?.faculty || '', contactNumber: user?.contactNumber || '',
    batch: user?.batch || '', avatar: user?.avatar || '',
    email: user?.email || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await api.put('/auth/me', formData);
      // res.data is raw Mongoose doc — normalise the shape
      const updated = {
        ...res.data,
        id: res.data._id || res.data.id,
      };
      updateUser(updated);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setIsEditing(false); }, 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Update failed. Please try again.');
    } finally { setLoading(false); }
  };

  const now = new Date();
  const lastSeen = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    + '  ·  ' + now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  const infoRows = [
    { label:'Student ID',   value: user?.studentId    || '—', icon: Hash,         color:'#3b82f6' },
    { label:'Email',        value: user?.email        || '—', icon: Mail,         color:'#8b5cf6' },
    { label:'Faculty',      value: user?.faculty      || '—', icon: Building2,    color:'#10b981' },
    { label:'Batch / Year', value: user?.batch        || '—', icon: GraduationCap,color:'#f59e0b' },
    { label:'Contact',      value: user?.contactNumber|| '—', icon: Phone,        color:'#06b6d4' },
    { label:'Campus',       value: 'Main Campus',             icon: MapPin,       color:'#f43f5e' },
  ];

  const permissions = [
    { name:'Library 24/7',      icon: BookOpen,    clr:'text-emerald-400', bg:'bg-emerald-500/10', border:'border-emerald-500/20' },
    { name:'Computing Cluster', icon: Database,    clr:'text-blue-400',    bg:'bg-blue-500/10',    border:'border-blue-500/20'    },
    { name:'Student Lounge',    icon: Users,       clr:'text-amber-400',   bg:'bg-amber-500/10',   border:'border-amber-500/20'   },
    { name:'Research Labs',     icon: FlaskConical,clr:'text-violet-400',  bg:'bg-violet-500/10',  border:'border-violet-500/20'  },
  ];

  const activityCards = [
    { label:'Bookings Completed', val: 14, icon: Calendar, gradient:'from-emerald-600 to-teal-500',   img:'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' },
    { label:'Tickets Raised',     val: 3,  icon: Activity, gradient:'from-amber-500 to-orange-500',   img:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
    { label:'Active Sessions',    val: 1,  icon: Zap,      gradient:'from-blue-600 to-indigo-500',    img:'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="space-y-8 pb-16">

      {/* ══════════════════  HERO BANNER  ══════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1,  scale: 1    }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
        style={{ minHeight: '280px' }}
      >
        {/* Background photo */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${CAMPUS_IMG}")` }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage:'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize:'40px 40px' }} />

        {/* ── Avatar + Text Row — inside hero at bottom ── */}
        <div className="relative z-10 flex items-end gap-8 p-8 md:p-10 pt-20 md:pt-24">

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1,  scale: 1   }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="relative shrink-0"
          >
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-blue-500 via-violet-400 to-emerald-400 opacity-50 blur-md animate-pulse" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[1.75rem] overflow-hidden border-4 border-slate-950/80 shadow-2xl">
              <img
                src={user?.avatar || GRAD_IMG}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
              {/* Scanning line animation */}
              <motion.div
                animate={{ top: ['-10%', '110%', '-10%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent shadow-[0_0_8px_#3b82f6] pointer-events-none"
                style={{ position: 'absolute' }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-slate-950 rounded-xl p-1.5 shadow-lg z-10">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </motion.div>

          {/* Name + details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1,  x: 0   }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 pb-1"
          >
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1.5">
              ScholarFlow · Institutional Profile
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-lg">
              {user?.name || 'Scholar'}
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">{user?.email}</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center space-x-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.role || 'Student'} · Verified</span>
              </div>
              {user?.faculty && (
                <div className="flex items-center space-x-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
                  <Building2 className="w-3 h-3 text-blue-300" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.faculty}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Edit button — top-right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(true)}
            className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all self-start mt-4 shadow-lg"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </motion.button>
        </div>

        {/* HUD corners */}
        <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-white/30 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-white/20 rounded-tr-xl pointer-events-none" />
      </motion.div>

      {/* ══════════════════  MAIN GRID  ══════════════════ */}
      <motion.div
        ref={contentRef}
        variants={containerV}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >

        {/* ─── LEFT COLUMN ─── */}
        <div className="space-y-5">

          {/* ID Card */}
          <motion.div variants={slideLeft} className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 rounded-t-[2.5rem]" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage:'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize:'24px 24px' }} />
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full -mr-16 -mt-16"
            />

            <div className="relative z-10 p-7 space-y-5">
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.35em] mb-0.5">Secure Identifier</p>
                <p className="font-mono text-base font-bold text-white tracking-wider">{user?.studentId || 'ID-NOT-SET'}</p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-800/70 rounded-2xl p-3.5 border border-slate-700/60">
                <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Last Session</p>
                  <p className="text-[11px] font-bold text-slate-200 tabular-nums">{lastSeen}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Access Pass</p>
                  <div className="flex items-center space-x-1.5">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.08, rotate: 2 }} className="relative cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
                    <QrCode className="w-full h-full text-slate-900" strokeWidth={1.5} />
                  </div>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-1 rounded-2xl border border-emerald-500/50 pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Activity Cards */}
          {activityCards.map((c, i) => {
            const count = useCounter(c.val);
            return (
              <motion.div
                key={i}
                variants={itemV}
                whileHover={{ x: 6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative overflow-hidden rounded-2xl h-24 cursor-pointer shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                  style={{ backgroundImage: `url("${c.img}")` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${c.gradient} opacity-85`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                {/* Shimmer sweep */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 + i }}
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                <div className="relative z-10 flex items-center justify-between h-full px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <c.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{c.label}</p>
                  </div>
                  <p className="text-3xl font-black text-white drop-shadow-lg tabular-nums">{count}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Mobile Edit button */}
          <motion.button
            variants={itemV}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(true)}
            className="md:hidden w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Info */}
          <motion.div variants={itemV} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Identity Data</p>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Personal Information</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 group"
              >
                <Edit3 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>Edit</span>
              </motion.button>
            </div>

            <motion.div variants={containerV} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoRows.map((row, i) => (
                <motion.div
                  key={i}
                  variants={itemV}
                  whileHover={{ x: 4, backgroundColor: 'rgba(59,130,246,0.04)' }}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-slate-600 hover:shadow-md transition-all group cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform"
                    style={{ backgroundColor: row.color + '18' }}
                  >
                    <row.icon className="w-5 h-5" style={{ color: row.color }} />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{row.label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{row.value}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Permissions */}
          <motion.div variants={itemV} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="mb-6">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Access Control</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Active Permissions</h2>
            </div>
            <motion.div variants={containerV} className="grid grid-cols-2 gap-3">
              {permissions.map((p, i) => (
                <motion.div
                  key={i}
                  variants={itemV}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`flex items-center space-x-3 p-4 ${p.bg} border ${p.border} rounded-2xl cursor-default transition-shadow hover:shadow-lg`}
                >
                  <p.icon className={`w-5 h-5 ${p.clr} shrink-0`} />
                  <span className={`text-[11px] font-black uppercase tracking-wide ${p.clr}`}>{p.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Security Status */}
          <motion.div variants={itemV} className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage:`url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop")` }}
            />
            <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-[2px]" />
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-t-[2.5rem]" />
            {/* Animated pulse ring around status dot */}

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="relative shrink-0">
                  <motion.div animate={{ scale:[1,1.6,1], opacity:[0.4,0,0.4] }} transition={{ duration:2, repeat:Infinity }} className="absolute inset-0 bg-emerald-500 rounded-full blur-sm" />
                  <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-slate-950">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_16px_#10b981]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Security Clearance Active</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">Profile synchronized with institutional database. Operational integrity verified.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════  EDIT MODAL  ══════════════════ */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => !loading && setIsEditing(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale:0.92, opacity:0, y:32 }}
              animate={{ scale:1, opacity:1, y:0, transition:{ type:'spring', stiffness:280, damping:28 } }}
              exit={{ scale:0.92, opacity:0, y:32 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 rounded-t-[2.5rem]" />

              <div className="flex justify-between items-center mb-8 mt-1">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Edit Profile</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Update your information</p>
                </div>
                <motion.button whileTap={{ scale:0.9 }} onClick={() => setIsEditing(false)} disabled={loading}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label:'Full Name',      key:'name',          placeholder:'Your full name',  type:'text'  },
                    { label:'Student ID',     key:'studentId',     placeholder:'IT2XXXXXXX',       type:'text'  },
                    { label:'Email Address',  key:'email',         placeholder:'you@example.com',  type:'email' },
                    { label:'Contact',        key:'contactNumber', placeholder:'+94 XX XXX XXXX',  type:'text'  },
                    { label:'Batch / Year',   key:'batch',         placeholder:'2023',             type:'text'  },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{f.label}</label>
                      <input type={f.type || 'text'} value={formData[f.key]} placeholder={f.placeholder}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Faculty</label>
                  <select value={formData.faculty} onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors">
                    <option value="">Select Faculty…</option>
                    <option value="Computing">Faculty of Computing</option>
                    <option value="Business">Business School</option>
                    <option value="Engineering">Faculty of Engineering</option>
                    <option value="Humanities">Humanities &amp; Sciences</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Avatar URL</label>
                  <div className="flex items-center space-x-3">
                    <input type="text" value={formData.avatar} placeholder="https://…"
                      onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors font-mono truncate"
                    />
                    <img src={formData.avatar || GRAD_IMG} alt="preview"
                      onError={e => { e.target.src = GRAD_IMG; }}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  </div>
                </div>

                <motion.button type="submit" whileTap={{ scale:0.97 }} disabled={loading || success}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-black tracking-widest uppercase rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/20 mt-2">
                  {loading  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : success  ? <><CheckCircle2 className="w-5 h-5" /><span>Saved!</span></>
                  :            <><Save className="w-5 h-5" /><span>Save Changes</span></>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
