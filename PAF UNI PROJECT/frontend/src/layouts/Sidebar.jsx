import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Ticket, UserCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import logo from '../assets/SLIIT FacilityFlow logo design.png';


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
    { name: 'Admin Tickets', to: '/admin/tickets', icon: ShieldAlert, roles: ['ADMIN'] },
    { name: 'Manage Technicians', to: '/admin/technicians', icon: Users, roles: ['ADMIN'] },
    { name: 'My Tickets', to: '/technician/tickets', icon: Ticket, roles: ['TECHNICIAN'] },
    { name: 'Priority Tickets', to: '/technician/priority', icon: ShieldAlert, roles: ['TECHNICIAN'] },
    { name: 'Location Tickets', to: '/technician/locations', icon: Users, roles: ['TECHNICIAN'] },
    { name: 'Profile', to: '/profile', icon: UserCircle, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user?.role));

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-[#142B5D] text-white border-r border-white/10 w-64 transform transition-transform duration-300 z-30 lg:translate-x-0 lg:static flex flex-col",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#0D1E40]">
        <img src={logo} alt="SLIIT" className="h-10 w-auto mr-3" />
        <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">
          Facility<span className="text-[#F5AB24]">Flow</span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-2">Institutional Menu</div>
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)} // close on mobile
            className={({ isActive }) =>
              clsx(
                "flex items-center px-4 py-3 rounded transition-all group text-sm font-bold",
                isActive 
                  ? "bg-[#F5AB24] text-[#142B5D] shadow-lg shadow-black/20" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <link.icon className={clsx(
              "w-5 h-5 mr-3 flex-shrink-0 transition-colors",
              "group-hover:text-[#F5AB24]"
            )} />
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-white/10 bg-[#0D1E40]">
        <button
          onClick={logout}
          className="w-full flex justify-center items-center px-4 py-2 border-2 border-white/20 rounded font-black text-xs uppercase tracking-widest text-white hover:bg-white hover:text-[#142B5D] transition-all"
        >
          Logout System
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
