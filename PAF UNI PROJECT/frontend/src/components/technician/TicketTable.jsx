import React, { useState, useRef, useEffect } from 'react';
import { Eye, Play, CheckCircle, MoreVertical, FileText, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';

const TicketTable = ({ tickets, onUpdateStatus, onAddNote, onComplete, hideActions = false }) => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const handleQuickView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4">Incident ID</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Intensity</th>
            <th className="px-6 py-4">Zone / Location</th>
            <th className="px-6 py-4">Operational Status</th>
            {!hideActions && <th className="px-6 py-4 text-right">Actions</th>}
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
                {!hideActions && (
                  <td className="px-6 py-5 text-right relative">
                    <div className="flex items-center justify-end space-x-2 transition-opacity">
                      <button 
                        onClick={() => handleQuickView(ticket)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-[#142B5D] hover:text-white transition-all transition-transform active:scale-90"
                        title="Inspect Parameters"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative">
                         <button 
                           onClick={(e) => toggleMenu(e, ticket.id)}
                           className={clsx(
                             "p-2 rounded-lg transition-all transition-transform active:scale-90",
                             activeMenuId === ticket.id ? "bg-[#142B5D] text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                           )}
                         >
                           <MoreVertical className="w-4 h-4" />
                         </button>

                         {activeMenuId === ticket.id && (
                           <div 
                             ref={menuRef}
                             className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                           >
                              <button 
                                onClick={() => handleQuickView(ticket)}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                 <Eye className="w-4 h-4 text-blue-500" />
                                 <span>View Details</span>
                              </button>
                              
                              {(ticket.status === 'Assigned' || ticket.status === 'OPEN') && (
                                <button 
                                  onClick={() => { onUpdateStatus(ticket.id, 'IN_PROGRESS'); setActiveMenuId(null); }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                   <Play className="w-4 h-4 text-amber-500" />
                                   <span>Mark as In Progress</span>
                                </button>
                              )}

                              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                                <button 
                                  onClick={() => { onComplete(ticket); setActiveMenuId(null); }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                   <CheckCircle className="w-4 h-4 text-emerald-500" />
                                   <span>Mark as Complete</span>
                                </button>
                              )}

                              <button 
                                onClick={() => { onAddNote(ticket); setActiveMenuId(null); }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                 <FileText className="w-4 h-4 text-[#F5AB24]" />
                                 <span>Add Note</span>
                              </button>
                           </div>
                         )}
                      </div>
                    </div>
                  </td>
                )}
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
