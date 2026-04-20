import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Box, 
  CalendarCheck, 
  Ticket as TicketIcon, 
  User as UserIcon,
  Activity,
  Shield,
  ClipboardList,
  Users,
  Command,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PreferencesModal from '../components/shared/PreferencesModal';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  const coreItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Infrastructure', path: '/resources', icon: Box },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const studentItems = [
    { name: 'Request Booking', path: '/bookings', icon: CalendarCheck },
    { name: 'Booking History', path: '/my-bookings', icon: ClipboardList },
    { name: 'Incident Report', path: '/tickets', icon: TicketIcon },
    { name: 'My Tickets', path: '/my-tickets', icon: Activity },
  ];

  const adminItems = [
    { name: 'Booking Control', path: '/admin/bookings', icon: shieldIcon(Shield) },
    { name: 'Response Hub', path: '/admin/tickets', icon: shieldIcon(Activity) },
    { name: 'User Directory', path: '/admin/users', icon: shieldIcon(Users) },
  ];

  function shieldIcon(Icon) {
    return (props) => (
      <div className="relative">
        <Icon {...props} />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-1 ring-slate-950" />
      </div>
    );
  }

  return (
    <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-50 transition-colors">
      <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center space-x-3 mb-10 group cursor-default">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <Command className="w-6 h-6 text-primary" />
          </div>
          <div>
             <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">ScholarFlow</h1>
             <p className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em]">Institutional Hub</p>
          </div>
        </div>

        <nav className="space-y-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em] mb-4 ml-4">Core Telemetry</p>
            <div className="space-y-1">
              {coreItems.map(item => <NavItem key={item.path} {...item} />)}
            </div>
          </div>

          {user?.role === 'USER' && (
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em] mb-4 ml-4">Student Assets</p>
              <div className="space-y-1">
                {studentItems.map(item => <NavItem key={item.path} {...item} />)}
              </div>
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em] mb-4 ml-4">Command Center</p>
              <div className="space-y-1">
                {adminItems.map(item => <NavItem key={item.path} {...item} />)}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="p-8 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
           <div className="relative">
             <img src={user?.avatar} alt="" className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800" />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
           </div>
           <div className="overflow-hidden">
             <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
             <p className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest">{user?.role}</p>
           </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => setIsPreferencesOpen(true)}
            className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary transition-all flex items-center justify-center space-x-2 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm"
          >
             <Settings className="w-3.5 h-3.5" />
             <span>Preferences</span>
          </button>
          <button onClick={logout} className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 transition-all flex items-center justify-center space-x-2 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm hover:shadow-md">
             <LogOut className="w-3.5 h-3.5" />
             <span>Sign Out</span>
          </button>
        </div>
      </div>
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
    </aside>
  );
};

const NavItem = ({ path, name, icon: Icon }) => (
  <NavLink
    to={path}
    className={({ isActive }) => `
      flex items-center px-4 py-3 text-xs font-black rounded-2xl transition-all group uppercase tracking-wide
      ${isActive 
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_25px_rgba(79,70,229,0.08)]' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'
      }
    `}
  >
    <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110`} />
    {name}
  </NavLink>
);

export default Sidebar;
