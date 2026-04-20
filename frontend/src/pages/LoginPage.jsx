import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { LogIn, ShieldAlert } from 'lucide-react';

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
    // Redirect to backend OAuth2 endpoint
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background blobs for premium modern feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center transform -rotate-12 shadow-lg mb-6">
            <LogIn className="text-white transform rotate-12" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-300">Smart Campus Operations Hub</p>
        </div>

        {(urlError || localError) && (
          <div className="mb-6 animate-shake p-4 bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-xl flex items-center gap-3 text-red-200 text-sm text-left">
            <ShieldAlert className="flex-shrink-0" size={20} />
            <p>
              <strong className="block font-bold mb-0.5">Authentication Failed</strong>
              {localError || (urlError === 'bad_credentials' ? 'Invalid credentials provided. Please try again.' : urlError)}
            </p>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <LogIn size={18} className="rotate-90" />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <ShieldAlert size={18} />
            </div>
            <input
              type="password"
              required
              className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            disabled={localLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {localLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-gray-500">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-gray-900 bg-white hover:bg-gray-50 focus:ring-4 focus:ring-purple-300 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-blue-400 font-semibold underline underline-offset-4">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
