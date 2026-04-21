import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Ticket, UserCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { name: 'Resources', to: '/resources', icon: Users, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { name: 'Bookings', to: '/bookings', icon: Calendar, roles: ['USER'] },
    { name: 'My Bookings', to: '/my-bookings', icon: Calendar, roles: ['USER'] },
    { name: 'Tickets', to: '/tickets', icon: Ticket, roles: ['USER'] },
    { name: 'My Tickets', to: '/my-tickets', icon: Ticket, roles: ['USER'] },
    { name: 'Admin Bookings', to: '/admin/bookings', icon: ShieldAlert, roles: ['ADMIN'] },
    { name: 'Admin Tickets', to: '/admin/tickets', icon: ShieldAlert, roles: ['ADMIN', 'TECHNICIAN'] },
    { name: 'Profile', to: '/profile', icon: UserCircle, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user?.role));

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 transform transition-transform duration-300 z-30 lg:translate-x-0 lg:static flex flex-col",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">SH</span>
        </div>
        <span className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Smart Campus</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Menu</div>
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)} // close on mobile
            className={({ isActive }) =>
              clsx(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors group text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary dark:bg-primary/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex justify-center items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
