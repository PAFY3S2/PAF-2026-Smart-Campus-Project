import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckSquare } from 'lucide-react';
import campusBg from '../assets/campus-bg.png';

const LoginPage = () => {
  const { user, login: contextLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-10 font-outfit">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[700px]">
        
        {/* Left Side: Institutional Branding */}
        <div className="w-full md:w-1/2 relative overflow-hidden bg-[#0c1b35]">
          <img 
            src={campusBg} 
            alt="Campus" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1b35]/95 to-[#1a2b4b]/80 z-10"></div>
          
          <div className="relative z-20 flex flex-col h-full p-10 md:p-14 text-white">
            <div className="mb-12">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-10 h-10 bg-[#0c1b35] rounded-sm"></div>
              </div>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Welcome to the <br />
                <span className="text-[#f7b924]">Institutional Portal</span>
              </h1>
              
              <p className="text-gray-300 text-lg max-w-md mb-12 leading-relaxed">
                Access the FACILITYFLOW Operations ecosystem. Manage resources, track incidents, and optimize campus life.
              </p>
              
              <div className="space-y-4 max-w-sm">
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all cursor-default group">
                  <div className="w-10 h-10 rounded-full bg-[#f7b924]/20 flex items-center justify-center text-[#f7b924]">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-bold text-sm tracking-wide uppercase">Multi-factor Authenticated</span>
                </div>
                
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all cursor-default group">
                  <div className="w-10 h-10 rounded-full bg-[#f7b924]/20 flex items-center justify-center text-[#f7b924]">
                    <Lock size={20} />
                  </div>
                  <span className="font-bold text-sm tracking-wide uppercase">Secure Data Transmission</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-10">
              <p className="text-xs text-gray-400 font-medium tracking-widest">
                © 2024 SLIIT GLOBAL
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-[#0c1b35] mb-3">Sign In</h2>
              <p className="text-gray-500 font-medium">Enter your institutional credentials to access the system.</p>
            </div>

            {(urlError || localError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <ShieldCheck className="flex-shrink-0" size={18} />
                <p>{localError || (urlError === 'bad_credentials' ? 'Invalid credentials provided.' : urlError)}</p>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 tracking-[0.1em] uppercase ml-1">Institutional Email</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    className="block w-full px-5 py-4 bg-[#eef4ff] border-none rounded-xl text-[#0c1b35] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c1b35]/20 transition-all"
                    placeholder="pasan@test.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 tracking-[0.1em] uppercase ml-1">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    className="block w-full px-5 py-4 bg-[#eef4ff] border-none rounded-xl text-[#0c1b35] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c1b35]/20 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#0c1b35] focus:ring-[#0c1b35]/20"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase tracking-wider">Remember Me</span>
                </label>
                <Link to="#" className="text-[11px] font-black text-[#0c1b35] hover:underline uppercase tracking-wider">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="w-full py-4 mt-2 rounded-xl bg-[#0c1b35] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#1a2b4b] transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#0c1b35]/10"
              >
                <span>{localLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                {!localLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"><span className="bg-white px-4">Or continue with</span></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 text-sm shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <p className="mt-12 text-center text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#0c1b35] font-bold underline decoration-2 underline-offset-4 hover:text-[#1a2b4b] transition-colors">
                Register as Student
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
