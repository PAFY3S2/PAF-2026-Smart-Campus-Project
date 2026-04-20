import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, ArrowRight, Command, ShieldCheck, AlertTriangle, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid institutional email address format.')
        .required('Credential Identity (Email) is strictly required.'),
      password: Yup.string()
        .min(6, 'Access Key must be at least 6 characters.')
        .required('Access Key (Password) is strictly required.')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let role = 'USER';
        if (values.email.includes('alice')) role = 'ADMIN';
        if (values.email.includes('bob')) role = 'TECHNICIAN';
        await login(role);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  });


  const handleQuickLogin = async (role) => {
    setLoading(true);
    try {
      await login(role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative transition-colors">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] -mr-96 -mt-96 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none" />

      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[90vh] relative z-10 transition-colors">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col relative w-1/2 p-10 overflow-hidden" style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(2,6,23,0.95)), url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all">
                <Command className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">ScholarFlow</span>
            </div>
            <Link to="/" className="flex items-center text-white/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all">
              GATEWAY <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="mt-auto relative z-10 text-left">
            <p className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-4">SYSTEM PROTOCOL 1.0</p>
            <h2 className="text-4xl font-black text-white mb-8 leading-tight tracking-tight">
              Institutional Resource<br/>Ecosystem.
            </h2>
            <div className="flex space-x-2">
              <div className="w-8 h-1 bg-primary rounded-full"></div>
              <div className="w-4 h-1 bg-white/10 rounded-full"></div>
              <div className="w-4 h-1 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl transition-colors relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-slate-800/40 dark:to-transparent pointer-events-none" />
          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Access Point</h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Connect your institutional credentials to enter the ecosystem dashboard.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-1.5 group">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${formik.touched.email && formik.errors.email ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                  CREDENTIAL IDENTITY
                </label>
                <div className="relative">
                  <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-10 ${formik.touched.email && formik.errors.email ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-primary'}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@university.edu"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl pl-14 pr-6 py-4 outline-none placeholder-slate-400 dark:placeholder-slate-500 text-sm premium-input
                      ${formik.touched.email && formik.errors.email ? 'premium-input-error' : ''}`}
                  />
                </div>
                <AnimatePresence>
                  {formik.touched.email && formik.errors.email && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                      <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5 group">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${formik.touched.password && formik.errors.password ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`}>
                  ACCESS KEY
                </label>
                <div className="relative">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-10 ${formik.touched.password && formik.errors.password ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-primary'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white rounded-2xl pl-14 pr-12 py-4 outline-none placeholder-slate-400 dark:placeholder-slate-500 text-sm premium-input
                      ${formik.touched.password && formik.errors.password ? 'premium-input-error' : ''}`}
                  />
                  <motion.button 
                    type="button" 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 focus:text-primary hover:text-primary transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {formik.touched.password && formik.errors.password && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2 ml-4">
                      <AlertTriangle className="w-3 h-3 mr-1" /> {formik.errors.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 bg-slate-50 dark:bg-slate-950 rounded-lg flex-shrink-0 border border-slate-200 dark:border-slate-800 group-hover:border-primary/50 transition-all">
                    <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer w-full h-full" defaultChecked />
                    <div className="w-2 h-2 bg-primary rounded-sm transition-opacity group-hover:opacity-100" />
                  </div>
                  <span className="text-xs text-slate-500 ml-3 font-bold group-hover:text-slate-400 transition-colors">PERSIST SESSION</span>
                </label>
                <span className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer tracking-widest transition-colors uppercase">RECOVER KEY</span>
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
                  {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE ACCESS'}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </span>
              </motion.button>
            </form>

            <div className="mt-12 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="relative bg-white dark:bg-slate-900 px-6 text-[9px] font-black text-slate-500 dark:text-slate-600 tracking-[0.3em] uppercase">QUICK ENTRY NODES</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { r: 'USER', label: 'Student', color: 'bg-primary/10', text: 'text-primary' },
                { r: 'ADMIN', label: 'Admin', color: 'bg-rose-500/10', text: 'text-rose-400' },
                { r: 'TECHNICIAN', label: 'Tech', color: 'bg-emerald-500/10', text: 'text-emerald-400' },
              ].map((role) => (
                <motion.button 
                  key={role.r}
                  type="button" 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickLogin(role.r)}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/30 transition-all group disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-xl ${role.color} ${role.text} flex items-center justify-center mb-2 shadow-sm`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold group-hover:text-slate-200 transition-colors uppercase tracking-widest">{role.label}</span>
                </motion.button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
