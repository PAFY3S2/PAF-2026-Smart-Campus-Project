import React, { useState, useEffect } from 'react';
import { Server, Database, Activity, CheckCircle2 } from 'lucide-react';

const SystemStatus = () => {
  const [uptime, setUptime] = useState('');

  // Mock uptime calculation
  useEffect(() => {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 144); // Fake 6 days uptime
    
    const calculateUptime = () => {
      const now = new Date();
      const diff = now - startTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      setUptime(`${days}d ${hours}h ${minutes}m`);
    };

    calculateUptime();
    const interval = setInterval(calculateUptime, 60000);
    return () => clearInterval(interval);
  }, []);

  const statuses = [
    { name: 'API Server', status: 'Operational', icon: Server, color: 'text-emerald-500' },
    { name: 'Database', status: 'Operational', icon: Database, color: 'text-emerald-500' },
    { name: 'Services', status: 'Operational', icon: Activity, color: 'text-emerald-500' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center text-sm uppercase tracking-wider">
          <Server className="w-4 h-4 mr-2" />
          System Status
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          All Systems Go
        </span>
      </div>

      <div className="space-y-4">
        {statuses.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center text-sm">
              <item.icon className="w-4 h-4 mr-3 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`${item.color} font-medium mr-2`}>{item.status}</span>
              <CheckCircle2 className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Server Uptime</span>
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{uptime}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
