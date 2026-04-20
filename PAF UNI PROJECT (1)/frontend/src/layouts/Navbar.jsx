import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, Search, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center flex-1">
        <div className="max-w-md w-full relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search resources, tickets..." 
            className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-slate-300 transition-all placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full border-2 border-white dark:border-slate-900 animate-soft-pulse"></span>
        </button>

        <div className="flex items-center space-x-4 border-l border-slate-800/50 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{user?.name}</p>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase">{user?.role}</p>
          </div>
          <div className="relative group">
            <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer group-hover:border-primary transition-all" />
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition text-left">
                <UserIcon className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition mt-1 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
