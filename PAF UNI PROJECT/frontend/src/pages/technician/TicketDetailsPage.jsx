import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, ImageIcon, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useTicketMutations } from '../../hooks/useTicketMutations';

import StatusUpdater from '../../components/technician/StatusUpdater';
import EvidenceGallery from '../../components/technician/EvidenceGallery';
import MessageThread from '../../components/technician/MessageThread';
import RequesterDetails from '../../components/technician/RequesterDetails';
import TicketMetadata from '../../components/technician/TicketMetadata';
import QuickTechnicalActions from '../../components/technician/QuickTechnicalActions';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ticket, isLoading, error, evidence, isEvidenceLoading } = useTicketDetails(id);
  const { updateStatus, sendMessage, addNote } = useTicketMutations(id);

  if (isLoading) return <div className="p-8 animate-pulse text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Grid Data...</div>;
  if (error || !ticket) return <div className="p-20 text-center">Operation Failed: Registry Link Broken</div>;

  return (
    <div className="min-h-screen bg-[#F1F3F5] dark:bg-slate-950 p-8 pt-6 font-sans">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
          <div className="space-y-1 text-slate-900 dark:text-white">
             <h1 className="text-[2.5rem] font-bold tracking-tight leading-tight">
                {ticket.title || ticket.category || 'Problem Inquiry'}
             </h1>
             <div className="flex items-center space-x-2 text-[15px] font-medium text-slate-500">
                <Clock className="w-4 h-4 opacity-70" />
                <span>Submitted {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })} by {ticket.userId?.name}</span>
             </div>
          </div>
          
          <StatusUpdater 
            currentStatus={ticket.status} 
            onUpdate={(val) => updateStatus.mutate(val)}
            isLoading={updateStatus.isPending}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Core Ticket Data */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Problem Description Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="flex items-center space-x-3 mb-8">
                  <div className="text-[#0E4DA4]">
                     <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">
                    Problem Description
                  </h3>
               </div>
               <p className="text-[15px] leading-[1.8] text-slate-600 dark:text-slate-300 font-medium italic">
                 "{ticket.description}"
               </p>
            </div>

            {/* Evidence Gallery Card */}
            <EvidenceGallery images={evidence} isLoading={isEvidenceLoading} />

            {/* Activity Log (Thread) */}
            <div className="h-[750px]">
               <MessageThread 
                  messages={ticket.comments || []} 
                  onSend={(content) => sendMessage.mutate(content)}
                  onSendNote={(content) => addNote.mutate(content)}
                  isLoading={sendMessage.isPending || addNote.isPending}
               />
            </div>
          </div>

          {/* Right Column: Metadata & Actions */}
          <div className="space-y-8">
             <RequesterDetails user={ticket.userId} />
             <TicketMetadata ticket={ticket} />
             <QuickTechnicalActions 
                onAddNote={(content) => addNote.mutate(content)} 
                isLoading={addNote.isPending} 
             />
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center space-x-1.5 text-xs font-black text-[#142B5D] dark:text-white uppercase whitespace-nowrap">
       <Icon className="w-3 h-3 text-[#F5AB24]" />
       <span>{value || 'N/A'}</span>
    </div>
  </div>
);

export default TicketDetailsPage;
