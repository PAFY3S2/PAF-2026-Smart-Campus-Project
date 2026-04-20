import React from 'react';
import { X, MapPin, Tag, Calendar, User, Info, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ ticket, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#142B5D] p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-white/10 rounded-lg">
                <Info className="w-5 h-5 text-[#F5AB24]" />
             </div>
             <div>
                <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Parameter Quick View</h3>
                <p className="text-sm font-bold tracking-tight">Incident # {ticket.id}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <span className="text-[10px] font-black text-[#F5AB24] uppercase tracking-widest block mb-1">Subject Matter</span>
            <h2 className="text-xl font-black text-[#142B5D] dark:text-white leading-tight">{ticket.title}</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ModalInfoItem icon={Tag} label="Intensity" value={<StatusBadge status={ticket.priority} />} />
            <ModalInfoItem icon={Info} label="Flow Status" value={<StatusBadge status={ticket.status} />} />
            <ModalInfoItem icon={MapPin} label="Zone" value={ticket.building || 'Campus'} />
            <ModalInfoItem icon={Calendar} label="Logged At" value={new Date(ticket.createdAt).toLocaleDateString()} />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                <Info className="w-3 h-3 mr-1.5" />
                Contextual Brief
             </p>
             <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {ticket.description || "No extended description provided for this incident log."}
             </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
             <button 
               onClick={() => {
                 onClose();
                 navigate(`/tickets/${ticket.id}`);
               }}
               className="flex-1 py-3.5 bg-[#142B5D] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#0D1E40] transition flex items-center justify-center space-x-2"
             >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Parameter Access</span>
             </button>
             <button 
               onClick={onClose}
               className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
             >
                Close
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalInfoItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center space-x-2 text-sm font-bold text-[#142B5D] dark:text-slate-200">
       <Icon className="w-4 h-4 text-[#F5AB24]" />
       <span>{value}</span>
    </div>
  </div>
);

export default QuickViewModal;
