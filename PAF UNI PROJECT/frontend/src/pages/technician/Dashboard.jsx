import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, FileDown, ShieldCheck, User, X, Check } from 'lucide-react';
import StatCard from '../../components/technician/StatCard';
import TicketTable from '../../components/technician/TicketTable';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isNoteSaving, setIsNoteSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/technician/${user?.id}`).catch(() => ({ data: [] }));
      
      let ticketsData = Array.isArray(res.data) ? res.data : [];
      // Filter out completed assignments for the active table
      const activeTickets = ticketsData.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
      setTickets(activeTickets);

      // Fetch stats (using existing endpoint)
      const statsRes = await api.get(`/tickets/stats/${user?.id}`).catch(() => ({ data: { assigned: 0, open: 0, inProgress: 0, resolved: 0, highPriority: 0 } }));
      const s = statsRes.data;
      setStats({
        assigned: s.assigned || 0,
        inProgress: s.inProgress || 0,
        resolved: s.resolved || 0,
        highPriority: s.highPriority || 0
      });

      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
       fetchData();
    }
  }, [user?.id]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/tickets/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCompleteRequest = (ticket) => {
    setSelectedTicket(ticket);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!selectedTicket) return;
    setIsCompleting(true);
    try {
      await api.patch(`/api/assignments/${selectedTicket.id}/complete`);
      toast.success("Assignment marked as complete");
      setIsCompleteModalOpen(false);
      setSelectedTicket(null);
      fetchData(); // This will refresh and remove the row
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete assignment');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleAddNoteRequest = (ticket) => {
    setSelectedTicket(ticket);
    setNoteText('');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!selectedTicket || !noteText.trim()) return;
    setIsNoteSaving(true);
    try {
      await api.post(`/api/assignments/${selectedTicket.id}/notes`, { note: noteText });
      toast.success("Note added successfully");
      setIsNoteModalOpen(false);
      setSelectedTicket(null);
      setNoteText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
    } finally {
      setIsNoteSaving(false);
    }
  };

  const handleDownloadReport = () => {
    if (tickets.length === 0) return;
    
    const headers = ["Incident ID", "Title", "Priority", "Location", "Status", "Created At"];
    const csvRows = [
      headers.join(","),
      ...tickets.map(t => [
        t.id,
        `"${t.title}"`,
        t.priority,
        `"${t.lab || t.room || t.building}"`,
        t.status,
        new Date(t.createdAt).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Technician_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#F5AB24] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tighter mb-1 uppercase">Hub Overview</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Institutional Operations Dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg animate-pulse">
            <Clock className="w-4 h-4" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white">Active Session</span>
        </div>
      </div>

      {/* DASHBOARD WELCOME BANNER */}
      <div className="bg-[#142B5D] rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-[#142B5D]/20">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
             <div className="w-24 h-24 rounded-full bg-white p-1 border-4 border-[#F5AB24] shadow-lg overflow-hidden flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="bg-[#142B5D] w-full h-full rounded-full flex items-center justify-center text-white">
                    <User className="w-12 h-12" />
                  </div>
                )}
             </div>
             <div className="absolute -bottom-2 -right-2 bg-[#F5AB24] p-2 rounded-full shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#142B5D]" />
             </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
              Welcome, <span className="text-[#F5AB24]">{user?.name || 'Technician'}</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                Technician Account
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F5AB24] italic opacity-80">
                Verified Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned Tickets" value={stats.assigned} icon={Ticket} color="blue" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="amber" />
        <StatCard title="Resolved Operations" value={stats.resolved} icon={CheckCircle} color="emerald" />
        <StatCard title="Priority Alerts" value={stats.highPriority} icon={AlertCircle} color="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">My Active Assignments</h2>
            <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-widest mt-1">Institutional Technical Support Queue</p>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0D1E40] transition shadow-md"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate Status Report</span>
          </button>
        </div>
        <TicketTable 
            tickets={tickets} 
            onUpdateStatus={handleUpdateStatus} 
            onAddNote={handleAddNoteRequest}
            onComplete={handleCompleteRequest}
        />
      </div>

      {/* CONFIRM COMPLETE MODAL */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 text-center">
                 <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter mb-2">Complete Assignment?</h3>
                 <p className="text-sm text-slate-500 font-bold px-4">
                    Are you sure you want to mark <span className="text-[#142B5D] dark:text-[#F5AB24]">#{selectedTicket?.id}</span> as resolved? This action will archive the ticket.
                 </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                 <button 
                    onClick={() => setIsCompleteModalOpen(false)}
                    className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleConfirmComplete}
                    disabled={isCompleting}
                    className="flex-1 py-4 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                 >
                    {isCompleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Confirm</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-lg font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Internal Note</h3>
                 <button onClick={() => setIsNoteModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-8">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Add technical details or updates</label>
                 <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={6}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-[#F5AB24] rounded-2xl p-6 text-sm font-bold text-[#142B5D] dark:text-white outline-none transition-all resize-none"
                 />
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-4">
                 <button 
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-8 py-3 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-900 transition"
                 >
                    Discard
                 </button>
                 <button 
                    onClick={handleSaveNote}
                    disabled={isNoteSaving || !noteText.trim()}
                    className="px-10 py-3 bg-[#F5AB24] text-[#142B5D] text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#F5AB24]/20 hover:bg-[#e09b1f] transition flex items-center space-x-2 disabled:opacity-50"
                 >
                    {isNoteSaving ? <div className="w-4 h-4 border-2 border-[#142B5D] border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Save Note</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
