import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  Flag, 
  Layers, 
  UserCircle,
  LogOut,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PreferencesModal from '../../components/shared/PreferencesModal';
import clsx from 'clsx';
import logo from '../../assets/SLIIT FacilityFlow logo design.png';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user, logout } = useAuth();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', to: '/technician/dashboard', icon: LayoutDashboard },
    { name: 'In Progress', to: '/technician/in-progress', icon: Clock },
    { name: 'Resolved', to: '/technician/resolved', icon: CheckCircle },
    { name: 'Priority', to: '/technician/priority', icon: Flag },
    { name: 'Closed History', to: '/technician/closed', icon: Layers },
    { name: 'Profile', to: '/technician/profile', icon: UserCircle },
  ];

  return (
    <>
    <aside className={`w-72 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col h-screen fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      
      {/* Brand Header - Suranii Aesthetic Transferred */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 p-1 group-hover:border-primary transition-all shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
             <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">FACILITYFLOW</h1>
             <p className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em]">Institutional Hub</p>
          </div>
        </div>
        <button 
          onClick={() => setOpen(false)}
          className="lg:hidden text-slate-400 hover:text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em] mb-4 ml-4">
          TECHNICIAN ASSETS
        </div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-xs font-black rounded-2xl transition-all group uppercase tracking-wide
              ${isActive 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_25px_rgba(79,70,229,0.08)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-8 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
           <div className="relative">
             <img 
               src={user?.avatar || "https://images.unsplash.com/photo-1523240615152-44df0e1f7481?q=80&w=2070&auto=format&fit=crop"} 
               alt="" 
               className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md object-cover" 
             />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
           </div>
           <div className="overflow-hidden">
             <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || "System Admin"}</p>
             <p className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest">{user?.role || "ADMIN"}</p>
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
    </aside>
    <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
    </>
  );
};

export default Sidebar;
