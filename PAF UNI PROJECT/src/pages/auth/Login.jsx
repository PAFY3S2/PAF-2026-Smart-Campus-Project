import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock logic: decide role based on email typed, or default to USER
      let role = 'USER';
      if (email.includes('alice')) role = 'ADMIN';
      if (email.includes('bob')) role = 'TECHNICIAN';
      
      await login(role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#222129] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-[#2a2932] w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[90vh]">
        
        {/* Left Side - Image/Branding */}
        <div className="hidden md:flex flex-col relative w-1/2 p-8" style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(42,30,85,0.4), rgba(15,12,25,0.9)), url("https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/646171339_1231176275881228_2357975964920838948_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeEyr3a1w1I80l_rAr0S5PxaZwCzmGpTDVpnALOYalMNWgJaUuDF8eIQJ2S5dt49y8-IynDZ5qajCcCLr56zaykD&_nc_ohc=8lPTB2oT6YkQ7kNvwGBM4ih&_nc_oc=AdrreZmVMT-0xgay7Jg6qcGjIY5gDIDlUfu1nTWQYRiQYXlrGaM1vMmugsXG5-kCEIY&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=sw-WogO_1xDHn4xggIIz7g&_nc_ss=7a3a8&oh=00_AfyujELP6WGr2npI14dmSdW5tUuQuI4r2LnqllyT8glGeQ&oe=69D08B86")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {/* Top Bar inside image */}
          <div className="flex justify-between items-center relative z-10">
            <div className="text-white font-bold text-2xl tracking-widest flex items-center">
              <span className="mr-1">∩</span>MU
            </div>
            <Link to="/" className="flex items-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium transition">
              Back to website <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Bottom Content inside image */}
          <div className="mt-auto relative z-10 text-center pb-8">
            <h2 className="text-3xl font-medium text-white mb-8 leading-tight">
              Capturing Moments,<br/>Creating Memories
            </h2>
            <div className="flex justify-center space-x-2">
              <div className="w-6 h-1 bg-white/30 rounded-full"></div>
              <div className="w-6 h-1 bg-white/30 rounded-full"></div>
              <div className="w-8 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-semibold text-white mb-2">Create an account</h1>
            <p className="text-slate-400 text-sm mb-10">
              Already have an account? <span className="text-[#7c5cfa] hover:text-[#9075fc] cursor-pointer transition">Log in</span>
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full bg-[#363541] text-white border border-transparent focus:border-[#7c5cfa] rounded-xl px-4 py-3.5 outline-none placeholder-slate-500 transition text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full bg-[#363541] text-white border border-transparent focus:border-[#7c5cfa] rounded-xl px-4 py-3.5 outline-none placeholder-slate-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#363541] text-white border border-transparent focus:border-[#7c5cfa] rounded-xl px-4 py-3.5 outline-none placeholder-slate-500 transition text-sm"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#363541] text-white border border-transparent focus:border-[#7c5cfa] rounded-xl px-4 py-3.5 outline-none placeholder-slate-500 transition text-sm"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center pt-2 pb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center w-5 h-5 bg-white rounded flex-shrink-0 border border-slate-300 mr-3">
                    <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer w-full h-full" defaultChecked />
                    <svg className="w-3.5 h-3.5 text-black pointer-events-none" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-300">
                    I agree to the <span className="underline decoration-[#7c5cfa] underline-offset-2 hover:text-white transition">Terms & Conditions</span>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                fullWidth
                className="bg-[#7c5cfa] hover:bg-[#694be0] text-white py-3.5 shadow-[0_4px_14px_0_rgba(124,92,250,0.39)] hover:shadow-[0_6px_20px_rgba(124,92,250,0.23)]"
              >
                Create account
              </Button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-[#434150]"></div>
              <span className="relative bg-[#2a2932] px-4 text-xs text-slate-500">Or quick login as</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button 
                type="button" 
                onClick={() => handleQuickLogin('USER')}
                disabled={loading}
                className="flex flex-col items-center justify-center px-2 py-3 border border-[#434150] rounded-xl hover:bg-[#363541] hover:border-[#7c5cfa] transition group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold">ST</span>
                </div>
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition">Student</span>
              </button>
              
              <button 
                type="button" 
                onClick={() => handleQuickLogin('ADMIN')}
                disabled={loading}
                className="flex flex-col items-center justify-center px-2 py-3 border border-[#434150] rounded-xl hover:bg-[#363541] hover:border-[#7c5cfa] transition group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold">AD</span>
                </div>
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition">Admin</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleQuickLogin('TECHNICIAN')}
                disabled={loading}
                className="flex flex-col items-center justify-center px-2 py-3 border border-[#434150] rounded-xl hover:bg-[#363541] hover:border-[#7c5cfa] transition group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold">TC</span>
                </div>
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition">Tech</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
