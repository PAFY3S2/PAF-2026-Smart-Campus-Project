import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/shared/PageHeader';


const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets').then(res => {
      setTickets(res.data.sort((a,b) => b.id - a.id));
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'CLOSED': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:border-rose-800';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800';
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-800';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Tickets" 
        subtitle="Monitoring your active support requests" 
        showBanner={true} 
      />

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading Institutional Assets...</div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
          <p className="text-xs font-black uppercase tracking-widest opacity-30">No active tickets identified in your profile</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  TKT-{ticket.id}
                </span>
                <span className={`px-2.5 py-1 rounded font-black text-[9px] uppercase tracking-widest ${getStatusBadge(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-base font-black text-[#142B5D] dark:text-white uppercase tracking-tight line-clamp-1">{ticket.category} Issue</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">{ticket.description}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                
                <div className="flex items-center text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase">
                  <MessageSquare className="w-4 h-4 mr-1.5 opacity-40 text-[#F5AB24]" />
                  {ticket.comments?.length || 0} Responses
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
