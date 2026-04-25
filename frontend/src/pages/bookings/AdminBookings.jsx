import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Eye, User, Building, Calendar, Users, Info, X, Clock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { getImageUrl } from '../../utils/imageUtils';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = () => {
    Promise.all([
      api.get('/bookings'),
      api.get('/resources'),
      api.get('/admin/users')
    ]).then(([bookingsRes, resourcesRes, usersRes]) => {
      const resources = resourcesRes.data;
      const users = usersRes.data;
      
      const mappedBookings = bookingsRes.data.map(booking => {
        const resourceObj = resources.find(r => r.id === booking.resourceId);
        const userObj = users.find(u => u.id === booking.userId);
        return {
          ...booking,
          resourceId: resourceObj || booking.resourceId,
          userId: userObj || booking.userId
        };
      });
      
      setBookings(mappedBookings.sort((a,b) => (b.id || '').localeCompare(a.id || '')));
      setFilteredBookings(mappedBookings);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];
    
    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }
    
    if (searchTerm) {
      result = result.filter(b => {
        const resourceName = typeof b.resourceId === 'object' ? b.resourceId.name : '';
        const userName = typeof b.userId === 'object' ? b.userId.name : '';
        return resourceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               userName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    setFilteredBookings(result);
  }, [statusFilter, searchTerm, bookings]);

  const handleUpdateStatus = async (id, newStatus) => {
    let reason = null;
    if (newStatus === 'REJECTED') {
      reason = window.prompt('Please enter a reason for rejection:');
      if (reason === null) return;
    } else if (newStatus === 'APPROVED') {
      reason = window.prompt('Please enter a note/reason for approval (Optional):');
    }

    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus, reason });
      fetchBookings(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reservation Map" subtitle="Global oversight of institutional resource allocation" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex-1">
          <input 
            type="text"
            placeholder="Search by resource or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">No matching bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">User</th>
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Purpose</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-medium">
                      {typeof booking.userId === 'object' && booking.userId ? booking.userId.name : `User #${booking.userId}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {typeof booking.resourceId === 'object' && booking.resourceId ? booking.resourceId.name : `Res #${booking.resourceId}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div className="font-bold">{booking.date}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={booking.purpose}>
                      {booking.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                          booking.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : 
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}
                      >
                        {booking.status}
                      </span>
                      {booking.statusReason && (
                        <div className={`text-[10px] mt-1 italic max-w-[150px] truncate ${booking.status === 'REJECTED' ? 'text-rose-500' : 'text-emerald-500'}`} title={booking.statusReason}>
                          Note: {booking.statusReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition"
                        title="Review Details"
                      >
                        <Eye size={18} />
                      </button>

                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                            className="inline-flex items-center text-rose-600 hover:text-rose-700 transition"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {booking.status === 'APPROVED' && (
                        <button 
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <div>
                 <h3 className="text-xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Reservation Dossier</h3>
                 <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-widest">Detailed Audit Review</p>
               </div>
               <button 
                 onClick={() => setSelectedBooking(null)}
                 className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
               >
                 <X size={20} className="text-slate-500" />
               </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <DetailItem icon={<User size={16} />} label="Applicant" value={typeof selectedBooking.userId === 'object' ? selectedBooking.userId.name : selectedBooking.userId} />
                  <DetailItem icon={<Building size={16} />} label="Target Resource" value={typeof selectedBooking.resourceId === 'object' ? selectedBooking.resourceId.name : selectedBooking.resourceId} />
                  <DetailItem icon={<Calendar size={16} />} label="Scheduled Date" value={selectedBooking.date} />
                  <DetailItem icon={<Clock size={16} />} label="Time Window" value={`${selectedBooking.startTime} - ${selectedBooking.endTime}`} />
                  <DetailItem icon={<Users size={16} />} label="Expected Attendees" value={`${selectedBooking.attendees || 1} Persons`} />
                  <DetailItem icon={<Info size={16} />} label="Current Status" value={selectedBooking.status} isStatus status={selectedBooking.status} />
               </div>

               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Purpose</h4>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedBooking.purpose}
                  </div>
               </div>

               {selectedBooking.images && selectedBooking.images.length > 0 && (
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Evidence</h4>
                    <div className="flex flex-wrap gap-4">
                       {selectedBooking.images.map((img, i) => (
                         <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 group relative cursor-pointer" onClick={() => window.open(getImageUrl(img), '_blank')}>
                            <img src={getImageUrl(img)} alt="Evidence" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                               <Eye size={16} className="text-white" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {selectedBooking.statusReason && (
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Notes</h4>
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                      selectedBooking.status === 'REJECTED' ? 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400'
                    }`}>
                       <Info size={16} className="mt-0.5 shrink-0" />
                       <span className="text-sm font-bold italic">{selectedBooking.statusReason}</span>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
               <button 
                 onClick={() => setSelectedBooking(null)}
                 className="px-8 py-3 bg-[#142B5D] hover:bg-[#0D1E40] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-[#142B5D]/20"
               >
                 Close Analysis
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value, isStatus, status }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 text-slate-400">
       {icon}
       <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {isStatus ? (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
        status === 'APPROVED' ? 'bg-emerald-500 text-white' : 
        status === 'PENDING' ? 'bg-amber-500 text-white' : 
        status === 'REJECTED' ? 'bg-rose-500 text-white' : 
        'bg-slate-500 text-white'
      }`}>
        {status}
      </span>
    ) : (
      <p className="text-sm font-black text-[#142B5D] dark:text-slate-200 tracking-tight">{value}</p>
    )}
  </div>
);

export default AdminBookings;
