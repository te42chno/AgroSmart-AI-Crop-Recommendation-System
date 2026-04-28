import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function AllPredictions() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllPredictions(page).then(data => {
      setPredictions(data.predictions); setTotalPages(data.pages); setTotal(data.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-stone-800">All Predictions</h2><p className="text-stone-500 text-sm">{total} total records</p></div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">Crop</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">Confidence</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">N/P/K</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">Temp</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? [1,2,3].map(i => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-stone-100 rounded animate-pulse" /></td></tr>
              )) : predictions.map((p, i) => (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-700">{p.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 capitalize font-semibold text-emerald-700">{p.result.crop}</td>
                  <td className="px-4 py-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">{(p.result.confidence * 100).toFixed(0)}%</span></td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{p.inputs.N}/{p.inputs.P}/{p.inputs.K}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{p.inputs.temperature}°C</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm text-stone-600 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
