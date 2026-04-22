import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Save, ChevronLeft, Map, Clock, Shield, Search, Send, Filter } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTickets = () => {
    api.get('/tickets').then(res => {
      const data = res.data.sort((a,b) => b.id - a.id);
      setTickets(data);
      setFilteredTickets(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTickets(tickets.filter(t => 
        t.id.toString().includes(searchTerm) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredTickets(tickets);
    }
  }, [searchTerm, tickets]);

  const handleUpdateStatus = async (id, status) => {
    await api.put(`/tickets/${id}`, { status });
    fetchTickets();
    if (activeTicket?.id === id) {
      setActiveTicket(prev => ({ ...prev, status }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTicket) return;
    
    const commentObj = {
      id: Date.now(),
      text: newComment,
      author: user.name,
      timestamp: new Date().toISOString()
    };
    
    const updatedComments = [...(activeTicket.comments || []), commentObj];
    await api.put(`/tickets/${activeTicket.id}`, { comments: updatedComments });
    
    setNewComment('');
    setActiveTicket(prev => ({ ...prev, comments: updatedComments }));
    fetchTickets();
  };

  return (
    <div className="flex h-full gap-8">
      {/* List Column (Tickets Map) */}
      <div className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-96 flex-col bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl`}>
        <div className="p-8 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 mb-6">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tickets Map</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search TKT ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-300 transition-all placeholder-slate-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="py-20 text-center text-slate-600 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">Syncing nodes...</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredTickets.map(ticket => (
                <button
                   key={ticket.id}
                   onClick={() => setActiveTicket(ticket)}
                   className={`w-full text-left p-6 hover:bg-slate-800/50 transition-all border-l-4 ${activeTicket?.id === ticket.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-0.5 rounded border border-slate-800">TKT-{ticket.id}</span>
                    <span className={`text-[10px] font-black tracking-widest uppercase ${ticket.priority === 'HIGH' ? 'text-rose-500' : ticket.priority === 'MEDIUM' ? 'text-amber-500' : 'text-primary'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-black text-white text-sm uppercase tracking-tight line-clamp-1 mb-1">{ticket.category}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1 italic">"{ticket.description}"</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Column */}
      {activeTicket ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
          
          <div className="p-10 border-b border-slate-800 bg-slate-950/30 flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">TKT-{activeTicket.id}</h2>
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-slate-950 text-slate-300 border border-slate-800 shadow-sm uppercase">
                    {activeTicket.status}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border shadow-sm ${activeTicket.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                    {activeTicket.priority} PRIORITY
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center">
                 <Shield className="w-3.5 h-3.5 mr-2" />
                 Reported by User #{activeTicket.userId} for Resource #{activeTicket.resourceId}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-2xl p-2">
              <select
                className="bg-transparent text-xs font-black tracking-[0.2em] text-primary uppercase px-4 py-2 outline-none cursor-pointer"
                value={activeTicket.status}
                onChange={(e) => handleUpdateStatus(activeTicket.id, e.target.value)}
              >
                <option value="OPEN">OPEN SITE</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED NODE</option>
              </select>
              <button 
                onClick={() => setActiveTicket(null)}
                className="lg:hidden p-2 text-slate-500 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 flex flex-col lg:flex-row gap-12 custom-scrollbar">
            <div className="flex-1 space-y-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-2" /> Incident Narrative
                </h3>
                <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800/50 shadow-inner">
                   <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{activeTicket.description}"</p>
                </div>
              </div>

              {activeTicket.images && activeTicket.images.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Evidence Matrix</h3>
                  <div className="flex flex-wrap gap-4">
                    {activeTicket.images.map((img, i) => (
                      <div key={i} className="relative group">
                         <img src={img} alt="Evidence" className="w-32 h-32 object-cover rounded-2xl border border-slate-800 shadow-2xl transition-transform group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-96 flex flex-col pt-10 lg:pt-0 lg:border-l border-slate-800 lg:pl-10">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Active Discussion
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar min-h-[300px]">
                {activeTicket.comments?.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                     <p className="text-[10px] font-black tracking-widest uppercase mb-2">No data recorded</p>
                     <p className="text-[9px] font-bold uppercase transition hover:text-primary cursor-pointer">Start Resolution Note</p>
                  </div>
                ) : (
                  activeTicket.comments?.map(comment => (
                    <div key={comment.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-[10px] text-white uppercase tracking-widest">{comment.author}</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto space-y-4">
                <textarea
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all text-slate-400 resize-none h-28 placeholder-slate-700"
                  placeholder="Enter resolution instructions or operational updates..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full py-4 bg-blue-900 dark:bg-white text-white dark:text-blue-900 hover:bg-blue-800 dark:hover:bg-slate-100 text-[10px] font-black tracking-[0.3em] rounded-2xl transition-all disabled:opacity-30 shadow-lg transform hover:-translate-y-0.5 duration-200 flex items-center justify-center uppercase"
                >
                  <Send className="w-3.5 h-3.5 mr-2" /> Commit Entry
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-900 rounded-[3rem] border border-slate-800 border-dashed relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          <div className="text-center relative z-10">
             <Filter className="w-12 h-12 text-slate-800 mx-auto mb-4" />
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Select Node to Access Metadata</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
