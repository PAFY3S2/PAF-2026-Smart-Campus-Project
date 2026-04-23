import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Send, Clock, Trash2, CheckCircle2, 
  MessageSquare, Globe, AlertTriangle, Info, Bell
} from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Library Maintenance', body: 'The central library will be closed this Sunday for network upgrades.', type: 'ALERT', date: '2 hours ago' },
    { id: 2, title: 'Scholarship Deadline', body: 'Reminder: Applications for the merit scholarship close tonight at 23:59.', type: 'INFO', date: '5 hours ago' },
  ]);

  const [newMsg, setNewMsg] = useState({ title: '', body: '', type: 'INFO' });

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.title || !newMsg.body) return;
    setAnnouncements([{ ...newMsg, id: Date.now(), date: 'Just now' }, ...announcements]);
    setNewMsg({ title: '', body: '', type: 'INFO' });
  };

  return (
    <div className="space-y-8 pb-12 relative min-h-screen">
      {/* Background Mesh/Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
           <div className="flex items-center space-x-3 mb-2">
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-[8px] font-black tracking-[0.4em] text-amber-500 uppercase">Communcation Hub :: Active</p>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500/40 to-transparent hidden md:block" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
             Broadcast Center
           </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Create Broadcast */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="h-32 w-full relative overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               alt="Broadcast Hub"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />
             <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-lg">
                <p className="text-[7px] font-black tracking-[0.3em] text-amber-500 uppercase">System Uplink</p>
             </div>
          </div>
          
          <div className="p-8 pt-2 relative z-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">New Broadcast</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Deploy campus-wide alert</p>
          </div>

          <form onSubmit={handleSend} className="relative z-10 px-8 pb-8 space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'INFO', icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { id: 'ALERT', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { id: 'CRITICAL', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setNewMsg({ ...newMsg, type: p.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-[1.75rem] border-2 transition-all ${
                      newMsg.type === p.id ? 'border-primary bg-primary/10 shadow-inner' : 'border-slate-100 bg-white dark:bg-slate-800 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <p.icon className={`w-5 h-5 ${p.color} mb-1`} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Title</label>
              <input 
                type="text" 
                value={newMsg.title}
                onChange={e => setNewMsg({ ...newMsg, title: e.target.value })}
                placeholder="Emergency Update..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Payload</label>
              <textarea 
                rows="4"
                value={newMsg.body}
                onChange={e => setNewMsg({ ...newMsg, body: e.target.value })}
                placeholder="Enter detailed broadcast content..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center space-x-3 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Initiate Broadcast</span>
            </button>
          </form>
        </motion.div>

        {/* Active Broadcasts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -ml-32 -mb-32" />
             
             <div className="relative z-10 flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Operational Feed</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Live broadcast history</p>
                </div>
                <div className="flex items-center space-x-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Node : Sync</span>
                </div>
             </div>

             <div className="relative z-10 space-y-5">
                <AnimatePresence>
                  {announcements.map((a) => (
                    <motion.div 
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-5 rounded-[1.5rem] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center ${
                            a.type === 'ALERT' ? 'bg-amber-500/20 text-amber-500' : 
                            a.type === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {a.type === 'ALERT' ? <AlertTriangle className="w-5 h-5" /> : 
                             a.type === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{a.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.body}</p>
                            <div className="flex items-center space-x-3 mt-3">
                               <span className="flex items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                  <Clock className="w-3 h-3 mr-1" /> {a.date}
                               </span>
                               <span className="flex items-center text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
                               </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
