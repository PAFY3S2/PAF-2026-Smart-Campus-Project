import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <div className="flex items-center space-x-6">
          <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-slate-50" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500 mb-2">{user?.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
