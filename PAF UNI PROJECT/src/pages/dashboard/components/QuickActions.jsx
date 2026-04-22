import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CalendarPlus, TicketPlus, UserCog } from 'lucide-react';

const QuickActions = ({ role }) => {
  // Base actions visible to all users
  const actions = [
    {
      name: 'Create Booking',
      icon: CalendarPlus,
      to: '/bookings',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
    },
    {
      name: 'Raise Ticket',
      icon: TicketPlus,
      to: '/tickets',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/50'
    }
  ];

  // Admin specific actions
  if (role === 'ADMIN') {
    actions.unshift(
      {
        name: 'Add Resource',
        icon: PlusCircle,
        to: '/resources', // Or a specific add resource route if one exists
        color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
      },
      {
        name: 'Manage Users',
        icon: UserCog,
        to: '/users',
        color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
        hoverColor: 'hover:bg-rose-100 dark:hover:bg-rose-900/50'
      }
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.to}
            className={`flex items-center p-3 rounded-lg border border-transparent transition-all duration-300 ${action.color} ${action.hoverColor} hover:scale-105 active:scale-95`}
          >
            <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium text-sm">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
