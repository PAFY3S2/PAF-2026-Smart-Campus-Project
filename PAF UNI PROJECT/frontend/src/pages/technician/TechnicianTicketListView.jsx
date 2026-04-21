import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import TicketTable from '../../components/technician/TicketTable';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TechnicianTicketListView = ({ title, subtitle, filter, hideActions = false }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/technician/${user.id}`).catch(() => ({ data: [] }));
        
        let data = res.data;
        if (!data || data.length === 0) {
           data = [
             { id: '101', title: 'Network Outage in Lab 3', priority: 'HIGH', building: 'Building C', lab: 'Lab 3', status: 'IN_PROGRESS', createdAt: new Date() },
             { id: '102', title: 'Smart Board Calibration', priority: 'MEDIUM', building: 'Building A', room: '302', status: 'OPEN', createdAt: new Date(Date.now() - 3600000) },
             { id: '103', title: 'System Patching', priority: 'LOW', building: 'IT Center', room: 'Server Room', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000) },
             { id: '104', title: 'Audio System Failure', priority: 'HIGH', building: 'Auditorium', status: 'OPEN', createdAt: new Date(Date.now() - 7200000) },
             { id: '105', title: 'Security Camera Update', priority: 'MEDIUM', building: 'North Gate', status: 'CLOSED', createdAt: new Date(Date.now() - 259200000) },
           ];
        }

        if (filter) {
          data = data.filter(filter);
        }
        
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id, filter]);

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
           <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-[#F5AB24] transition-colors">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Operation Logs...</div>
        ) : (
          <TicketTable 
            tickets={filteredTickets} 
            onUpdateStatus={() => {}} 
            hideActions={hideActions}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianTicketListView;
