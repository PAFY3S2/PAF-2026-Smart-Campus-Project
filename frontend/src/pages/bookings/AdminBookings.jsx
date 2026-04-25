import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

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
      if (reason === null) return; // Cancel if user clicked cancel
    }

    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus, reason });
      fetchBookings(); // Refresh list
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
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">User ID</th>
                  <th className="px-6 py-4 font-medium">Resource ID</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Purpose</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-medium">{typeof booking.userId === 'object' && booking.userId ? booking.userId.name : `User #${booking.userId}`}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{typeof booking.resourceId === 'object' && booking.resourceId ? booking.resourceId.name : `Res #${booking.resourceId}`}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div>{booking.date}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={booking.purpose}>
                      {booking.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold 
                        ${booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 
                          booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                          booking.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 
                          'bg-slate-100 text-slate-800'}`}
                      >
                        {booking.status}
                      </span>
                      {booking.rejectionReason && (
                        <div className="text-[10px] text-rose-500 mt-1 italic max-w-[150px] truncate" title={booking.rejectionReason}>
                          Reason: {booking.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                            className="inline-flex items-center text-rose-600 hover:text-rose-700 transition"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {booking.status === 'APPROVED' && (
                        <button 
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          className="text-xs text-slate-500 hover:text-slate-700 underline"
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
    </div>
  );
};

export default AdminBookings;
