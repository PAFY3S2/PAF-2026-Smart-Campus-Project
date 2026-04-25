import React, { useState, useEffect } from 'react';
import { Search, Filter, Monitor, Building, Plus, Pencil, Trash2, X, AlertCircle, Loader2, Power, Database, Activity, XCircle, CalendarPlus, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import resourceService from '../../services/resourceService';
import Toast from '../../components/common/Toast';
import { resolveImage } from '../../utils/imageUtils';
import Loader from '../../components/common/Loader';

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
    fetchResources().then(() => {
      // Ensure correct mapping after POST
      if (location.state?.newResource) {
        setResources(prev => {
          if (!prev.find(r => r.id === location.state.newResource.id)) {
            return [...prev, location.state.newResource];
          }
          return prev;
        });
      }
    });
  }, [location.state]);

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
    return <Loader message="Fetching facility details securely..." />;
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
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md font-medium z-10"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Resource</span>
          </button>
        )}
      </div>

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div 
            onClick={() => { setFilterStatus('ALL'); setFilterType('ALL'); }}
            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-transform group-hover:scale-110">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Resources</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.length}</p>
            </div>
          </div>
          
          <div 
            onClick={() => setFilterStatus('ACTIVE')}
            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4"
          >
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-transform group-hover:scale-110">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Facilities</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.filter(r => r.status === 'ACTIVE').length}</p>
            </div>
          </div>

          <div 
            onClick={() => setFilterStatus('OUT_OF_SERVICE')}
            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-rose-300 transition-all duration-300 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4"
          >
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl transition-transform group-hover:scale-110">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Out of Service</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resources.filter(r => r.status !== 'ACTIVE').length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar - Removed excessive sticky behavior and fixed spacing */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 block z-0">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search resources by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Resource Type</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="ROOM">Room</option>
                <option value="LAB">Lab</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Status</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Available Only</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center"><Filter className="w-3 h-3 mr-1"/> Location</label>
              <select
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'ALL' ? 'Any Location' : loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Min. Capacity</label>
              <input 
                type="number"
                placeholder="e.g. 20"
                value={minCapacity}
                disabled={filterType === 'EQUIPMENT'}
                onChange={(e) => setMinCapacity(e.target.value)}
                className={`w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100 transition shadow-sm ${filterType === 'EQUIPMENT' ? 'bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed opacity-70' : 'bg-white dark:bg-slate-800'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {currentResources.map(resource => {
          return (
          <div 
            key={resource.id} 
            onClick={() => navigate(`/resources/${resource.id}`)}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 relative z-0"
          >
            {/* Image Container */}
            <div className="w-full h-48 overflow-hidden rounded-t-2xl border-b border-slate-100 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {resource.imageUrl ? (
                <>
                  <img 
                    src={resolveImage(resource.imageUrl)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/e2e8f0/475569?text=No+Image+Available";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={resource.name}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-full w-full">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                  <span className="text-sm font-medium">No Image Available</span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl shadow-sm flex items-center justify-center ${resource.type === 'EQUIPMENT' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                  {resource.type === 'EQUIPMENT' ? <Monitor className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm ${resource.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                  {resource.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">{resource.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">{resource.location}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Type</span>
                  <span className="font-medium">{resource.type}</span>
                </div>
                {resource.capacity && (
                  <div className="flex flex-col items-center border-l border-slate-200 dark:border-slate-700 w-1/3">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Capacity</span>
                    <span className="font-medium">{resource.capacity} people</span>
                  </div>
                )}
                <div className="flex flex-col items-end border-l border-slate-200 dark:border-slate-700 pl-4 w-1/3 text-right">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Hours</span>
                  <span className="font-medium">{resource.availabilityStartTime || '08:00'} - {resource.availabilityEndTime || '18:00'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center relative z-10 transition-colors">
              <div className="flex items-center space-x-3">
                <button 
                  className="text-sm font-bold text-primary hover:text-primary-hover hover:underline transition"
                  onClick={(e) => { e.stopPropagation(); navigate(`/resources/${resource.id}`); }}
                >
                  View Details
                </button>
                {resource.status === 'ACTIVE' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/bookings/new', { state: { resourceId: resource.id, resourceName: resource.name } }); }}
                    className="flex justify-center items-center p-2 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg transition-all shadow-sm"
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
                    className={`p-2 rounded-lg transition-all shadow-sm ${resource.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-500 hover:bg-emerald-500 hover:text-white dark:bg-slate-800'}`}
                    title={resource.status === 'ACTIVE' ? 'Mark Out of Service' : 'Activate Resource'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/resources/edit/${resource.id}`); }}
                    className="p-2 text-slate-500 hover:text-white hover:bg-primary bg-slate-100 dark:bg-slate-800 rounded-lg transition-all shadow-sm"
                    title="Edit Resource"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); confirmDelete(resource); }}
                    className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 dark:bg-rose-900/30 rounded-lg transition-all shadow-sm"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          );
        })}
        
        {!isLoading && !error && resources.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
               <Building className="w-12 h-12 text-slate-300 dark:text-slate-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Resources Found</h3>
             <p className="max-w-md">There are currently no active resources provisioned on the server network. Wait for an administrator to map new layouts.</p>
             {isAdmin && (
                <button onClick={(e) => {e.stopPropagation(); navigate('/resources/add');}} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-md font-medium">Provision System</button>
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
             <button onClick={() => {setSearchTerm(''); setFilterType('ALL'); setFilterStatus('ALL'); setFilterLocation('ALL'); setMinCapacity('');}} className="mt-5 px-5 py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition font-medium">Clear All Filters</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 py-8">
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
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
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

      {/* Delete Confirmation Modal - z-indices intact */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden transform scale-100 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-500">
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-full">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delete Resource</h3>
                </div>
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition rounded-full p-1.5"
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
                  className="px-5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg font-medium text-white bg-rose-600 hover:bg-rose-700 transition flex items-center disabled:opacity-50 shadow-md"
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
