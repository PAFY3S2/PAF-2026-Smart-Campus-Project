import React, { useState, useEffect } from 'react';
import { Search, Filter, Monitor, Building } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/shared/PageHeader';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DUMMY_RESOURCES = [
    { id: '1', name: 'Main Auditorium', type: 'ROOM', capacity: 300, location: 'Building A', status: 'ACTIVE' },
    { id: '2', name: 'Lab 402', type: 'LAB', capacity: 40, location: 'Building C', status: 'ACTIVE' },
    { id: '3', name: 'Projector XYZ', type: 'EQUIPMENT', location: 'IT Store', status: 'OUT_OF_SERVICE' },
    { id: '4', name: 'Smart Classroom 301', type: 'ROOM', capacity: 60, location: 'Building D', status: 'ACTIVE' },
    { id: '5', name: 'IoT Research Lab', type: 'LAB', capacity: 25, location: 'Building E', status: 'ACTIVE' },
    { id: '6', name: 'Advanced Robotics Lab', type: 'LAB', capacity: 15, location: 'Building F', status: 'ACTIVE' }
  ];

  useEffect(() => {
    setLoading(true);
    api.get('/resources')
      .then(res => {
        let data = res.data;
        if (!data || data.length === 0) {
          data = DUMMY_RESOURCES;
        }
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch resources, using dummy fallback:', err);
        setResources(DUMMY_RESOURCES);
        setLoading(false);
      });
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = (res.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || res.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-12 min-h-screen">
      <PageHeader 
        title="Campus Resources" 
        subtitle="Management & Booking for Lab Equipment and Rooms" 
        showBanner={true} 
      />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="ROOM">Room</option>
              <option value="LAB">Lab</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-[#F5AB24] border-t-[#142B5D] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Institutional Database...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-2xl text-center">
            <p className="text-rose-700 font-bold mb-4">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="bg-rose-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition"
            >
                Retry Connection
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${resource.type === 'EQUIPMENT' ? 'bg-[#F5AB24]/10 text-[#F5AB24]' : 'bg-[#142B5D]/10 text-[#142B5D] dark:bg-white/10 dark:text-white'}`}>
                  {resource.type === 'EQUIPMENT' ? <Monitor className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-tighter ${resource.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                  {(resource.status || 'UNKNOWN').replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#142B5D] dark:text-white mb-1 tracking-tighter">{resource.name}</h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4">{resource.location}</p>
              
              <div className="flex items-center text-sm text-slate-600 space-x-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ResourceType</span>
                  <span className="font-bold text-[#142B5D] dark:text-white">{resource.type}</span>
                </div>
                {resource.capacity && (
                  <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 pl-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                    <span className="font-bold text-[#142B5D] dark:text-white">{resource.capacity} people</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                className="w-full text-center text-xs font-black text-[#142B5D] dark:text-[#F5AB24] uppercase tracking-widest hover:opacity-75 transition-colors"
                onClick={() => {/* Navigate to booking prepopulated */}}
              >
                Initiate Booking
              </button>
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            No resources found matching your criteria.
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Resources;
