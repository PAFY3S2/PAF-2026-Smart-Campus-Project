import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Save, Filter, MapPin, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import { getImageUrl } from '../../utils/imageUtils';

const TechnicianTickets = ({ initialFilter = 'ALL' }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [workLogNote, setWorkLogNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Specific filters for Location view
  const [locationFilter, setLocationFilter] = useState({ building: '', lab: '', room: '' });

  const DUMMY_TICKETS = [
    {
      id: "69d7a1", category: 'HARDWARE', status: 'IN_PROGRESS', priority: 'URGENT',
      description: 'Critical server failure in Building A. Overheating detected.',
      building: 'Building A', room: 'Server Room Alpha',
      createdAt: new Date(Date.now() - 3600000), updatedAt: new Date(),
      workLog: [{ action: 'Emergency Response', note: 'Checks cooling units.', user: 'Technician', timestamp: new Date() }],
      comments: [{ text: 'Database is unreachable!', author: 'Admin', createdAt: new Date() }]
    },
    {
      id: "69d7a2", category: 'SOFTWARE', status: 'OPEN', priority: 'HIGH',
      description: 'Exam portal not loading in Exam Hall 02. Scheduled for tomorrow.',
      building: 'Building D', room: 'Exam Hall 02',
      createdAt: new Date(Date.now() - 7200000), updatedAt: new Date(Date.now() - 3600000)
    },
    {
      id: "69d7a3", category: 'FACILITIES', status: 'IN_PROGRESS', priority: 'MEDIUM',
      description: 'AC unit leaking water in staff room.',
      building: 'New Building', room: 'Staff Room 202',
      createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(),
      workLog: [{ action: 'Site Visit', note: 'Confirmed leakage.', user: 'Technician', timestamp: new Date() }]
    },
    {
      id: "69d7a4", category: 'HARDWARE', status: 'OPEN', priority: 'MEDIUM',
      description: 'Printer jam in main library.',
      building: 'Main Library', room: 'Ground Floor',
      createdAt: new Date(Date.now() - 43200000), updatedAt: new Date(Date.now() - 43200000)
    },
    {
      id: "69d7a5", category: 'OTHER', status: 'RESOLVED', priority: 'LOW',
      description: 'Slow Wi-Fi in student lounge.',
      building: 'Student Center', room: 'Lounge',
      createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(),
      resolutionNotes: 'Updated firmware.',
      workLog: [{ action: 'Resolution', note: 'Completed.', user: 'Technician', timestamp: new Date() }]
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/technician/${user.id}`);
      
      let data = res.data;
      if (!data || data.length === 0) {
        console.log('Using dummy data for tickets fallback');
        data = DUMMY_TICKETS;
      }
      
      setTickets(data.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      setLoading(false);
    } catch (err) {
      console.error('API failed, using dummy tickets fallback:', err);
      setTickets(DUMMY_TICKETS);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  useEffect(() => {
    let result = [...tickets];

    // Handle Route-based initial filters
    const path = location.pathname;
    if (path.includes('priority')) {
      result = result.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT');
    } else if (path.includes('locations')) {
      if (locationFilter.building) result = result.filter(t => t.building === locationFilter.building);
      if (locationFilter.lab) result = result.filter(t => t.lab === locationFilter.lab);
      if (locationFilter.room) result = result.filter(t => t.room === locationFilter.room);
    }

    // Apply Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [tickets, statusFilter, locationFilter, location.pathname]);

  const handleUpdateStatus = async (id, status) => {
    await api.patch(`/tickets/${id}`, { status });
    // Add work log entry for status change
    await api.post(`/tickets/${id}/worklog`, {
      action: `Status changed to ${status}`,
      user: user.name,
      timestamp: new Date()
    });
    fetchData();
    if (activeTicket?.id === id) {
      setActiveTicket(prev => ({ ...prev, status }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTicket) return;
    await api.post(`/tickets/${activeTicket.id}/comments`, {
      text: newComment,
      author: user.name
    });
    setNewComment('');
    fetchData();
    // Re-set active ticket to show new comment
    const res = await api.get(`/tickets/technician/${user.id}`);
    const updatedTicket = res.data.find(t => t.id === activeTicket.id);
    setActiveTicket(updatedTicket);
  };

  const handleAddWorkLog = async () => {
    if (!workLogNote.trim() || !activeTicket) return;
    await api.post(`/tickets/${activeTicket.id}/worklog`, {
      action: 'Work Log Entry',
      note: workLogNote,
      user: user.name,
      timestamp: new Date()
    });
    setWorkLogNote('');
    fetchData();
    // Refresh active ticket
    const res = await api.get(`/tickets/technician/${user.id}`);
    const updatedTicket = res.data.find(t => t.id === activeTicket.id);
    setActiveTicket(updatedTicket);
  }

  const getPageInfo = () => {
    if (location.pathname.includes('priority')) return { title: 'Priority Operations', subtitle: 'Critical & Urgent Support Incidents' };
    if (location.pathname.includes('locations')) return { title: 'Location Control', subtitle: 'Filtering Incidents by Campus Lab & Room' };
    return { title: 'Field Operations', subtitle: 'Incident response and technical task management' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="space-y-8 h-full flex flex-col">
      <PageHeader 
        title={pageInfo.title} 
        subtitle={pageInfo.subtitle} 
        showBanner={true} 
      />
      <div className="flex flex-1 min-h-0 gap-6">
      {/* List Column */}
      <div className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-1/3 flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-black text-[#142B5D] dark:text-white uppercase tracking-widest">
                {location.pathname.includes('priority') ? 'Priority Tickets' : 
                 location.pathname.includes('locations') ? 'Location Filters' : 'Assigned Tickets'}
            </h2>
            <span className="bg-[#142B5D] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{filteredTickets.length}</span>
          </div>

          <div className="flex gap-2">
            <select 
              className="flex-1 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#142B5D] dark:text-[#F5AB24] rounded p-2 focus:ring-1 focus:ring-[#F5AB24] outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase animate-pulse">Synchronizing...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">No tickets found matching criteria</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-l-4 ${activeTicket?.id === ticket.id ? 'border-[#F5AB24] bg-[#F5AB24]/5 dark:bg-[#F5AB24]/10' : 'border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TKT-{ticket.id}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-black text-[#142B5D] dark:text-slate-200 text-sm line-clamp-1 mb-1">{ticket.category}</h4>
                  <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {ticket.building || 'Main Campus'} {ticket.room ? `- ${ticket.room}` : ''}
                  </div>
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
                <div className={`px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest border border-current ${
                  activeTicket.status === 'OPEN' ? 'text-sky-600 bg-sky-50 dark:bg-sky-900/30' : 
                  activeTicket.status === 'IN_PROGRESS' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' : 
                  'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                }`}>
                  {activeTicket.status.replace('_', ' ')}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Reported: {new Date(activeTicket.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="text-xs font-black uppercase tracking-widest border-2 border-[#142B5D]/10 dark:border-slate-700 rounded px-3 py-2 focus:ring-2 focus:ring-[#F5AB24] outline-none bg-white dark:bg-slate-800 text-[#142B5D] dark:text-[#F5AB24]"
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
                className="lg:hidden text-slate-400 hover:text-[#142B5D] p-2 border border-slate-200 rounded transition"
              >
                Back
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col xl:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <section>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Incident Description</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-[#142B5D] dark:text-slate-300 font-medium leading-relaxed">
                  {activeTicket.description}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                   <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Location Details</h3>
                   <div className="flex items-center p-4 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl space-x-4">
                      <div className="p-3 bg-[#142B5D]/5 dark:bg-white/5 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#142B5D] dark:text-[#F5AB24]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase">Building / Room</p>
                        <p className="font-bold text-[#142B5D] dark:text-white uppercase tracking-tight">{activeTicket.building || 'Main Campus'} {activeTicket.room ? `(${activeTicket.room})` : ''}</p>
                      </div>
                   </div>
                </section>
                <section>
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Reference Information</h3>
                   <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl space-x-4">
                      <div className="p-3 bg-[#F5AB24]/5 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-[#F5AB24]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase">Category</p>
                        <p className="font-bold text-[#142B5D]">{activeTicket.category}</p>
                      </div>
                   </div>
                </section>
              </div>

              {activeTicket.images && activeTicket.images.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Visual Evidence</h3>
                  <div className="flex flex-wrap gap-4">
                    {activeTicket.images.slice(0, 3).map((img, i) => (
                      <div key={i} className="group relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm transition-all hover:border-[#F5AB24]">
                        <img src={getImageUrl(img)} alt="Evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Preview</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Work Log Section */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Professional work log</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                placeholder="Add technical note or resolution step..."
                                className="flex-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-[#F5AB24] outline-none text-[#142B5D] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                value={workLogNote}
                                onChange={(e) => setWorkLogNote(e.target.value)}
                             />
                             <button 
                                onClick={handleAddWorkLog}
                                disabled={!workLogNote.trim()}
                                className="bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-widest px-4 rounded hover:bg-[#0D1E40] transition disabled:opacity-50"
                             >
                                Log Activity
                             </button>
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {activeTicket.workLog?.length === 0 ? (
                            <p className="p-6 text-center text-xs text-slate-400 italic">No work log entries yet</p>
                        ) : (
                            [...activeTicket.workLog].reverse().map((log, i) => (
                                <div key={i} className="p-4 flex justify-between items-start hover:bg-slate-50/50">
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-[#142B5D] dark:text-[#F5AB24] mb-1">{log.action}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{log.note || 'Status Update'}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">{log.user}</p>
                                        <p className="text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
              </section>
            </div>

            {/* Sidebar for Discussion */}
            <div className="w-full xl:w-96 flex flex-col bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-[10px] font-black text-[#142B5D] dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#F5AB24]" /> Communication Hub
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                {activeTicket.comments?.length === 0 ? (
                  <div className="bg-white/50 border border-dashed border-slate-300 rounded-lg p-6 text-center">
                     <p className="text-xs text-slate-400 italic">No historical communication logs</p>
                  </div>
                ) : (
                  activeTicket.comments?.map((comment, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                       <div className="absolute top-0 left-0 w-1 h-full bg-[#142B5D] dark:bg-[#F5AB24]"></div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-[10px] text-[#142B5D] dark:text-[#F5AB24] uppercase tracking-tighter">{comment.author}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                <textarea
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-[#142B5D] dark:text-white focus:ring-2 focus:ring-[#F5AB24] outline-none resize-none mb-3 shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  rows="4"
                  placeholder="Send a message to user or admin..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg hover:bg-[#0D1E40] transition shadow-lg disabled:opacity-50 flex justify-center items-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Send Update
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
                <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-sm font-black text-[#142B5D] dark:text-white uppercase tracking-[0.2em] opacity-30">Select Assignment</h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">Pick a ticket from the left directory to begin operations</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TechnicianTickets;
