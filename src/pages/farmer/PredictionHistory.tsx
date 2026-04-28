import React, { useState, useEffect } from 'react';
import { Search, Sprout, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { predictionAPI } from '../../services/api';

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionAPI.getHistory(page, search);
      setPredictions(data.predictions);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">Prediction History</h2>
          <p className="text-stone-500 text-sm">{total} total predictions</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="Search by crop name..." />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 animate-pulse"><div className="h-4 bg-stone-200 rounded w-1/3 mb-2" /><div className="h-3 bg-stone-100 rounded w-2/3" /></div>
        ))}</div>
      ) : predictions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
          <Sprout className="h-12 w-12 mx-auto text-stone-200 mb-3" />
          <p className="text-stone-400 text-sm">No predictions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {predictions.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Sprout className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 capitalize">{p.result.crop}</h4>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {(p.result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {Object.entries(p.inputs).map(([k, v]: any) => (
                  <div key={k} className="bg-stone-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-stone-400 uppercase">{k}</p>
                    <p className="text-xs font-bold text-stone-600">{typeof v === 'number' ? v.toFixed(1) : v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm text-stone-600 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
