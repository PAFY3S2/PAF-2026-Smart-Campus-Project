import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle2, Sparkles, Key, RefreshCw, ArrowLeft } from 'lucide-react';
import campusBg from '../assets/campus-bg.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8081/api/auth/register', formData);
      setStep(2);
      setSuccess(response.data.message || 'Verification code sent to your email.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:8081/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });
      setSuccess('Account verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/auth/resend-otp', {
        email: formData.email
      });
      setSuccess(response.data.message || 'A new code has been sent.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse overflow-hidden bg-[#0a0a0c] font-outfit">
      {/* Right Side: Stunning HD Image */}
      <div className="hidden md:flex md:w-[60%] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0c] via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-blue-900/20 z-10"></div>
        
        <img 
          src={campusBg} 
          alt="Campus Hub" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] group-hover:scale-110"
        />
        
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white text-right items-end animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium tracking-widest uppercase text-purple-300">
              {step === 1 ? 'Join the Community • Register' : 'Identity Verification • Security'}
            </span>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              {step === 1 ? <Sparkles className="text-purple-400" size={24} /> : <Key className="text-purple-400" size={24} />}
            </div>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tighter">
            {step === 1 ? (
              <>Unlock Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-pink-500">Academic Potential</span></>
            ) : (
              <>Secure Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-pink-500">Campus Identity</span></>
            )}
          </h1>
          <p className="max-w-md text-lg text-gray-400 leading-relaxed text-right">
            {step === 1 
              ? "Join the Smart Campus Hub today. Manage your academic profile, notifications, and campus interactions."
              : "We've sent a 6-digit verification code to your institutional email. Please enter it to activate your node."}
          </p>
        </div>
      </div>

      {/* Left Side: Modern Glassmorphic Form */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 bg-[#0a0a0c] relative">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="w-full max-w-md relative z-10 animate-slide-in-bottom">
          <div className="mb-10 text-center md:text-left">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors mb-4 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Registration</span>
              </button>
            )}
            <h2 className="text-4xl font-bold text-white mb-3">
              {step === 1 ? 'Join the Hub' : 'Verify Email'}
            </h2>
            <p className="text-gray-500">
              {step === 1 ? 'Create your campus account to get started' : `Verification code sent to ${formData.email}`}
            </p>
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
              <p>{success}</p>
            </div>
          )}

          {step === 1 ? (
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
                {loading ? 'Initiating Verification...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 ml-1 block text-center">6-Digit Verification Code</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full pl-12 pr-4 py-6 bg-white/5 border border-white/10 rounded-2xl text-white text-center text-3xl font-black tracking-[0.5em] placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying Identity...' : 'Complete Registration'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending || loading}
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors py-2"
                >
                  <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                  {resending ? 'Resending Code...' : 'Resend Verification Code'}
                </button>
              </div>
            </form>
          )}

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
