import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Building, Clock, MapPin, Users, CheckCircle, AlertTriangle, CalendarPlus, Wrench, XCircle, RefreshCcw } from 'lucide-react';
import resourceService from '../../services/resourceService';
import { resolveImage } from '../../utils/imageUtils';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResource = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await resourceService.getResourceById(id);
      setResource(data);
    } catch (err) {
      setError('Failed to load resource details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);



  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto mt-10">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Failed to Load Resource</p>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">{error || 'The requested resource could not be found or may have been deleted.'}</p>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/resources')} 
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition font-medium"
          >
            Return to Resources
          </button>
          <button 
            onClick={fetchResource}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg transition shadow-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = resource.status === 'ACTIVE';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          text: 'Available',
          bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400',
          overlayClass: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
        };
      case 'MAINTENANCE':
        return { 
          icon: <Wrench className="w-4 h-4" />, 
          text: 'Maintenance',
          bgClass: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400',
          overlayClass: 'bg-amber-500/20 border-amber-400/30 text-amber-300'
        };
      case 'OUT_OF_SERVICE':
      default:
        return { 
          icon: <XCircle className="w-4 h-4" />, 
          text: 'Out of Service',
          bgClass: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400',
          overlayClass: 'bg-rose-500/20 border-rose-400/30 text-rose-300'
        };
    }
  };

  const badgeInfo = getStatusBadge(resource.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <button 
          onClick={() => navigate('/resources')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition border border-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Resource Profile</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header section */}
        {resource.imageUrl ? (
          <div className="w-full h-64 md:h-80 relative overflow-hidden bg-slate-900">
            <img 
              src={resolveImage(resource.imageUrl)}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">{resource.name}</h2>
                <div className="flex items-center space-x-3 mt-2 text-slate-200 font-medium text-sm">
                  <span className="uppercase tracking-wider">{resource.type}</span>

                </div>
              </div>
              <span className={`px-4 py-2 text-sm font-bold rounded-full flex items-center space-x-2 border backdrop-blur-sm ${badgeInfo.overlayClass}`}>
                {badgeInfo.icon}
                <span>{badgeInfo.text}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-6">
              <div className={`p-5 rounded-2xl ${resource.type === 'EQUIPMENT' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                {resource.type === 'EQUIPMENT' ? <Monitor className="w-10 h-10" /> : <Building className="w-10 h-10" />}
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{resource.name}</h2>
                <div className="flex items-center space-x-3 mt-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                  <span className="uppercase tracking-wider">{resource.type}</span>

                </div>
              </div>
            </div>
            <span className={`px-4 py-2 text-sm font-bold rounded-full flex items-center space-x-2 border ${badgeInfo.bgClass}`}>
              {badgeInfo.icon}
              <span>{badgeInfo.text}</span>
            </span>
          </div>
        )}

        {/* Content section */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-5 gap-8 bg-slate-50/50 dark:bg-slate-900">
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Facility Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{resource.location}</p>
                </div>
              </div>

              {resource.capacity && (
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Maximum Capacity</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{resource.capacity} Attendees</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Availability Window</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {resource.availabilityStartTime && resource.availabilityEndTime 
                      ? `${formatTime(resource.availabilityStartTime)} - ${formatTime(resource.availabilityEndTime)}`
                      : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-5 border border-slate-200 dark:border-slate-700 shadow-sm h-full relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400 opacity-80" />
              
              <div className={`p-4 rounded-full ${isAvailable ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                <CalendarPlus className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Book This Resource</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {isAvailable 
                    ? "Schedule a session or reserve this facility for your upcoming requirements."
                    : resource.status === 'MAINTENANCE' 
                      ? "This resource is currently undergoing scheduled maintenance and is untrackable temporarily."
                      : "This resource is currently out of service and cannot be directly scheduled."}
                </p>
              </div>

              {!isAvailable && (
                <div className={`p-4 mt-2 mb-2 w-full text-left rounded-xl border text-sm font-medium ${
                  resource.status === 'MAINTENANCE' 
                    ? 'bg-amber-50/50 border-amber-200/60 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
                    : 'bg-rose-50/50 border-rose-200/60 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
                    <p>Booking operations disabled until system status returns to Active limits.</p>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => isAvailable ? navigate('/bookings/new', { state: { resourceId: resource.id, resourceName: resource.name } }) : null}
                disabled={!isAvailable}
                className={`w-full py-3.5 rounded-xl font-bold shadow-sm transition-all focus:ring-4 focus:ring-primary/20 mt-auto ${isAvailable ? 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5 text-white cursor-pointer active:translate-y-0' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'}`}
              >
                Secure Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
