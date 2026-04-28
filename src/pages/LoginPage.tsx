import React, { useState, useEffect } from 'react';
import { Sprout, Mail, Lock, Loader2, Eye, EyeOff, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface Props { onNavigate: (page: string) => void; }

export default function LoginPage({ onNavigate }: Props) {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'farmer-dashboard');
    }
  }, [user, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required.'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(6, 78, 59, 0.8), rgba(2, 44, 34, 0.9)), url(/farmer_bg.png)' }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-700/50 p-3 rounded-2xl">
                <Sprout className="h-10 w-10 text-emerald-300" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-emerald-200 text-sm mt-1">Sign in to your AgroSmart account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>

            <p className="text-center text-sm text-stone-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => onNavigate('register')} className="text-emerald-600 font-semibold hover:underline">
                Create Account
              </button>
            </p>
            <p className="text-center text-sm text-stone-500 mt-2 border-t border-stone-100 pt-4">
              Testing the app?{' '}
              <a href="/crop_dataset.csv" download className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1">
                <Download className="h-4 w-4" /> Download Sample Dataset
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
