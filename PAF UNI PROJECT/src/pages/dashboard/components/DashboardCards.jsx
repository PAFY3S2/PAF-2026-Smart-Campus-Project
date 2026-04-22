import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Ticket } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  const statCards = [
    { 
      name: 'Total Resources', 
      value: stats.resources, 
      icon: Users, 
      color: 'text-indigo-600 dark:text-indigo-400', 
      bg: 'bg-indigo-100 dark:bg-indigo-900/50',
      to: '/resources'
    },
    { 
      name: 'Your Bookings', 
      value: stats.bookings, 
      icon: Calendar, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-100 dark:bg-emerald-900/50',
      to: '/bookings'
    },
    { 
      name: 'Active Tickets', 
      value: stats.tickets, 
      icon: Ticket, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-100 dark:bg-amber-900/50',
      to: '/tickets'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <Link 
          key={stat.name} 
          to={stat.to}
          className="group block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bg} mr-4 transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardCards;
