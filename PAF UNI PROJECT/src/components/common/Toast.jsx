import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
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
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className={`flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-sm min-w-80 max-w-md ${
        isSuccess 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-900/80 dark:border-emerald-800/60 dark:text-emerald-100' 
          : 'bg-rose-50/90 border-rose-200 text-rose-800 dark:bg-rose-900/80 dark:border-rose-800/60 dark:text-rose-100'
      }`}>
        <div className="shrink-0 mr-3 mt-0.5">
          {isSuccess 
            ? <CheckCircle className={`w-5 h-5 ${isSuccess ? 'text-emerald-500' : ''}`} /> 
            : <AlertCircle className={`w-5 h-5 ${isSuccess ? '' : 'text-rose-500'}`} />
          }
        </div>
        <div className="flex-1 mr-4">
          <h4 className="text-sm font-bold mb-0.5">
            {isSuccess ? 'Success' : 'Error'}
          </h4>
          <p className="text-sm font-medium opacity-90">{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`shrink-0 p-1 rounded-md transition-colors ${
            isSuccess 
              ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800 focus:ring-emerald-500' 
              : 'hover:bg-rose-100 dark:hover:bg-rose-800 focus:ring-rose-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
