import React, { useState, useRef } from 'react';

import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Briefcase, 
  Wrench, 
  MapPin, 
  Clock, 
  Lock, 
  Camera, 
  Save, 
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/shared/PageHeader';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
    studentId: user?.studentId || '',
    faculty: user?.faculty || '',
    batch: user?.batch || '',
    expertise: user?.expertise?.join(', ') || '',
    workLocations: user?.workLocations?.join(', ') || '',
    workingHours: user?.workingHours || '',
    availability: user?.availability ?? true
  });

  // Sync formData when the full user object is loaded from the backend
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        department: user.department || '',
        studentId: user.studentId || '',
        faculty: user.faculty || '',
        batch: user.batch || '',
        expertise: user.expertise?.join(', ') || '',
        workLocations: user.workLocations?.join(', ') || '',
        workingHours: user.workingHours || '',
        availability: user.availability ?? true
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleAvailability = async () => {
    const newStatus = !formData.availability;
    setFormData(prev => ({ ...prev, availability: newStatus }));
    try {
        const res = await api.patch('/auth/me', { availability: newStatus });
        setUser(res.data);
    } catch (err) {
        console.error('Failed to update availability', err);
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    
    if (formData.phoneNumber && !/^\+?[0-9]{10,12}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSubmit = {
        ...formData,
        expertise: typeof formData.expertise === 'string' 
          ? formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
          : formData.expertise,
        workLocations: typeof formData.workLocations === 'string'
          ? formData.workLocations.split(',').map(s => s.trim()).filter(Boolean)
          : formData.workLocations
      };

      console.log('Submitting profile data:', dataToSubmit);
      const res = await api.patch('/auth/me', dataToSubmit);
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Profile update error:', err.response || err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload image' });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      await api.post('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader title="Security & Profile" subtitle="Manage your institutional identity" />
        
        {user?.role === 'TECHNICIAN' && (
            <button 
                onClick={handleToggleAvailability}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition shadow-sm ${
                    formData.availability 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                }`}
            >
                <div className={`w-3 h-3 rounded-full ${formData.availability ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-xs font-black uppercase tracking-widest">{formData.availability ? 'Available for Assignment' : 'Currently Busy / Offline'}</span>
                {formData.availability ? <ToggleRight className="w-5 h-5 ml-2" /> : <ToggleLeft className="w-5 h-5 ml-2" />}
            </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl font-bold text-sm border-2 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar and Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center transition-colors">
            <div className="relative group p-1 border-4 border-[#F5AB24] rounded-full mb-6">
              <img src={user?.avatar || 'https://via.placeholder.com/150'} alt={user?.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
              <button 
                onClick={handleImageClick}
                className="absolute bottom-1 right-1 bg-[#142B5D] text-white p-2 rounded-full border-4 border-white dark:border-slate-900 hover:bg-[#F5AB24] hover:text-[#142B5D] transition shadow-md opacity-100"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <h2 className="text-xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">{user?.email}</p>
            <div className="mt-6 flex items-center space-x-2">
              <span className="px-4 py-1.5 bg-[#142B5D] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm">
                {user?.role}
              </span>
              <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-[#142B5D] dark:text-[#F5AB24] rounded-full font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                Validated
              </span>
            </div>
          </div>

          <div className="bg-[#142B5D] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
             <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-white opacity-5" />
             <h3 className="font-black uppercase tracking-widest text-xs mb-6 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-[#F5AB24]" /> Access Level
             </h3>
             <p className="text-sm font-medium leading-relaxed opacity-80 mb-6">
                Your account is currently protected by institution-grade encryption. Ensure your password remains private.
             </p>
             <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Last Login</p>
                <p className="text-xs font-bold tracking-widest">{new Date().toLocaleDateString()} (Sri Lanka)</p>
             </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="font-black text-[#142B5D] dark:text-white uppercase tracking-widest text-xs flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-[#F5AB24]" /> Identity Details
              </h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                  <input 
                    name="name"
                    type="text" 
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${errors.name ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition`}
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Institutional Email (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 dark:text-slate-700" />
                  <input 
                    type="email" 
                    value={user?.email} 
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                  <input 
                    name="phoneNumber"
                    type="text" 
                    placeholder="+94 7X XXX XXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${errors.phoneNumber ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition`}
                  />
                  {errors.phoneNumber && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.phoneNumber}</p>}
                </div>
              </div>

              {user?.role === 'USER' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="studentId"
                        type="text" 
                        placeholder="IT2XXXXXXX"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="faculty"
                        type="text" 
                        placeholder="e.g. Computing"
                        value={formData.faculty}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="batch"
                        type="text" 
                        placeholder="e.g. 2023"
                        value={formData.batch}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {user?.role === 'TECHNICIAN' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Department</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="department"
                        type="text" 
                        placeholder="e.g. IT Support, Maintenance"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise / Skills (Comma separated)</label>
                    <div className="relative">
                      <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="expertise"
                        type="text" 
                        placeholder="Networking, Hardware, Projectors..."
                        value={formData.expertise}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Locations</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="workLocations"
                        type="text" 
                        placeholder="Lab 402, Building B..."
                        value={formData.workLocations}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Working Hours</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        name="workingHours"
                        type="text" 
                        placeholder="8:00 AM - 5:00 PM"
                        value={formData.workingHours}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F5AB24] focus:ring-0 outline-none text-sm font-bold text-[#142B5D] dark:text-white transition"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#142B5D] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#F5AB24] hover:text-[#142B5D] transition shadow-lg flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-3" /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center">
              <h3 className="font-black text-[#142B5D] dark:text-white uppercase tracking-widest text-xs flex items-center">
                <Lock className="w-4 h-4 mr-2 text-[#F5AB24]" /> Password & Security
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current Password</label>
                    <input 
                        type="password" 
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${errors.currentPassword ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-xl focus:border-rose-300 outline-none text-sm font-bold text-[#142B5D] dark:text-white`}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    {errors.currentPassword && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.currentPassword}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                    <input 
                        type="password" 
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${errors.newPassword ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-xl focus:border-[#F5AB24] outline-none text-sm font-bold text-[#142B5D] dark:text-white`}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    {errors.newPassword && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.newPassword}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                    <input 
                        type="password" 
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-xl focus:border-[#F5AB24] outline-none text-sm font-bold text-[#142B5D] dark:text-white`}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.confirmPassword}</p>}
                </div>
                <div className="md:col-span-2 pt-4">
                    <button 
                         type="submit"
                         disabled={loading}
                         className="border-2 border-[#142B5D] dark:border-[#F5AB24] text-[#142B5D] dark:text-[#F5AB24] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#142B5D] dark:hover:bg-[#F5AB24] hover:text-white dark:hover:text-[#142B5D] transition disabled:opacity-50"
                    >
                         Update Security Credentials
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
