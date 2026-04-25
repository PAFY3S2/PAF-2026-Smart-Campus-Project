import React, { useState, useRef, useEffect } from 'react';
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
  ToggleLeft,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// ─── Validation Schemas ──────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  department: z.string().optional(),
  specialty: z.string().min(2, 'Specialty is required'),
  experienceYears: z.coerce.number().min(0, 'Must be a positive number'),
  address: z.string().optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  expertise: z.string().optional(),
  workLocations: z.string().optional(),
  workingHours: z.string().optional(),
  availability: z.boolean().default(true),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const TechnicianProfile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ─── Profile Form ──────────────────────────────────────────────────
  const { 
    register: regProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfile,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors, isSubmitting: profileSaving } 
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      department: '',
      specialty: '',
      experienceYears: 0,
      address: '',
      bio: '',
      expertise: '',
      workLocations: '',
      workingHours: '',
      availability: true,
    }
  });

  // ─── Password Form ─────────────────────────────────────────────────
  const { 
    register: regPw, 
    handleSubmit: handlePwSubmit, 
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSaving } 
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const availability = watchProfile('availability');

  // Pre-populate form from AuthContext user
  useEffect(() => {
    if (user) {
      resetProfile({
        name:            user.name             || '',
        phoneNumber:     user.phoneNumber      || '',
        department:      user.department       || '',
        specialty:       user.specialty       || '',
        experienceYears: user.experienceYears || 0,
        address:         user.address         || '',
        bio:             user.bio             || '',
        expertise:       Array.isArray(user.expertise)     ? user.expertise.join(', ')     : (user.expertise     || ''),
        workLocations:   Array.isArray(user.workLocations) ? user.workLocations.join(', ') : (user.workLocations || ''),
        workingHours:    user.workingHours     || '',
        availability:    user.availability !== undefined ? user.availability : true,
      });
    }
  }, [user, resetProfile]);

  // ─── Save Profile ──────────────────────────────────────────────────
  const onProfileSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        expertise: data.expertise ? data.expertise.split(',').map(s => s.trim()).filter(Boolean) : [],
        workLocations: data.workLocations ? data.workLocations.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const res = await api.put('/technician/profile', payload);
      setUser(prev => ({ ...prev, ...res.data }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    }
  };

  // ─── Avatar Upload ─────────────────────────────────────────────────
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload jpg, png or webp.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB.');
      return;
    }

    setAvatarLoading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await api.post('/technician/profile-picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });
      setUser(prev => ({ ...prev, avatar: res.data.avatarUrl }));
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setAvatarLoading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // ─── Update Password ───────────────────────────────────────────────
  const onPwSubmit = async (data) => {
    try {
      await api.put('/technician/password', {
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const lastLogin = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })
    : '—';

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#142B5D] dark:text-white tracking-tighter mb-1 uppercase leading-none">Security &amp; Profile</h1>
           <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.25em]">Manage Your Institutional Identity</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#F5AB24]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F5AB24]">Secure Session Active</span>
           </div>

           <button 
             onClick={() => setProfileValue('availability', !availability)}
             className={clsx(
               "flex items-center space-x-3 px-6 py-2.5 rounded-xl border-2 transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
               availability 
                 ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                 : "bg-slate-500/10 border-slate-500/50 text-slate-500"
             )}
           >
              <div className={clsx("w-2 h-2 rounded-full animate-pulse", availability ? "bg-emerald-500" : "bg-slate-500")}></div>
              <span>{availability ? 'Available for Assignment' : 'Currently Unavailable'}</span>
              {availability ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
           <div className="bg-[#142B5D] rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl shadow-[#142B5D]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative mb-8">
                 <div className="w-40 h-40 rounded-full bg-white p-1.5 border-4 border-[#F5AB24] shadow-2xl overflow-hidden flex items-center justify-center relative">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="bg-[#142B5D] w-full h-full rounded-full flex items-center justify-center text-white">
                        <User className="w-20 h-20" />
                      </div>
                    )}
                    
                    {/* Progress Overlay */}
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center z-20">
                         <div className="relative w-16 h-16">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                               <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-700" strokeWidth="4"></circle>
                               <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#F5AB24]" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }}></circle>
                            </svg>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-white">{uploadProgress}%</span>
                         </div>
                      </div>
                    )}
                 </div>
                 <button 
                    onClick={handleAvatarClick}
                    disabled={avatarLoading}
                    className="absolute bottom-2 right-2 p-2.5 bg-[#142B5D] border-2 border-white rounded-full text-[#F5AB24] hover:bg-[#F5AB24] hover:text-[#142B5D] transition-all shadow-xl disabled:opacity-50 z-30"
                    title="Update profile picture"
                 >
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
                 <div className="text-sm font-bold text-white">{lastLogin}</div>
                 <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white/5 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
           {/* IDENTITY DETAILS */}
           <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center space-x-3">
                 <User className="w-5 h-5 text-[#F5AB24]" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#142B5D] dark:text-white">Identity Details</h3>
              </div>
              
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <ProfileField label="Full Name" name="name" register={regProfile} error={profileErrors.name} icon={User} />
                 <ProfileField label="Institutional Email (Read-Only)" name="email" value={user?.email || ''} icon={Mail} readOnly />
                 <ProfileField label="Phone Number" name="phoneNumber" register={regProfile} error={profileErrors.phoneNumber} icon={Phone} />
                 <ProfileField label="Specialty" name="specialty" register={regProfile} error={profileErrors.specialty} icon={Wrench} />
                 <ProfileField label="Years of Experience" name="experienceYears" type="number" register={regProfile} error={profileErrors.experienceYears} icon={Clock} />
                 <ProfileField label="Assigned Department" name="department" register={regProfile} error={profileErrors.department} icon={Briefcase} />
                 
                 <div className="md:col-span-2">
                    <ProfileField label="Bio / Professional Summary" name="bio" isTextArea register={regProfile} error={profileErrors.bio} icon={User} />
                 </div>

                 <div className="md:col-span-2">
                    <ProfileField label="Expertise / Skills (Comma Separated)" name="expertise" register={regProfile} error={profileErrors.expertise} icon={Wrench} />
                 </div>

                 <ProfileField label="Address" name="address" register={regProfile} error={profileErrors.address} icon={MapPin} />
                 <ProfileField label="Assigned Locations (Comma Separated)" name="workLocations" register={regProfile} error={profileErrors.workLocations} icon={MapPin} />
                 <ProfileField label="Working Hours" name="workingHours" register={regProfile} error={profileErrors.workingHours} icon={Clock} />
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                 <button 
                   type="submit"
                   disabled={profileSaving}
                   className="px-10 py-4 bg-[#142B5D] text-white text-xs font-black uppercase tracking-[0.25em] rounded-xl hover:bg-[#0D1E40] transition shadow-xl shadow-[#142B5D]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                 >
                   {profileSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                   <span>{profileSaving ? 'Saving...' : 'Save Changes'}</span>
                 </button>
              </div>
           </form>

           {/* PASSWORD & SECURITY */}
           <form onSubmit={handlePwSubmit(onPwSubmit)} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center space-x-3">
                 <Lock className="w-5 h-5 text-[#F5AB24]" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#142B5D] dark:text-white">Password &amp; Security</h3>
              </div>
              
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-1 gap-8">
                    <ProfileField label="Current Password" name="currentPassword" type="password" placeholder="Enter current password" register={regPw} error={pwErrors.currentPassword} icon={Lock} />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileField label="New Password" name="newPassword" type="password" placeholder="Enter new password" register={regPw} error={pwErrors.newPassword} icon={Lock} />
                    <ProfileField label="Confirm New Password" name="confirmPassword" type="password" placeholder="Repeat new password" register={regPw} error={pwErrors.confirmPassword} icon={Lock} />
                 </div>

                 <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={pwSaving}
                      className="w-full py-4 bg-transparent border-2 border-[#F5AB24] text-[#F5AB24] hover:bg-[#F5AB24] hover:text-[#142B5D] text-xs font-black uppercase tracking-[0.25em] rounded-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {pwSaving && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                      <span>{pwSaving ? 'Updating...' : 'Update Security Credentials'}</span>
                    </button>
                 </div>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, name, register, error, icon: Icon, readOnly, type = "text", placeholder, isTextArea }) => (
  <div className="space-y-2 group">
    <div className="flex items-center space-x-2 mb-1 px-1">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <div className={clsx(
      "relative flex items-center transition-all duration-300",
      readOnly ? "opacity-60" : "group-focus-within:translate-x-1"
    )}>
       <Icon className={clsx("absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-[#F5AB24] transition-colors", isTextArea && "top-4")} />
       {isTextArea ? (
         <textarea
           {...(register ? register(name) : {})}
           readOnly={readOnly}
           placeholder={placeholder}
           rows={4}
           className={clsx(
             "w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-[#142B5D] dark:text-white outline-none transition-all resize-none",
             error && "border-red-500 focus:border-red-500"
           )}
         />
       ) : (
         <input 
           type={type}
           {...(register ? register(name) : {})}
           value={value}
           readOnly={readOnly}
           placeholder={placeholder}
           className={clsx(
             "w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-[#142B5D] dark:text-white outline-none transition-all",
             error && "border-red-500 focus:border-red-500"
           )}
         />
       )}
    </div>
    {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 px-1">{error.message}</p>}
  </div>
);

export default TechnicianProfile;
