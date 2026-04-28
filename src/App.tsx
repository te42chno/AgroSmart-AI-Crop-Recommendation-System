import React, { useState } from 'react';
import { Sprout, Thermometer, Droplets, CloudRain, FlaskConical, ArrowRight, CheckCircle2, Info, Mail, Github, Menu, X, Loader2, Leaf, Sun, Wind, Mountain, MapPin, RefreshCw, Calendar, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCropRecommendation, FarmerInput, PredictionResponse } from './services/geminiService';
import { useLanguage } from './i18n';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerLayout from './components/layout/FarmerLayout';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import CropRecommendation from './pages/farmer/CropRecommendation';
import PredictionHistory from './pages/farmer/PredictionHistory';
import ProfilePage from './pages/farmer/ProfilePage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AllPredictions from './pages/admin/AllPredictions';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';

// --- Main App with routing ---

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="h-10 w-10 text-emerald-600 animate-spin" /></div>;

  // Unauthenticated routing
  if (!isAuthenticated) {
    if (activeTab === 'register') return <RegisterPage onNavigate={setActiveTab} />;
    return <LoginPage onNavigate={setActiveTab} />;
  }

  // Set default active tab for authenticated users if they are still on login
  if (activeTab === 'login' || activeTab === 'register') {
    if (user?.role === 'admin') setActiveTab('admin-dashboard');
    else setActiveTab('farmer-dashboard');
  }

  // Farmer dashboard pages
  if (activeTab.startsWith('farmer-') || activeTab === 'crop-recommendation' || activeTab === 'prediction-history') {
    return (
      <FarmerLayout activePage={activeTab} onNavigate={setActiveTab}>
        {activeTab === 'farmer-dashboard' && <FarmerDashboard onNavigate={setActiveTab} />}
        {activeTab === 'crop-recommendation' && <CropRecommendation />}
        {activeTab === 'prediction-history' && <PredictionHistory />}
        {activeTab === 'farmer-profile' && <ProfilePage />}
      </FarmerLayout>
    );
  }

  // Admin dashboard pages
  if (activeTab.startsWith('admin-') || activeTab === 'user-management' || activeTab === 'all-predictions' || activeTab === 'analytics' || activeTab === 'reports') {
    return (
      <AdminLayout activePage={activeTab} onNavigate={setActiveTab}>
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
        {activeTab === 'user-management' && <UserManagement />}
        {activeTab === 'all-predictions' && <AllPredictions />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'reports' && <Reports />}
      </AdminLayout>
    );
  }

  return null;
}
