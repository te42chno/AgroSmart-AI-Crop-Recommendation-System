import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-emerald-900">My Profile</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-white mt-3">{user?.name}</h3>
          <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-100 uppercase">
            {user?.role}
          </span>
        </div>
        <div className="p-6 space-y-4">
          {[
            { icon: User, label: 'Full Name', value: user?.name },
            { icon: Mail, label: 'Email', value: user?.email },
            { icon: Shield, label: 'Role', value: user?.role },
            { icon: Calendar, label: 'Member Since', value: 'Active Member' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <item.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-stone-800 capitalize">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
