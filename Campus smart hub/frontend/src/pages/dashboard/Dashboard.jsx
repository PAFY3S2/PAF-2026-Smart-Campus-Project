import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Ticket, Activity, TrendingUp, Zap, 
  ShieldCheck, ChevronRight, Loader2, LogOut,
  BookOpen, Lightbulb, GraduationCap, MapPin, Search, Building2, Fingerprint,
  ShieldAlert, Cpu, Network, Database, Terminal, Settings
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TiltCard from '../../components/shared/TiltCard';

// Mock historical data for "Realistic" charts
const weeklyData = [
  { day: 'Mon', utilization: 65, energy: 400 },
  { day: 'Tue', utilization: 78, energy: 450 },
  { day: 'Wed', utilization: 82, energy: 420 },
  { day: 'Thu', utilization: 75, energy: 380 },
  { day: 'Fri', utilization: 92, energy: 500 },
  { day: 'Sat', utilization: 45, energy: 200 },
  { day: 'Sun', utilization: 30, energy: 150 },
];

const miniChartData = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 30 }, { v: 20 }, { v: 40 }, { v: 35 }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const isAdmin = user?.role === 'ADMIN';
  const isTech = user?.role === 'TECHNICIAN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, bookRes, tickRes, userRes] = await Promise.all([
          api.get('/resources').catch(() => ({ data: [] })),
          api.get('/bookings').catch(() => ({ data: [] })),
          api.get('/tickets').catch(() => ({ data: [] })),
          isAdmin ? api.get('/auth/users').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);
        
        setStats({
          resources: resRes.data.length,
          bookings: bookRes.data.length,
          tickets: tickRes.data.length,
          users: userRes.data.length
        });

        // Mock some system logs for the "Command Center" vibe
        const mockLogs = [
          { id: 1, type: 'AUTH', msg: 'Admin Node Handshake Successful', time: '0.02s ago' },
          { id: 2, type: 'SYNC', msg: 'Infrastructure Telemetry Uplinked', time: '1.4m ago' },
          { id: 3, type: 'ALERT', msg: 'Computing Node B-4 Thermal Warning', time: '5m ago' },
          { id: 4, type: 'USER', msg: 'New Student Registration Verified', time: '12m ago' },
        ];
        setLogs(mockLogs);

      } catch (err) {
        console.error("Critical dashboard telemetry failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-12 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
           <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
           <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        </div>
        <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 pb-12 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ════════ BACKGROUND VISUALS ════════ */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-[3.5rem]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[60vw] max-w-[800px] aspect-square rounded-full bg-gradient-to-br from-primary/10 via-indigo-500/5 to-blue-500/5 blur-[100px] mix-blend-screen"
        />
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>

      {/* ════════ HEADER HUD ════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
           <div className="flex items-center space-x-3 mb-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-[8px] font-black tracking-[0.4em] text-primary uppercase">System Status :: Operational</p>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-primary/40 to-transparent hidden md:block" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
             Command Center
           </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {[
             { label: 'Uptime', val: '99.98%', icon: Activity, color: 'text-emerald-500' },
             { label: 'Latency', val: '14ms', icon: Zap, color: 'text-primary' },
             { label: 'Identity', val: user?.role || 'Guest', icon: ShieldCheck, color: 'text-indigo-400' }
           ].map((chip, idx) => (
             <div key={idx} className="flex items-center px-4 py-2.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm group">
               <chip.icon className={`w-3.5 h-3.5 mr-3 ${chip.color} group-hover:rotate-12 transition-transform`} />
               <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{chip.label}</p>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{chip.val}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ════════ PROFILE HUD CARD ════════ */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 relative overflow-hidden rounded-[3rem] p-8 md:p-10 bg-slate-900 border border-slate-800 shadow-2xl group flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-50" />
          
          <div className="relative z-10 flex items-center space-x-6 md:space-x-8">
            <div className="relative">
               <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-blue-400 to-emerald-400 rounded-2xl blur-lg opacity-20 animate-pulse" />
               <img 
                 src={user?.avatar || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"} 
                 alt={user?.name} 
                 className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-slate-800 shadow-2xl object-cover relative z-10" 
               />
               <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-emerald-500 shadow-xl z-20">
                 <ShieldCheck className="w-4 h-4" />
               </div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Node Sync :: Active</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-1 text-white tracking-tighter uppercase italic leading-none">
                {user?.name || "Accessing..."}
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Access Level</span>
                  <p className="text-[10px] text-white font-black uppercase tracking-widest mt-1">{user?.role || 'User'}</p>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Entity State</span>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
             <Link to="/profile" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all text-center">
               Profile Protocol
             </Link>
             <button onClick={logout} className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
               De-Authorize Session
             </button>
          </div>
        </motion.div>

        {/* ════════ LIVE SYSTEM LOGS ════════ */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-1 bg-slate-950 border border-slate-900 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">System Audit</h3>
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          </div>
          <div className="space-y-4">
             {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 group/log">
                   <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                     log.type === 'ALERT' ? 'bg-rose-500' : log.type === 'AUTH' ? 'bg-primary' : 'bg-emerald-500'
                   }`} />
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-300 font-medium leading-tight group-hover/log:text-white transition-colors">{log.msg}</p>
                      <p className="text-[8px] text-slate-600 font-black uppercase mt-1">{log.time}</p>
                   </div>
                </div>
             ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-900 flex justify-center">
             <button className="text-[9px] font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-colors flex items-center">
               View Full Logs <ChevronRight className="w-3 h-3 ml-1" />
             </button>
          </div>
        </motion.div>
      </div>

      {/* ════════ ACTION MATRIX ════════ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { path: isAdmin ? '/admin/users' : '/resources', label: isAdmin ? 'User Directory' : 'Resources', desc: isAdmin ? 'Secure control over nodes.' : 'Find campus resources.', icon: isAdmin ? Users : Search, color: 'text-blue-400', bg: 'bg-blue-500/10', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop' },
             { path: isAdmin ? '/admin/bookings' : '/bookings', label: isAdmin ? 'Institutional Bookings' : 'Booking Matrix', desc: 'Reservation sync protocol.', icon: Calendar, color: 'text-violet-400', bg: 'bg-violet-500/10', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop' },
             { path: isAdmin ? '/admin/announcements' : '/tickets', label: isAdmin ? 'Broadcast Center' : 'Response Hub', desc: isAdmin ? 'Push system-wide alerts.' : 'Active incident response.', icon: isAdmin ? ShieldAlert : Ticket, color: 'text-amber-400', bg: 'bg-amber-500/10', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop' },
             { path: isAdmin ? '/admin/settings' : '/profile', label: isAdmin ? 'Institutional Governance Hub' : 'Identity Protocol', desc: 'Operational settings.', icon: isAdmin ? Settings : Fingerprint, color: 'text-emerald-400', bg: 'bg-emerald-500/10', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' },
           ].map((node, i) => (
             <Link to={node.path} key={i}>
               <motion.div 
                 whileHover={{ y: -8, scale: 1.02 }}
                 className={`h-full min-h-[220px] relative overflow-hidden rounded-[2.5rem] border border-white/10 dark:border-slate-800 shadow-xl group transition-all`}
               >
                  {/* Card Image Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${node.img}")` }}
                  />
                  {/* High-Contrast Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center ${node.color} border border-white/10 group-hover:scale-110 transition-transform`}>
                       <node.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{node.label}</h4>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{node.desc}</p>
                    </div>
                  </div>
               </motion.div>
             </Link>
           ))}
      </motion.div>

      {/* ════════ ANALYTICS SECTION ════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UTILIZATION TREND */}
        <TiltCard 
          variants={itemVariants}
          className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-1 block">Telemetry Engine</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Campus Resource Load</h3>
            </div>
            <div className="hidden sm:flex items-center space-x-6">
               <div className="flex items-center space-x-2">
                 <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Utilization</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Energy Sync</span>
               </div>
            </div>
          </div>
          
          <div className="h-80 min-h-[350px] w-full relative z-10" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={350}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px', color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUtil)" />
                <Area yAxisId="left" type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>

        {/* INFRASTRUCTURE MONITOR */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
             <div>
               <span className="text-[10px] font-black tracking-[.3em] text-primary uppercase mb-1 block">Live Nodes</span>
               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">Infrastructure Monitoring</h3>
             </div>
             <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-primary" />
             </div>
          </div>

          <div className="space-y-8 flex-1">
             {[
               { label: 'Central Library Node', val: 78, color: 'bg-primary' },
               { label: 'Computing Block B', val: 45, color: 'bg-emerald-500' },
               { label: 'Student Nexus', val: 92, color: 'bg-rose-500' },
               { label: 'Innovation Lab 402', val: 24, color: 'bg-indigo-500' },
             ].map((node, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{node.label}</span>
                      <span className="text-white">{node.val}%</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.val}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                        className={`h-full ${node.color} rounded-full`}
                      />
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-12 p-6 bg-slate-950 rounded-[2rem] border border-slate-800 group cursor-pointer hover:border-primary transition-all">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-[.4em] mb-1">Network Protocol</p>
                   <p className="text-xs font-black text-white uppercase tracking-tighter">All Nodes Synced</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:text-primary transition-colors">
                   <ChevronRight className="w-5 h-5" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
