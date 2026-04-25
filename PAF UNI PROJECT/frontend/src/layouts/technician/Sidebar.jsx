import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  Flag, 
  Layers, 
  UserCircle,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import logo from '../../assets/SLIIT FacilityFlow logo design.png';

const Sidebar = ({ isOpen, setOpen }) => {
  const { logout } = useAuth();
  
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
{/* Overlay */}
    {isOpen && (
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
      />
    )}

     <aside
    className={clsx(
      "fixed inset-y-0 left-0 bg-[#142B5D] text-white border-r border-white/10 w-64 transform transition-transform duration-300 z-50 lg:translate-x-0 lg:static flex flex-col shadow-2xl",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
  >
      {/* Brand Header - FIXED REPLICATION */}
      <div className="h-20 flex items-center px-6 bg-[#0D1E40] border-b border-white/10 relative">
        <div className="bg-white p-1.5 rounded-lg shadow-sm mr-3">
          <img src={logo} alt="SLIIT" className="h-8 w-8 object-contain" />
        </div>
        
        <span className="text-xl font-black uppercase tracking-tighter whitespace-nowrap">
          FACILITY<span className="text-[#F5AB24]">FLOW</span>
        </span>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setOpen(false)}  aria-label="Close Sidebar"
          className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4 px-4 leading-none">
          Institutional Menu
        </div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-xl transition-all group font-bold text-sm",
              isActive 
                ? "bg-[#F5AB24] text-[#142B5D] shadow-xl shadow-black/20" 
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={clsx(
              "w-5 h-5 mr-4 flex-shrink-0 transition-colors",
              "group-hover:text-white"
            )} />
            <span className="whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-6 bg-[#0D1E40]/50 border-t border-white/5">
        <button 
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-white/10 text-white/80 hover:bg-white hover:text-[#142B5D] transition-all duration-300 group font-black text-xs uppercase tracking-widest"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>

    </>
  );
};

export default Sidebar;
