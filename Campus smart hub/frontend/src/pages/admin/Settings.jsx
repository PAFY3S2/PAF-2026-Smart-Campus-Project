import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, ShieldAlert, Cpu, Network, Database, 
  Lock, Unlock, Power, RefreshCw, Zap, Save, CheckCircle2, Activity
} from 'lucide-react';

const Settings = () => {
  const [switches, setSwitches] = useState({
    maintenance: false,
    publicRegistrations: true,
    energyOptimization: true,
    autoLoadBalance: false,
    securityHardening: true
  });

  const toggle = (key) => setSwitches(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-8 pb-12 relative min-h-screen">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
           <div className="flex items-center space-x-3 mb-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-[8px] font-black tracking-[0.4em] text-primary uppercase">Core Protocol :: Level 5 Access</p>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-primary/40 to-transparent hidden md:block" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
             Governance Hub
           </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Security Matrix */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-emerald-500" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Operational Parameters</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Global system behavior toggles</p>
                 </div>
                 <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 shadow-lg">
                    <Cpu className="w-7 h-7" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                 {[
                   { id: 'maintenance', label: 'Maintenance Mode', desc: 'Lock all non-admin access.', icon: Power, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                   { id: 'publicRegistrations', label: 'Public Enrollment', desc: 'Allow new node registration.', icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                   { id: 'energyOptimization', label: 'Eco-Grid Sync', desc: 'Optimize resource consumption.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                   { id: 'autoLoadBalance', label: 'Auto Load-Balance', desc: 'Dynamic resource re-routing.', icon: RefreshCw, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                   { id: 'securityHardening', label: 'Enhanced Encryption', desc: 'AES-256 node verification.', icon: ShieldAlert, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                 ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`cursor-pointer group p-6 rounded-[2.25rem] border-2 transition-all shadow-sm ${
                        switches[item.id] 
                        ? `${item.bg} ${item.border} shadow-[0_0_20px_rgba(0,0,0,0.05)]` 
                        : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-transparent hover:border-slate-200'
                      }`}
                    >
                       <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            switches[item.id] ? `${item.bg} ${item.color} shadow-lg` : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:scale-110'
                          }`}>
                             <item.icon className="w-6 h-6" />
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors ${switches[item.id] ? (item.id === 'maintenance' ? 'bg-rose-500' : item.id === 'publicRegistrations' ? 'bg-emerald-500' : item.id === 'energyOptimization' ? 'bg-amber-500' : item.id === 'autoLoadBalance' ? 'bg-violet-500' : 'bg-blue-500') : 'bg-slate-200 dark:bg-slate-600'}`}>
                             <motion.div 
                               animate={{ x: switches[item.id] ? 24 : 4 }}
                               className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                             />
                          </div>
                       </div>
                       <h4 className={`text-base font-black uppercase tracking-tight ${switches[item.id] ? item.color : 'text-slate-900 dark:text-white'}`}>
                         {item.label}
                       </h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{item.desc}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-10 flex justify-end">
                 <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[.3em] rounded-2xl shadow-lg shadow-primary/25 flex items-center space-x-3 transition-all active:scale-95">
                    <Save className="w-4 h-4" />
                    <span>Apply Override</span>
                 </button>
              </div>
           </div>
        </div>

        {/* System Stats Hud */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Integrity</h3>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Live infrastructure telemetry</p>
              </div>

              <div className="space-y-6">
                 {[
                   { label: 'Database Sync', val: 'Syncing', icon: Database, color: 'text-emerald-400' },
                   { label: 'Uplink Node', val: 'Operational', icon: Network, color: 'text-primary' },
                   { label: 'Memory Leak', val: '0.00% detected', icon: Activity, color: 'text-emerald-400' },
                 ].map((stat, i) => (
                    <div key={i} className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                          <p className="text-xs font-black text-white uppercase tracking-tighter leading-none">{stat.val}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                    <span>System Heat Level</span>
                    <span className="text-emerald-400">Low</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '25%', '22%'] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-emerald-500"
                    />
                 </div>
              </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                 <Lock className="w-8 h-8 mb-4 opacity-50" />
                 <h4 className="text-lg font-black uppercase italic tracking-tighter leading-tight">Master Node Control</h4>
                 <p className="text-xs text-white/70 mt-2 font-medium">Clicking will initiate a full system verification scan of all connected campus nodes.</p>
                 <button className="mt-6 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Initiate Scan
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
