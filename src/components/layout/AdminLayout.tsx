import React, { useState } from 'react';
import { Sprout, LayoutDashboard, Users, History, BarChart3, FileText, LogOut, Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface Props { activePage: string; onNavigate: (page: string) => void; children: React.ReactNode; }

const menuItems = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'user-management', label: 'Users', icon: Users },
  { id: 'all-predictions', label: 'Predictions', icon: History },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function AdminLayout({ activePage, onNavigate, children }: Props) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => { logout(); onNavigate('home'); };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-stone-700/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <Sprout className="h-8 w-8 text-emerald-400" />
          <div><span className="font-bold text-lg text-white block">AgroSmart</span><span className="text-xs text-stone-400">Admin Panel</span></div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activePage === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-300 hover:bg-stone-700/50 hover:text-white'}`}>
            <item.icon className="h-5 w-5" />{item.label}
            {activePage === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-stone-700/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{user?.name}</p><p className="text-xs text-stone-400 truncate">Administrator</p></div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/30 transition-all">
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="min-h-screen flex bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'linear-gradient(to right, rgba(245, 245, 244, 0.95), rgba(245, 245, 244, 0.85)), url(/admin_bg.png)' }}
    >
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-gradient-to-b from-stone-800 to-stone-900 fixed inset-y-0 left-0 z-40"><SidebarContent /></aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-stone-800 to-stone-900 z-50 flex flex-col lg:hidden"><SidebarContent /></motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-stone-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100"><Menu className="h-5 w-5" /></button>
          <h2 className="text-lg font-bold text-stone-800">{menuItems.find(i => i.id === activePage)?.label || 'Admin'}</h2>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
        </header>
        <main className="p-4 lg:p-8">
          <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{children}</motion.div>
        </main>
      </div>
    </div>
  );
}
