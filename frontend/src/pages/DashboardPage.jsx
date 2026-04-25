import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Ticket, 
  Bell, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  MapPin,
  CalendarDays
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const stats = [
    { label: 'Active Bookings', value: '3', icon: Calendar, color: 'bg-blue-500', trend: '+1 this week' },
    { label: 'Open Tickets', value: '1', icon: Ticket, color: 'bg-amber-500', trend: 'Resolved 2' },
    { label: 'Notifications', value: '5', icon: Bell, color: 'bg-purple-500', trend: '2 new today' },
  ];

  const quickActions = [
    { title: 'New Facility Booking', desc: 'Reserve labs, auditoriums, or equipment.', icon: CalendarDays, color: 'bg-blue-50' },
    { title: 'Report an Incident', desc: 'Submit maintenance or security requests.', icon: AlertCircle, color: 'bg-amber-50' },
    { title: 'View Schedule', desc: 'Check your upcoming campus events.', icon: Clock, color: 'bg-emerald-50' },
    { title: 'Institutional Map', desc: 'Find buildings and facilities.', icon: MapPin, color: 'bg-indigo-50' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-[#0c1b35] mb-2 tracking-tight">
              Greetings, {user?.name?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Calendar size={16} className="text-[#f7b924]" />
              {currentDate}
            </p>
          </div>
          <div className="bg-[#0c1b35] text-white px-6 py-4 rounded-[2rem] shadow-xl shadow-[#0c1b35]/20 flex items-center gap-4 group cursor-pointer hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full bg-[#f7b924] flex items-center justify-center text-[#0c1b35]">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Campus Status</p>
              <p className="text-sm font-bold">Systems Operational</p>
            </div>
            <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#0c1b35]">{stat.value}</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-1">{stat.trend}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Quick Actions (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0c1b35] uppercase tracking-widest">Quick Actions</h2>
              <button className="text-sm font-bold text-[#f7b924] hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`${action.color} p-6 rounded-[2rem] border border-black/5 hover:border-[#f7b924]/30 hover:shadow-xl hover:shadow-[#f7b924]/5 transition-all cursor-pointer group`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0c1b35] mb-4 shadow-sm group-hover:rotate-6 transition-transform">
                    <action.icon size={24} />
                  </div>
                  <h3 className="font-bold text-[#0c1b35] mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{action.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity / Notifications (Right 1/3) */}
          <div className="space-y-8">
            <h2 className="text-xl font-black text-[#0c1b35] uppercase tracking-widest">Recent Activity</h2>
            
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-6">
              {[1, 2, 3].map((item, index) => (
                <div key={item} className="flex gap-4 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#0c1b35] border border-gray-100 group-hover:bg-[#f7b924]/10 transition-colors">
                      <Clock size={18} />
                    </div>
                    {index !== 2 && <div className="absolute top-10 left-1/2 w-px h-10 bg-gray-100 -translate-x-1/2"></div>}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1">
                      {index === 0 ? 'Booking Confirmed' : index === 1 ? 'Ticket Updated' : 'System Alert'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      {index === 0 ? 'Auditorium reserved for May 12' : index === 1 ? 'Technical issue #402 resolved' : 'Server maintenance scheduled'}
                    </p>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">2 hours ago</span>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#0c1b35] rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                View Full Log
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
