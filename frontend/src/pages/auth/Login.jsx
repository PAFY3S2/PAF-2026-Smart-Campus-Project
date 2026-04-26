import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/SLIIT FacilityFlow logo design.png';
import adminBtnImg from '../../assets/ADMIN LOOK (1).jpg';
import api from '../../services/api';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const userData = await login(email, password);
        if (userData.role === 'TECHNICIAN') {
          navigate('/technician/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const response = await register({ name, email, password });
        setSuccess(response.message || 'Verification code sent to your email.');
        setStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Authentication failed';
      setError(typeof msg === 'string' ? msg : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setSuccess('Account verified successfully! You can now sign in.');
      setIsLogin(true);
      setStep(1);
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/resend-otp', { email });
      setSuccess(response.data.message || 'A new code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
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
            <img src={logo} alt="SLIIT Logo" className="h-16 w-auto mb-8 object-contain" />
            <h2 className="text-4xl font-black leading-tight mb-6">
              {step === 1 ? 'Welcome to the' : 'Identity'} <br/>
              <span className="text-[#F5AB24]">{step === 1 ? 'Institutional Portal' : 'Verification'}</span>
            </h2>
            <p className="text-lg text-white/80 font-medium max-w-sm mb-12">
              {step === 1 
                ? "Access the FACILITYFLOW Operations ecosystem. Manage resources, track incidents, and optimize campus life."
                : "We've sent a 6-digit security code to your SLIIT email. Please enter it to activate your account."}
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
              <h1 className="text-3xl font-black text-[#142B5D] mb-2">
                {isLogin ? 'Sign In' : (step === 1 ? 'Create Account' : 'Verify Email')}
              </h1>
              <p className="text-slate-500 font-bold text-sm">
                {isLogin 
                  ? 'Enter your institutional credentials to access the system.' 
                  : (step === 1 
                      ? 'Register as a student to access campus resources and support.'
                      : `Enter the 6-digit code sent to ${email}`)}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm font-bold rounded">
                {success}
              </div>
            )}

            {!isLogin && step === 2 ? (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-3 text-center">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-xl px-4 py-5 outline-none transition text-3xl font-black text-[#142B5D] placeholder-slate-200 text-center tracking-[0.5em]"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#142B5D] text-white font-black py-4 rounded-lg shadow-xl shadow-blue-900/20 hover:bg-[#0D1E40] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'Verifying...' : 'Complete Registration'}
                    {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="w-full text-[10px] font-black text-[#142B5D] hover:text-[#F5AB24] transition uppercase tracking-widest text-center"
                  >
                    Resend Verification Code
                  </button>
                </div>
              </form>
            ) : (
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg pl-4 pr-12 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#142B5D] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-black text-[#142B5D] uppercase tracking-widest mb-1.5 px-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#142B5D] rounded-lg pl-4 pr-12 py-3 outline-none transition text-sm font-bold text-[#142B5D] placeholder-slate-400"
                      />
                    </div>
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
            )}

            {/* Google OAuth - Only show if not in OTP step */}
            {(isLogin || step === 1) && (
              <div className="mt-6">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
                <a
                  href="http://localhost:8081/oauth2/authorization/google"
                  className="mt-4 w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-100 rounded-lg hover:border-[#142B5D] hover:bg-slate-50 transition font-bold text-sm text-slate-600"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </a>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); setStep(1); }}
                  className="ml-2 text-[#142B5D] hover:text-[#F5AB24] transition underline decoration-2 underline-offset-4"
                >
                  {isLogin ? 'Register as Student' : 'Sign In instead'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
