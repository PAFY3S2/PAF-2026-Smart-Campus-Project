import React, { useState, useEffect } from 'react';
import { Search, Filter, Monitor, Building, Plus, Pencil, Trash2, X, AlertCircle, Loader2, Power, Database, Activity, XCircle, CalendarPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import resourceService from '../../services/resourceService';
import Toast from '../../components/common/Toast';

const Resources = () => {
  const { user } = useAuth();
  
  // Debug Log for issue resolution
  console.log("Current user:", user);
  
  // Temporary fallback if role is undefined
  const isAdmin = !user?.role || user?.role === 'ADMIN';

  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [errorMessage, setErrorMessage] = useState('');
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
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchResources = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getAllResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('Unable to load resources. Please verify your connection.');
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

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const confirmDelete = (resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    const targetId = resourceToDelete.id;
    const backupResources = [...resources];
    
    // Optimistic UI state clear
    setResources(prev => prev.filter(r => r.id !== targetId));
    setDeleteModalOpen(false);
    
    try {
      await resourceService.deleteResource(targetId);
      setSuccessMessage('Resource deleted successfully!');
    } catch (err) {
      console.error('Failed to delete resource', err);
      setResources(backupResources); // Revert UI
      setErrorMessage('Failed to delete. Server rejected the request.');
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    const backupResources = [...resources];
    
    // Optimistic Mapping
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, status: newStatus } : r));
    
    try {
      await resourceService.updateResourceStatus(resource.id, newStatus);
      setSuccessMessage(`System status successfully mapped to ${newStatus === 'ACTIVE' ? 'Available' : 'Out of Service'}.`);
    } catch (err) {
      console.error('Failed to toggle status', err);
      setResources(backupResources); // Revert mapping
      setErrorMessage('Failed to alter system limits. Permission denied or disconnected.');
    }
  };

  const uniqueLocations = ['ALL', ...new Set(resources.map(r => r.location).filter(Boolean))];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || res.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || res.status === filterStatus;
    const matchesLocation = filterLocation === 'ALL' || res.location === filterLocation;
    const matchesCapacity = !minCapacity || (res.type !== 'EQUIPMENT' && res.capacity && res.capacity >= Number(minCapacity));
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesCapacity;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterType, filterStatus, filterLocation, minCapacity]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Loading Resources</h3>
        <p className="text-slate-500 font-medium">Fetching facility details securely...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Data Retrieval Failed</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => fetchResources(true)} 
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition font-medium shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast 
        message={errorMessage || successMessage} 
        type={errorMessage ? "error" : "success"}
        onClose={() => {
           setSuccessMessage('');
           setErrorMessage('');
           // Clear router state to prevent toast from reappearing on refresh
           if (location.state?.message) {
               window.history.replaceState({}, document.title);
           }
        }} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Facilities & Equipment</h1>
        {isAdmin && (
          <button 
            onClick={() => navigate('/resources/add')}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-hover hover:scale-105 active:scale-95 text-white px-4 py-2 rounded-lg transition-transform duration-200 shadow-md font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Resource</span>
          </button>
        )}
      </div>

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Resources</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.length}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Facilities</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.filter(r => r.status === 'ACTIVE').length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Out of Service</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.filter(r => r.status !== 'ACTIVE').length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Filter Bar */}
      <div className="sticky top-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search resources by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Resource Type</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="ROOM">Room</option>
                <option value="LAB">Lab</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Status</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Available Only</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Location</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'ALL' ? 'Any Location' : loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Min. Capacity</label>
              <input 
                type="number"
                placeholder="e.g. 20"
                value={minCapacity}
                disabled={filterType === 'EQUIPMENT'}
                onChange={(e) => setMinCapacity(e.target.value)}
                className={`w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100 transition ${filterType === 'EQUIPMENT' ? 'bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed opacity-70' : 'bg-white dark:bg-slate-800'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResources.map(resource => (
          <div 
            key={resource.id} 
            onClick={() => navigate(`/resources/${resource.id}`)}
            className="group block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200"
          >
            {resource.imageUrl && (
              <div className="w-full h-48 overflow-hidden border-b border-slate-100 dark:border-slate-800 relative">
                <img 
                  src={resource.imageUrl} 
                  alt={resource.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/800x400/1e293b/94a3b8?text=Image+Not+Available'; 
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${resource.type === 'EQUIPMENT' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                  {resource.type === 'EQUIPMENT' ? <Monitor className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                  {resource.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">{resource.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{resource.location}</p>
              
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 space-x-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Type</span>
                  <span className="font-medium">{resource.type}</span>
                </div>
                {resource.capacity && (
                  <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-4">
                    <span className="text-xs text-slate-400">Capacity</span>
                    <span className="font-medium">{resource.capacity} people</span>
                  </div>
                )}
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-4">
                  <span className="text-xs text-slate-400">Hours</span>
                  <span className="font-medium">{resource.availabilityStartTime || '08:00'} - {resource.availabilityEndTime || '18:00'}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-3">
                <button 
                  className="text-sm font-semibold text-primary hover:text-primary-hover transition"
                  onClick={(e) => { e.stopPropagation(); navigate(`/resources/${resource.id}`); }}
                  title="View Details"
                >
                  View Details
                </button>
                {resource.status === 'ACTIVE' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/bookings/new', { state: { resourceId: resource.id, resourceName: resource.name } }); }}
                    className="flex justify-center items-center p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition"
                    title="Book Now"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(resource); }}
                    className={`p-1.5 rounded transition ${resource.status === 'ACTIVE' ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30'}`}
                    title={resource.status === 'ACTIVE' ? 'Mark Out of Service' : 'Activate Resource'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/resources/edit/${resource.id}`); }}
                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                    title="Edit Resource"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); confirmDelete(resource); }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {!isLoading && !error && resources.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
               <Building className="w-12 h-12 text-slate-300 dark:text-slate-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Resources Found</h3>
             <p className="max-w-md">There are currently no active resources provisioned on the server network. Wait for an administrator to map new layouts.</p>
             {isAdmin && (
                <button onClick={(e) => {e.stopPropagation(); navigate('/resources/add');}} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm font-medium">Provision System</button>
             )}
          </div>
        )}

        {filteredResources.length === 0 && resources.length > 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
               <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No Matching Results</h3>
             <p>Try modifying your current filter combinations or lowering capacity constraints.</p>
             <button onClick={() => {setSearchTerm(''); setFilterType('ALL'); setFilterStatus('ALL'); setFilterLocation('ALL'); setMinCapacity('');}} className="mt-4 text-primary hover:underline font-medium">Clear All Filters</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 py-6">
          <button 
            onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium shadow-sm bg-white dark:bg-slate-900"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            Page <span className="font-bold text-slate-900 dark:text-slate-100">{currentPage}</span> of {totalPages}
          </span>
          <button 
            onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium shadow-sm bg-white dark:bg-slate-900"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-500">
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delete Resource</h3>
                </div>
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-slate-200">{resourceToDelete?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-rose-600 hover:bg-rose-700 transition flex items-center disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
