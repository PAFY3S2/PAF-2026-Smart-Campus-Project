import React from 'react';
import { Activity, CalendarPlus, PackagePlus, AlertTriangle } from 'lucide-react';

const ActivityFeed = () => {
  // Hardcoded mock actions as per requirements for now.
  // In a real app, this would be fetched from an activity log endpoint.
  const activities = [
    { id: 1, action: 'Resource added', item: 'Lab 402', timeAgo: '2 hours ago', type: 'RESOURCE', icon: PackagePlus, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { id: 2, action: 'Booking created', item: 'Main Auditorium', timeAgo: '5 hours ago', type: 'BOOKING', icon: CalendarPlus, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 3, action: 'Ticket raised', item: 'Projector Issue', timeAgo: '1 day ago', type: 'TICKET', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' },
    { id: 4, action: 'Resource deleted', item: 'Old Chair', timeAgo: '2 days ago', type: 'DANGER', icon: Activity, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400' },
    { id: 5, action: 'Booking updated', item: 'Meeting Room 1', timeAgo: '3 days ago', type: 'BOOKING', icon: CalendarPlus, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6 h-full">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center text-sm uppercase tracking-wider">
        <Activity className="w-4 h-4 mr-2" />
        Recent Activity
      </h3>
      
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative pl-4">
            {/* Timeline line connecting items */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[1.3rem] top-8 bottom-[-1.5rem] w-px bg-slate-200 dark:bg-slate-700"></div>
            )}
            
            <div className="flex items-start">
              <div className={`p-2 rounded-full z-10 ${activity.color} mr-4`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {activity.action}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activity.item}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {activity.timeAgo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
