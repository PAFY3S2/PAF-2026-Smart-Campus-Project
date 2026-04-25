import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Inbox } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

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
      case 'OPEN': return 'bg-sky-100 text-sky-700';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700';
      case 'CLOSED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600';
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Tickets</h1>

      {loading ? (
        <Loader message="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState 
          icon={Inbox}
          title="No Tickets Found"
          message="You have not submitted any incident tickets yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  TKT-{ticket.id}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{ticket.category} Issue</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{ticket.description}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span className={`text-xs font-medium px-2 py-1 rounded border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} PRIORITY
                </span>
                
                <div className="flex items-center text-slate-400 text-sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {ticket.comments?.length || 0}
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
