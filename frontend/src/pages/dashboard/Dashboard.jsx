import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Ticket, Activity, TrendingUp, Zap, 
  ShieldCheck, ChevronRight, Loader2, LogOut,
  BookOpen, Lightbulb, GraduationCap, MapPin, Search, Building2, Fingerprint
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

const studentTips = [
  { id: 1, title: "Library Finals Hours", desc: "Main library now open 24/7 until the end of finals week. Free coffee at midnight!", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, title: "Tech Support Node", desc: "Experiencing Wi-Fi drops in the dorms? File a quick ticket to get remote help.", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 3, title: "Study Labs Added", desc: "3 new collaborative study rooms are now available in the Science Block for group bookings.", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'TECHNICIAN') {
      navigate('/technician/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      const timeout = setTimeout(() => setLoading(false), 5000);
      try {
        const [resRes, bookRes, tickRes] = await Promise.all([
          api.get('/resources').catch(() => ({ data: [] })),
          api.get('/bookings').catch(() => ({ data: [] })),
          api.get('/tickets').catch(() => ({ data: [] }))
        ]);
        
        setStats({
          resources: resRes.data.length,
          bookings: bookRes.data.length,
          tickets: tickRes.data.length
        });
      } catch (err) {
        console.error("Critical dashboard telemetry failure:", err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-3">
             <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
             <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
           <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
           <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
           <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        </div>
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
      {/* DYNAMIC DASHBOARD BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-[3.5rem]">
        {/* Animated Gradient Orbs - Elite Command Center Palette */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[60vw] max-w-[800px] aspect-square rounded-full bg-gradient-to-br from-primary/20 via-indigo-500/10 to-blue-500/10 blur-[100px] mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[10%] w-[50vw] max-w-[600px] aspect-square rounded-full bg-gradient-to-tr from-indigo-950/20 via-slate-900/10 to-primary/10 blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] right-[10%] w-[40vw] max-w-[500px] aspect-square rounded-full bg-gradient-to-t from-emerald-500/10 via-cyan-500/10 to-blue-500/10 blur-[100px] mix-blend-screen"
        />
        {/* Tech Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>
      {/* SYSTEM HANDSHAKE :: HEADER HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
           <div className="flex items-center space-x-3 mb-3">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-[8px] font-black tracking-[0.4em] text-primary uppercase">Node Handshake :: Active</p>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-primary/40 to-transparent hidden md:block" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic flex items-center leading-none">
             Command Center
           </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Telemetry Chips */}
           {[
             { label: 'Session Status', val: 'Operational', icon: Activity, color: 'text-emerald-500' },
             { label: 'Uplink Node', val: user?.id?.slice(-8).toUpperCase() || 'NODE-XXX', icon: Zap, color: 'text-primary' },
             { label: 'Local Time', val: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), icon: Calendar, color: 'text-slate-400' }
           ].map((chip, idx) => (
             <div key={idx} className="flex items-center px-5 py-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm group">
               <chip.icon className={`w-3.5 h-3.5 mr-3 ${chip.color} group-hover:scale-110 transition-transform`} />
               <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{chip.label}</p>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{chip.val}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TACTICAL PROFILE HUD :: WELCOME CARD */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 relative overflow-hidden rounded-[3rem] p-10 bg-slate-900 border border-slate-800 shadow-2xl group flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48 mix-blend-screen" />
          
          {/* Structural Hex Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 flex items-center space-x-8">
            <div className="relative group/identity">
               <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-blue-400 to-emerald-400 rounded-2xl blur-lg opacity-20 group-hover/identity:opacity-40 transition-opacity animate-pulse" />
               <img 
                 src={user?.avatar || "https://images.unsplash.com/photo-1523240615152-44df0e1f7481?q=80&w=2070&auto=format&fit=crop"} 
                 alt={user?.name} 
                 className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-slate-800 shadow-2xl object-cover relative z-10 grayscale-[30%] group-hover/identity:grayscale-0 transition-all duration-500" 
               />
               <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-emerald-500 shadow-xl z-20">
                 <ShieldCheck className="w-4 h-4" />
               </div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-80">Sync Point :: Home Node</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-3xl font-black mb-1 text-white tracking-tighter uppercase italic drop-shadow-md leading-none">
                {user?.name || "Authorized User"}
              </h2>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Institutional Security</span>
                  <p className="text-[10px] text-white font-black uppercase tracking-widest mt-1">Verified Student</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto flex flex-col items-center md:items-end space-y-4">
            <button 
              onClick={logout}
              className="group/btn relative px-8 py-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center space-x-3 text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-[.3em]">
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Log out</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* CAMPUS VIEWFINDER :: PICTORIAL HUD */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-1 relative overflow-hidden rounded-[3rem] border border-slate-700 shadow-2xl group min-h-[280px]"
        >
          {/* Full-bleed campus photo always visible */}
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop")' }}
          />
          {/* Strong gradient overlay — readable in both modes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          {/* Content pinned to bottom */}
          <div className="absolute inset-0 flex flex-col justify-between p-7">
            <div className="flex justify-between items-start">
              <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em]">● Live Feed</p>
              </div>
              {/* HUD Corner */}
              <div className="w-10 h-10 border-t-2 border-r-2 border-white/30 rounded-tr-xl" />
            </div>
            <div>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mb-2">Campus Snapshot</p>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">Main Academic Block</h4>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Optimized Study Node</p>
              </div>
            </div>
          </div>
          {/* Bottom HUD Corner */}
          <div className="absolute bottom-6 right-7 w-10 h-10 border-b-2 border-r-2 border-white/20 rounded-br-xl pointer-events-none" />
        </motion.div>
      </div>

      {/* TACTICAL ACTION MATRIX — IMAGE-FORWARD CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { path: '/resources', label: 'Resource Directory', desc: 'Find study rooms, labs, and computing nodes across campus.', icon: Search, accentColor: '#3b82f6', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop' },
           { path: '/tickets', label: 'Incident Reporting', desc: 'Submit technical tickets and report faulty equipment instantly.', icon: Activity, accentColor: '#f59e0b', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' },
           { path: '/profile', label: 'Identity Protocol', desc: 'View your authorizations, history, and institutional credentials.', icon: Fingerprint, accentColor: '#10b981', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' }
         ].map((node, i) => (
           <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="group">
              <Link to={node.path} className="h-full min-h-[280px] flex flex-col rounded-[2.5rem] relative overflow-hidden shadow-xl border border-white/10 dark:border-slate-800">
                {/* IMAGE — Always fully visible */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${node.img}")` }}
                />
                {/* Adaptive gradient overlay — strong enough for both modes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                {/* Accent color tint on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to top, ${node.accentColor}80, transparent)` }}
                />
                {/* Content pinned to bottom */}
                <div className="relative z-10 flex flex-col justify-between h-full p-8">
                  {/* Top icon chip */}
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg text-white"
                    style={{ backgroundColor: `${node.accentColor}30` }}
                  >
                    <node.icon className="w-5 h-5" />
                  </div>
                  {/* Bottom text */}
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 drop-shadow-lg">{node.label}</h4>
                    <p className="text-slate-300 text-xs font-medium leading-relaxed mb-5">{node.desc}</p>
                    <div className="flex items-center text-[9px] font-black uppercase tracking-[.3em] text-white/60 group-hover:text-white transition-colors">
                      Initiate Protocol <ChevronRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
           </motion.div>
         ))}
      </motion.div>

      {/* ANALYTICS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Campus Nodes', value: stats.resources, icon: Building2, color: 'text-primary', trend: '+12%', bg: 'bg-primary/5' },
          { label: 'Active Syncs', value: stats.bookings, icon: Activity, iconColor: 'text-emerald-500', trend: '-2%', bg: 'bg-emerald-500/5' },
          { label: 'Pending Tickets', value: stats.tickets, icon: Ticket, iconColor: 'text-amber-500', trend: '+5%', bg: 'bg-amber-500/5' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:border-primary/40 relative overflow-hidden group shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center ${stat.iconColor || stat.color} group-hover:-translate-y-1 transition-transform shadow-inner`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <div className="h-10 w-20 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniChartData}>
                      <Line type="monotone" dataKey="v" stroke="currentColor" className={stat.iconColor || stat.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase mb-2 leading-none">{stat.label}</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{stat.value}</h3>
              <div className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                {stat.trend}
              </div>
            </div>
            {/* Corner Sensor Pip */}
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse group-hover:bg-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UTILIZATION TREND */}
        <TiltCard 
          variants={itemVariants}
          className="lg:col-span-2 bg-white/70 backdrop-blur-xl dark:bg-slate-900 rounded-3xl p-8 border border-white/60 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative"
        >
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1 block">ANALYTICS ENGINE</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Campus Load vs Power</h3>
            </div>
            <div className="hidden sm:flex items-center space-x-6">
               <div className="flex items-center space-x-2">
                 <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Utilization</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Energy (kW)</span>
               </div>
            </div>
          </div>
          
          <div className="h-80 min-h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.2} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} dx={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" />
                <Area yAxisId="right" type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>

        {/* INFRASTRUCTURE :: LIVE MONITOR */}
        <TiltCard 
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-xl dark:bg-slate-900 rounded-[2.5rem] p-8 border border-white/60 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col group"
        >
          <div className="flex items-center justify-between mb-8">
             <div>
               <span className="text-[10px] font-black tracking-[.2em] text-primary uppercase mb-1 block">Live Monitor</span>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Campus Load</h3>
             </div>
             <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center animate-pulse">
               <Activity className="w-6 h-6 text-primary" />
             </div>
          </div>

          <div className="space-y-6 flex-1">
             {[
               { label: 'Central Library Node', val: 78, color: 'bg-primary' },
               { label: 'Computing Block Wing-B', val: 45, color: 'bg-emerald-500' },
               { label: 'Student Nexus Cluster', val: 92, color: 'bg-rose-500' },
               { label: 'Innovation Lab 402', val: 24, color: 'bg-indigo-500' },
             ].map((node, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{node.label}</span>
                      <span className="text-slate-900 dark:text-white">{node.val}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.val}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${node.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                      />
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-10 p-5 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
             <div className="relative z-10 flex items-center justify-between">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-[.3em] mb-1">Recommended Deployment</p>
                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter">Lab 402 :: Low Latency</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                   <ChevronRight className="w-4 h-4 text-emerald-500" />
                </div>
             </div>
          </div>
        </TiltCard>
      </div>

    </motion.div>
  );
};

export default Dashboard;
