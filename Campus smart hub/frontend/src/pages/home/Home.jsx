import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Wrench, BarChart2, ChevronRight, Check, Command, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans overflow-x-hidden text-slate-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all">
            <Command className="w-6 h-6 text-primary" />
          </div>
          <div className="text-xl font-black text-white tracking-tighter uppercase">
            ScholarFlow
          </div>
        </div>
        
        <div className="hidden md:flex space-x-10 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
          <a href="#" className="text-primary border-b-2 border-primary pb-1">Operations</a>
          <a href="#" className="hover:text-slate-200 transition">Infrastructure</a>
          <a href="#" className="hover:text-slate-200 transition">Telemetry</a>
          <a href="#" className="hover:text-slate-200 transition">Security</a>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-[10px] font-black tracking-[0.2em] text-slate-400 hover:text-white transition uppercase">
            Log in
          </Link>
          <Link to="/login" className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-black tracking-[0.2em] rounded-xl transition uppercase shadow-xl shadow-primary/20">
            CONNECT
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none" />
        
        <div className="flex-1 max-w-2xl relative z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-[0.3em] rounded-full mb-8 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase"
          >
            NEXGEN CAMPUS OS v2.0
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter"
          >
            Digital Twin <span className="text-primary italic">Campus</span> Ecosystem.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 mb-12 leading-relaxed max-w-xl font-medium"
          >
            Real-time intelligence and unified operational telemetry for the world's most advanced learning environments.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-6"
          >
            <Link to="/login" className="px-10 py-5 bg-primary hover:bg-primary-hover text-white text-[10px] font-black tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-primary/40 uppercase">
              Enter Sandbox
            </Link>
            <a href="#" className="px-10 py-5 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 text-[10px] font-black tracking-[0.3em] rounded-2xl transition-all uppercase">
              View Specs
            </a>
          </motion.div>
        </div>

        {/* Hero Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 w-full flex justify-end relative"
        >
          <div className="relative w-full max-w-md bg-slate-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl aspect-square flex flex-col justify-between border border-slate-800/50">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            
            <div className="flex justify-between items-start relative z-10">
               <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl shadow-xl">
                 <span className="block text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Campus Node</span>
                 <strong className="text-white text-xl font-black tracking-tighter">OPERATIONS</strong>
               </div>
               <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                 <Zap className="w-6 h-6 text-primary animate-soft-pulse" />
               </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-32 h-32 rounded-3xl border-4 border-primary/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] bg-slate-950 flex items-center justify-center">
                 <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="bg-slate-950/80 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between mt-auto z-20 border border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-lg">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-0.5">ACTIVE HUB</div>
                  <div className="text-white text-sm font-black uppercase tracking-widest">Main Node A-4</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 -mt-12">
        {[
          { icon: Calendar, title: 'Spatial Mgmt', desc: 'Secure real-time resource allocation and conflict detection.', color: 'text-primary' },
          { icon: Wrench, title: 'Operational Log', desc: 'Instant incident reporting with automated technician dispatch.', color: 'text-emerald-400' },
          { icon: BarChart2, title: 'Deep Analytics', desc: 'Institutional intelligence based on live campus telemetry.', color: 'text-purple-400' }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-800 hover:border-primary/20 transition-all group"
          >
            <div className={`w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-10 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform ${feat.color}`}>
              <feat.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">{feat.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 border-y border-slate-800 text-white py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 opacity-50 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/3">
             <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-4 block">LIVE TELEMETRY</span>
             <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">System Vital Signs</h2>
             <div className="h-1 bg-slate-800 w-32 rounded-full" />
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12 text-center lg:text-left">
            <div className="space-y-4">
              <div className="text-6xl font-black text-white tracking-tighter">99.9%</div>
              <div className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">UPTIME STATUS</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black text-white tracking-tighter">2,400</div>
              <div className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">NODES TRACKED</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black text-white tracking-tighter">0.4ms</div>
              <div className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">REACTIVE DELAY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored Access */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-3 block">ACCESS CONTROL</span>
            <h2 className="text-5xl font-black text-white tracking-tighter">Deep Integration</h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm">Every institutional role is mapped to a dedicated operation path.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { role: 'Students', desc: 'Request resources and report maintenance issues instantly.', btn: 'STUDENT PORTAL', bg: 'bg-primary/5' },
            { role: 'Faculty', desc: 'Full laboratory and lecture hall administrative control.', btn: 'FACULTY HUB', bg: 'bg-emerald-500/5' },
            { role: 'Administrators', desc: 'Predictive analytics and institutional ecosystem oversight.', btn: 'COMMAND CENTER', bg: 'bg-purple-500/5' }
          ].map((item, i) => (
             <motion.div 
               key={i}
               whileHover={{ scale: 1.02 }}
               className={`rounded-[3rem] p-12 border border-slate-800 relative overflow-hidden flex flex-col min-h-[450px] transition-all hover:bg-slate-900 ${item.bg}`}
             >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{item.role}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                   {item.desc}
                </p>
                <Link to="/login" className="mt-auto w-full py-5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-white text-[10px] font-black tracking-[0.3em] rounded-2xl transition-all text-center uppercase">
                   {item.btn}
                </Link>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
             <div className="flex items-center space-x-3 mb-8">
                <Command className="w-8 h-8 text-primary" />
                <span className="text-white font-black text-2xl tracking-tighter uppercase">ScholarFlow</span>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-medium">
               Architecting the digital foundation for academic excellence and institutional intelligence.
             </p>
          </div>

          {[
            { title: 'Platform', links: ['Ecosystem', 'Telemetry', 'Security', 'Compliance'] },
            { title: 'Governance', links: ['Privacy', 'Ethics', 'Legal', 'Policy'] },
            { title: 'Assistance', links: ['Support Desk', 'Documentation', 'Training', 'Status'] }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-8">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors font-medium">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-700 text-[9px] font-black tracking-[0.4em] uppercase">
            © 2024 NEXGEN CAMPUS OS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-8">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">SYSTEMS STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
