import React from 'react';
import { Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const StatusUpdater = ({ currentStatus, onUpdate, isLoading }) => {
  const [val, setVal] = React.useState(currentStatus);

  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col sm:flex-row sm:items-center bg-[#E9ECEF] dark:bg-slate-800 rounded-lg px-5 py-2.5">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-4">Status</span>
        <select 
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="bg-transparent text-sm font-black text-[#142B5D] dark:text-white outline-none cursor-pointer pr-4 appearance-none"
          style={{ background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23142B5D\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right center', backgroundSize: '12px' }}
        >
          <option value="OPEN">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <button 
        onClick={() => onUpdate(val)}
        disabled={isLoading || val === currentStatus}
        className="px-8 py-3 bg-[#00529C] hover:bg-[#003D75] disabled:opacity-50 text-white text-xs font-black rounded-lg transition-all shadow-lg shadow-blue-900/10 active:scale-95"
      >
        {isLoading ? 'Processing...' : 'Update Ticket'}
      </button>
    </div>
  );
};

export default StatusUpdater;
