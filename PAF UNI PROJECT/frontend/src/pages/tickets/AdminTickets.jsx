import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/shared/PageHeader';

const AdminTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const [ticketsRes, techsRes] = await Promise.all([
      api.get('/tickets'),
      api.get('/auth/technicians')
    ]);

    setTickets(ticketsRes.data.sort((a, b) => b.id - a.id));
    setTechnicians(techsRes.data);

  } catch (err) {
    console.error(err);
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await api.patch(`/tickets/${id}`, { status });
    fetchData();
    if (activeTicket?.id === id) {
      setActiveTicket(prev => ({ ...prev, status }));
    }
  };

  const handleAssignTechnician = async (ticketId, techId) => {
    await api.patch(`/tickets/${ticketId}`, { technicianId: techId });
    fetchData();
    if (activeTicket?.id === ticketId) {
      const assignedTech = technicians.find(t => t.id === techId);
      setActiveTicket(prev => ({ ...prev, technicianId: techId, technician: assignedTech }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTicket) return;
    
    // Updated to match backend comments structure
    await api.post(`/tickets/${activeTicket.id}/comments`, {
      text: newComment,
      author: user.name
    });
    
    setNewComment('');
    // Refresh to get new comment with author and timestamp from backend if possible
    // or just optimistic update
    fetchData();
    // Re-set active ticket to show new comment
    const res = await api.get('/tickets');
    const updatedTicket = res.data.find(t => t.id === activeTicket.id);
    setActiveTicket(updatedTicket);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <PageHeader title="Tickets Control Room" subtitle="System-wide incident monitoring and assignment" />
      
      <div className="flex flex-1 min-h-0 gap-6">
      {/* List Column */}
      <div className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-1/3 flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Tickets Map</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
        {error ? (
          //  Show error FIRST if exists
          <div className="p-4 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : loading ? (
          //  Then loading
          <div className="p-4 text-center text-slate-500 text-sm">
            Loading...
          </div>
  ) : (
    //  Then actual ticket list
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {tickets.map(ticket => (
        <button
          key={ticket.id}
          onClick={() => setActiveTicket(ticket)}
          className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-l-4 ${
            activeTicket?.id === ticket.id
              ? 'border-[#F5AB24] bg-indigo-50/30 dark:bg-[#F5AB24]/5'
              : 'border-transparent'
          }`}
        >
          {/* your existing ticket UI */}
        </button>
      ))}
    </div>
  )}
</div>
      </div>

      {/* Details Column */}
      {activeTicket ? (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/30 dark:bg-slate-800/20">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-black text-[#142B5D] dark:text-white tracking-tighter">TKT-{activeTicket.id}</h2>
                <span className="px-2.5 py-1 rounded font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {activeTicket.status}
                </span>
                <span className="px-2.5 py-1 rounded font-black text-[10px] uppercase tracking-widest bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                  {activeTicket.priority} PRIORITY
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Reported by User #{activeTicket.userId} for Resource #{activeTicket.resourceId}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {user.role === 'ADMIN' && (
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign:</span>
                  <select
                    className="text-xs font-bold bg-transparent outline-none text-[#142B5D] dark:text-[#F5AB24]"
                    value={activeTicket.technicianId || ''}
                    onChange={(e) => handleAssignTechnician(activeTicket.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <select
                className="text-xs font-black border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-[#142B5D] dark:text-white uppercase tracking-widest"
                value={activeTicket.status}
                onChange={(e) => handleUpdateStatus(activeTicket.id, e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <button 
                onClick={() => setActiveTicket(null)}
                className="lg:hidden text-slate-400 hover:text-slate-600 px-3 py-1.5 border border-slate-200 rounded-lg"
              >
                Back
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Incident Description</h3>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 font-medium text-sm leading-relaxed">{activeTicket.description}</p>
              </div>

              {activeTicket.images && activeTicket.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Attachments</h3>
                  <div className="flex gap-4">
                    {activeTicket.images.map((img, i) => (
                      <img key={i} src={img} alt="Attachment" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-6">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#F5AB24]" /> Official Discussion
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {activeTicket.comments?.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic text-center py-8">No formal entries yet</p>
                ) : (
                  activeTicket.comments?.map(comment => (
                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-[10px] text-[#142B5D] dark:text-[#F5AB24] uppercase tracking-widest">{comment.author}</span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto">
                <textarea
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#F5AB24] outline-none resize-none mb-3 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  rows="3"
                  placeholder="Record formal resolution note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-[#142B5D] dark:bg-[#142B5D] hover:bg-[#0D1E40] text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 px-4 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-blue-900/20"
                >
                  <Save className="w-4 h-4 mr-3 text-[#F5AB24]" /> Send Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed text-slate-400 p-12 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#142B5D] opacity-[0.02] dark:opacity-[0.1] -translate-y-32 translate-x-32 rotate-45"></div>
          <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Ticket className="w-10 h-10 text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-sm font-black text-[#142B5D] dark:text-white uppercase tracking-[0.2em] opacity-30">Selection Required</h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">Select an incident from the log to begin administration</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminTickets;
