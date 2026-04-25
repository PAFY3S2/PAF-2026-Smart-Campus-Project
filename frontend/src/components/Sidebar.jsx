import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Ticket, User, LogOut, Shield, Map, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Campus Map', path: '/map', icon: Map },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-72 h-screen bg-[#0c1b35] flex flex-col sticky top-0 border-r border-white/10">
      {/* Logo Area */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-[#0c1b35] rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Institutional</h1>
            <p className="text-[10px] font-bold text-[#f7b924] uppercase tracking-[0.2em]">Operations Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                isActive 
                  ? 'bg-[#f7b924] text-[#0c1b35] shadow-lg shadow-[#f7b924]/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} className={({ isActive }) => isActive ? 'text-[#0c1b35]' : 'group-hover:scale-110 transition-transform'} />
            {item.name}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group mt-8 ${
                isActive 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`
            }
          >
            <Shield size={20} />
            Admin Console
          </NavLink>
        )}
      </nav>

      {/* User Profile Summary & Logout */}
      <div className="p-6 mt-auto border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
