import React, { useState, useEffect } from 'react';
import { Bell, Menu, X, Check, Sun, Moon, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  

  useEffect(() => {
    if (user) {
      api.get('/notifications').then((res) => setNotifications(res.data));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleToggleNotifications = () => {
    const opening = !showNotifications;
    setShowNotifications(opening);
    if (opening && unreadCount > 0) {
      api.patch('/notifications/read-all').catch(console.error);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-20 transition-colors">
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-400 hover:text-[#142B5D] hover:bg-slate-100 focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Global Search */}
        <div className="hidden md:flex items-center ml-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search faculty resources..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm font-medium text-[#142B5D] dark:text-white focus:outline-none focus:border-[#142B5D] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-400 hover:text-[#142B5D] hover:bg-slate-100 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button 
            className="p-2 rounded-full text-slate-400 hover:text-[#142B5D] hover:bg-slate-100 transition relative"
            onClick={handleToggleNotifications}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F5AB24] rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#142B5D] dark:text-white">System Notifications</h3>
                <span className="text-[10px] font-black bg-[#F5AB24] text-[#142B5D] px-2 py-0.5 rounded-full">{unreadCount} NEW</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400">No active alerts</div>
                ) : (
                  notifications.map(note => (
                    <div key={note.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 flex items-start ${!note.read ? 'bg-indigo-50/30' : ''}`}>
                      <div className="flex-1">
                        <p className={`text-sm ${!note.read ? 'text-[#142B5D] font-bold' : 'text-slate-600 font-medium'}`}>
                          {note.message}
                        </p>
                        <span className="text-[10px] font-black text-slate-400 mt-2 block uppercase tracking-tighter">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {!note.read && (
                        <button onClick={() => markAsRead(note.id)} className="ml-2 text-[#142B5D] hover:text-[#F5AB24]" title="Mark as read">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-black text-[#142B5D] uppercase tracking-widest hover:text-[#F5AB24] transition">View All Activity</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-4">
          <div className="text-right mr-3 hidden md:block">
            <p className="text-sm font-black text-[#142B5D] dark:text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.15em]">{user?.role}</p>
          </div>
          <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border-2 border-slate-100 dark:border-slate-800 shadow-sm" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
