import React, { useState, useEffect } from 'react';
import { Users, FlaskConical, Wheat, TrendingUp, BarChart3, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse"><div className="h-4 bg-stone-200 rounded w-1/2 mb-3" /><div className="h-6 bg-stone-100 rounded w-1/3" /></div>)}
    </div>
  );

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Total Predictions', value: stats?.totalPredictions || 0, icon: FlaskConical, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { label: 'Active Farmers', value: stats?.totalFarmers || 0, icon: Wheat, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { label: 'Top Crop', value: stats?.topCrops?.[0]?._id || 'N/A', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className={`bg-white rounded-2xl p-5 shadow-sm border ${c.border}`}>
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}><c.icon className="h-5 w-5" /></div>
            <p className="text-xs text-stone-500 font-medium">{c.label}</p>
            <p className="text-2xl font-bold text-stone-800 mt-1 capitalize">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Crops */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="h-5 w-5 text-emerald-600" /><h3 className="font-bold text-stone-800">Top Recommended Crops</h3></div>
          {(stats?.topCrops || []).length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topCrops.map((crop: any, i: number) => {
                const maxCount = stats.topCrops[0]?.count || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-stone-700 capitalize">{crop._id}</span>
                      <span className="text-stone-400">{crop.count} predictions</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(crop.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly Predictions */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h3 className="font-bold text-stone-800 mb-4">Monthly Activity</h3>
          {(stats?.monthlyPredictions || []).length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No monthly data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.monthlyPredictions.map((m: any, i: number) => {
                const max = Math.max(...stats.monthlyPredictions.map((x: any) => x.count));
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-stone-400 w-16">{m._id}</span>
                    <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(m.count / max) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-stone-600 w-8 text-right">{m.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
