import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Small delay to ensure the DOM has rendered before animating in
      setTimeout(() => setIsVisible(true), 10);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div 
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'
      }`}
    >
      <div className={`relative overflow-hidden flex items-start p-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[320px] max-w-md ${
        isSuccess 
          ? 'bg-white/90 border-emerald-200 text-slate-800 dark:bg-slate-900/90 dark:border-emerald-800/50 dark:text-slate-100' 
          : 'bg-white/90 border-rose-200 text-slate-800 dark:bg-slate-900/90 dark:border-rose-800/50 dark:text-slate-100'
      }`}>
        <div className={`shrink-0 mr-4 mt-0.5 p-1 rounded-full ${isSuccess ? 'bg-emerald-100/50 dark:bg-emerald-900/30' : 'bg-rose-100/50 dark:bg-rose-900/30'}`}>
          {isSuccess 
            ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 
            : <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          }
        </div>
        <div className="flex-1 mr-4">
          <h4 className={`text-sm font-bold mb-1 tracking-wide ${isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {isSuccess ? 'Success' : 'Error'}
          </h4>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Progress Bar */}
        <div 
          className={`absolute bottom-0 left-0 h-1 transition-all ease-linear ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}
          style={{ 
            width: isVisible ? '100%' : '0%',
            transitionDuration: isVisible ? `${duration}ms` : '0ms'
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
