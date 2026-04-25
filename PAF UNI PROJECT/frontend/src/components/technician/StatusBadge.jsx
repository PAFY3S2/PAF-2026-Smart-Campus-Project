import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes safely
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatusBadge = ({ status, className }) => {
  const getStyles = (status) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'URGENT':
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'MEDIUM':
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'LOW':
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'OPEN':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors duration-200",
      getStyles(status),
      className
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
