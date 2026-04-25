import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Ticket } from 'lucide-react';
import Card, { CardBody } from '../../../components/common/Card';

const DashboardCards = ({ stats }) => {
  const navigate = useNavigate();
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
        <Card 
          key={stat.name} 
          hoverable
          onClick={() => navigate(stat.to)}
          className="group"
        >
          <CardBody className="flex items-center">
            <div className={`p-3 rounded-xl ${stat.bg} mr-5 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors mb-1">
                {stat.name}
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
