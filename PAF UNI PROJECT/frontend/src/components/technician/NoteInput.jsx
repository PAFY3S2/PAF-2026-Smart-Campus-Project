import React, { useState } from 'react';
import { Pencil, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NoteInput = ({ notes = [], onAdd, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#F5AB24]" />
          Internal Tactical Registry
        </p>
        
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Document tactical update (Internal only)..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-4 pl-5 pr-14 text-xs font-bold text-[#142B5D] dark:text-white outline-none focus:bg-white focus:ring-2 focus:ring-[#F5AB24]/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#142B5D] text-[10px] font-black text-white uppercase tracking-widest rounded-lg hover:bg-[#0D1E40] transition disabled:opacity-50"
          >
            Log Note
          </button>
        </form>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-xl">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No internal notes logged</p>
          </div>
        ) : (
          [...notes].reverse().map((note, i) => (
            <div key={i} className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border-l-4 border-amber-400 rounded-lg">
               <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[9px] font-black bg-amber-400 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Internal Note</span>
                  <span className="text-[8px] font-bold text-slate-400">{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
               </div>
               <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{note.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteInput;
