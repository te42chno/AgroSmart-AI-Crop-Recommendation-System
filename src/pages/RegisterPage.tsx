import React, { useState, useEffect } from 'react';
import { Sprout, User, Mail, Lock, Loader2, Eye, EyeOff, Shield, Wheat } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface Props { onNavigate: (page: string) => void; }

export default function RegisterPage({ onNavigate }: Props) {
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
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
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(6, 78, 59, 0.8), rgba(2, 44, 34, 0.9)), url(/farmer_bg.png)' }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-700/50 p-3 rounded-2xl"><Sprout className="h-10 w-10 text-emerald-300" /></div>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-emerald-200 text-sm mt-1">Join AgroSmart today</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-3 uppercase tracking-wide">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('farmer')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${role === 'farmer' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                  <Wheat className="h-4 w-4" /> Farmer
                </button>
                <button type="button" onClick={() => setRole('admin')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${role === 'admin' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                  <Shield className="h-4 w-4" /> Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  placeholder="Ravi Kumar" />
              </div>
            </div>

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
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
            </button>

            <p className="text-center text-sm text-stone-500">
              Already have an account?{' '}
              <button type="button" onClick={() => onNavigate('login')} className="text-emerald-600 font-semibold hover:underline">Sign In</button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
