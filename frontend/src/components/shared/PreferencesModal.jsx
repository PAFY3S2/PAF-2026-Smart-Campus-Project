import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, Smartphone, Globe, Accessibility, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PreferencesModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('user_preferences');
    return saved ? JSON.parse(saved) : {
      emailAlerts: true,
      smsAlerts: false,
      reducedMotion: false,
      timeFormat24: true
    };
  });

  useEffect(() => {
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
  }, [prefs]);

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl max-w-xl w-full relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Platform Preferences</h3>
                 <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">Personalize Your Environment</p>
               </div>
               <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
              >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="space-y-8 relative z-10 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
              
              {/* THEME SECTION */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center">
                  <Sun className="w-3 h-3 mr-2" /> Interface Theme
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all border-2
                      ${theme === 'dark' 
                        ? 'bg-slate-950 border-primary shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                   >
                      <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-primary' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Deep Midnight</span>
                   </button>

                   <button 
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all border-2
                      ${theme === 'light' 
                        ? 'bg-white border-primary shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-700'}`}
                   >
                      <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-primary' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>Crisp Canvas</span>
                   </button>
                </div>
              </div>

              {/* NOTIFICATIONS SECTION */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center">
                  <Bell className="w-3 h-3 mr-2" /> Communications
                </h4>
                <div className="space-y-3">
                   <ToggleRow 
                     icon={Bell} 
                     title="Email Approvals" 
                     subtitle="Receive booking confirmations directly to your inbox."
                     active={prefs.emailAlerts}
                     onToggle={() => handleToggle('emailAlerts')}
                   />
                   <ToggleRow 
                     icon={Smartphone} 
                     title="SMS Incident Alerts" 
                     subtitle="Get urgent technician updates via text message."
                     active={prefs.smsAlerts}
                     onToggle={() => handleToggle('smsAlerts')}
                   />
                </div>
              </div>

              {/* SYSTEM & ACCESSIBILITY SECTION */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center">
                  <Accessibility className="w-3 h-3 mr-2" /> Accessibility & Regional
                </h4>
                <div className="space-y-3">
                   <ToggleRow 
                     icon={Activity} 
                     title="Reduce UI Motion" 
                     subtitle="Minimize active animations and parallax effects."
                     active={prefs.reducedMotion}
                     onToggle={() => handleToggle('reducedMotion')}
                   />
                   <ToggleRow 
                     icon={Globe} 
                     title="24-Hour Time Format" 
                     subtitle="Display calendars and bookings using a 24-hour clock."
                     active={prefs.timeFormat24}
                     onToggle={() => handleToggle('timeFormat24')}
                   />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ToggleRow = ({ icon: Icon, title, subtitle, active, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
    <div className="flex items-center space-x-4">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${active ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
         <Icon className="w-5 h-5" />
       </div>
       <div>
         <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</p>
         <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{subtitle}</p>
       </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${active ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div 
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${active ? 'translate-x-6' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

export default PreferencesModal;
