import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/SLIIT FacilityFlow logo design.png';

import adminBtnImg from '../../assets/ADMIN LOOK (1).jpg';

const Login = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register({ name, email, password, role: 'USER' });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[700px] max-h-[90vh]">
        
        {/* Left Side - Institutional Branding */}
        <div className="hidden md:flex flex-col relative w-1/2 p-12 text-white" style={{
          backgroundImage: `linear-gradient(to bottom, rgba(20, 43, 93, 0.8), rgba(13, 30, 64, 0.95)), url("${adminBtnImg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="relative z-10">
            <img src={logo} alt="SLIIT Logo" className="h-16 w-auto brightness-0 invert mb-8" />
            <h2 className="text-4xl font-black leading-tight mb-6">
              Welcome to the <br/>
              <span className="text-[#F5AB24]">Institutional Portal</span>
            </h2>
            <p className="text-lg text-white/80 font-medium max-w-sm mb-12">
              Access the SLIIT Facility Flow Operations ecosystem. Manage resources, track incidents, and optimize campus life in one secure location.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg border border-white/20">
                <ShieldCheck className="w-6 h-6 text-[#F5AB24]" />
                <span className="font-bold text-sm uppercase tracking-wider">Multi-Factor Authenticated</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg border border-white/20">
                <Lock className="w-6 h-6 text-[#F5AB24]" />
                <span className="font-bold text-sm uppercase tracking-wider">Secure Data Transmission</span>
              </div>
            </div>
          </div>

          <div className="mt-auto relative z-10 flex justify-between items-center opacity-60">
            <span className="text-xs font-black tracking-widest uppercase">© 2024 SLIIT Global</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-[#142B5D] mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h1>
              <p className="text-slate-500 font-bold text-sm">
                {isLogin 
                  ? 'Enter your institutional credentials to access the system.' 
                  : 'Register as a student to access campus resources and support.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-1.5 px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg px-4 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-1.5 px-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@sliit.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg px-4 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-1.5 px-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg px-4 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-1.5 px-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg px-4 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 border-2 border-slate-300 rounded text-[#142B5D] focus:ring-[#142B5D]" />
                    <span className="ml-2 text-[10px] text-slate-500 font-bold group-hover:text-[#142B5D] transition uppercase tracking-wider">Remember me</span>
                  </label>
                  <a href="#" className="text-[10px] font-black text-[#142B5D] hover:text-[#F5AB24] transition uppercase tracking-wider">Forgot Password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#142B5D] text-white font-black py-4 rounded-lg shadow-xl shadow-blue-900/20 hover:bg-[#0D1E40] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In to Portal' : 'Create Student Account')}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[#142B5D] hover:text-[#F5AB24] transition underline decoration-2 underline-offset-4"
                >
                  {isLogin ? 'Register as Student' : 'Sign In instead'}
                </button>
              </p>
            </div>

            <div className="mt-12 text-center">
              <Link to="/" className="text-[10px] font-black text-slate-400 hover:text-[#142B5D] transition uppercase tracking-widest">
                ← Back to institution website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
