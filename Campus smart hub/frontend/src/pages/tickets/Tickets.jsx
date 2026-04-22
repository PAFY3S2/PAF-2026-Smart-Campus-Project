import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, Box, Tag, Flag, Activity } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Tickets = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get('/resources').then(res => setResources(res.data));
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...imageUrls].slice(0, 3));
    }
  };

  const formik = useFormik({
    initialValues: {
      resourceId: '',
      category: '',
      priority: 'LOW',
      description: ''
    },
    validationSchema: Yup.object({
      resourceId: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      priority: Yup.string().required('Required'),
      description: Yup.string().required('Required').min(10, 'Must be at least 10 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await api.post('/tickets', { ...values, userId: user.id, images });
        setSuccess(true);
        resetForm();
        setImages([]);
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="space-y-8 pb-12 relative">
      {/* DYNAMIC INCIDENT BANNER */}
      <div className="absolute top-0 left-0 w-full h-[450px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] overflow-hidden rounded-b-[4rem] z-0">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")' }}
        />
        
        {/* Animated Emergency Glows */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-[400px] h-[300px] bg-rose-500/40 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[400px] bg-amber-500/30 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        />

        {/* Blueprint Tech Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />
        
        {/* Smooth Fade Transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50 via-slate-50/80 dark:from-slate-950 dark:via-slate-950/80 to-transparent pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-16 max-w-6xl mx-auto w-full px-4 md:px-0"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5 inline-block">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">MODULE C: INCIDENT REPORTING</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">Log an Incident Ticket</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 mt-8 max-w-6xl mx-auto w-full px-4 md:px-0 pb-12">
        {/* LEFT COLUMN: Info */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] overflow-hidden group shadow-2xl flex flex-col justify-end min-h-[500px] h-full">
             <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[40s] group-hover:scale-110"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
             <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
             
             <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
               <div className="w-12 h-1.5 bg-primary mb-6 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
               <h3 className="text-white text-3xl font-black mb-4 tracking-tight drop-shadow-md">Technical Support Node</h3>
               <p className="text-white/80 text-[10px] uppercase tracking-[0.15em] font-black leading-loose mb-6">Please supply accurate asset coordinates and visual logs. The rapid response team prioritizes queues based on operational obstruction.</p>
               <ul className="space-y-4 max-w-sm">
                 {[
                   { icon: Tag, text: 'Categorize logs correctly for routing.' },
                   { icon: Activity, text: 'Set priority level based on impact.' },
                   { icon: Flag, text: 'Attach visual evidence if available.' }
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center space-x-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <CheckCircle className="w-8 h-8 shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-widest text-sm">Transfer Successful</p>
                <p className="text-xs opacity-80">Ticket submitted successfully! A technician will review it shortly.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={formik.handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.resourceId && formik.errors.resourceId ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                <Box className="w-3 h-3 mr-2" /> Resource / Location
              </label>
              <select
                name="resourceId"
                value={formik.values.resourceId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer premium-input font-medium
                  ${formik.touched.resourceId && formik.errors.resourceId ? 'premium-input-error' : ''}`}
              >
                <option value="" disabled className="bg-white dark:bg-slate-900">Select a resource</option>
                {resources.map(res => (
                  <option value={res.id} key={res.id} className="bg-white dark:bg-slate-900">{res.name}</option>
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

            <div className="space-y-2 group">
              <label className={`text-[10px] font-black tracking-widest uppercase flex items-center transition-colors ${formik.touched.category && formik.errors.category ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                <Tag className="w-3 h-3 mr-2" /> Category
              </label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer premium-input font-medium
                  ${formik.touched.category && formik.errors.category ? 'premium-input-error' : ''}`}
              >
                <option value="" disabled className="bg-white dark:bg-slate-900">Select category</option>
                <option value="HARDWARE" className="bg-white dark:bg-slate-900">Hardware / IT</option>
                <option value="SOFTWARE" className="bg-white dark:bg-slate-900">Software / Network</option>
                <option value="FACILITIES" className="bg-white dark:bg-slate-900">Facilities / Cleaning</option>
                <option value="OTHER" className="bg-white dark:bg-slate-900">Other</option>
              </select>
              <AnimatePresence>
                {formik.touched.category && formik.errors.category && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                    <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.category}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center">
              <Flag className="w-3 h-3 mr-2" /> Priority Level
            </label>
            <div className="flex flex-wrap gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(pLevel => (
                <motion.label 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={pLevel} 
                  className={`flex-1 relative overflow-hidden flex justify-center items-center space-x-3 px-2 md:px-6 py-4 rounded-xl cursor-pointer premium-input select-none transition-colors duration-300 ${
                    formik.values.priority === pLevel 
                      ? (pLevel === 'HIGH' ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]' 
                         : pLevel === 'MEDIUM' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                         : 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]')
                      : 'text-slate-600 dark:text-slate-500'
                  }`}>
                  {formik.values.priority === pLevel && <motion.div layoutId="priority_glow" className={`absolute inset-0 pointer-events-none ${pLevel === 'HIGH' ? 'bg-rose-500/5' : pLevel === 'MEDIUM' ? 'bg-amber-500/5' : 'bg-emerald-500/5'}`} />}
                  <input
                    type="radio"
                    name="priority"
                    value={pLevel}
                    checked={formik.values.priority === pLevel}
                    onChange={formik.handleChange}
                    className="hidden"
                  />
                  <div className={`relative z-10 w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${pLevel === 'HIGH' ? 'bg-rose-500 text-rose-500 animate-pulse' : pLevel === 'MEDIUM' ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'}`} />
                  <span className="relative z-10 text-[11px] font-black tracking-widest uppercase">{pLevel}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="space-y-2 group">
            <label className={`text-[10px] font-black tracking-widest uppercase transition-colors ${formik.touched.description && formik.errors.description ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide details about the issue..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none resize-none premium-input font-medium
                ${formik.touched.description && formik.errors.description ? 'premium-input-error' : ''}`}
            ></textarea>
            <AnimatePresence>
              {formik.touched.description && formik.errors.description && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                  <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Upload Images (Max 3)</label>
            <div className="border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-3xl p-10 flex flex-col items-center justify-center bg-white dark:bg-slate-900 hover:border-primary focus-within:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group overflow-hidden relative">
              <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-4 group-hover:text-primary transition-colors" />
              <p className="text-xs font-bold text-slate-500 text-center leading-relaxed">Click to upload or drag and drop<br/><span className="text-[10px] opacity-60">Visual evidence assists in rapid resolution</span></p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {images.length > 0 && (
              <div className="flex gap-4 mt-6">
                {images.map((src, i) => (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={i} className="relative group">
                    <img src={src} alt={`Preview ${i}`} className="w-28 h-28 object-cover rounded-2xl border border-slate-800 shadow-xl" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full relative overflow-hidden group font-black py-5 rounded-2xl transition-all disabled:opacity-70 text-[10px] tracking-[0.3em] uppercase transform hover:-translate-y-0.5 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-primary to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1s]" />
            <span className="relative z-10 text-white flex items-center justify-center shadow-sm">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>INITIALIZE INCIDENT TICKET</span>}
            </span>
           </motion.button>
          </form>
            </div> {/* End Form Content Wrapper */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
