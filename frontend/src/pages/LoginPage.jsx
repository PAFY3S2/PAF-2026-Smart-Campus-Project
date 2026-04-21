import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { LogIn, ShieldAlert, Mail, Lock, Sparkles } from 'lucide-react';
import campusBg from '../assets/campus-bg.png';

const LoginPage = () => {
  const { user, login: contextLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlError = queryParams.get('error');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError('');
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', formData);
      contextLogin(response.data.token);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#0a0a0c] font-outfit">
      {/* Left Side: Stunning HD Image (Hidden on small screens) */}
      <div className="hidden md:flex md:w-[60%] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-purple-900/20 z-10"></div>
        
        <img 
          src={campusBg} 
          alt="Campus Hub" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] group-hover:scale-110"
        />
        
        {/* Decorative content on image */}
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="text-blue-400" size={24} />
            </div>
            <span className="text-sm font-medium tracking-widest uppercase text-blue-300">Member 4 • Project Showcase</span>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tighter">
            Smart Campus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Operations Hub</span>
          </h1>
          <p className="max-w-md text-lg text-gray-400 leading-relaxed">
            Experience the next generation of campus management. Secure, efficient, and beautifully designed for the modern academic ecosystem.
          </p>
        </div>
      </div>

      {/* Right Side: Modern Glassmorphic Form */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 bg-[#0a0a0c] relative">
        {/* Background blobs for depth */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="w-full max-w-md relative z-10 animate-slide-in-bottom">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to continue</p>
          </div>

          {(urlError || localError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
              <ShieldAlert className="flex-shrink-0" size={20} />
              <p>{localError || (urlError === 'bad_credentials' ? 'Invalid credentials provided.' : urlError)}</p>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {localLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0c] px-4 text-gray-600 font-medium tracking-widest">Or login with</span></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
