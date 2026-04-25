import React from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

const RequesterDetails = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">REQUESTER DETAILS</h4>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
           {user.avatar ? (
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-[#142B5D] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
             </div>
           )}
        </div>
        <div>
           <h3 className="text-[17px] font-bold text-[#142B5D] dark:text-white leading-tight">{user.name}</h3>
           <p className="text-[12px] font-medium text-slate-500 mt-0.5">{user.faculty || user.department} • {user.studentId || user.role}</p>
        </div>
      </div>

      <div className="space-y-5">
        <DetailItem icon={Mail} value={user.email} />
        <DetailItem icon={Phone} value={user.phoneNumber || 'No contact provided'} />
        <DetailItem icon={MapPin} value={user.faculty || 'No faculty info'} />
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, value }) => (
  <div className="flex items-center space-x-3 text-[14px] font-medium text-[#0E4DA4] dark:text-blue-400">
    <Icon className="w-5 h-5 text-slate-500" />
    <span className="truncate">{value}</span>
  </div>
);

export default RequesterDetails;
