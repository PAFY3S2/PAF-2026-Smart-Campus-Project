import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageCircle, MessageSquare, Paperclip } from 'lucide-react';
import clsx from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';

const MessageThread = ({ messages = [], onSend, onSendNote, isLoading }) => {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'note'
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (activeTab === 'note') {
      onSendNote(text);
    } else {
      onSend(text);
    }
    setText('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center space-x-3">
        <MessageSquare className="w-5 h-5 text-[#0E4DA4]" />
        <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">Activity Log</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.map((m, i) => {
          const isNote = m.senderType === 'technician' || m.isInternal;
          const initials = m.author ? m.author.split(' ').map(n => n[0]).join('') : 'U';

          return (
            <div key={i} className={clsx("flex items-start space-x-4", isNote ? "flex-row-reverse space-x-reverse" : "")}>
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold",
                isNote ? "bg-[#0E4DA4] text-white" : "bg-[#D1D5DB] text-slate-600"
              )}>
                {isNote ? 'ME' : initials}
              </div>
              <div className={clsx("flex flex-col max-w-[80%]", isNote ? "items-end" : "items-start")}>
                <div className="flex items-center space-x-3 mb-2">
                   <span className="text-[13px] font-bold text-[#1F2937] dark:text-white">{m.author}</span>
                   <span className="text-[11px] font-medium text-slate-400">{m.senderType === 'user' ? '(Student)' : '(Technician)'}</span>
                   <span className="text-[11px] font-medium text-slate-400">{format(new Date(m.createdAt), 'hh:mm a')}</span>
                </div>
                <div className={clsx(
                  "p-5 rounded-xl text-[14px] leading-[1.6] font-medium",
                  isNote 
                    ? "bg-[#0E4DA4] text-white rounded-tr-none" 
                    : "bg-[#E9ECEF] text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-tl-none border border-slate-200 dark:border-slate-700"
                )}>
                  {isNote && <div className="text-[10px] font-bold uppercase mb-1.5 opacity-60">Internal Note</div>}
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex space-x-8 mb-6">
           <button 
             onClick={() => setActiveTab('student')}
             className={clsx(
               "text-[14px] font-bold uppercase tracking-wider pb-2 border-b-2 transition-all", 
               activeTab === 'student' ? "text-[#0E4DA4] border-[#0E4DA4]" : "text-slate-400 border-transparent"
             )}
           >
             To Student
           </button>
           <button 
             onClick={() => setActiveTab('note')}
             className={clsx(
               "text-[14px] font-bold uppercase tracking-wider pb-2 border-b-2 transition-all", 
               activeTab === 'note' ? "text-[#0E4DA4] border-[#0E4DA4]" : "text-slate-400 border-transparent"
             )}
           >
             Internal Note
           </button>
        </div>

        <form onSubmit={handleSend} className="bg-[#F8F9FA] dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
           <textarea 
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Type your response here..."
             className="w-full p-4 bg-transparent outline-none text-[14px] font-medium text-slate-700 dark:text-white resize-none h-28"
           />
           <div className="flex items-center justify-between px-4 pb-4">
              <Paperclip className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
              <button 
                type="submit"
                disabled={isLoading || !text.trim()}
                className="px-8 py-3 bg-[#0E4DA4] hover:bg-[#0A3D82] text-white text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-blue-900/10 active:scale-95 disabled:opacity-50"
              >
                Send Reply
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default MessageThread;
