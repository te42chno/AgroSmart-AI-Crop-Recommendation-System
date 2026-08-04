import React, { useState, useRef } from 'react';
import { Sprout, Loader2, CheckCircle2, FlaskConical, Thermometer, Droplets, CloudRain, Info, MapPin, Upload, FileText, MousePointer2, AlertCircle, Sparkles, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictionAPI } from '../../services/api';
import { fetchWeatherByCoords } from '../../services/weatherService';
import { extractSoilDataFromImage } from '../../services/ocrService';

type InputMode = 'manual' | 'auto' | 'ocr';

export default function CropRecommendation() {
  const [activeMode, setActiveMode] = useState<InputMode>('manual');
  const [form, setForm] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [loading, setLoading] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [scanningOCR, setScanningOCR] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields = [
    { key: 'N', label: 'Nitrogen (N)', icon: FlaskConical, placeholder: '0-200', unit: 'mg/kg', color: 'text-green-600', help: 'Essential for leaf growth and green color.' },
    { key: 'P', label: 'Phosphorus (P)', icon: FlaskConical, placeholder: '0-200', unit: 'mg/kg', color: 'text-blue-600', help: 'Crucial for root development and flowering.' },
    { key: 'K', label: 'Potassium (K)', icon: FlaskConical, placeholder: '0-300', unit: 'mg/kg', color: 'text-purple-600', help: 'Improves disease resistance and water use.' },
    { key: 'temperature', label: 'Temperature', icon: Thermometer, placeholder: '10-45', unit: '°C', color: 'text-red-500', help: 'Ambient air temperature in Celsius.' },
    { key: 'humidity', label: 'Humidity', icon: Droplets, placeholder: '0-100', unit: '%', color: 'text-sky-500', help: 'Relative humidity level in percentage.' },
    { key: 'ph', label: 'Soil pH', icon: FlaskConical, placeholder: '0-14', unit: 'pH', color: 'text-amber-600', help: 'Acidity or alkalinity level (7 is neutral).' },
    { key: 'rainfall', label: 'Rainfall', icon: CloudRain, placeholder: '0-500', unit: 'mm', color: 'text-indigo-500', help: 'Average rainfall in millimeters.' },
  ];

  const handleAutoDetect = async () => {
    setFetchingWeather(true);
    setError('');
    setSuccessMsg('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setFetchingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherByCoords(latitude, longitude);
          
          setForm(prev => ({
            ...prev,
            temperature: weather.temperature.toFixed(1),
            humidity: weather.humidity.toString(),
            rainfall: weather.rainfall.toFixed(1),
          }));
          
          setSuccessMsg('Weather data detected successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch weather data. Please ensure API key is set.');
        } finally {
          setFetchingWeather(false);
        }
      },
      (err) => {
        setError('Location permission denied. Please enter weather data manually.');
        setFetchingWeather(false);
      }
    );
  };

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanningOCR(true);
    setError('');
    setSuccessMsg('');

    try {
      const extracted = await extractSoilDataFromImage(file);
      
      setForm(prev => ({
        ...prev,
        ...(extracted.N && { N: extracted.N.toString() }),
        ...(extracted.P && { P: extracted.P.toString() }),
        ...(extracted.K && { K: extracted.K.toString() }),
        ...(extracted.ph && { ph: extracted.ph.toString() }),
      }));

      const foundCount = Object.keys(extracted).length;
      if (foundCount > 0) {
        setSuccessMsg(`Scan complete! Extracted ${foundCount} values.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError('No soil values detected. Please ensure the report is clear.');
      }
    } catch (err: any) {
      setError(err.message || 'OCR scanning failed.');
    } finally {
      setScanningOCR(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const values = Object.values(form);
    if (values.some(v => !v)) { setError('All fields are required. Try other modes to auto-fill.'); return; }
    
    setLoading(true);
    setResult(null);
    try {
      const numData = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v as string)]));
      const data = await predictionAPI.predict(numData as any);
      if (data && data.prediction) {
        setResult(data.prediction);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      setError(err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const ModeTab = ({ id, icon: Icon, label, description }: { id: InputMode, icon: any, label: string, description: string }) => (
    <button
      onClick={() => setActiveMode(id)}
      className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
        activeMode === id 
          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' 
          : 'bg-white border-stone-100 text-stone-500 hover:border-emerald-200 hover:bg-stone-50'
      }`}
    >
      <div className={`p-2.5 rounded-xl mb-2 ${activeMode === id ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-400'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-bold">{label}</span>
      <span className="text-[10px] opacity-70 mt-1 hidden sm:block">{description}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold mb-3">
          <Sparkles className="h-3 w-3" /> AI-Powered Agriculture
        </div>
        <h2 className="text-3xl font-bold text-emerald-900">Crop Recommendation</h2>
        <p className="text-stone-500 text-sm mt-1">Select an input mode and find the perfect crop for your land</p>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex gap-4 max-w-3xl mx-auto">
        <ModeTab id="auto" icon={MapPin} label="Smart Auto" description="Weather via GPS" />
        <ModeTab id="ocr" icon={Upload} label="Upload Report" description="OCR Soil Scan" />
        <ModeTab id="manual" icon={MousePointer2} label="Manual Entry" description="Traditional Form" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Input Controls */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            {activeMode === 'auto' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-bold text-stone-800">Weather Auto-Detect</h3>
                    <p className="text-xs text-stone-500">Fetches temperature, humidity & rainfall</p>
                  </div>
                </div>
                <button onClick={handleAutoDetect} disabled={fetchingWeather}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
                  {fetchingWeather ? <Loader2 className="h-5 w-5 animate-spin" /> : <><MapPin className="h-5 w-5" /> Detect My Location</>}
                </button>
                <div className="mt-4 p-3 bg-stone-50 rounded-xl flex items-start gap-3">
                  <Info className="h-4 w-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    We will use your browser's geolocation to find current weather conditions. You only need to enter your soil's NPK and pH levels manually.
                  </p>
                </div>
              </motion.div>
            )}

            {activeMode === 'ocr' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-bold text-stone-800">Scan Soil Report</h3>
                    <p className="text-xs text-stone-500">Extract NPK & pH from image/PDF</p>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleOCRUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={scanningOCR}
                  className="w-full py-10 rounded-2xl border-2 border-dashed border-stone-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3 group disabled:opacity-50">
                  {scanningOCR ? (
                    <>
                      <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
                      <span className="text-sm font-bold text-purple-700">Scanning Report...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-stone-50 rounded-full group-hover:bg-white transition-all">
                        <Upload className="h-8 w-8 text-stone-400 group-hover:text-purple-600" />
                      </div>
                      <span className="text-sm font-bold text-stone-600">Click to Upload Soil Card</span>
                      <span className="text-[10px] text-stone-400">Supports JPG, PNG, PDF</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {activeMode === 'manual' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MousePointer2 className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-bold text-stone-800">Manual Entry</h3>
                    <p className="text-xs text-stone-500">Directly enter all parameters</p>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
                  Enter all values manually below. You can hover over the info icons to learn about each parameter.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Messages */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start gap-3 overflow-hidden">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-medium text-red-700">{String(error)}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-start gap-3 overflow-hidden">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-medium text-emerald-700">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Form Fields (Common) */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Parameter Checklist</h4>
            <div className="grid grid-cols-1 gap-4">
              {fields.map(f => (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <f.icon className={`h-3.5 w-3.5 ${f.color}`} /> {f.label}
                    </label>
                    <div className="group relative">
                      <Info className="h-3.5 w-3.5 text-stone-300 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-stone-800 text-white text-[9px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {f.help}
                        <div className="absolute top-full right-2 border-4 border-transparent border-t-stone-800" />
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="number" step="any" value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all bg-stone-50/50 focus:bg-white"
                      placeholder={f.placeholder}
                      max={f.key === 'humidity' ? 100 : undefined}
                      min={0} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 group-focus-within:text-emerald-500 transition-colors uppercase">{f.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 group">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <Sprout className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                  Predict Best Crop
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white border border-stone-100 p-12 rounded-[2rem] text-center h-full flex flex-col justify-center items-center min-h-[500px] shadow-sm">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                  <Loader2 className="h-16 w-16 text-emerald-600 animate-spin relative z-10" />
                </div>
                <p className="text-stone-900 font-bold text-xl">Analyzing Soil Profile...</p>
                <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">Our ML model is processing your parameters to find the highest yield crop.</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Winner Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
                  <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-10 w-10 text-emerald-100" />
                    </div>
                    <p className="text-emerald-100/80 font-medium tracking-widest text-xs uppercase mb-1">Top Recommendation</p>
                    <h2 className="text-5xl font-black mb-4 capitalize tracking-tight">{result.result?.crop || 'Unknown'}</h2>
                    
                    <div className="flex items-center gap-3">
                      <div className="px-5 py-2 bg-white text-emerald-900 rounded-full text-sm font-black shadow-sm">
                        {((result.result?.confidence || 0) * 100).toFixed(1)}% Match
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alternatives */}
                  {result.result?.allPredictions?.length > 1 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <History className="h-4 w-4 text-emerald-600" />
                        <h4 className="font-bold text-stone-800 text-sm">Alternative Crops</h4>
                      </div>
                      <div className="space-y-3">
                        {result.result.allPredictions.slice(1, 4).map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3.5 bg-stone-50/50 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-stone-300 w-4">0{i + 2}</span>
                              <span className="text-sm font-bold text-stone-700 capitalize">{p.crop}</span>
                            </div>
                            <span className="text-xs font-black text-emerald-600">{ (p.confidence * 100).toFixed(1) }%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Insight */}
                  <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <h4 className="font-bold text-stone-800 text-sm">Land Suitability</h4>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                      <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        Based on your Nitrogen levels and soil pH, {result.result?.crop} is the most optimal choice. This crop thrives in your current temperature profile of {result.inputs?.temperature}°C.
                      </p>
                    </div>
                    <button onClick={() => setResult(null)} className="w-full mt-4 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                      Try Different Parameters
                    </button>
                  </div>
                </div>

                {/* Input Recap */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-6">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="font-bold text-stone-800 text-sm">Environmental Profile</h4>
                    <span className="text-[10px] font-bold text-stone-400">Captured at {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {result.inputs && Object.entries(result.inputs).map(([k, v]: any) => (
                      <div key={k} className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-100/50">
                        <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">{k}</p>
                        <p className="text-xs font-black text-stone-800">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-stone-100 min-h-[500px] shadow-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <Sprout className="h-12 w-12 text-emerald-200" />
                </div>
                <h4 className="text-2xl font-bold text-stone-800">Ready to Consult AI?</h4>
                <p className="text-stone-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                  Choose an input method on the left. You can use your phone's camera, GPS, or enter data manually to get started.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-md">
                  {[
                    { icon: MapPin, label: 'Location' },
                    { icon: Upload, label: 'OCR Scan' },
                    { icon: MousePointer2, label: 'Manual' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-stone-300" />
                      </div>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
