import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, FileDown, ShieldCheck, User, X, Check } from 'lucide-react';
import StatCard from '../../components/technician/StatCard';
import TicketTable from '../../components/technician/TicketTable';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { toast } from 'sonner';

import { useTickets, useUpdateTicketStatus, useAddTicketNote } from '../../hooks/useTickets';
import { useTechnicianStats } from '../../hooks/useTechnicianStats';
import { z } from 'zod';

const noteSchema = z.string().min(1, "Note cannot be empty").max(2000, "Note must be under 2000 characters");

const Dashboard = () => {
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    from: '',
    to: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }, 300);
    return () => clearTimeout(handler);
  }, [debouncedSearch]);

  // Use TanStack Query hooks
  const { data: tickets = [], isLoading: isTicketsLoading, isFetching: isTicketsFetching } = useTickets('active-assignments', filters);
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useTechnicianStats();
  const updateStatus = useUpdateTicketStatus();
  const addNote = useAddTicketNote();
  
  // Modal States
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleUpdateStatus = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  const handleCompleteRequest = (ticket) => {
    setSelectedTicket(ticket);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!selectedTicket) return;
    updateStatus.mutate({ 
      id: selectedTicket.id, 
      status: 'RESOLVED' 
    }, {
      onSuccess: () => {
        setIsCompleteModalOpen(false);
        setSelectedTicket(null);
      }
    });
  };

  const handleAddNoteRequest = (ticket) => {
    setSelectedTicket(ticket);
    setNoteText('');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!selectedTicket) return;
    
    try {
      noteSchema.parse(noteText);
      addNote.mutate({ 
        id: selectedTicket.id, 
        note: noteText 
      }, {
        onSuccess: () => {
          setIsNoteModalOpen(false);
          setSelectedTicket(null);
          setNoteText('');
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
  };

  const handleDownloadReport = () => {
    if (tickets.length === 0) return;
    
    const headers = ["Incident ID", "Title", "Priority", "Location", "Status", "Created At"];
    const csvRows = [
      headers.join(","),
      ...tickets.map(t => [
        t.id,
        `"${t.description || ''}"`,
        t.priority,
        `"${t.room || t.location || t.building || ''}"`,
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

  if (isTicketsLoading) return (
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
        <StatCard title="Assigned Tickets" value={isStatsError ? '—' : stats?.assignedCount} icon={Ticket} color="blue" isLoading={isStatsLoading} />
        <StatCard title="In Progress" value={isStatsError ? '—' : stats?.inProgressCount} icon={Clock} color="amber" isLoading={isStatsLoading} />
        <StatCard title="Resolved Operations" value={isStatsError ? '—' : stats?.resolvedCount} icon={CheckCircle} color="emerald" isLoading={isStatsLoading} />
        <StatCard title="Priority Alerts" value={isStatsError ? '—' : stats?.priorityCount} icon={AlertCircle} color="rose" isLoading={isStatsLoading} />
      </div>

      {/* BLURRED BACKGROUND CONTAINER FOR TABLE OVERLAY */}
      <div className="relative rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Wallpaper.jpg')" }}
        />
        {/* Glassmorphism Blur & Opacity Layer */}
        <div className="absolute inset-0 z-0 bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl" />

        {/* Content Layer (Keeps content readable above background) */}
        <div className="relative z-10 w-full h-full">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">My Active Assignments</h2>
              <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-widest mt-1">Institutional Technical Support Queue</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search ID, description or student..."
                  value={debouncedSearch}
                  onChange={(e) => setDebouncedSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-transparent focus:border-[#F5AB24] outline-none rounded-lg text-xs font-bold text-[#142B5D] dark:text-white transition-all w-64 shadow-sm placeholder:text-slate-500"
                />
                <Ticket className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#F5AB24] transition-colors" />
              </div>

              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-transparent focus:border-[#F5AB24] outline-none rounded-lg text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>

              <select 
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-transparent focus:border-[#F5AB24] outline-none rounded-lg text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white shadow-sm"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {(filters.search || filters.status || filters.priority || filters.from || filters.to) && (
                <button 
                  onClick={() => {
                    setDebouncedSearch('');
                    setFilters({ search: '', status: '', priority: '', from: '', to: '' });
                  }}
                  className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest hover:underline drop-shadow-sm px-1"
                >
                  Clear Filters
                </button>
              )}

              <button 
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-[#142B5D]/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0D1E40] transition shadow-md"
              >
                <FileDown className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
          <div className="relative">
            {(isTicketsFetching && !isTicketsLoading) && (
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#F5AB24] rounded-full animate-spin"></div>
              </div>
            )}
            <div className="bg-transparent">
              <TicketTable 
                  tickets={tickets} 
                  onUpdateStatus={handleUpdateStatus} 
                  onAddNote={handleAddNoteRequest}
                  onComplete={handleCompleteRequest}
                  isLoading={isTicketsLoading}
              />
            </div>
          </div>
        </div>
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
                    disabled={updateStatus.isPending}
                    className="flex-1 py-4 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                 >
                    {updateStatus.isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
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
                    disabled={addNote.isPending || !noteText.trim()}
                    className="px-10 py-3 bg-[#F5AB24] text-[#142B5D] text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#F5AB24]/20 hover:bg-[#e09b1f] transition flex items-center space-x-2 disabled:opacity-50"
                 >
                    {addNote.isPending ? <div className="w-4 h-4 border-2 border-[#142B5D] border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
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
