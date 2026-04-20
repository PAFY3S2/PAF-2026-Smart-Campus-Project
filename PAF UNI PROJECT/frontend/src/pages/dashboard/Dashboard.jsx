import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, Ticket, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import TechnicianDashboard from './TechnicianDashboard';

import PageHeader from '../../components/shared/PageHeader';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/resources'),
      api.get('/bookings'),
      api.get('/tickets')
    ]).then(([resRes, bookRes, tickRes]) => {
      setStats({
        resources: resRes.data.length,
        bookings: bookRes.data.length,
        tickets: tickRes.data.length
      });
    });
  }, []);
  
  if (user?.role === 'TECHNICIAN') {
    return <TechnicianDashboard />;
  }

  const statCards = [
    { name: 'Total Resources', value: stats.resources, icon: Users, color: 'text-[#142B5D]', bg: 'bg-[#142B5D]/5', border: 'border-[#142B5D]/10' },
    { name: 'Active Bookings', value: stats.bookings, icon: Calendar, color: 'text-[#F5AB24]', bg: 'bg-[#F5AB24]/5', border: 'border-[#F5AB24]/20' },
    { name: 'Incident Tickets', value: stats.tickets, icon: Ticket, color: 'text-[#142B5D]', bg: 'bg-[#142B5D]/5', border: 'border-[#142B5D]/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="System Overview" 
        subtitle="Institutional Operations Dashboard" 
        showBanner={true} 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border-2 ${stat.border} p-6 flex items-center transition-all hover:shadow-md hover:-translate-y-1`}>
            <div className={`p-4 rounded-lg ${stat.bg} mr-5`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-3xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex items-center justify-between mb-8 text-[#142B5D] dark:text-white">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 text-[#F5AB24]" />
              System Activity Log
            </h3>
            <button className="text-[10px] font-black text-[#142B5D] dark:text-[#F5AB24] hover:opacity-75 uppercase tracking-tighter">Refresh Log</button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-center p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="animate-pulse w-3 h-3 bg-slate-300 rounded-full"></span>
                </div>
                <p className="text-xs font-bold text-slate-400 italic">No recent system alerts to display</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck className="w-24 h-24 text-[#142B5D] dark:text-white" />
           </div>
           <h3 className="font-black text-[#142B5D] dark:text-white uppercase tracking-widest text-sm mb-6">Security & Usage</h3>
           <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-[#F5AB24]">
                <p className="text-xs font-black text-[#142B5D] uppercase tracking-tighter mb-1">Authenticated IP</p>
                <p className="text-sm font-bold text-slate-600 tracking-widest">192.168.1.104 (Verified)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-[#142B5D]">
                <p className="text-xs font-black text-[#142B5D] uppercase tracking-tighter mb-1">Session Duration</p>
                <p className="text-sm font-bold text-slate-600 tracking-widest">02:45:12 Active</p>
              </div>
           </div>
           <button className="w-full mt-8 py-3 bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#0D1E40] transition shadow-md">
              View Access Logs
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
