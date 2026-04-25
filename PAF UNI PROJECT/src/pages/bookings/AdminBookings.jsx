import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Calendar } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    api.get('/bookings').then(res => {
      setBookings(res.data.sort((a,b) => b.id - a.id));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manage Bookings</h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {loading ? (
          <Loader message="Loading bookings..." />
        ) : bookings.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="No Bookings Found"
            message="There are currently no bookings in the system."
            containerClassName="py-16 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
          />
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
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-medium">User #{booking.userId}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Res #{booking.resourceId}</td>
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
