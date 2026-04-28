import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const csv = await adminAPI.exportCSV();
      const blob = new Blob([csv as string], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agrosmart_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800">Prediction Report (CSV)</h3>
              <p className="text-xs text-stone-400">Export all prediction data with user info</p>
            </div>
          </div>
          <p className="text-stone-500 text-sm mb-6">
            Downloads a CSV file containing all predictions including user details, input parameters, 
            predicted crops, confidence scores, and timestamps.
          </p>
          <button onClick={handleExportCSV} disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-70">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {loading ? 'Exporting...' : 'Download CSV'}
          </button>
          {success && <p className="text-emerald-600 text-sm mt-3 font-medium">✓ Report downloaded successfully!</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800">Summary Report</h3>
              <p className="text-xs text-stone-400">High-level overview of platform activity</p>
            </div>
          </div>
          <p className="text-stone-500 text-sm mb-6">
            View aggregated statistics about user activity, popular crops, and prediction trends.
            Check the Analytics page for interactive visualizations.
          </p>
          <button className="flex items-center gap-2 bg-stone-200 text-stone-600 font-bold px-6 py-3 rounded-xl cursor-default">
            View Analytics Page →
          </button>
        </div>
      </div>
    </div>
  );
}
