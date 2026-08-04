/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  FlaskConical, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Mail, 
  Github,
  Menu,
  X,
  Loader2,
  Leaf,
  Sun,
  Wind,
  Mountain,
  MapPin,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCropRecommendation, FarmerInput, PredictionResponse } from './services/geminiService';
import { useLanguage } from './i18n';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('nav.home') },
    { id: 'tool', label: t('nav.tool') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Sprout className="h-8 w-8 text-emerald-400" />
            <span className="font-bold text-xl tracking-tight">AgroSmart</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="ml-10 flex items-baseline space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-100 uppercase tracking-wide">
                {t('nav.language')}
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-emerald-800 text-emerald-50 text-xs px-2 py-1 rounded-md border border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-emerald-800 text-emerald-50 text-xs px-2 py-1 rounded-md border border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="te">TE</option>
              <option value="ta">TA</option>
            </select>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-emerald-800">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-emerald-800 border-t border-emerald-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-emerald-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-lg text-white">AgroSmart</span>
            </div>
            <p className="text-sm opacity-80">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  {t('footer.docs')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('footer.connect')}
            </h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-emerald-900 text-center text-xs opacity-60">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = ({ onStart }: { onStart: () => void }) => {
  const { t } = useLanguage();

  return (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Lush green field" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          {t('home.hero.title')} <span className="text-emerald-400">{t('home.hero.titleHighlight')}</span>
        </motion.h1>
          <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-emerald-50 mb-10 leading-relaxed"
        >
          {t('home.hero.subtitle')}
        </motion.p>
          <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all flex items-center gap-2 mx-auto"
        >
          {t('home.hero.cta')} <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </section>

    {/* Features */}
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-emerald-950 mb-4">{t('home.why.title')}</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: <FlaskConical className="h-10 w-10 text-emerald-600" />, 
              title: t('home.feature.soil.title'), 
              desc: t('home.feature.soil.desc'),
            },
            { 
              icon: <Thermometer className="h-10 w-10 text-emerald-600" />, 
              title: t('home.feature.climate.title'), 
              desc: t('home.feature.climate.desc'),
            },
            { 
              icon: <CheckCircle2 className="h-10 w-10 text-emerald-600" />, 
              title: t('home.feature.accuracy.title'), 
              desc: t('home.feature.accuracy.desc'),
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
  );
};

const ToolPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<FarmerInput>({
    season: 'Summer',
    soilType: 'Loamy',
    rainfallLevel: 'Medium',
    temperatureCondition: 'Moderate'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getCropRecommendation(formData, language);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-emerald-950 mb-4">{t('tool.title')}</h2>
          <p className="text-stone-600">{t('tool.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-xl border border-emerald-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-emerald-900">{t('tool.form.title')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" /> {t('tool.season.label')}
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-stone-50 font-medium text-sm"
                    required
                  >
                    <option value="Summer">{t('tool.season.summer')}</option>
                    <option value="Winter">{t('tool.season.winter')}</option>
                    <option value="Monsoon">{t('tool.season.monsoon')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-emerald-600" /> {t('tool.soil.label')}
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-stone-50 font-medium text-sm"
                    required
                  >
                    <option value="Sandy">{t('tool.soil.sandy')}</option>
                    <option value="Clay">{t('tool.soil.clay')}</option>
                    <option value="Loamy">{t('tool.soil.loamy')}</option>
                    <option value="Black Soil">{t('tool.soil.black')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-emerald-600" /> {t('tool.rainfall.label')}
                  </label>
                  <select
                    name="rainfallLevel"
                    value={formData.rainfallLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-stone-50 font-medium text-sm"
                    required
                  >
                    <option value="Low">{t('tool.rainfall.low')}</option>
                    <option value="Medium">{t('tool.rainfall.medium')}</option>
                    <option value="High">{t('tool.rainfall.high')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-emerald-600" /> {t('tool.temperature.label')}
                  </label>
                  <select
                    name="temperatureCondition"
                    value={formData.temperatureCondition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-stone-50 font-medium text-sm"
                    required
                  >
                    <option value="Cold">{t('tool.temperature.cold')}</option>
                    <option value="Moderate">{t('tool.temperature.moderate')}</option>
                    <option value="Hot">{t('tool.temperature.hot')}</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Sprout className="h-5 w-5" />
                    {t('tool.submit')}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Result Display */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 p-12 rounded-3xl text-center shadow-inner h-full flex flex-col justify-center items-center"
                >
                  <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mb-6" />
                  <p className="text-emerald-900 font-bold text-xl">{t('tool.loading.title')}</p>
                  <p className="text-emerald-700 mt-2">{t('tool.loading.subtitle')}</p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 p-8 rounded-3xl text-red-700 flex items-start gap-4 shadow-lg"
                >
                  <Info className="h-8 w-8 shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">{t('tool.error.title')}</h4>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-emerald-950 flex items-center gap-3">
                      <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                      {t('tool.results.title')}
                    </h3>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-emerald-600 font-bold text-sm hover:underline"
                    >
                      {t('tool.results.reset')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.recommendations.map((crop, index) => (
                      <motion.div
                        key={crop.crop}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-3xl shadow-xl border ${index === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-100'} hover:shadow-2xl transition-all group p-6`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {t('tool.results.rank')} #{index + 1}
                          </div>
                          <div className="bg-emerald-50 px-3 py-1 rounded-full text-emerald-900 font-bold text-xs shadow-sm border border-emerald-100">
                            {(crop.confidence * 100).toFixed(0)}% {t('tool.results.match')}
                          </div>
                        </div>

                        <h4 className="text-2xl font-bold text-emerald-950 mb-2">{crop.crop}</h4>
                        <p className="text-stone-600 text-sm leading-relaxed mb-4">
                          {crop.description}
                        </p>
                        
                        {crop.suitability_factors && (
                          <div className="space-y-2 pt-4 border-t border-stone-100">
                            {crop.suitability_factors.map((factor, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px] text-stone-500 font-medium">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-emerald-900 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="p-4 bg-emerald-800 rounded-2xl">
                      <Info className="h-10 w-10 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{t('tool.results.expertTitle')}</h4>
                      <p className="text-emerald-100 text-sm leading-relaxed opacity-90">
                        {t('tool.results.expertText')}{' '}
                        <strong>{result.recommendations[0].crop}</strong>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {!loading && !result && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border-4 border-dashed border-stone-200 shadow-inner min-h-[500px]">
                  <div className="p-6 bg-stone-100 rounded-full mb-6">
                    <Sprout className="h-20 w-20 text-stone-300" />
                  </div>
                  <h4 className="text-xl font-bold text-stone-400 mb-2">{t('tool.empty.title')}</h4>
                  <p className="text-stone-400 max-w-xs">{t('tool.empty.subtitle')}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-emerald-950 mb-8 text-center">{t('about.title')}</h2>
        <div className="prose prose-emerald lg:prose-xl mx-auto text-stone-600 space-y-6">
          <p>
            {t('about.p1')}
          </p>
          
          <h3 className="text-2xl font-bold text-emerald-900 mt-12">{t('about.tech.title')}</h3>
          <p>
            {t('about.tech.body')}
          </p>

          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 my-12">
            <h4 className="font-bold text-emerald-900 mb-4">{t('about.keyParams.title')}</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('about.keyParams.soil')}</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('about.keyParams.climate')}</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('about.keyParams.ph')}</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('about.keyParams.rainfall')}</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-emerald-900">{t('about.mission.title')}</h3>
          <p>
            {t('about.mission.body')}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className="py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-emerald-900 p-12 text-white md:w-1/3">
            <h2 className="text-3xl font-bold mb-6">{t('contact.title')}</h2>
            <p className="text-emerald-100 mb-12">{t('contact.subtitle')}</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-emerald-400" />
                <span>{t('contact.supportEmail')}</span>
              </div>
              <div className="flex items-center gap-4">
                <Github className="h-6 w-6 text-emerald-400" />
                <span>{t('contact.github')}</span>
              </div>
            </div>
          </div>
          
          <div className="p-12 md:w-2/3">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{t('contact.form.name')}</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder={t('contact.form.name.placeholder')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{t('contact.form.email')}</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder={t('contact.form.email.placeholder')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">{t('contact.form.message')}</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder={t('contact.form.message.placeholder')}></textarea>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg">
                {t('contact.form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && <HomePage onStart={() => setActiveTab('tool')} />}
            {activeTab === 'tool' && <ToolPage />}
            {activeTab === 'about' && <AboutPage />}
            {activeTab === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
