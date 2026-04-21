import React, { useState } from 'react';
import { Bell, Search, User, Sun, Moon, ShieldCheck, Menu, X, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications = [], markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (n) => {
    markAsRead.mutate(n.id);
    if (n.ticketId) {
      navigate(`/tickets/${n.ticketId}`);
    }
    setShowNotifications(false);
  };

  return (
    <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Search Bar - REPLICATED FROM ADMIN */}
        <div className="flex-1 max-w-2xl relative group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#142B5D] transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search faculty resources..."
            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-[#142B5D] dark:text-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Secure Session Badge */}
        <div className="hidden xl:flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg mr-2">
           <ShieldCheck className="w-4 h-4 text-[#F5AB24]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Session Active</span>
        </div>

        <div className="flex items-center space-x-1 relative">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-400 hover:text-[#142B5D] dark:hover:text-[#F5AB24] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={clsx(
              "relative p-2.5 rounded-full transition-all",
              showNotifications ? "bg-[#142B5D] text-white" : "text-slate-400 hover:text-[#142B5D] dark:hover:text-[#F5AB24] hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#F5AB24] border-2 border-white dark:border-slate-900 rounded-full shadow-sm flex items-center justify-center text-[8px] font-black text-[#142B5D]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white">Institutional Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#F5AB24] text-[#142B5D] text-[8px] font-black rounded uppercase">
                      {unreadCount} New
                    </span>
                  )}
               </div>
               <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={clsx(
                          "p-4 border-b last:border-0 border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group",
                          !n.read && "bg-blue-50/30 dark:bg-blue-900/10"
                        )}
                      >
                         <div className="flex items-start space-x-3">
                            <div className={clsx(
                              "p-2 rounded-lg mt-1",
                              n.type === 'urgent' ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                               {n.type === 'urgent' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-[#142B5D] dark:text-slate-200 group-hover:text-[#F5AB24] transition-colors uppercase tracking-tight">{n.title}</p>
                               <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-tight">{n.message}</p>
                               <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">
                                 {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                               </p>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
               <div className="p-3 text-center bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => markAllAsRead.mutate()}
                    className="text-[8px] font-black uppercase tracking-widest text-[#142B5D] dark:text-[#F5AB24] hover:underline"
                  >
                    Clear Internal Log
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-1 md:mx-2"></div>

        {/* Profile Section - REPLICATED FROM ADMIN */}
        <div className="flex items-center pl-2">
          <div className="text-right mr-3 hidden md:block">
            <p className="text-sm font-black text-[#142B5D] dark:text-white leading-tight">
              {user?.name || 'Technician'}
            </p>
            <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.15em] mt-0.5">
              {user?.role || 'Technician'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden p-0.5">
             {user?.avatar ? (
               <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
             ) : (
               <div className="w-full h-full bg-[#142B5D] rounded-full flex items-center justify-center text-white">
                 <User className="w-6 h-6" />
               </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
