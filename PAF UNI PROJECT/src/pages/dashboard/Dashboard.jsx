import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Components
import DashboardCards from './components/DashboardCards';
import QuickActions from './components/QuickActions';
import DashboardCharts from './components/DashboardCharts';
import ActivityFeed from './components/ActivityFeed';
import SystemStatus from './components/SystemStatus';
import Card, { CardBody } from '../../components/common/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // States
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });
  const [resourcesData, setResourcesData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/resources').catch(() => ({ data: [] })),
      api.get('/bookings').catch(() => ({ data: [] })),
      api.get('/tickets').catch(() => ({ data: [] }))
    ]).then(([resRes, bookRes, tickRes]) => {
      setStats({
        resources: resRes.data.length,
        bookings: bookRes.data.length,
        tickets: tickRes.data.length
      });
      setResourcesData(resRes.data);
      setBookingsData(bookRes.data);
    }).catch(err => {
      console.error("Error fetching dashboard data:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
      </div>
      
      {/* Welcome Card & Quick Actions Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <Card className="lg:col-span-1 flex flex-col justify-center h-full">
          <CardBody className="flex items-center space-x-5">
            <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700 shadow-sm" />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Welcome back, {user.name}!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Role: <span className="text-primary">{user.role}</span></p>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-2">
           <QuickActions role={user.role} />
        </div>

      </div>

      {/* Main Dashboard Stats Cards */}
      <DashboardCards stats={stats} />

      {/* Real Dashboard Charts */}
      <DashboardCharts resourcesData={resourcesData} bookingsData={bookingsData} />

      {/* Two Column Layout for Status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
