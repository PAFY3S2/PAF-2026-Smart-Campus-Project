import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  ChevronRight,
  ShieldAlert,
  Box,
  Monitor,
  Building,
  Zap
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const toggleEq = (eq) => setSelectedEquipment(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]);

  useEffect(() => {
    api.get('/resources').then(res => setResources(res.data.filter(r => r.status === 'ACTIVE')));
  }, []);

  const formik = useFormik({
    initialValues: {
      resourceId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    },
    validationSchema: Yup.object({
      resourceId: Yup.string().required('Select a resource'),
      date: Yup.string().required('Select a date'),
      startTime: Yup.string().required('Start time required'),
      endTime: Yup.string().required('End time required'),
      purpose: Yup.string().required('Describe the purpose').min(5, 'Too short'),
      attendees: Yup.number().required('Count required').min(1, 'Min 1')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError(null);
      try {
        const finalPurpose = selectedEquipment.length > 0 
          ? `${values.purpose}\n\n[Requested Equipment: ${selectedEquipment.join(', ')}]` 
          : values.purpose;
        await api.post('/bookings', { ...values, purpose: finalPurpose, userId: user.id });
        setSuccess(true);
        toast.success("Reservation synchronized successfully!", { 
          icon: '✨', 
          duration: 5000,
          style: {
            fontSize: '14px',
            fontWeight: '600'
          }
        });
        resetForm();
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        if (err.response?.status === 409) {
          setError('SCHEDULING CONFLICT: This time slot is already taken or pending. Please select a different time or resource.');
          toast.error("Scheduling conflict detected.");
        } else {
          setError(err.response?.data?.message || 'Submission failed');
          toast.error("Network communication failed.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const selectedResource = resources.find(r => r.id === formik.values.resourceId);
  
  let capacityNum = Infinity;
  if (selectedResource && selectedResource.capacity) {
     const parts = String(selectedResource.capacity).split('-');
     capacityNum = parseInt(parts[parts.length - 1]);
     if (isNaN(capacityNum)) capacityNum = Infinity;
  }
  const isOverCapacity = formik.values.attendees > capacityNum;

  return (
    <div className="space-y-8 pb-12 relative">
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-16 max-w-4xl mx-auto w-full"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">MODULE B: RESOURCE RESERVATION</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">Booking Request</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 max-w-6xl mx-auto w-full px-4 md:px-0">
        {/* INFO COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {!selectedResource ? (
              <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] overflow-hidden group shadow-2xl flex flex-col justify-end min-h-[500px]">
                <div 
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-[40s] group-hover:scale-110"
                   style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                
                <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="w-12 h-1.5 bg-primary mb-6 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                  <h3 className="text-white text-3xl font-black mb-6 tracking-tight drop-shadow-md">Institutional Protocol</h3>
                  <ul className="space-y-4 max-w-sm">
                    {[
                      { icon: ShieldAlert, text: 'Conflicts are checked in real-time across all nodes.' },
                      { icon: Clock, text: 'Workflow: Pending → Approved/Rejected.' },
                      { icon: Calendar, text: 'Cancelable only after formal approval.' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl shadow-inner">
                        <div className="min-w-[40px] h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                           <item.icon className="w-5 h-5 text-primary drop-shadow-sm" />
                        </div>
                        <span className="text-[10px] xl:text-[11px] text-white/90 leading-relaxed font-black uppercase tracking-[0.15em]">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col justify-center">
                 <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-[30s] group-hover:scale-110" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop")' }} />
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors" />
                 
                 <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="w-12 h-1.5 bg-primary mb-6 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                   <span className="text-[10px] font-black tracking-[0.3em] text-primary/90 uppercase mb-3 block drop-shadow-md">SELECTED NODE CONFIRMED</span>
                   <h2 className="text-4xl xl:text-5xl font-black text-white uppercase tracking-tight mb-8 leading-tight drop-shadow-xl">{selectedResource.name}</h2>
                   
                   <div className="space-y-4 max-w-sm">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all shadow-inner">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Asset Type</span>
                        <span className="text-xs text-white font-black uppercase tracking-widest flex items-center bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                          {selectedResource.type === 'LAB' ? <Monitor className="w-3 h-3 mr-2 text-primary" /> : <Building className="w-3 h-3 mr-2 text-primary" />}
                          {selectedResource.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all shadow-inner">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Location Grid</span>
                        <span className="text-xs text-white font-black uppercase tracking-widest">{selectedResource.location || 'B-WING SEC 2'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all shadow-inner">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Base Capacity</span>
                        <span className="text-xs text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          {capacityNum === Infinity ? 'Unlimited Loads' : `${capacityNum} Personnel`}
                        </span>
                      </div>
                   </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden group shadow-lg dark:shadow-none transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />
            <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase mb-1">SYSTEM STATUS</p>
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider relative group-hover:text-primary transition-colors">Node Telemetry</h4>
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center shadow-sm">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-[pulse_2s_ease-in-out_infinite] mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                   <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Synchronized</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 border border-slate-200 dark:bg-slate-950/80 p-4 rounded-2xl dark:border-slate-800 shadow-inner group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Latency Ping</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono tracking-widest">14ms</span>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 dark:bg-slate-950/80 p-4 rounded-2xl dark:border-slate-800 shadow-inner group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Encryption Protocol</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono tracking-widest">TLS 1.3</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM COLUMN */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full bg-white/85 dark:bg-slate-950/90 backdrop-blur-3xl border-2 border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-300/40 dark:shadow-none overflow-hidden group transition-colors duration-300"
          >
            {/* Internal Structural Micro-pattern */}
            <div 
               className="absolute inset-0 opacity-[0.10] dark:opacity-20 mix-blend-overlay pointer-events-none"
               style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,1) 1px, transparent 0)`, backgroundSize: '32px 32px' }}
            />
            {/* Sweeping Glass Glare Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/90 dark:from-transparent dark:via-white/5 dark:to-white/10 pointer-events-none rounded-[3rem]" />
            
            {/* Form Content Wrapper */}
            <div className="relative z-10 w-full">
              <AnimatePresence mode="wait">
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center space-x-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                >
                  <CheckCircle className="w-8 h-8 shrink-0" />
                  <div>
                    <p className="font-bold uppercase tracking-widest text-sm">Transfer Successful</p>
                    <p className="text-xs opacity-80">Your request has been queued for Admin review.</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center space-x-4 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                >
                  <AlertTriangle className="w-8 h-8 shrink-0" />
                  <div className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={formik.handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2 group">
                <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.resourceId && formik.errors.resourceId ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                  <Box className="w-3 h-3 mr-2" /> SELECT RESOURCE
                </label>
                <select
                  name="resourceId"
                  value={formik.values.resourceId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer premium-input
                    ${formik.touched.resourceId && formik.errors.resourceId ? 'premium-input-error' : ''}`}
                >
                  <option value="" disabled>Search available infrastructure...</option>
                  {resources.map(res => (
                    <option value={res.id} key={res.id}>{res.name} (NODE: {res.type})</option>
                  ))}
                </select>
                <AnimatePresence>
                  {formik.touched.resourceId && formik.errors.resourceId && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                      <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.resourceId}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.date && formik.errors.date ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                    <Calendar className="w-3 h-3 mr-2" /> DATE
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none premium-input
                      ${formik.touched.date && formik.errors.date ? 'premium-input-error' : ''}`}
                  />
                  <AnimatePresence>
                    {formik.touched.date && formik.errors.date && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                        <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.date}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 group">
                  <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.attendees && formik.errors.attendees ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                    <Users className="w-3 h-3 mr-2" /> ATTENDEES
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formik.values.attendees}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="1"
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none premium-input
                      ${formik.touched.attendees && formik.errors.attendees ? 'premium-input-error' : ''}`}
                  />
                  <AnimatePresence>
                    {formik.touched.attendees && formik.errors.attendees && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                        <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.attendees}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Capacity Validation Widget */}
                  {selectedResource && capacityNum !== Infinity && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className={`mt-3 flex items-center justify-between p-4 rounded-[1rem] border ${isOverCapacity ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/5 border-emerald-500/20'}`}
                    >
                       <span className={`text-[9px] font-black uppercase tracking-widest flex items-center ${isOverCapacity ? 'text-rose-500' : 'text-emerald-500'}`}>
                         {isOverCapacity ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                         Load: {formik.values.attendees} / {capacityNum}
                       </span>
                       <div className="w-32 h-1.5 bg-black/20 dark:bg-slate-950 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-500 ${isOverCapacity ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                           style={{ width: `${Math.min(100, (formik.values.attendees / capacityNum) * 100)}%` }} 
                         />
                       </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.startTime && formik.errors.startTime ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                    <Clock className="w-3 h-3 mr-2" /> START TIME
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none premium-input
                      ${formik.touched.startTime && formik.errors.startTime ? 'premium-input-error' : ''}`}
                  />
                  <AnimatePresence>
                    {formik.touched.startTime && formik.errors.startTime && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                        <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.startTime}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 group">
                  <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.endTime && formik.errors.endTime ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                    <Clock className="w-3 h-3 mr-2" /> END TIME
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none premium-input
                      ${formik.touched.endTime && formik.errors.endTime ? 'premium-input-error' : ''}`}
                  />
                  <AnimatePresence>
                    {formik.touched.endTime && formik.errors.endTime && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                        <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.endTime}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 flex items-center">
                  <Zap className="w-3 h-3 mr-2" /> ADD-ON MODULES (OPTIONAL)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['4K Projector', 'Sound System', 'Extra Chairs', 'VR Headsets', 'Whiteboard', 'Catering Node'].map(eq => {
                    const isSelected = selectedEquipment.includes(eq);
                    return (
                      <button 
                        type="button" 
                        key={eq} 
                        onClick={() => toggleEq(eq)} 
                        className={`flex items-center justify-center p-3.5 rounded-xl border-2 transition-all ${isSelected ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(249,115,22,0.15)] text-primary dark:text-white transform scale-[1.02]' : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest">{eq}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.purpose && formik.errors.purpose ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                  <FileText className="w-3 h-3 mr-2" /> CORE PURPOSE
                </label>
                <textarea
                  name="purpose"
                  rows="3"
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Detail your operational requirements here..."
                  className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none resize-none premium-input
                    ${formik.touched.purpose && formik.errors.purpose ? 'premium-input-error' : ''}`}
                ></textarea>
                <AnimatePresence>
                  {formik.touched.purpose && formik.errors.purpose && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                      <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.purpose}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={loading || isOverCapacity}
                className="w-full relative overflow-hidden group font-black py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[10px] tracking-[0.3em] uppercase transform hover:-translate-y-0.5 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-primary to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1s]" />
                <span className="relative z-10 text-white flex items-center justify-center shadow-sm">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>SUBMIT RESERVATION REQUEST</span>}
                </span>
              </motion.button>
            </form>
            </div> {/* End Form Wrapper */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
