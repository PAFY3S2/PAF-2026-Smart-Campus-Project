import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Save, Ticket, AlertCircle, Clock, CheckCircle, User, Shield, ArrowLeft, Image as ImageIcon, Send, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/shared/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../utils/imageUtils';

const AdminTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');

  const fetchData = async () => {
    try {
      const [ticketsRes, techsRes] = await Promise.all([
        api.get('/tickets'),
        api.get('/admin/users/technicians')
      ]);
      setTickets(ticketsRes.data.sort((a,b) => {
        if (typeof a.id === 'number') return b.id - a.id;
        return b.id.toString().localeCompare(a.id.toString());
      }));
      setTechnicians(techsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await api.patch(`/tickets/${id}/status`, { status });
    fetchData();
    if (activeTicket?.id === id) {
      setActiveTicket(prev => ({ ...prev, status }));
    }
  };

  const handleAssignTechnician = async (ticketId, techId) => {
    await api.patch(`/tickets/${ticketId}/assign`, { technicianId: techId });
    fetchData();
    if (activeTicket?.id === ticketId) {
      const assignedTech = technicians.find(t => t.id === techId);
      setActiveTicket(prev => ({ ...prev, technicianId: techId, technician: assignedTech }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTicket) return;
    
    await api.post(`/tickets/${activeTicket.id}/messages`, {
      content: newComment,
      senderType: 'admin'
    });
    
    setNewComment('');
    const res = await api.get(`/tickets/${activeTicket.id}`);
    setActiveTicket(res.data);
  };

  return (
    <div className="h-[calc(100vh-120px)] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col h-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <PageHeader 
            title="Tickets Control Room" 
            subtitle="System-wide incident monitoring and assignment" 
          />
        </motion.div>
        
        <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
          {/* List Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-[350px] flex-col glass-dark rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl transition-all duration-500`}
          >
            <div className="p-5 border-b border-slate-700/50 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Ticket className="text-blue-400 w-4 h-4" />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Tickets Map</h2>
              </div>
              <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {tickets.length} Active
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Syncing Feed...</span>
                 </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {tickets.map((ticket, i) => (
                      <motion.button
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden border ${
                          activeTicket?.id === ticket.id 
                            ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                            : 'bg-white/[0.02] border-slate-700/30 hover:bg-white/[0.05] hover:border-slate-600/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">TX-{ticket.id.toString().slice(-6)}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            ticket.priority === 'HIGH' || ticket.priority === 'URGENT' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors text-xs uppercase tracking-tight mb-1">{ticket.category} Failure</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 italic group-hover:text-slate-400 transition-colors">{ticket.description}</p>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details Column */}
          <AnimatePresence mode="wait">
            {activeTicket ? (
              <motion.div 
                key="detail-view"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="flex-1 glass-dark rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl flex flex-col relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 opacity-40"></div>

                <div className="p-8 border-b border-slate-700/50 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                       <AlertCircle className={`w-8 h-8 relative z-10 ${activeTicket.priority === 'HIGH' ? 'text-rose-500' : 'text-blue-400'}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-black text-white tracking-tight uppercase leading-none">Incident Report</h2>
                          <div className="flex gap-2">
                             <span className="px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                               {activeTicket.status}
                             </span>
                             <span className="px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30">
                               {activeTicket.priority}
                             </span>
                          </div>
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] font-mono">TX-{activeTicket.id}</h3>
                      </div>
                      <div className="flex items-center gap-6 pt-1">
                        <div className="flex items-center gap-2">
                           <User size={12} className="text-blue-500/50" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin: {activeTicket.userId?.toString()?.slice(-12) || 'UNKNOWN'}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        <div className="flex items-center gap-2">
                           <Database size={12} className="text-purple-500/50" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource: {activeTicket.resourceId?.toString()?.slice(-12) || 'UNKNOWN'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-700/50 shadow-inner group transition-all hover:border-slate-600">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors whitespace-nowrap">Assign To:</span>
                        <select
                          className="text-[10px] font-black bg-transparent outline-none text-blue-400 cursor-pointer hover:text-blue-300 transition-colors uppercase tracking-widest min-w-[100px]"
                          value={activeTicket.technicianId || ''}
                          onChange={(e) => handleAssignTechnician(activeTicket.id, e.target.value)}
                        >
                          <option value="" className="bg-slate-900 text-slate-500 italic">Unassigned</option>
                          {technicians.map(tech => (
                            <option key={tech.id} value={tech.id} className="bg-slate-900 text-white font-bold">{tech.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="h-10 w-[2px] bg-slate-800 hidden md:block mx-1"></div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTicket(null)}
                      className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-2xl text-slate-400"
                    >
                      <ArrowLeft size={20} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 lg:p-10 flex flex-col lg:flex-row gap-10 custom-scrollbar">
                  <div className="flex-1 space-y-12">
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Report</h3>
                      </div>
                      <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-700/30 relative group overflow-hidden">
                        <div className="absolute -top-4 -right-4 text-white/[0.02] transition-colors group-hover:text-white/[0.04]">
                           <Shield size={120} />
                        </div>
                        <p className="text-slate-300 font-medium text-base leading-[1.8] relative z-10">{activeTicket.description}</p>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Evidence Logs</h3>
                      </div>
                      <div className="flex flex-wrap gap-5">
                        {activeTicket.images && activeTicket.images.length > 0 ? (
                          activeTicket.images.map((img, i) => (
                            <motion.div 
                              whileHover={{ scale: 1.05, rotate: 1, zIndex: 50 }}
                              key={i} 
                              className="w-36 h-36 rounded-2xl border-2 border-slate-700/50 overflow-hidden shadow-2xl bg-slate-900 cursor-zoom-in relative group"
                            >
                              <img src={getImageUrl(img)} alt="Evidence" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="w-full py-12 rounded-[2rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 bg-slate-900/20 group">
                             <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 group-hover:border-slate-600 transition-all">
                                <ImageIcon className="text-slate-700 w-7 h-7 group-hover:text-slate-500 transition-colors" />
                             </div>
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">No visual evidence logged</span>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Discussion Panel */}
                  <div className="w-full lg:w-[24rem] flex flex-col bg-slate-900/60 rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-xl flex-shrink-0">
                     <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-950/40">
                        <div className="flex items-center gap-3">
                           <MessageSquare size={16} className="text-emerald-400" />
                           <h3 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Response Log</h3>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                     </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-[300px]">
                        {activeTicket.comments?.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full gap-5 opacity-40">
                             <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center bg-slate-800/20">
                                <Clock size={24} className="text-slate-500" />
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center max-w-[150px] leading-loose">Initialization required. Enter primary resolution data below.</p>
                          </div>
                        ) : (
                          activeTicket.comments?.map((comment, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={idx} 
                              className={`p-4 rounded-2xl border ${
                                comment.author === user.email ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-700/50'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/[0.03]">
                                <span className={`font-black text-[8px] uppercase tracking-widest ${comment.author === user.email ? 'text-blue-400' : 'text-slate-400'}`}>
                                  {comment.author === user.email ? 'Command Center' : comment.author.split('@')[0]}
                                </span>
                                <span className="text-[8px] font-bold text-slate-600">{comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'LIVE'}</span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-300 leading-relaxed">{comment.text}</p>
                            </motion.div>
                          ))
                        )}
                      </div>

                      <div className="p-6 bg-slate-950/40 border-t border-slate-700/50 space-y-4">
                        <div className="relative group">
                          <textarea
                            className="w-full border-2 border-slate-800 bg-slate-900/80 rounded-2xl p-4 text-[11px] font-medium text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none placeholder:text-slate-700 transition-all group-focus-within:border-slate-700 group-focus-within:bg-slate-900"
                            rows="4"
                            placeholder="Type resolution entry..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          ></textarea>
                          <div className="absolute bottom-3 right-4 flex items-center gap-2 opacity-20 group-focus-within:opacity-60 transition-opacity">
                             <kbd className="text-[8px] font-black bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ENTER</kbd>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.25em] py-4 rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex justify-center items-center shadow-xl shadow-blue-900/20 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <Send className="w-3.5 h-3.5 mr-3 text-blue-200 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                          Commit Resolution
                        </motion.button>
                      </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex flex-1 items-center justify-center glass-dark rounded-[3rem] border border-slate-700/50 border-dashed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
                <div className="text-center relative z-10 px-20">
                    <motion.div 
                      animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-28 h-28 bg-slate-900 border-2 border-slate-700/50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-blue-500/5"></div>
                      <Ticket className="w-12 h-12 text-slate-700" />
                      <div className="absolute top-0 right-0 p-3">
                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">Signal Awaiting</h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] leading-[2] max-w-sm mx-auto">Select a prioritized incident from the map to initialize response sequence and authentication protocols.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 114, 143, 0.5);
        }
      `}} />
    </div>
  );
};

export default AdminTickets;
