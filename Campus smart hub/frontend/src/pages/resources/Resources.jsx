import React, { useState, useEffect } from 'react';
import { Search, Filter, Monitor, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(res => {
      setResources(res.data);
      setLoading(false);
    });
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || res.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-12 relative">
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-16"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">
            FACILITY TELEMETRY
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">
            Infrastructure List
          </h1>
        </div>
      </motion.div>

      <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl transition-all relative z-10 mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search resources by identifier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl focus:ring-1 focus:ring-primary outline-none transition-all placeholder-slate-600"
            />
          </div>
          <div className="flex items-center space-x-4 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              className="bg-transparent text-slate-300 text-sm font-bold uppercase tracking-widest outline-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">ALL NODES</option>
              <option value="ROOM">ROOMS</option>
              <option value="LAB">LABS</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-600 font-bold tracking-[0.4em] animate-pulse uppercase">
            SYNCHRONIZING INFRASTRUCTURE DATA...
          </div>
        ) : filteredResources.map((resource, i) => (
          <motion.div 
            key={resource.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/30 transition-all group shadow-xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl shadow-inner border border-slate-800/50 ${resource.type === 'EQUIPMENT' ? 'bg-amber-500/10 text-amber-400' : 'bg-primary/10 text-primary'}`}>
                  {resource.type === 'EQUIPMENT' ? <Monitor className="w-7 h-7" /> : <Building className="w-7 h-7" />}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border shadow-sm ${resource.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {resource.status}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{resource.name}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4 mb-6">{resource.location}</p>
              
              <div className="flex items-center space-x-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase mb-1">Node Type</span>
                  <span className="text-xs font-bold text-slate-300">{resource.type}</span>
                </div>
                {resource.capacity && (
                  <div className="flex flex-col border-l border-slate-800 pl-8">
                    <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase mb-1">Cap. Range</span>
                    <span className="text-xs font-bold text-slate-300">{resource.capacity} units</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-950/50 px-8 py-5 border-t border-slate-800/50">
              <button 
                className="w-full text-center text-[10px] font-black tracking-[0.3em] text-primary hover:text-white transition-all uppercase"
                onClick={() => {/* Navigate */}}
              >
                INITIALIZE BOOKING
              </button>
            </div>
          </motion.div>
        ))}

        {filteredResources.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">No operational nodes detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
