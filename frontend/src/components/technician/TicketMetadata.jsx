import React from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';

const TicketMetadata = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">TICKET METADATA</h4>
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <MetaItem label="CREATED" value={format(new Date(ticket.createdAt), 'MMM dd, hh:mm a')} />
          <MetaItem 
            label="PRIORITY" 
            value={ticket.priority} 
            dot 
            color={ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-[#DC2626]' : 'bg-[#F59E0B]'} 
          />
          <MetaItem label="CATEGORY" value={ticket.category} />
          <MetaItem label="BUILDING" value={ticket.building || 'N/A'} />
          <MetaItem label="LAB/ROOM" value={ticket.lab || ticket.room || 'N/A'} />
          <MetaItem label="TICKET ID" value={`#${ticket.id?.toUpperCase() || 'PROJ - 8821'}`} link />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
         <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SERVICE HISTORY</span>
            <span className="text-[11px] font-bold text-slate-900 dark:text-slate-300">6 months ago</span>
         </div>
         <div className="flex items-center space-x-4">
            <div className="flex-1 h-3 bg-[#E9ECEF] dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="w-[85%] h-full bg-[#0E4DA4] rounded-full"></div>
            </div>
         </div>
         <p className="mt-3 text-[11px] font-medium text-slate-500">Last maintenance</p>
      </div>
    </div>
  );
};

const MetaItem = ({ label, value, dot, color, link }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
    <div className="flex items-center space-x-2">
      {dot && <div className={`w-2 h-2 rounded-full ${color}`}></div>}
      <span className={clsx(
        "text-[14px] font-bold",
        link ? "text-[#0E4DA4] hover:underline cursor-pointer" : "text-[#1F2937] dark:text-white"
      )}>
        {value}
      </span>
    </div>
  </div>
);

export default TicketMetadata;
