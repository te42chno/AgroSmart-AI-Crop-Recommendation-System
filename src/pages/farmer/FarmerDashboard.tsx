import React, { useState, useEffect } from 'react';
import { FlaskConical, History, TrendingUp, Lightbulb, Sprout, ArrowRight, CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { predictionAPI } from '../../services/api';

interface Props { onNavigate: (page: string) => void; }

const tips = [
  { title: 'Soil Testing', text: 'Test your soil every season for accurate NPK levels. This ensures the best crop recommendations.' },
  { title: 'Crop Rotation', text: 'Rotate crops each season to maintain soil fertility and reduce pest buildup.' },
  { title: 'Water Management', text: 'Use drip irrigation to save 30-50% water compared to flood irrigation.' },
  { title: 'Organic Farming', text: 'Add compost and organic matter to improve soil structure and nutrient content.' },
];

export default function FarmerDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, lastCrop: 'N/A' });
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    predictionAPI.getHistory(1, '').then(data => {
      setStats({ total: data.total, lastCrop: data.predictions[0]?.result?.crop || 'N/A' });
      setRecentPredictions(data.predictions.slice(0, 3));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTipIndex(i => (i + 1) % tips.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm">{greeting}</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">{user?.name} 👋</h1>
          <p className="text-emerald-100 mt-2 text-sm">Ready to find the perfect crop for your farm?</p>
          <button onClick={() => onNavigate('crop-recommendation')}
            className="mt-4 bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition-all flex items-center gap-2">
            New Prediction <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Predictions', value: stats.total, icon: FlaskConical, color: 'bg-blue-50 text-blue-600' },
          { label: 'Last Crop', value: stats.lastCrop, icon: Sprout, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Best Match', value: recentPredictions[0]?.result?.confidence ? `${(recentPredictions[0].result.confidence * 100).toFixed(0)}%` : 'N/A', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
          { label: 'Predictions Today', value: recentPredictions.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length, icon: History, color: 'bg-purple-50 text-purple-600' },
        ].map((card, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-xs text-stone-500 font-medium">{card.label}</p>
            <p className="text-xl font-bold text-stone-800 mt-1 capitalize">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-800">Recent Predictions</h3>
            <button onClick={() => onNavigate('prediction-history')} className="text-emerald-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          {recentPredictions.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No predictions yet. Start your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Sprout className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm capitalize">{p.result.crop}</p>
                      <p className="text-xs text-stone-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {(p.result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Farming Tips */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-stone-800">Farming Tips</h3>
          </div>
          <motion.div key={tipIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h4 className="font-bold text-amber-800 text-sm mb-2">{tips[tipIndex].title}</h4>
            <p className="text-amber-700 text-xs leading-relaxed">{tips[tipIndex].text}</p>
          </motion.div>
          <div className="flex gap-1 mt-3 justify-center">
            {tips.map((_, i) => (
              <button key={i} onClick={() => setTipIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === tipIndex ? 'bg-amber-500 w-4' : 'bg-stone-200'}`} />
            ))}
          </div>

          {/* Weather Widget */}
          <div className="mt-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100">
            <div className="flex items-center gap-2 mb-3">
              <CloudSun className="h-5 w-5 text-sky-500" />
              <h4 className="font-bold text-sky-800 text-sm">Weather Today</h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><Thermometer className="h-4 w-4 mx-auto text-red-400" /><p className="text-xs text-stone-500 mt-1">28°C</p></div>
              <div><Droplets className="h-4 w-4 mx-auto text-blue-400" /><p className="text-xs text-stone-500 mt-1">65%</p></div>
              <div><Wind className="h-4 w-4 mx-auto text-stone-400" /><p className="text-xs text-stone-500 mt-1">12 km/h</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
