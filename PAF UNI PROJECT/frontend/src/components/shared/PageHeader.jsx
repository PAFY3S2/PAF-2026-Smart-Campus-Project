import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PageHeader = ({ title, subtitle, showBanner = false }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 mb-8">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tight">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-black text-[#142B5D] dark:text-[#F5AB24] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded uppercase tracking-tighter transition-colors">
          <ShieldCheck className="w-4 h-4 text-[#F5AB24]" />
          <span>Secure Session Active</span>
        </div>
      </div>
      
      {/* Optional Banner Section */}
      {showBanner && (
        <div className="bg-[#142B5D] rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-full bg-[#F5AB24] skew-x-[-20deg] translate-x-32 opacity-10"></div>
          <div className="p-8 flex items-center relative z-10">
            <div className="relative">
              <img src={user?.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-[#F5AB24] shadow-lg" />
              <div className="absolute -bottom-1 -right-1 bg-[#F5AB24] p-1.5 rounded-full border-2 border-[#142B5D]">
                <TrendingUp className="w-3 h-3 text-[#142B5D]" />
              </div>
            </div>
            <div className="ml-8 text-white">
              <h2 className="text-2xl font-black tracking-tight">Welcome, {user?.name}</h2>
              <div className="flex items-center mt-2 space-x-3">
                <span className="px-3 py-1 bg-white/10 rounded font-black text-[10px] uppercase tracking-widest border border-white/20">
                  {user?.role} Account
                </span>
                <span className="text-slate-300 text-xs font-bold italic opacity-60">Verified Access</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
