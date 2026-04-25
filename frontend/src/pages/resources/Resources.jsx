import React, { useState, useEffect } from 'react';
import { Search, Filter, Monitor, Building, Plus, Pencil, Trash2, X, AlertCircle, Loader2, Power, Database, Activity, XCircle, CalendarPlus, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import resourceApi from '../../services/resourceApi';
import { resolveImage } from '../../utils/imageUtils';
import { toast } from 'sonner';

const Resources = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const navigate = useNavigate();
  const location = useLocation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [minCapacity, setMinCapacity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchResources = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const { data } = await resourceApi.getAllResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      toast.error('Unable to sync institutional assets');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const confirmDelete = (resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    try {
      await resourceApi.deleteResource(resourceToDelete.id);
      setResources(prev => prev.filter(r => r.id !== resourceToDelete.id));
      setDeleteModalOpen(false);
      toast.success('Asset decommissioned successfully');
    } catch (err) {
      toast.error('Strategic failure: Access denied to system deletion');
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await resourceApi.updateResourceStatus(resource.id, newStatus);
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, status: newStatus } : r));
      toast.success(`System mapped to ${newStatus}`);
    } catch (err) {
      toast.error('Communication error: Failed to toggle unit status');
    }
  };

  const uniqueLocations = ['ALL', ...new Set(resources.map(r => r.location).filter(Boolean))];

  const filteredResources = resources.filter(res => {
    const matchesSearch = (res.name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || res.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || res.status === filterStatus;
    const matchesLocation = filterLocation === 'ALL' || res.location === filterLocation;
    const matchesCapacity = !minCapacity || (res.type !== 'EQUIPMENT' && res.capacity && res.capacity >= Number(minCapacity));
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesCapacity;
  });

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-[#F5AB24] border-t-[#142B5D] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Facility Grid...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tighter uppercase mb-1">Facilities & Equipment</h1>
           <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Institutional Operations Dashboard</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin/resources/add')}
            className="flex items-center justify-center space-x-2 bg-[#142B5D] hover:bg-[#0D1E40] text-white px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xl shadow-[#142B5D]/20 text-[10px] font-black uppercase tracking-widest active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Resource</span>
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          icon={<Database className="w-6 h-6" />} 
          label="Total Resources" 
          value={resources.length} 
          color="bg-blue-500" 
          onClick={() => { setFilterStatus('ALL'); setFilterType('ALL'); }}
        />
        <StatCard 
          icon={<Activity className="w-6 h-6" />} 
          label="Active Facilities" 
          value={resources.filter(r => r.status === 'ACTIVE').length} 
          color="bg-emerald-500"
          onClick={() => setFilterStatus('ACTIVE')}
        />
        <StatCard 
          icon={<XCircle className="w-6 h-6" />} 
          label="Out of Service" 
          value={resources.filter(r => r.status !== 'ACTIVE').length} 
          color="bg-rose-500"
          onClick={() => setFilterStatus('OUT_OF_SERVICE')}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#F5AB24] transition-colors" />
            <input 
              type="text" 
              placeholder="Search resource infrastructure by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-[#F5AB24] text-[#142B5D] dark:text-white rounded-xl outline-none transition-all font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FilterSelect label="Resource Type" value={filterType} onChange={setFilterType}>
              <option value="ALL">All Systems</option>
              <option value="ROOM">Room / Hall</option>
              <option value="LAB">Research Lab</option>
              <option value="EQUIPMENT">Digital Gear</option>
            </FilterSelect>

            <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">System Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="MAINTENANCE">In Maintenance</option>
            </FilterSelect>

            <FilterSelect label="Location" value={filterLocation} onChange={setFilterLocation}>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc === 'ALL' ? 'Any Campus Sector' : loc}</option>
              ))}
            </FilterSelect>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min. Capacity</label>
              <input 
                type="number"
                placeholder="e.g. 20"
                value={minCapacity}
                disabled={filterType === 'EQUIPMENT'}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-[#F5AB24] px-4 py-3 text-sm font-bold rounded-xl outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentResources.map(resource => (
          <ResourceCard 
            key={resource.id} 
            resource={resource} 
            isAdmin={isAdmin}
            onToggleStatus={() => handleToggleStatus(resource)}
            onDelete={() => confirmDelete(resource)}
            onEdit={() => navigate(`/admin/resources/edit/${resource.id}`)}
            onView={() => navigate(`/resources/${resource.id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-800">
             <div className="bg-slate-50 dark:bg-slate-800 rounded-full p-8 mb-6">
               <Building className="w-16 h-16 text-slate-200 dark:text-slate-700" />
             </div>
             <h3 className="text-2xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter mb-2">Zero Assets Found</h3>
             <p className="text-sm font-medium text-slate-400 max-w-sm px-8">No infrastructure units match your current operational parameters. Adjust filters or provision new units.</p>
          </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 py-12">
          <PageBtn 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            label="Previous Sector"
          />
          <div className="px-6 py-3 bg-[#142B5D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#142B5D]/20">
            Page {currentPage} of {totalPages}
          </div>
          <PageBtn 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            label="Next Sector"
          />
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal 
          resourceName={resourceToDelete?.name}
          isDeleting={isDeleting}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex items-center space-x-5">
      <div className={`p-4 rounded-xl ${color.replace('bg-', 'bg-opacity-10 text-')} text-white flex items-center justify-center transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-[#142B5D] dark:text-white tracking-tighter">{value}</p>
      </div>
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    <select
      className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-[#F5AB24] px-4 py-3 text-sm font-bold rounded-xl outline-none transition-all cursor-pointer appearance-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

const ResourceCard = ({ resource, isAdmin, onToggleStatus, onDelete, onEdit, onView }) => (
  <div 
    onClick={onView}
    className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:border-[#F5AB24]/30 hover:-translate-y-2 cursor-pointer transition-all duration-500 relative z-0"
  >
    <div className="w-full h-56 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
      {resource.imageUrl ? (
        <img 
          src={resolveImage(resource.imageUrl)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={resource.name}
          onError={(e) => { e.target.src = "https://placehold.co/600x400/142B5D/white?text=Campus+Facility"; }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Static Asset</span>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md ${resource.status === 'ACTIVE' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
          {resource.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
    
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2.5 rounded-lg shadow-sm ${resource.type === 'EQUIPMENT' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
          {resource.type === 'EQUIPMENT' ? <Monitor className="w-5 h-5" /> : <Building className="w-5 h-5" />}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{resource.type}</span>
      </div>
      
      <h3 className="text-2xl font-black text-[#142B5D] dark:text-white mb-2 tracking-tighter transition-colors group-hover:text-[#F5AB24]">{resource.name}</h3>
      <p className="text-xs font-bold text-slate-400 mb-8 flex-1 line-clamp-2">{resource.location}</p>
      
      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
        {resource.capacity && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Capacity</span>
            <span className="text-sm font-black text-[#142B5D] dark:text-white">{resource.capacity} PAX</span>
          </div>
        )}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Hours</span>
          <span className="text-sm font-black text-[#142B5D] dark:text-white">{resource.availabilityStartTime || '08:00'} - {resource.availabilityEndTime || '18:00'}</span>
        </div>
      </div>
    </div>

    <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        className="text-[10px] font-black text-[#142B5D] dark:text-[#F5AB24] uppercase tracking-widest hover:underline"
        onClick={(e) => { e.stopPropagation(); onView(); }}
      >
        View Core Details
      </button>
      
      {isAdmin && (
        <div className="flex items-center space-x-3">
          <CardAction icon={<Power className="w-4 h-4" />} onClick={onToggleStatus} title="Toggle Ops" color="text-emerald-500" />
          <CardAction icon={<Pencil className="w-4 h-4" />} onClick={onEdit} title="Edit Asset" color="text-[#142B5D]" />
          <CardAction icon={<Trash2 className="w-4 h-4" />} onClick={onDelete} title="Purge" color="text-rose-500" />
        </div>
      )}
    </div>
  </div>
);

const CardAction = ({ icon, onClick, title, color }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${color} hover:bg-[#142B5D] hover:text-white transition-all transform hover:scale-110`}
    title={title}
  >
    {icon}
  </button>
);

const PageBtn = ({ onClick, disabled, label }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-white disabled:opacity-30 hover:border-[#F5AB24] transition-all shadow-sm active:scale-95"
  >
    {label}
  </button>
);

const DeleteModal = ({ resourceName, isDeleting, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#142B5D]/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-10 text-center">
        <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 text-rose-600">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter mb-4">Decommission Asset?</h3>
        <p className="text-sm font-medium text-slate-400 mb-10 px-4">
          Are you sure you want to purge <span className="text-[#142B5D] dark:text-[#F5AB24] font-black">"{resourceName}"</span>? This operation will permanently erase the unit from the institutional network.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition"
            disabled={isDeleting}
          >
            Abort
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Purging...' : 'Confirm Purge'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Resources;
