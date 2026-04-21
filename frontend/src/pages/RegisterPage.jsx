import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import campusBg from '../assets/campus-bg.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:8081/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse overflow-hidden bg-[#0a0a0c] font-outfit">
      {/* Right Side: Stunning HD Image (Flipped layout for visual variety) */}
      <div className="hidden md:flex md:w-[60%] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0c] via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-blue-900/20 z-10"></div>
        
        <img 
          src={campusBg} 
          alt="Campus Hub" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] group-hover:scale-110"
        />
        
        {/* Decorative content on image */}
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white text-right items-end animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium tracking-widest uppercase text-purple-300">Join the Community • Register</span>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="text-purple-400" size={24} />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tighter">
            Unlock Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-pink-500">Academic Potential</span>
          </h1>
          <p className="max-w-md text-lg text-gray-400 leading-relaxed text-right">
            Join the Smart Campus Hub today. Manage your academic profile, notifications, and campus interactions with a unified, state-of-the-art interface.
          </p>
        </div>
      </div>

      {/* Left Side: Modern Glassmorphic Form */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 bg-[#0a0a0c] relative">
        {/* Background blobs for depth */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="w-full max-w-md relative z-10 animate-slide-in-bottom">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-3">Join the Hub</h2>
            <p className="text-gray-500">Create your campus account to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
              <ShieldAlert className="flex-shrink-0" size={20} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 backdrop-blur-md rounded-2xl flex items-center gap-3 text-green-400 text-sm animate-fade-in">
              <CheckCircle2 className="flex-shrink-0" size={20} />
              <p>Registration successful! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
