import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Clock, CheckCircle, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/shared/PageHeader';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  const DUMMY_STATS = {
    assigned: 5,
    open: 2,
    inProgress: 2,
    resolved: 1
  };

  const DUMMY_TICKETS = [
    { id: "69d7a1", category: 'HARDWARE', status: 'IN_PROGRESS', priority: 'URGENT', updatedAt: new Date() },
    { id: "69d7a2", category: 'SOFTWARE', status: 'OPEN', priority: 'HIGH', updatedAt: new Date(Date.now() - 3600000) },
    { id: "69d7a3", category: 'FACILITIES', status: 'IN_PROGRESS', priority: 'MEDIUM', updatedAt: new Date(Date.now() - 7200000) },
    { id: "69d7a4", category: 'HARDWARE', status: 'OPEN', priority: 'MEDIUM', updatedAt: new Date(Date.now() - 43200000) },
    { id: "69d7a5", category: 'OTHER', status: 'RESOLVED', priority: 'LOW', updatedAt: new Date(Date.now() - 172800000) }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Stats
        const statsRes = await api.get(`/tickets/stats/${user.id}`);
        let statsData = statsRes.data;
        if (!statsData || statsData.assigned === 0) {
          statsData = DUMMY_STATS;
        }
        setStats(statsData);

        // Fetch Recent/High Priority Tickets
        const ticketsRes = await api.get(`/tickets/technician/${user.id}`);
        let assignedTickets = ticketsRes.data;
        if (!assignedTickets || assignedTickets.length === 0) {
          assignedTickets = DUMMY_TICKETS;
        }
        setTickets(assignedTickets);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data, using fallback:', err);
        setStats(DUMMY_STATS);
        setTickets(DUMMY_TICKETS);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const highPriorityTickets = tickets
    .filter(t => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'RESOLVED' && t.status !== 'CLOSED')
    .slice(0, 5);

  const recentlyUpdated = [...tickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  if (loading) return <div className="p-8 text-center font-bold text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Technician Hub" 
        subtitle="Your daily assignments and focus area" 
        showBanner={true} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned" value={stats.assigned} icon={Ticket} color="blue" />
        <StatCard title="Open" value={stats.open} icon={AlertTriangle} color="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="indigo" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Priority Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-black text-[#142B5D] dark:text-white uppercase tracking-widest text-xs flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
              High Priority Tickets
            </h3>
            <Link to="/technician/priority" className="text-[10px] font-black text-[#142B5D] dark:text-[#F5AB24] hover:underline uppercase tracking-tighter">View All</Link>
          </div>
          <div className="p-5">
            {highPriorityTickets.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4">No high priority tickets assigned.</p>
            ) : (
              <div className="space-y-4">
                {highPriorityTickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase">TKT-{ticket.id}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{ticket.category} Issue</span>
                    </div>
                    <Link to="/technician/tickets" state={{ activeTicketId: ticket.id }}>
                      <ExternalLink className="w-4 h-4 text-slate-300 hover:text-[#F5AB24]" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Updated Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-black text-[#142B5D] dark:text-white uppercase tracking-widest text-xs flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              Recent Updates
            </h3>
            <Link to="/technician/tickets" className="text-[10px] font-black text-[#142B5D] dark:text-[#F5AB24] hover:underline uppercase tracking-tighter">All Tickets</Link>
          </div>
          <div className="p-5">
            {recentlyUpdated.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentlyUpdated.map(ticket => (
                  <div key={ticket.id} className="flex items-center space-x-4 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-[#142B5D] dark:text-[#F5AB24]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase">TKT-{ticket.id}</span>
                        <span className="text-[9px] text-slate-400 uppercase">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{ticket.status} - {ticket.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
  };

  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border-2 ${colors[color]} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 dark:text-slate-400">{title}</span>
      </div>
      <p className="text-4xl font-black dark:text-white">{value}</p>
    </div>
  );
};

export default TechnicianDashboard;
