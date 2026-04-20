import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle, 
  ArrowLeft, 
  Info, 
  Activity, 
  Shield, 
  UserCircle, 
  Send,
  MessageSquare
} from 'lucide-react';
import StatusBadge from '../../components/technician/StatusBadge';
import UpdateTimeline from '../../components/technician/UpdateTimeline';
import AttachmentUploader from '../../components/technician/AttachmentUploader';
import api from '../../services/api';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  const DUMMY_TICKET = {
    id,
    title: 'Network Outage in Lab 3',
    description: 'Multiple students reporting unable to connect to the internal server. WiFi seems stable but Ethernet is down for all terminals.',
    category: 'Network / Infrastructure',
    location: 'Building C - Lab 3',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000),
    assignedTechnician: 'John Doe (You)',
    updates: [
      { type: 'STATUS_CHANGE', note: 'Technician assigned to the incident.', user: 'System', timestamp: new Date(Date.now() - 86400000) },
      { type: 'COMMENT', note: 'On-site investigation started. Checking rack switches.', user: 'John Doe', timestamp: new Date(Date.now() - 3600000) },
      { type: 'STATUS_CHANGE', note: 'Status updated to IN PROGRESS.', user: 'John Doe', timestamp: new Date(Date.now() - 3600000) },
    ]
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/${id}`).catch(() => ({ data: DUMMY_TICKET }));
        setTicket(res.data || DUMMY_TICKET);
        setLoading(false);
      } catch (err) {
        setTicket(DUMMY_TICKET);
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleUpdateStatus = (newStatus) => {
    const update = {
      type: 'STATUS_CHANGE',
      note: `Status updated to ${newStatus.replace('_', ' ')}.`,
      user: 'Technician',
      timestamp: new Date()
    };
    setTicket(prev => ({ 
      ...prev, 
      status: newStatus,
      updates: [update, ...prev.updates]
    }));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    const newUpdate = {
      type: 'COMMENT',
      note: replyText,
      user: 'Technician',
      timestamp: new Date()
    };

    setTicket(prev => ({
      ...prev,
      updates: [newUpdate, ...prev.updates]
    }));
    setReplyText('');
  };

  if (loading || !ticket) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#F5AB24] rounded-full animate-spin"></div>
    </div>
  );

  const steps = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentStepIndex = steps.indexOf(ticket.status);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-400 hover:text-[#142B5D] dark:hover:text-white transition-colors font-black uppercase text-[10px] tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Operations</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Ticket Info */}
        <div className="lg:w-[350px] space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="mb-6">
                <span className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em] block mb-2">Detailed Log</span>
                <h2 className="text-2xl font-black text-[#142B5D] dark:text-white tracking-tighter leading-tight">
                  {ticket.title}
                </h2>
             </div>

             <div className="space-y-6">
                <InfoItem icon={Tag} label="Category" value={ticket.category} />
                <InfoItem icon={MapPin} label="Location" value={ticket.location} />
                <InfoItem icon={Calendar} label="Created Date" value={new Date(ticket.createdAt).toLocaleDateString()} />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority Level</p>
                  <StatusBadge status={ticket.priority} />
                </div>
                <InfoItem icon={UserCircle} label="Assigned Tech" value={ticket.assignedTechnician} />
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center space-x-2 mb-4">
                <Info className="w-4 h-4 text-[#F5AB24]" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</h4>
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
               {ticket.description}
             </p>
          </div>
        </div>

        {/* MIDDLE: Workflow + Timeline + Reply */}
        <div className="flex-1 space-y-8">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-[#142B5D] dark:text-white uppercase tracking-[0.2em] mb-10 text-center">Operation Workflow Progress</h3>
              <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4">
                <div className="absolute left-10 right-10 top-5 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {steps.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      i <= currentStepIndex 
                        ? 'bg-emerald-500 border-white dark:border-slate-900 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'
                    }`}>
                      {i < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-black">{i + 1}</span>}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest mt-4 ${i <= currentStepIndex ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           {/* TECHNICAL RESPONSE HUB */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-[#F5AB24]/30 shadow-xl shadow-[#F5AB24]/5">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#F5AB24]/10 rounded-lg">
                       <MessageSquare className="w-5 h-5 text-[#F5AB24]" />
                    </div>
                    <h3 className="text-xs font-black text-[#142B5D] dark:text-white uppercase tracking-widest">Technical Response Hub</h3>
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-[#F5AB24]">Visible to Student</span>
              </div>
              
              <div className="space-y-4">
                 <textarea 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   placeholder="Type your professional response or technical update here..."
                   className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-[#F5AB24] transition-all resize-none"
                 />
                 <div className="flex justify-end">
                    <button 
                      onClick={handleSendReply}
                      className="flex items-center space-x-2 px-8 py-3.5 bg-[#F5AB24] text-[#142B5D] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ffb633] transition shadow-lg active:scale-95"
                    >
                       <Send className="w-4 h-4" />
                       <span>Send Professional Reply</span>
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 mb-8">
                <Activity className="w-4 h-4 text-[#F5AB24]" />
                <h3 className="text-xs font-black text-[#142B5D] dark:text-white uppercase tracking-widest">Activity & Update Timeline</h3>
              </div>
              <UpdateTimeline updates={ticket.updates || []} />
           </div>
        </div>

        {/* RIGHT: Actions Panel */}
        <div className="lg:w-[300px] space-y-8">
           <div className="bg-[#142B5D] p-8 rounded-2xl shadow-xl shadow-[#142B5D]/20 text-white">
              <div className="flex items-center space-x-2 mb-6 opacity-60">
                <Shield className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Actions Hub</h3>
              </div>
              <div className="space-y-4">
                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                  <ActionButton 
                    label={ticket.status === 'OPEN' ? "Initiate Work" : "Resolve Incident"} 
                    variant={ticket.status === 'OPEN' ? "amber" : "success"} 
                    onClick={() => handleUpdateStatus(ticket.status === 'OPEN' ? 'IN_PROGRESS' : 'RESOLVED')} 
                  />
                )}
                {ticket.status === 'RESOLVED' && (
                  <ActionButton 
                    label="Close Operation" 
                    variant="primary" 
                    onClick={() => handleUpdateStatus('CLOSED')} 
                  />
                )}
                <ActionButton label="Flag for Review" variant="secondary" />
                <ActionButton label="Transfer Zone" variant="secondary" />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <AttachmentUploader />
           </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="p-2 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
      <Icon className="w-4 h-4 text-[#F5AB24]" />
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-[#142B5D] dark:text-slate-200">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ label, variant, onClick }) => {
  const styles = {
    primary: 'bg-white/10 text-white hover:bg-white/20',
    secondary: 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10',
    amber: 'bg-[#F5AB24] text-[#142B5D] hover:bg-[#ffb633]',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600'
  };
  return (
    <button 
      onClick={onClick}
      className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export default TicketDetails;
