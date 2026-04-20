import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Wrench, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock,
  Camera,
  CheckCircle2,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const TechnicianProfile = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  const profileData = {
    phone: '+94771234321',
    department: 'Maintenance',
    expertise: 'Hardware',
    locations: 'All Campus Buildings',
    workingHours: '08:00 AM - 05:00 PM',
    lastLogin: '4/18/2026 (Sri Lanka)'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#142B5D] dark:text-white tracking-tighter mb-1 uppercase leading-none">Security & Profile</h1>
           <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.25em]">Manage Your Institutional Identity</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#F5AB24]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F5AB24]">Secure Session Active</span>
           </div>

           <button 
             onClick={() => setIsAvailable(!isAvailable)}
             className={clsx(
               "flex items-center space-x-3 px-6 py-2.5 rounded-xl border-2 transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
               isAvailable 
                 ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                 : "bg-slate-500/10 border-slate-500/50 text-slate-500"
             )}
           >
              <div className={clsx("w-2 h-2 rounded-full animate-pulse", isAvailable ? "bg-emerald-500" : "bg-slate-500")}></div>
              <span>{isAvailable ? 'Available for Assignment' : 'Currently Unavailable'}</span>
              {isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: STATUS & AVATAR */}
        <div className="space-y-8">
           <div className="bg-[#142B5D] rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl shadow-[#142B5D]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative mb-8">
                 <div className="w-40 h-40 rounded-full bg-white p-1.5 border-4 border-[#F5AB24] shadow-2xl overflow-hidden flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="bg-[#142B5D] w-full h-full rounded-full flex items-center justify-center text-white">
                        <User className="w-20 h-20" />
                      </div>
                    )}
                 </div>
                 <button className="absolute bottom-2 right-2 p-2.5 bg-[#142B5D] border-2 border-white rounded-full text-[#F5AB24] hover:bg-[#F5AB24] hover:text-[#142B5D] transition-all shadow-xl">
                    <Camera className="w-4 h-4" />
                 </button>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">{user?.name || 'Technician'}</h2>
              <p className="text-white/50 text-xs font-medium mb-8 leading-none tracking-tight">{user?.email}</p>

              <div className="flex items-center space-x-3 w-full">
                 <div className="flex-1 py-3 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    Technician
                 </div>
                 <div className="flex-1 py-3 bg-[#F5AB24] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#142B5D]">
                    Validated
                 </div>
              </div>
           </div>

           <div className="bg-[#142B5D] rounded-3xl p-8 shadow-xl shadow-[#142B5D]/10">
              <div className="flex items-center space-x-3 mb-6">
                 <ShieldCheck className="w-5 h-5 text-[#F5AB24]" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Access Level</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                 <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Last Login</div>
                 <div className="text-sm font-bold text-white">{profileData.lastLogin}</div>
                 <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white/5 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: IDENTITY DETAILS */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center space-x-3">
                 <User className="w-5 h-5 text-[#F5AB24]" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#142B5D] dark:text-white">Identity Details</h3>
              </div>
              
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <ProfileField label="Full Name" value={user?.name || 'Technician'} icon={User} />
                 <ProfileField label="Institutional Email (Read-Only)" value={user?.email} icon={Mail} readOnly />
                 <ProfileField label="Phone Number" value={profileData.phone} icon={Phone} />
                 <ProfileField label="Assigned Department" value={profileData.department} icon={Briefcase} />
                 
                 <div className="md:col-span-2">
                    <ProfileField label="Expertise / Skills (Comma Separated)" value={profileData.expertise} icon={Wrench} />
                 </div>

                 <ProfileField label="Assigned Locations" value={profileData.locations} icon={MapPin} />
                 <ProfileField label="Working Hours" value={profileData.workingHours} icon={Clock} />
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                 <button className="px-10 py-4 bg-[#142B5D] text-white text-xs font-black uppercase tracking-[0.25em] rounded-xl hover:bg-[#0D1E40] transition shadow-xl shadow-[#142B5D]/20">
                    Save Changes
                 </button>
              </div>
           </div>

           {/* PASSWORD & SECURITY SECTION */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center space-x-3">
                 <Lock className="w-5 h-5 text-[#F5AB24]" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#142B5D] dark:text-white">Password & Security</h3>
              </div>
              
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-1 gap-8">
                    <ProfileField label="Current Password" value="••••••••••••" icon={Lock} type="password" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileField label="New Password" value="" icon={Lock} type="password" placeholder="Enter new password" />
                    <ProfileField label="Confirm New Password" value="" icon={Lock} type="password" placeholder="Repeat new password" />
                 </div>

                 <div className="pt-4">
                    <button className="w-full py-4 bg-transparent border-2 border-[#F5AB24] text-[#F5AB24] hover:bg-[#F5AB24] hover:text-[#142B5D] text-xs font-black uppercase tracking-[0.25em] rounded-xl transition duration-300">
                       Update Security Credentials
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, icon: Icon, readOnly, type = "text", placeholder }) => (
  <div className="space-y-2 group">
    <div className="flex items-center space-x-2 mb-1 px-1">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <div className={clsx(
      "relative flex items-center transition-all duration-300",
      readOnly ? "opacity-60" : "group-focus-within:translate-x-1"
    )}>
       <Icon className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-[#F5AB24] transition-colors" />
       <input 
         type={type}
         defaultValue={value}
         readOnly={readOnly}
         placeholder={placeholder}
         className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-[#142B5D] dark:text-white outline-none transition-all"
       />
    </div>
  </div>
);

export default TechnicianProfile;
