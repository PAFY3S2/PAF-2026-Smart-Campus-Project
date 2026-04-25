import React from 'react';
import { User, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const UpdateTimeline = ({ updates }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'STATUS_CHANGE': return RefreshCw;
      case 'COMMENT': return User;
      case 'RESOLUTION': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'STATUS_CHANGE': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'COMMENT': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'RESOLUTION': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
      {updates.length === 0 ? (
        <p className="text-xs text-slate-400 italic pl-12">Zero operation activity recorded.</p>
      ) : (
        updates.map((update, index) => {
          const Icon = getIcon(update.type);
          return (
            <div key={index} className="relative pl-12 group">
              <div className={`absolute left-0 top-0 p-2 rounded-lg border-2 border-white dark:border-slate-900 shadow-sm z-10 ${getColor(update.type)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#142B5D] dark:text-[#F5AB24]">
                    {update.user || 'Hub System'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {new Date(update.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                  {update.note || update.action}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UpdateTimeline;
