import React, { useState } from 'react';
import { Sprout, LayoutDashboard, FlaskConical, History, User, Lightbulb, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

const menuItems = [
  { id: 'farmer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crop-recommendation', label: 'Predict Crop', icon: FlaskConical },
  { id: 'prediction-history', label: 'My History', icon: History },
  { id: 'farmer-profile', label: 'Profile', icon: User },
];

export default function FarmerLayout({ activePage, onNavigate, children }: Props) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); onNavigate('home'); };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-emerald-800/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <Sprout className="h-8 w-8 text-emerald-400" />
          <span className="font-bold text-lg text-white">AgroSmart</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activePage === item.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
            }`}>
            <item.icon className="h-5 w-5" />
            {item.label}
            {activePage === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-800/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-emerald-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all">
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="min-h-screen flex bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'linear-gradient(to right, rgba(250, 250, 249, 0.95), rgba(250, 250, 249, 0.85)), url(/farmer_bg.png)' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-gradient-to-b from-emerald-900 to-emerald-950 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-emerald-900 to-emerald-950 z-50 flex flex-col lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu className="h-5 w-5 text-stone-600" />
          </button>
          <h2 className="text-lg font-bold text-emerald-900">
            {menuItems.find(i => i.id === activePage)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-stone-500">Hello, {user?.name?.split(' ')[0]}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
