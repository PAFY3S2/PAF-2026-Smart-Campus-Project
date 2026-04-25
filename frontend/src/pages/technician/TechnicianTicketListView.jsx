import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets, useUpdateTicketStatus, useClaimTicket } from '../../hooks/useTickets';
import TicketTable from '../../components/technician/TicketTable';

const TechnicianTicketListView = ({ title, subtitle, pageType = 'active' }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tickets = [], isLoading, refetch } = useTickets(pageType);
  const updateStatus = useUpdateTicketStatus();
  const claimTicket = useClaimTicket();

  const handleUpdateStatus = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  const handleClaim = (id) => {
    claimTicket.mutate({ id, technicianId: user.id });
  };

  const filteredTickets = tickets.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id?.toString().includes(searchTerm) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tighter mb-1 uppercase">{title}</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Institutional Operations Dashboard</p>
        </div>
        
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Filter results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#F5AB24] transition-all w-64"
              />
           </div>
           <button 
             onClick={() => refetch()}
             className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-[#F5AB24] transition-colors"
           >
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Operation Logs...</div>
        ) : (
          <TicketTable 
            tickets={filteredTickets} 
            onUpdateStatus={handleUpdateStatus} 
            onClaim={handleClaim}
            pageType={pageType}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianTicketListView;
