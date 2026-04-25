import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionLabel, 
  onAction,
  containerClassName = "col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
}) => {
  return (
    <div className={containerClassName}>
      {Icon && (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
          <Icon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h3>
      )}
      {message && (
        <p className="max-w-md">
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onAction();
          }} 
          className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-md font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
