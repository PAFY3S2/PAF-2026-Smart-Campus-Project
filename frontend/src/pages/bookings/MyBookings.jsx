import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/shared/PageHeader';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    
    Promise.all([
      api.get(`/bookings/user/${user.id}`),
      api.get('/resources')
    ]).then(([bookingsRes, resourcesRes]) => {
      const resources = resourcesRes.data;
      const mappedBookings = bookingsRes.data.map(booking => {
        const resourceObj = resources.find(r => r.id === booking.resourceId);
        return {
          ...booking,
          resourceId: resourceObj || { name: 'Unknown Resource', type: 'UNKNOWN' }
        };
      });
      setBookings(mappedBookings);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'PENDING': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'REJECTED': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      case 'CANCELLED': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Reservations" subtitle="Tracking your academic resource usage" />

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-black uppercase tracking-widest animate-pulse">Retrieving Bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50">
            <p className="text-xs font-black uppercase tracking-widest opacity-30">No facility reservations identified</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Resource ID</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Purpose</th>
                  <th className="px-6 py-4 font-medium">Attendees</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black text-[#142B5D] dark:text-[#F5AB24] uppercase tracking-tighter">
                        {booking.resourceId?.name || 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {booking.resourceId?.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="font-bold text-[#142B5D] dark:text-white">{booking.date}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{booking.purpose}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-black">{booking.attendees}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded font-black text-[9px] uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.statusReason && (
                        <div className={`text-[10px] mt-2 font-bold uppercase tracking-tight ${
                          booking.status === 'REJECTED' ? 'text-rose-500' : 
                          booking.status === 'APPROVED' ? 'text-emerald-500' : 
                          'text-slate-400'
                        }`}>
                          Note: {booking.statusReason}
                        </div>
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

export default MyBookings;
