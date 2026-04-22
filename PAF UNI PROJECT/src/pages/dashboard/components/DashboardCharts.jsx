import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer 
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const DashboardCharts = ({ resourcesData, bookingsData }) => {

  // Prepare Pie Chart Data (Active vs Out_of_Service)
  const pieData = useMemo(() => {
    let active = 0;
    let outOfService = 0;
    
    resourcesData.forEach(res => {
      if (res.status === 'ACTIVE') active++;
      else if (res.status === 'OUT_OF_SERVICE') outOfService++;
    });

    return [
      { name: 'Active', value: active, color: '#4f46e5' }, // indigo-600
      { name: 'Out of Service', value: outOfService, color: '#e11d48' }, // rose-600
    ];
  }, [resourcesData]);

  // Prepare Line Chart Data (Last 7 days bookings trend)
  const lineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { dateStr: format(d, 'yyyy-MM-dd'), display: format(d, 'MMM dd'), count: 0 };
    });

    bookingsData.forEach(booking => {
      if (!booking.date) return;
      const index = last7Days.findIndex(d => d.dateStr === booking.date);
      if (index !== -1) {
        last7Days[index].count++;
      }
    });

    return last7Days;
  }, [bookingsData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* Resource Status Pie Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Resource Status</h3>
        <div className="h-64 w-full min-w-0 min-h-0" style={{ position: 'relative' }}>
        {resourcesData.length > 0 ? (
          <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">No Resource Data</div>
        )}
        </div>
      </div>

      {/* Bookings Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Bookings Trend (Last 7 Days)</h3>
        <div className="h-64 w-full min-w-0 min-h-0" style={{ position: 'relative' }}>
        {bookingsData.length > 0 ? (
          <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="display" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <LineTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Bookings" 
                stroke="#10b981" // emerald-500
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">No Booking Data</div>
        )}
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
