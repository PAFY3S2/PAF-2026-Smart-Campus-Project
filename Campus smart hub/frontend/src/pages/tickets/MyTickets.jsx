import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Ticket, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/me').then(res => {
      setTickets(res.data.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'IN_PROGRESS': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'CLOSED': return 'bg-slate-800 text-slate-500 border-slate-700/50';
      default: return 'bg-slate-800 text-slate-500 border-slate-700/50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500';
    }
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-16"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">USER TELEMETRY</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">My Tickets</h1>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-slate-600 font-bold tracking-[0.4em] animate-pulse uppercase relative z-10">ACCESSING INCIDENT LOGS...</div>
      ) : tickets.length === 0 ? (
        <div className="py-20 px-8 text-center bg-slate-900 border border-slate-800 rounded-[2.5rem] border-dashed relative z-10 mt-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <Ticket className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">No active incident reports</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10 mt-6">
          {tickets.map((ticket, i) => (
            <motion.div 
              key={ticket._id || ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />
              
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  TKT-{(ticket._id || ticket.id || '').toString().slice(-6)}
                </span>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border shadow-sm ${getStatusStyles(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="mb-8 flex-1">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight line-clamp-1">{ticket.category} Issue</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium italic">"{ticket.description}"</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-800/50">
                <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} PRIORITY
                </span>
                
                <div className="flex items-center text-slate-600 text-[10px] font-black tracking-widest">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {ticket.comments?.length || 0} COMMENTS
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
