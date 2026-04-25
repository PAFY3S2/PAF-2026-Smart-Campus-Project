import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, isLoading }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
  };

  return (
    <div className={`p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-lg border ${colors[color] || colors.blue}`}>
          {isLoading ? <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" /> : <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Metrics</span>
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mt-1" />
        ) : (
          <p className="text-2xl font-black text-[#142B5D] dark:text-white tracking-tighter">
            {value ?? 0}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
