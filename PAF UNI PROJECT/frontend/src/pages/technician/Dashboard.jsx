import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, FileDown, ShieldCheck, User } from 'lucide-react';
import StatCard from '../../components/technician/StatCard';
import TicketTable from '../../components/technician/TicketTable';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);

  const DUMMY_DATA = [
    { id: '101', title: 'Network Outage in Lab 3', priority: 'HIGH', building: 'Building C', lab: 'Lab 3', status: 'IN_PROGRESS', createdAt: new Date() },
    { id: '102', title: 'Smart Board Calibration', priority: 'MEDIUM', building: 'Building A', room: '302', status: 'OPEN', createdAt: new Date(Date.now() - 3600000) },
    { id: '103', title: 'System Patching', priority: 'LOW', building: 'IT Center', room: 'Server Room', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000) },
    { id: '104', title: 'Audio System Failure', priority: 'HIGH', building: 'Auditorium', status: 'OPEN', createdAt: new Date(Date.now() - 7200000) },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/technician/${user?.id || 'tech-1'}`).catch(() => ({ data: [] }));
        
        let ticketsData = res.data.length > 0 ? res.data : DUMMY_DATA;
        setTickets(ticketsData);

        setStats({
          assigned: ticketsData.length,
          inProgress: ticketsData.filter(t => t.status === 'IN_PROGRESS').length,
          resolved: ticketsData.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
          highPriority: ticketsData.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleUpdateStatus = async (id, status) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDownloadReport = () => {
    if (tickets.length === 0) return;
    
    const headers = ["Incident ID", "Title", "Priority", "Location", "Status", "Created At"];
    const csvRows = [
      headers.join(","),
      ...tickets.map(t => [
        t.id,
        `"${t.title}"`,
        t.priority,
        `"${t.lab || t.room || t.building}"`,
        t.status,
        new Date(t.createdAt).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Technician_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#F5AB24] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tighter mb-1 uppercase">Hub Overview</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Institutional Operations Dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg animate-pulse">
            <Clock className="w-4 h-4" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white">Active Session</span>
        </div>
      </div>

      {/* DASHBOARD WELCOME BANNER - REPLICATED FROM USER IMAGE */}
      <div className="bg-[#142B5D] rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-[#142B5D]/20">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
             <div className="w-24 h-24 rounded-full bg-white p-1 border-4 border-[#F5AB24] shadow-lg overflow-hidden flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="bg-[#142B5D] w-full h-full rounded-full flex items-center justify-center text-white">
                    <User className="w-12 h-12" />
                  </div>
                )}
             </div>
             <div className="absolute -bottom-2 -right-2 bg-[#F5AB24] p-2 rounded-full shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#142B5D]" />
             </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
              Welcome, <span className="text-[#F5AB24]">{user?.name || 'Technician'}</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                Technician Account
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F5AB24] italic opacity-80">
                Verified Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned Tickets" value={stats.assigned} icon={Ticket} color="blue" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="amber" />
        <StatCard title="Resolved Operations" value={stats.resolved} icon={CheckCircle} color="emerald" />
        <StatCard title="Priority Alerts" value={stats.highPriority} icon={AlertCircle} color="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">My Active Assignments</h2>
            <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-widest mt-1">Institutional Technical Support Queue</p>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0D1E40] transition shadow-md"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate Status Report</span>
          </button>
        </div>
        <TicketTable tickets={tickets} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
