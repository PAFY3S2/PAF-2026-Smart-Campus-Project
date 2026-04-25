import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Save, Ticket, AlertCircle, Clock, CheckCircle, User, Shield, ArrowLeft, Image as ImageIcon, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/shared/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

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
      setTickets(ticketsRes.data.sort((a,b) => b.id - a.id));
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
    <div className="min-h-screen text-slate-200 flex flex-col font-sans relative overflow-hidden -m-8 p-8">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col h-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PageHeader 
            title="Tickets Control Room" 
            subtitle="System-wide incident monitoring and assignment" 
          />
        </motion.div>
        
        <div className="flex flex-1 min-h-0 gap-6">
          {/* List Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-1/3 flex-col glass-dark rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl transition-all duration-500`}
          >
            <div className="p-6 border-b border-slate-700/50 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Ticket className="text-blue-400 w-4 h-4" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Tickets Map</h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400">
                {tickets.length} ACTIVE
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scanning Network...</span>
                 </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {tickets.map((ticket, i) => (
                      <motion.button
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden border ${
                          activeTicket?.id === ticket.id 
                            ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                            : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-slate-700/50'
                        }`}
                      >
                        {activeTicket?.id === ticket.id && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-0 w-1 h-full bg-blue-500"
                          />
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">PROTOCOL-TX{ticket.id}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              ticket.priority === 'HIGH' || ticket.priority === 'URGENT' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm uppercase tracking-tight mb-1">{ticket.category} Failure</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic group-hover:text-slate-400 transition-colors">{ticket.description}</p>
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 glass-dark rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl flex flex-col relative"
              >
                {/* Glow Header Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 opacity-30"></div>

                <div className="p-8 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                       <AlertCircle className={`w-7 h-7 ${activeTicket.priority === 'HIGH' ? 'text-rose-500' : 'text-blue-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Incident TX-{activeTicket.id}</h2>
                        <div className="flex gap-2">
                           <span className="px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                             {activeTicket.status}
                           </span>
                           <span className="px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
                             {activeTicket.priority}
                           </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                        <User size={10} className="text-slate-400" /> Origin: Unit-{activeTicket.userId} 
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span> 
                        Resource: R-{activeTicket.resourceId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 shadow-inner">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assign:</span>
                        <select
                          className="text-xs font-bold bg-transparent outline-none text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                          value={activeTicket.technicianId || ''}
                          onChange={(e) => handleAssignTechnician(activeTicket.id, e.target.value)}
                        >
                          <option value="" className="bg-slate-900 text-slate-400">Unassigned</option>
                          {technicians.map(tech => (
                            <option key={tech.id} value={tech.id} className="bg-slate-900 text-white">{tech.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="relative group">
                       <select
                         className="text-[10px] font-black bg-slate-900 border-2 border-slate-700 rounded-2xl px-5 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white uppercase tracking-widest cursor-pointer appearance-none hover:bg-slate-800 transition-all shadow-lg"
                         value={activeTicket.status}
                         onChange={(e) => handleUpdateStatus(activeTicket.id, e.target.value)}
                       >
                         <option value="OPEN">Open</option>
                         <option value="IN_PROGRESS">In Progress</option>
                         <option value="RESOLVED">Resolved</option>
                         <option value="CLOSED">Closed</option>
                       </select>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTicket(null)}
                      className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl text-slate-400"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:row gap-10 custom-scrollbar">
                  <div className="flex-1 space-y-10">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <AlertCircle size={12} className="text-blue-400" /> System Report
                      </h3>
                      <div className="bg-slate-800/30 p-8 rounded-[2rem] border border-slate-700/50 relative group">
                        <div className="absolute top-4 right-4 text-slate-700 group-hover:text-slate-600 transition-colors">
                           <Shield size={32} />
                        </div>
                        <p className="text-slate-300 font-medium text-base leading-relaxed relative z-10">{activeTicket.description}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <ImageIcon size={12} className="text-purple-400" /> Evidence Logs
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {activeTicket.images && activeTicket.images.length > 0 ? (
                          activeTicket.images.map((img, i) => (
                            <motion.div 
                              whileHover={{ scale: 1.05, rotate: 2 }}
                              key={i} 
                              className="w-32 h-32 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-800 cursor-zoom-in"
                            >
                              <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                            </motion.div>
                          ))
                        ) : (
                          <div className="w-full py-10 rounded-[2rem] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-3 bg-slate-900/20">
                             <ImageIcon className="text-slate-700 w-8 h-8" />
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">No visual evidence attached</span>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="w-full lg:w-[22rem] flex flex-col gap-6">
                    <div className="flex flex-col flex-1 glass-dark rounded-[2rem] border border-slate-700/50 p-6 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
                       
                       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <MessageSquare size={14} className="text-emerald-400" /> Protocol Discussion
                      </h3>
                      
                      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar min-h-[300px]">
                        {activeTicket.comments?.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full gap-4 py-20 opacity-30">
                             <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center">
                                <Clock size={20} className="text-slate-400" />
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-center">Awaiting command entry</p>
                          </div>
                        ) : (
                          activeTicket.comments?.map((comment, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={idx} 
                              className={`p-4 rounded-2xl border ${
                                comment.author === user.email ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/50 border-slate-700/50'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-[9px] text-blue-400 uppercase tracking-widest">{comment.author === user.email ? 'YOU (ADMIN)' : comment.author}</span>
                                <span className="text-[8px] font-bold text-slate-600">{comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NEW'}</span>
                              </div>
                              <p className="text-xs font-medium text-slate-300 leading-relaxed">{comment.text}</p>
                            </motion.div>
                          ))
                        )}
                      </div>

                      <div className="mt-auto space-y-3">
                        <div className="relative group">
                          <textarea
                            className="w-full border-2 border-slate-700 bg-slate-900 rounded-[1.5rem] p-5 text-xs font-medium text-white focus:ring-2 focus:ring-blue-500/50 outline-none resize-none placeholder:text-slate-600 transition-all group-focus-within:border-blue-500/30"
                            rows="4"
                            placeholder="Enter resolution notes..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          ></textarea>
                          <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                             <span className="text-[8px] font-bold text-slate-500">SHIFT + ENTER</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex justify-center items-center shadow-xl shadow-blue-900/30 group"
                        >
                          <Send className="w-4 h-4 mr-3 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" /> Commit Entry
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex flex-1 items-center justify-center glass-dark rounded-[3rem] border border-slate-700/50 border-dashed relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                <div className="text-center relative z-10 px-20">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-24 h-24 bg-slate-800 border-2 border-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
                    >
                      <Ticket className="w-10 h-10 text-slate-500" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                         <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-4">Awaiting Signal</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] leading-relaxed max-w-sm mx-auto">Select an active incident report from the network log to initialize administration protocol and response sequences.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 114, 143, 0.6);
        }
      `}} />
    </div>
  );
};

export default AdminTickets;
