import React, { useState, useRef, useEffect } from 'react';
import { Eye, Play, CheckCircle, MoreVertical, FileText, Calendar, MapPin, User, Tag, Clock } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';
import { format } from 'date-fns';

const TicketTable = ({ tickets = [], onUpdateStatus, onAddNote, onComplete, onClaim, pageType = 'active', isLoading }) => {
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

  const showActions = pageType !== 'resolved' && pageType !== 'closed';

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Status & Priority</th>
            <th className="px-6 py-4">Submitted By</th>
            <th className="px-6 py-4">Submission Details</th>
            <th className="px-6 py-4">Location & Category</th>
            <th className="px-6 py-4">Last Updated</th>
            {showActions && <th className="px-6 py-4 text-right">Actions</th>}
            {!showActions && <th className="px-6 py-4 text-right">Progress</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">
                 {Array(8).fill(0).map((_, j) => (
                   <td key={j} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                   </td>
                 ))}
              </tr>
            ))
          ) : tickets.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest italic">
                Zero tickets found in this query
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-5">
                   <span className="font-black text-[#142B5D] dark:text-[#F5AB24] text-xs"># {ticket.id?.length > 6 ? ticket.id.substring(ticket.id.length - 6).toUpperCase() : ticket.id?.toUpperCase()}</span>
                </td>
                <td className="px-6 py-5 max-w-xs">
                  <div className="flex flex-col">
                    <p className="text-xs text-[#142B5D] dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>
                      <button 
                        onClick={() => navigate(`/technician/tickets/details/${ticket.id}`)}
                        className="mt-2 text-[10px] font-black text-[#F5AB24] hover:underline uppercase text-left w-fit"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1.5">
                      <StatusBadge status={ticket.status} />
                      <StatusBadge status={ticket.priority} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center space-x-2">
                       <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#142B5D] dark:text-[#F5AB24]">
                          <User className="w-3.5 h-3.5" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{ticket.userDetails?.name || 'Anonymous'}</p>
                         <p className="text-[10px] text-slate-400">{ticket.userDetails?.email || 'N/A'}</p>
                       </div>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(ticket.createdAt), 'yyyy-MM-dd')}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[10px] font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(ticket.createdAt), 'HH:mm:ss')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {ticket.room || ticket.location || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Tag className="w-3 h-3 text-[#F5AB24]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-slate-400">
                          {ticket.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <p className="text-[10px] font-bold text-slate-400">
                       {format(new Date(ticket.updatedAt), 'MMM dd, HH:mm')}
                     </p>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    {showActions ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/technician/tickets/details/${ticket.id}`)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-[#142B5D] hover:text-white transition-all active:scale-90"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative">
                           <button 
                             onClick={(e) => toggleMenu(e, ticket.id)}
                             className={clsx(
                               "p-2 rounded-lg transition-all active:scale-90",
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
                                  onClick={() => navigate(`/technician/tickets/details/${ticket.id}`)}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                 <Eye className="w-4 h-4 text-blue-500" />
                                 <span>View Details</span>
                              </button>
                              
                              {pageType !== 'resolved' && pageType !== 'closed' && (ticket.status === 'OPEN' || ticket.status === 'Assigned') && (
                                <button 
                                  onClick={() => { onUpdateStatus(ticket.id, 'IN_PROGRESS'); setActiveMenuId(null); }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                   <Play className="w-4 h-4 text-amber-500" />
                                   <span>Mark as In Progress</span>
                                </button>
                              )}

                              {!ticket.technicianId && pageType === 'priority' && (
                                <button 
                                  onClick={() => { onClaim(ticket.id); setActiveMenuId(null); }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-blue-50/50 dark:bg-blue-900/10"
                                >
                                   <CheckCircle className="w-4 h-4 text-blue-600" />
                                   <span className="text-blue-600">Claim Task</span>
                                </button>
                              )}

                              {pageType !== 'resolved' && pageType !== 'closed' && (
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
                  ) : (
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {pageType === 'resolved' ? 'Completed' : 'Closed'}
                    </span>
                  )}
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
