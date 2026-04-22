import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, ChevronLeft, Map, Clock, Shield, Search, Send,
  Filter, CheckCircle, XCircle, AlertTriangle, User, FileText
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchTickets = () => {
    setLoading(true);
    api.get('/tickets')
      .then(res => {
        const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load tickets');
        setLoading(false);
      });
  };

  useEffect(() => { fetchTickets(); }, []);

  // Filter + search
  useEffect(() => {
    let result = tickets;
    if (filterStatus !== 'ALL') {
      result = result.filter(t => t.status === filterStatus);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t =>
        (t._id || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.userId?.name || '').toLowerCase().includes(q)
      );
    }
    setFilteredTickets(result);
  }, [searchTerm, filterStatus, tickets]);

  // Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length,
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchTickets();
      if (activeTicket && (activeTicket._id === ticketId)) {
        setActiveTicket(prev => ({ ...prev, status }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTicket) return;
    const ticketId = activeTicket._id || activeTicket.id;
    try {
      const res = await api.put(`/tickets/${ticketId}`, {
        comment: {
          text: newComment,
          author: user?.name || 'Admin',
        }
      });
      setNewComment('');
      setActiveTicket(res.data);
      toast.success('Comment added');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const selectTicket = (ticket) => {
    setActiveTicket(ticket);
  };

  const priorityColor = (p) => {
    if (p === 'HIGH') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (p === 'MEDIUM') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const statusColor = (s) => {
    if (s === 'OPEN') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (s === 'IN_PROGRESS') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (s === 'RESOLVED') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block">MODULE C: INCIDENT MANAGEMENT</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Response Hub</h1>
        <p className="text-slate-500 text-sm mt-1">Review and respond to student incident reports and maintenance tickets.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', val: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Open', val: stats.open, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'In Progress', val: stats.inProgress, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Resolved', val: stats.resolved, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center justify-between`}
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
            <s.icon className={`w-8 h-8 ${s.color} opacity-40`} />
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ticket, user, category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-slate-300 w-72 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
                filterStatus === s ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex h-[calc(100vh-420px)] min-h-[500px] gap-6">
        {/* Left: Ticket list */}
        <div className={`${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-[380px] flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl`}>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-500 font-bold tracking-widest text-[10px] animate-pulse uppercase">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <Filter className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">No tickets found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredTickets.map(ticket => {
                  const tid = ticket._id || ticket.id;
                  const isActive = activeTicket && (activeTicket._id || activeTicket.id) === tid;
                  return (
                    <button
                      key={tid}
                      onClick={() => selectTicket(ticket)}
                      className={`w-full text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-l-4 ${
                        isActive ? 'border-primary bg-primary/5' : 'border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          TKT-{tid?.slice(-6)}
                        </span>
                        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${priorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight line-clamp-1 mb-1">
                        {ticket.category}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] text-slate-400 font-medium">
                          {ticket.userId?.name || 'User'}
                        </span>
                        <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${statusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail panel */}
        {activeTicket ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-xl"
          >
            {/* Detail header */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    TKT-{(activeTicket._id || activeTicket.id)?.slice(-6)}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${statusColor(activeTicket.status)}`}>
                    {activeTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${priorityColor(activeTicket.priority)}`}>
                    {activeTicket.priority}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {activeTicket.userId?.name || 'Unknown'} · {activeTicket.userId?.email || ''} · {activeTicket.resourceId?.name || 'Resource'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status dropdown */}
                <select
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-black tracking-widest text-slate-700 dark:text-slate-300 uppercase px-4 py-2.5 rounded-xl outline-none cursor-pointer"
                  value={activeTicket.status}
                  onChange={e => handleUpdateStatus(activeTicket._id || activeTicket.id, e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <button
                  onClick={() => setActiveTicket(null)}
                  className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8">
              {/* Left: Description + evidence */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Incident Description
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">"{activeTicket.description}"</p>
                  </div>
                </div>

                {/* Category + priority info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{activeTicket.category}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeTicket.createdAt ? new Date(activeTicket.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {activeTicket.images && activeTicket.images.length > 0 && (
                  <div>
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Evidence</h3>
                    <div className="flex flex-wrap gap-3">
                      {activeTicket.images.map((img, i) => (
                        <img key={i} src={img} alt="Evidence" className="w-28 h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shadow-md" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Discussion thread */}
              <div className="w-full lg:w-80 flex flex-col lg:border-l border-slate-200 dark:border-slate-800 lg:pl-8">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Discussion Thread
                </h3>

                <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]">
                  {(!activeTicket.comments || activeTicket.comments.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-[10px] font-bold tracking-widest uppercase">No comments yet</p>
                    </div>
                  ) : (
                    activeTicket.comments.map((c, i) => (
                      <div key={c._id || i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-[10px] text-slate-900 dark:text-white uppercase tracking-widest">{c.author}</span>
                          <span className="text-[9px] text-slate-400">
                            {c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment input */}
                <div className="space-y-3 mt-auto">
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-700 dark:text-slate-300 resize-none h-24 placeholder-slate-400 transition-all"
                    placeholder="Add a resolution note or update..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-black tracking-[0.3em] rounded-xl transition-all disabled:opacity-30 shadow-lg flex items-center justify-center gap-2 uppercase"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Comment
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="text-center">
              <Filter className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Select a ticket to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
