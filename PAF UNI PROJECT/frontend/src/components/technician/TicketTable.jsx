import React, { useState } from 'react';
import { Eye, Play, CheckCircle, MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';

const TicketTable = ({ tickets, onUpdateStatus }) => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4">Incident ID</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Intensity</th>
            <th className="px-6 py-4">Zone / Location</th>
            <th className="px-6 py-4">Operational Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                Zero active assignments found
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-5">
                   <span className="font-black text-[#142B5D] dark:text-[#F5AB24] text-xs"># {ticket.id}</span>
                </td>
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-[#142B5D] dark:text-slate-200 group-hover:text-[#F5AB24] transition-colors">{ticket.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ticket.building || 'Campus Facility'}</p>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={ticket.priority} />
                </td>
                <td className="px-6 py-5">
                   <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                     {ticket.lab || ticket.room || ticket.building}
                   </p>
                </td>
                <td className="px-6 py-5">
                   <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2 transition-opacity">
                    <button 
                      onClick={() => handleQuickView(ticket)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-[#142B5D] hover:text-white transition-all transition-transform active:scale-90"
                      title="Inspect Parameters"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={() => onUpdateStatus(ticket.id, 'IN_PROGRESS')}
                        className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all transform active:scale-90"
                        title="Initialize Operation"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {(ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED') && (
                       <button 
                         onClick={() => onUpdateStatus(ticket.id, ticket.status === 'IN_PROGRESS' ? 'RESOLVED' : 'CLOSED')}
                         className={clsx(
                           "p-2 rounded-lg transition-all transform active:scale-90",
                           ticket.status === 'IN_PROGRESS' 
                             ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                             : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-500 hover:text-white"
                         )}
                         title={ticket.status === 'IN_PROGRESS' ? "Confirm Resolution" : "Archive Archive Log"}
                       >
                         <CheckCircle className="w-4 h-4" />
                       </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-[#142B5D] dark:hover:text-[#F5AB24] transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* QUICK VIEW POPUP */}
      <QuickViewModal 
        ticket={selectedTicket} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default TicketTable;
