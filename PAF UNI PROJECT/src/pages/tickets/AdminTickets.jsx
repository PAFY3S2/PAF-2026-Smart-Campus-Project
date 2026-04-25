import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const AdminTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newComment, setNewComment] = useState('');

  const fetchTickets = () => {
    api.get('/tickets').then(res => {
      setTickets(res.data.sort((a,b) => b.id - a.id));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
    <div className="flex h-full gap-6">
      {/* List Column */}
      <div className={`w-full ${activeTicket ? 'hidden lg:flex' : 'flex'} lg:w-1/3 flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Tickets Map</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <Loader message="Loading tickets..." fullScreen={false} />
          ) : (
            <div className="divide-y divide-slate-100">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition border-l-4 ${activeTicket?.id === ticket.id ? 'border-primary bg-indigo-50/30' : 'border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-slate-500">TKT-{ticket.id}</span>
                    <span className="text-xs font-medium text-slate-500">{ticket.priority}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-1">{ticket.category}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{ticket.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Column */}
      {activeTicket ? (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">TKT-{activeTicket.id}</h2>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {activeTicket.status}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                  {activeTicket.priority} PRIORITY
                </span>
              </div>
              <p className="text-slate-500 text-sm">Reported by User #{activeTicket.userId} for Resource #{activeTicket.resourceId}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-primary outline-none"
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
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">{activeTicket.description}</p>
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

            <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" /> Discussion
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {activeTicket.comments?.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No comments yet</p>
                ) : (
                  activeTicket.comments?.map(comment => (
                    <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-slate-800">{comment.author}</span>
                        <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto">
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none mb-2"
                  rows="3"
                  placeholder="Add a resolution note or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 rounded-xl border border-slate-200 border-dashed text-slate-400">
          Select a ticket to view details
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
