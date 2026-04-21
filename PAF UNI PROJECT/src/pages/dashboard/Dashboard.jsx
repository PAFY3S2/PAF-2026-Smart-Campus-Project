import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, Ticket, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/resources'),
      api.get('/bookings'),
      api.get('/tickets')
    ]).then(([resRes, bookRes, tickRes]) => {
      setStats({
        resources: resRes.data.length,
        bookings: bookRes.data.length,
        tickets: tickRes.data.length
      });
    });
  }, []);

  const statCards = [
    { name: 'Total Resources', value: stats.resources, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    { name: 'Your Bookings', value: stats.bookings, icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { name: 'Active Tickets', value: stats.tickets, icon: Ticket, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex items-center space-x-4">
          <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Welcome back, {user.name}!</h2>
            <p className="text-slate-500 dark:text-slate-400">Role: <span className="font-semibold text-primary dark:text-indigo-400">{user.role}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center transition-colors">
            <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-400" />
            Recent Activity
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Dashboard charts will be rendered here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
