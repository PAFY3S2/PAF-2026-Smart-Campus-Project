import React, { useState } from 'react';

const QuickTechnicalActions = ({ onAddNote, isLoading }) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddNote(note);
    setNote('');
  };

  return (
    <div className="bg-[#E9ECEF] dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800/50">
      <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">QUICK TECHNICAL ACTION</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input 
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 'Ordered replacement fan'"
            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-[#0E4DA4]/10 transition-all shadow-sm"
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading || !note.trim()}
          className="w-full py-4 bg-[#0E4DA4] hover:bg-[#0A3D82] text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Post Update'}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <SecondaryAction label="Escalate" />
        <SecondaryAction label="Reassign" />
      </div>
    </div>
  );
};

const SecondaryAction = ({ label }) => (
  <button className="py-4 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[13px] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]">
    {label}
  </button>
);

export default QuickTechnicalActions;
