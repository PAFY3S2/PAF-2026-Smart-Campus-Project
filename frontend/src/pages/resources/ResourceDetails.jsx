import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Building, Clock, MapPin, Users, CheckCircle, AlertTriangle, CalendarPlus, Wrench, XCircle, RefreshCcw } from 'lucide-react';
import resourceApi from '../../services/resourceApi';
import { resolveImage } from '../../utils/imageUtils';
import { toast } from 'sonner';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResource = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await resourceApi.getResourceById(id);
      setResource(data || null);
    } catch (err) {
      console.error('Failed to fetch resource:', err);
      setError('Unable to establish connection with the central database.');
      toast.error('Strategic fail: Unable to load asset profile');
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
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-[#F5AB24] border-t-[#142B5D] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Asset Dossier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl mx-auto mt-10 text-center">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-8 text-rose-500">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter mb-2">System Sync Failure</h3>
        <p className="text-sm font-medium text-slate-400 mb-10 max-w-sm">{error}</p>
        <button 
          onClick={fetchResource} 
          className="px-8 py-3 bg-[#142B5D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0D1E40] transition shadow-lg flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Reboot Connection</span>
        </button>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl mx-auto mt-10 text-center">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-8 text-rose-500">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter mb-2">Asset Not Found</h3>
        <p className="text-sm font-medium text-slate-400 mb-10 max-w-sm">The requested unit coordinates are invalid or the asset has been decommissioned from the grid.</p>
        <button 
          onClick={() => navigate('/resources')} 
          className="px-8 py-3 bg-[#142B5D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0D1E40] transition shadow-lg"
        >
          Return to Grid
        </button>
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
          bgClass: 'bg-emerald-500 text-white',
          overlayClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
        };
      case 'MAINTENANCE':
        return { 
          icon: <Wrench className="w-4 h-4" />, 
          text: 'Maintenance',
          bgClass: 'bg-amber-500 text-white',
          overlayClass: 'bg-amber-500/10 border-amber-500/20 text-amber-500'
        };
      case 'OUT_OF_SERVICE':
      default:
        return { 
          icon: <XCircle className="w-4 h-4" />, 
          text: 'Out of Service',
          bgClass: 'bg-rose-500 text-white',
          overlayClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500'
        };
    }
  };

  const badgeInfo = getStatusBadge(resource.status);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/resources')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md text-[#142B5D] dark:text-[#F5AB24] transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Resource Dossier</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Full Parameter Analysis</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header section with Image */}
        <div className="w-full h-80 md:h-[400px] relative overflow-hidden bg-slate-900">
          {resource.imageUrl ? (
            <img 
              src={resolveImage(resource.imageUrl)}
              className="w-full h-full object-cover opacity-60"
              alt={resource.name}
              onError={(e) => { e.target.src = "https://placehold.co/1200x800/142B5D/white?text=Institutional+Asset"; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#142B5D] to-[#0D1E40] flex flex-col items-center justify-center">
               <Building className="w-24 h-24 text-[#F5AB24] opacity-20 mb-4" />
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Grid Infrastructure</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B5D] via-transparent to-transparent opacity-80" />
          
          <div className="absolute inset-x-0 bottom-0 p-10 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
              <span className="inline-block px-4 py-1 bg-[#F5AB24] text-[#142B5D] text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                {resource.type}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{resource.name}</h2>
              <div className="flex items-center space-x-2 text-white/70 font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#F5AB24]" />
                <span>{resource.location}</span>
              </div>
            </div>
            <div className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center space-x-3 shadow-2xl backdrop-blur-md ${badgeInfo.overlayClass} bg-white/10 border-white/20`}>
              {badgeInfo.icon}
              <span>{badgeInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-12">
            <div>
              <h3 className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center">
                <div className="w-8 h-1 bg-[#F5AB24] mr-3 rounded-full"></div>
                Technical Specification
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <DetailItem 
                  icon={<Monitor className="w-6 h-6 text-[#142B5D] dark:text-[#F5AB24]" />}
                  label="Category"
                  value={resource.type}
                />
                <DetailItem 
                  icon={<Users className="w-6 h-6 text-[#142B5D] dark:text-[#F5AB24]" />}
                  label="Occupancy Limit"
                  value={resource.capacity ? `${resource.capacity} Attendees` : 'N/A'}
                />
                <DetailItem 
                  icon={<Clock className="w-6 h-6 text-[#142B5D] dark:text-[#F5AB24]" />}
                  label="Operational Window"
                  value={resource.availabilityStartTime && resource.availabilityEndTime 
                    ? `${formatTime(resource.availabilityStartTime)} - ${formatTime(resource.availabilityEndTime)}`
                    : 'Unspecified'}
                />
                <DetailItem 
                  icon={<CheckCircle className="w-6 h-6 text-[#142B5D] dark:text-[#F5AB24]" />}
                  label="Current Status"
                  value={badgeInfo.text}
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                 "This unit is part of the institutional infrastructure grid. All activities within this facility are subject to the standard operations protocol and safety guidelines."
               </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#142B5D] dark:bg-slate-800 rounded-3xl p-10 flex flex-col items-center text-center space-y-8 shadow-2xl shadow-[#142B5D]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5AB24] opacity-[0.05] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className={`p-5 rounded-2xl ${isAvailable ? 'bg-[#F5AB24] text-[#142B5D]' : 'bg-slate-700 text-slate-500'}`}>
                <CalendarPlus className="w-8 h-8" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Initiate Booking</h3>
                <p className="text-xs font-medium text-white/60 leading-relaxed">
                  {isAvailable 
                    ? "Secure this asset for your upcoming research or event requirements."
                    : "This unit is currently offline for calibration and cannot be reserved."}
                </p>
              </div>

              {!isAvailable && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Booking Vector Disabled
                </div>
              )}
              
              <button 
                onClick={() => isAvailable ? navigate('/bookings/new', { state: { resourceId: resource.id, resourceName: resource.name } }) : null}
                disabled={!isAvailable}
                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isAvailable ? 'bg-[#F5AB24] hover:bg-[#E0991F] text-[#142B5D]' : 'bg-slate-700 text-slate-600 cursor-not-allowed'}`}
              >
                Execute Reservation
              </button>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
              Authorized personnel only. Logs are kept for all asset reservations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-5 group">
    <div className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-slate-500 shadow-sm transition-all group-hover:border-[#F5AB24] group-hover:shadow-md">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-md font-black text-[#142B5D] dark:text-white tracking-tight leading-none">{value}</p>
    </div>
  </div>
);

export default ResourceDetails;
