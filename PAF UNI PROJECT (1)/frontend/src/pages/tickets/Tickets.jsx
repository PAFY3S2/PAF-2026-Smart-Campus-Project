import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, Box, Tag, Flag } from 'lucide-react';
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
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 pt-16 max-w-4xl mx-auto w-full"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5 inline-block">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">MODULE C: INCIDENT REPORTING</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">Create an Incident Ticket</h1>
        </div>
      </motion.div>

      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden z-10 mt-6 max-w-4xl mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-slate-800/40 dark:to-transparent pointer-events-none" />
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
                className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer premium-input
                  ${formik.touched.resourceId && formik.errors.resourceId ? 'premium-input-error' : ''}`}
              >
                <option value="" disabled>Select a resource</option>
                {resources.map(res => (
                  <option value={res.id} key={res.id}>{res.name}</option>
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
                className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer premium-input
                  ${formik.touched.category && formik.errors.category ? 'premium-input-error' : ''}`}
              >
                <option value="" disabled>Select category</option>
                <option value="HARDWARE">Hardware / IT</option>
                <option value="SOFTWARE">Software / Network</option>
                <option value="FACILITIES">Facilities / Cleaning</option>
                <option value="OTHER">Other</option>
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
                <label key={pLevel} className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl cursor-pointer premium-input ${formik.values.priority === pLevel ? 'border-primary bg-primary/5 text-primary dark:text-white shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'text-slate-600 dark:text-slate-500 hover:border-slate-400 dark:hover:border-slate-500'}`}>
                  <input
                    type="radio"
                    name="priority"
                    value={pLevel}
                    checked={formik.values.priority === pLevel}
                    onChange={formik.handleChange}
                    className="hidden"
                  />
                  <div className={`w-2 h-2 rounded-full ${pLevel === 'HIGH' ? 'bg-rose-500 animate-pulse' : pLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-primary'}`} />
                  <span className="text-[10px] font-black tracking-widest uppercase">{pLevel}</span>
                </label>
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
              className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl p-4 text-sm outline-none resize-none premium-input
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
      </div>
    </div>
  );
};

export default Tickets;
