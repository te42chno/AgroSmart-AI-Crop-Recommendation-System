import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FlaskConical, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { adminAPI } from '../../services/api';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getStats().then(setStats).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-8 animate-pulse"><div className="h-40 bg-stone-100 rounded" /></div>)}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">Analytics</h2>

      {/* Crop Distribution */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="flex items-center gap-2 mb-6"><BarChart3 className="h-5 w-5 text-emerald-600" /><h3 className="font-bold text-stone-800">Crop Distribution</h3></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(stats?.topCrops || []).map((crop: any, i: number) => {
            const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${colors[i]} mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold`}>
                  {crop.count}
                </div>
                <p className="text-sm font-semibold text-stone-700 capitalize">{crop._id}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="flex items-center gap-2 mb-6"><Users className="h-5 w-5 text-blue-600" /><h3 className="font-bold text-stone-800">User Growth</h3></div>
        {(stats?.userGrowth || []).length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8">No growth data yet</p>
        ) : (
          <div className="space-y-3">
            {stats.userGrowth.map((m: any, i: number) => {
              const max = Math.max(...stats.userGrowth.map((x: any) => x.count));
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-stone-400 w-20">{m._id}</span>
                  <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(m.count / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-stone-600 w-10 text-right">{m.count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Predictions */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="flex items-center gap-2 mb-6"><TrendingUp className="h-5 w-5 text-amber-600" /><h3 className="font-bold text-stone-800">Monthly Predictions</h3></div>
        {(stats?.monthlyPredictions || []).length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8">No prediction data yet</p>
        ) : (
          <div className="flex items-end gap-3 h-48">
            {stats.monthlyPredictions.map((m: any, i: number) => {
              const max = Math.max(...stats.monthlyPredictions.map((x: any) => x.count));
              const height = max > 0 ? (m.count / max) * 100 : 10;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end">
                  <span className="text-xs font-bold text-stone-600 mb-1">{m.count}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg min-h-[8px]" />
                  <span className="text-[10px] text-stone-400 mt-2 font-mono">{m._id.slice(5)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
