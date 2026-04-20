import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Ticket, Activity, TrendingUp, Zap, 
  ShieldCheck, ChevronRight, Loader2, LogOut,
  BookOpen, Lightbulb, GraduationCap, MapPin, Search
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
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block">
            Institutional Overview
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-primary" />
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-3 text-sm font-medium">
          <div className="flex items-center px-4 py-2 bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            SYSTEM STATUS: OPTIMAL
          </div>
          <span className="text-slate-600 dark:text-slate-400 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* USER WELCOME CARD (UNIVERSITY THEMED) */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/80 to-transparent mix-blend-overlay" />
        
        <div className="relative z-10 flex items-center space-x-6">
          <div className="relative">
             <img src={user?.avatar || "https://i.pravatar.cc/150"} alt={user?.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white/20 shadow-xl object-cover" />
             {user?.role === 'ADMIN' && (
               <div className="absolute -bottom-2 -right-2 bg-rose-500 p-1.5 rounded-lg border-2 border-slate-900 text-white">
                 <ShieldCheck className="w-4 h-4" />
               </div>
             )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300 mb-1">{getGreeting()},</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{user?.name || "Scholar"}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                <span className="text-[10px] text-white font-black uppercase tracking-widest">{user?.role || "STUDENT"}</span>
              </div>
              <div className="flex items-center text-white/80 text-xs font-semibold bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Main Campus Block Wing
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 w-full md:w-auto flex justify-end">
          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm backdrop-blur-md border border-white/20 focus:ring-2 ring-white/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </motion.div>

      {/* QUICK ACTIONS ROW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div whileHover={{ scale: 1.02, y: -4 }} className="group">
            <Link to="/resources" className="h-full block p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
              <Calendar className="absolute right-0 bottom-0 w-24 h-24 text-white/10 -mr-2 -mb-2 rotate-12 transition-transform group-hover:scale-110" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                     <Search className="w-5 h-5 text-white" />
                   </div>
                   <h4 className="text-xl font-black mb-1">Book a Resource</h4>
                   <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-90 max-w-[80%]">Find study rooms, computing nodes, or lab gear across campus.</p>
                 </div>
                 <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-indigo-100 group-hover:text-white transition-colors">
                   Enter Directory <ChevronRight className="w-4 h-4 ml-1" />
                 </div>
              </div>
            </Link>
         </motion.div>

         <motion.div whileHover={{ scale: 1.02, y: -4 }} className="group">
            <Link to="/tickets" className="h-full block p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-amber-500/20">
              <Zap className="absolute right-0 bottom-0 w-24 h-24 text-white/10 -mr-2 -mb-2 rotate-12 transition-transform group-hover:scale-110" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                     <Activity className="w-5 h-5 text-white" />
                   </div>
                   <h4 className="text-xl font-black mb-1">Issue Reporting</h4>
                   <p className="text-amber-100 text-xs font-medium leading-relaxed opacity-90 max-w-[80%]">Submit technical tickets or report faulty equipment immediately.</p>
                 </div>
                 <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-amber-100 group-hover:text-white transition-colors">
                   Open Ticket <ChevronRight className="w-4 h-4 ml-1" />
                 </div>
              </div>
            </Link>
         </motion.div>

         <motion.div whileHover={{ scale: 1.02, y: -4 }} className="group">
            <Link to="/profile" className="h-full block p-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="absolute right-0 bottom-0 w-24 h-24 text-white/10 -mr-2 -mb-2 rotate-12 transition-transform group-hover:scale-110" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                     <Users className="w-5 h-5 text-white" />
                   </div>
                   <h4 className="text-xl font-black mb-1">Scholar Profile</h4>
                   <p className="text-emerald-100 text-xs font-medium leading-relaxed opacity-90 max-w-[80%]">View your authorizations, history, and institutional ID card.</p>
                 </div>
                 <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-emerald-100 group-hover:text-white transition-colors">
                   View Profile <ChevronRight className="w-4 h-4 ml-1" />
                 </div>
              </div>
            </Link>
         </motion.div>
      </motion.div>

      {/* ANALYTICS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Campus Resources', value: stats.resources, icon: Users, color: 'text-primary', trend: '+12%', bg: 'bg-primary/5' },
          { label: 'Your Active Bookings', value: stats.bookings, icon: Calendar, color: 'text-emerald-400', trend: '-2%', bg: 'bg-emerald-400/5' },
          { label: 'Pending Tickets', value: stats.tickets, icon: Ticket, color: 'text-amber-400', trend: '+5%', bg: 'bg-amber-400/5' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-primary/30 relative overflow-hidden group shadow-md dark:shadow-none"
          >
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.bg} -mr-8 -mb-8 rounded-full blur-2xl transition-all group-hover:scale-150 group-hover:opacity-20`} />
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 ${stat.color}`}>
                 <stat.icon className="w-5 h-5 shadow-sm" />
               </div>
               <div className="h-10 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniChartData}>
                      <Line type="monotone" dataKey="v" stroke="currentColor" className={stat.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">{stat.label}</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10' : 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-400/10'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UTILIZATION TREND */}
        <TiltCard 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative"
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
                <Area yAxisId="right" type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>

        {/* TIPS FOR STUDENTS */}
        <TiltCard 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
             <div>
               <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1 block">Campus Updates</span>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white">Scholar Tips</h3>
             </div>
             <div className="w-10 h-10 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
               <Lightbulb className="w-5 h-5 text-primary" />
             </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {studentTips.map((tip) => (
                <div key={tip.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2.5 rounded-xl ${tip.bg} ${tip.color} shrink-0`}>
                       <tip.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{tip.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{tip.desc}</p>
                    </div>
                  </div>
                </div>
             ))}
          </div>

          <button className="mt-6 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-[10px] font-black tracking-[.2em] rounded-2xl transition-all flex items-center justify-center uppercase shadow-sm dark:shadow-none">
            VIEW ALL BULLETINS <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </TiltCard>
      </div>

    </motion.div>
  );
};

export default Dashboard;
