import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(res => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'REJECTED': return 'bg-rose-100 text-rose-800';
      case 'CANCELLED': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <Loader message="Loading bookings..." />
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-slate-500">You have no bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
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
                  <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                       {booking.resourceId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{booking.date}</div>
                      <div className="text-xs text-slate-400">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{booking.purpose}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.attendees}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
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
